---
title: "Rockchip ISP30 Development: Complete RK3588 RkAiq API and Debugging Guide"
description: "Full ISP30 V1.2.5 reference covering RkAiq system control, AE/AWB/AF, image processing modules, tuning, debugging and RK-RAW formats."
translation_key: "078-rockchip-isp30-development"
slug: "078-rockchip-isp30-development"
lang: "en"
date: "2026-10-19"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "camera"
products: []
tags: ["Rockchip", "ISP30", "RK3588", "RkAiq", "AE", "AWB", "AF"]
keywords: "ArmSoM Rockchip RK3588 ISP30 RkAiq API"
excerpt: "Full ISP30 V1.2.5 reference covering RkAiq system control, AE/AWB/AF, image processing modules, tuning, debugging and RK-RAW formats."
---

{% raw %}

# Rockchip ISP30 Development: Complete RK3588 RkAiq API and Debugging Guide

This platform reference preserves the complete technical body of the 436-page English V1.2.5 source (PDF pp.16–436), including the RK-RAW formats and the final error-code and abbreviation chapters. No corresponding Chinese PDF was supplied. Chinese and Russian are full translations of this English version; all 42 original technical figures come from the English PDF, including Chinese labels already present there. Ten image-based RAW layout/format tables are additionally transcribed as editable tables. No whole-page images replace the body.

The source specifies RK3588 / Linux 5.10, with BuildRoot and Android marked Y and Debian and Yocto marked N. These are historical source records, not a promise of support in every BSP. For ArmSoM boards, verify the exact SoC, ISP generation, sensor/VCM, kernel, AIQ library, IQ file and SDK/BSP branch first. ArmSoM Sige7 is an RK3588 board, but this article's APIs and examples have not been validated on its hardware. All measurements and examples belong to the source; no hardware commands or camera/motor operations were executed.

**Source issues:** repeated API headings, mixed ISP generations and types, conflicting units, defaults, log levels and RAW field descriptions are retained and listed in the editorial notes. Values and identifiers are not silently corrected. Code comments remain in their original language. Commands and APIs can alter camera or motor state; adapt and review before use.

[EDITORIAL-NOTES](/docs/rockchip-isp30-development/EDITORIAL-NOTES.md) · [ArmSoM Sige7](https://docs.armsom.org/armsom-sige7) · [ArmSoM camera documentation](https://docs.armsom.org/sige-family-started) · [Rockchip Linux](https://github.com/rockchip-linux)

<!-- Source EN PDF p.16; unit 0 -->

## 1.   General overview

<!-- Source EN PDF p.16; unit 1 -->

### 1.1   Structure diagram

<!-- Source EN PDF p.16; unit 2 -->

![Original technical figure — PDF p.16](/docs/rockchip-isp30-development/assets/en-p016-X692.jpg)

<!-- Source EN PDF p.16; unit 3 -->

RK3588 VI as a general term for video input modules, contains:

<!-- Source EN PDF p.16; unit 4 -->

Interface and data acquisition part: C/DPHY, DVP, CSI, VICAP

<!-- Source EN PDF p.16; unit 5 -->

Image processing part: ISP-0,ISP-1,FEC-0,FEC-1

<!-- Source EN PDF p.16; unit 6 -->

The RK3588 ISP belongs to the RK ISP v3.0 version, and subsequent documents are identified as ISP30.

<!-- Source EN PDF p.16; unit 7 -->

### 1.2   mode of operation

<!-- Source EN PDF p.16; unit 8 -->

Single ISP Single CIS (CMOS Image Sensor):

<!-- Source EN PDF p.16; unit 9 -->

RAW pass-through/online mode: The blue arrows in the block diagram indicate the data flow 1.0 path

<!-- Source EN PDF p.16; unit 10 -->

Raw readback/offline mode: Orange arrows in the block diagram indicate traffic 1.1, 1.2 paths

<!-- Source EN PDF p.16; unit 11 -->

Dual ISP 2-in-1 mode for single CIS:

<!-- Source EN PDF p.16; unit 12 -->

The 2-in-1 mode supports ISP-0/ISP-1 to process the left and right parts of a single CIS image separately to support large resolution CIS.

<!-- Source EN PDF p.16; unit 13 -->

Multi-CIS :

<!-- Source EN PDF p.17; unit 14 -->

Single ISP adopts Raw readback/offline mode, which can support multi-CIS input in time-division multiplexing.

<!-- Source EN PDF p.17; unit 15 -->

### 1.3   Overview of performance and constraints

<!-- Source EN PDF p.17; unit 16 -->

Supported resolutions and throughput:

<!-- Source EN PDF p.17; unit 17 -->

| Working mode | Throughput | Maximum<br>resolution | Minimum resolution<br>supported |
|---|---|---|---|
| Single ISP Single CIS | 16Mega@30fps | 4672x3504 | 208x128 |
| Dual ISP 2-in-1 Single<br>CIS | 32Mega@30fps | 8064x6048 | \ |

<!-- Source EN PDF p.17; unit 18 -->

Support Raw12 data entry.

<!-- Source EN PDF p.17; unit 19 -->

ISP30 supports processing Raw12 data. The Raw14 data input discards the low bits for Raw12 processing. Image data input with a bit width of less than 12 bits will supplement the low bit to Raw12 processing.

<!-- Source EN PDF p.17; unit 20 -->

Support for Bayer color CIS, Mono CIS.

<!-- Source EN PDF p.17; unit 21 -->

Support 3-in-1 multi-frame HDR. The following types of HDR CIS are supported:

<!-- Source EN PDF p.17; unit 22 -->

| Multi exposure HDR | RK Platform support | CIS | Apply |
|---|---|---|---|
| Sequential / Framebase HDR | ISP20: RV1109/RV1126 etc<br>ISP21: RK356X etc<br>ISP30: RK3588<br>ISP32: RV1106 | OV4689 | IPC/CVR |
| Staggered / DOL HDR | ISP20: RV1109/RV1126 etc<br>ISP21: RK356X etc<br>ISP30: RK3588<br>ISP32: RV1106 | OS04A10<br>IMX464<br>AR0239 | IPC/CVR |
| DCG HDR | ISP20: RV1109/RV1126 etc<br>ISP21: RK356X etc<br>ISP30: RK3588<br>ISP32: RV1106 | OS04A10<br>IMX585 | IPC/CVR |
| SME HDR | N | IMX378 | Consumer |
| BME HDR | N | IMX258 | Consumer |
| QBC HDR | N | OV50C40<br>IMX586 | Consumer |
| Lateral overflow HDR | N | AR0821 | IPC |
| Splite-diode pixel HDR | N | OV10640 | CVR |

<!-- Source EN PDF p.17; unit 23 -->

Lowest latency for ISP30 data output to DDR notification stage in Raw pass-through/online mode: approx. image frame transmission time/15.

<!-- Source EN PDF p.18; unit 24 -->

In ISP time-division multiplexing mode, a single ISP supports up to four data source inputs.

<!-- Source EN PDF p.18; unit 25 -->

In RAW pass-through/online mode, the minimum image frame is blanked by 136 lines and the minimum image line is blanked by 16 pixels

<!-- Source EN PDF p.18; unit 26 -->

The CSM module does not support YUV limit range conversion, see the IMGPROC/CSM module API description for details

<!-- Source EN PDF p.18; unit 27 -->

## 2.   Overview

<!-- Source EN PDF p.18; unit 28 -->

ISP30 includes a series of image processing algorithm modules, mainly including: dark current correction, dead pixel correction, 3A, HDR, lens shadow correction, lens distortion correction, 3DLUT, denoising (including RAW domain denoising, multi-frame noise reduction, color denoising, etc.), sharpening, etc.

<!-- Source EN PDF p.18; unit 29 -->

ISP30 includes hardware algorithm implementation and software logic control part, RkAiq is the implementation of software logic control part.

<!-- Source EN PDF p.18; unit 30 -->

The main functions of the RkAiq software module are: to obtain image statistics from the ISP driver, combine IQ Tuning parameters, use a series of algorithms to calculate new ISP, Sensor and other hardware parameters, and continuously iterate the process to finally achieve the best image effect.

<!-- Source EN PDF p.18; unit 31 -->

### 2.1   Feature description

<!-- Source EN PDF p.18; unit 32 -->

![Original technical figure — PDF p.18](/docs/rockchip-isp30-development/assets/en-p018-X701.png)

<!-- Source EN PDF p.18; unit 33 -->

Figure 1-1 ISP21 system block diagram

<!-- Source EN PDF p.18; unit 34 -->

The overall software and hardware block diagram of ISP30 is shown in Figure 1-1. The sensor outputs a data stream to the ISP HW, WHICH IN TURN OUTPUTS THE IMAGE AFTER A SERIES OF IMAGE PROCESSING ALGORITHMS. RkAiq continuously obtains statistical data from ISP HW, and generates new parameters through algorithms such as 3A to feed back to each hardware module. Tuning tool can debug parameters online in real time, and after debugging, a new IQ parameter file can be saved and generated.

<!-- Source EN PDF p.19; unit 35 -->

### 2.2   RkAiq architecture

<!-- Source EN PDF p.19; unit 36 -->

![Original technical figure — PDF p.19](/docs/rockchip-isp30-development/assets/en-p019-X706.png)

<!-- Source EN PDF p.19; unit 37 -->

Figure 1-2 Overall architecture diagram of RkAiq

<!-- Source EN PDF p.19; unit 38 -->

1\. The ISP30 RkAiq software design idea is shown in Figure 1-2. It is mainly divided into the following four parts:

<!-- Source EN PDF p.19; unit 39 -->

1\. RkAiq lib dynamic library. The library contains the main logical part, which is responsible for obtaining statistics from the driver and passing them to the individual algorithm libraries.

<!-- Source EN PDF p.19; unit 40 -->

2\. Integrated algo libs。 The static algorithm library provided by Rk is registered with the RkAiq lib dynamic library by default.

<!-- Source EN PDF p.19; unit 41 -->

3\. customer 3A libs。 Customers can implement their own 3A algorithm library or other algorithm libraries according to the algorithm library interface definition. After you register a custom algorithm library with the RkAiq lib dynamic library, you can choose whether to run the custom library or the Rk library according to the provided interface.

<!-- Source EN PDF p.19; unit 42 -->

4\. IQ file。 IQ tuning result files store algorithm-related parameters and some system static parameters such as CIS.

<!-- Source EN PDF p.20; unit 43 -->

### 2.3   Software architecture

<!-- Source EN PDF p.20; unit 44 -->

![Original technical figure — PDF p.20](/docs/rockchip-isp30-development/assets/en-p020-X710.png)

<!-- Source EN PDF p.20; unit 45 -->

Figure 1-3 Block diagram of software architecture

<!-- Source EN PDF p.20; unit 46 -->

The ISP30 software block diagram is shown in Figure 1-3. It is mainly divided into the following three layers:

<!-- Source EN PDF p.20; unit 47 -->

1\. kernel layer。 This layer contains all hardware drivers for the camera system, mainly ISP drivers, sensor drivers, VCM drivers, flashlight drivers, IrCutter drivers and so on. The drivers are based on V4L2 and the Media framework.

<!-- Source EN PDF p.20; unit 48 -->

2\. framework layer。 This layer is the integration layer of RkAiq lib, which has two integration methods:

<!-- Source EN PDF p.20; unit 49 -->

IspServer mode In this way, the Rkaiq lib runs on the IspServer standalone process, with which the client communicates via dbus. In addition, this method can provide images with ISP debugging effect for existing third-party applications such as v4L-CTL without modifying the source code.

<!-- Source EN PDF p.20; unit 50 -->

Direct integration RkAiq lib can be integrated directly into applications.

<!-- Source EN PDF p.20; unit 51 -->

3\. user layer. User application layer.

<!-- Source EN PDF p.21; unit 52 -->

### 2.4   Software processes

<!-- Source EN PDF p.22; unit 53 -->

![Original technical figure — PDF p.22](/docs/rockchip-isp30-development/assets/en-p022-X717.png)

<!-- Source EN PDF p.23; unit 54 -->

Figure 1-4 Flow chart

<!-- Source EN PDF p.23; unit 55 -->

The RkAiq interface call process is shown in Figure 1-4. The dotted box part in the figure is optional, and the blue font part is the configuration that the application needs to use with the RkAiq process.

<!-- Source EN PDF p.23; unit 56 -->

configure media pipeline。 Optionally, configure the ISP30 pipeline, such as sensor output resolution, etc., the driver has a default configuration. rk_aiq_uapi2_sysctl_init。 Initialize RkAiq, including IQ tuning parameters and initialization of various algorithm libraries. other Aiq or algo params uapis。 Optionally, you can configure the required parameters through the API interface provided by each algorithm, and register third-party algorithm libraries. rk_aiq_uapi2_sysctl_prepare。 Prepare the initialization parameters of each algorithm library and each hardware module, and set them to the driver.

<!-- Source EN PDF p.23; unit 57 -->

video capture start。 This process is enabled for the application ISP traffic, and the process needs to be called after rk_aiq_uapi2_sysctl_prepare.

<!-- Source EN PDF p.23; unit 58 -->

rk_aiq_uapi2_sysctl_start。 Start the RkAiq internal flow, after the interface call is successful, the sensor starts to output data, the ISP starts processing data, and outputs the processed image.

<!-- Source EN PDF p.23; unit 59 -->

Rkaiq running。 RkAiq continuously obtains statistics from the ISP driver, calls algorithms such as 3A to calculate new parameters, and applies new parameters to the driver. PC Online Tuning Tool。 The PC can adjust the parameters online via the Tuning Tool. video capture stop。 Before stopping the RkAiq process, you need to stop the data flow section. rk_aiq_uapi2_sysctl_stop。 Stop the RkAiq running process. You can adjust the parameters and start it again or start it directly.

<!-- Source EN PDF p.23; unit 60 -->

rk_aiq_uapi2_sysctl_deinit。 Deinitialize RkAiq.

<!-- Source EN PDF p.23; unit 61 -->

### 2.5   API description

<!-- Source EN PDF p.23; unit 62 -->

The APIs provided by RKAiq are divided into two levels: functional-level APIs and module-level APIs.

<!-- Source EN PDF p.23; unit 63 -->

Functional level API: Based on module-level API packaging, mainly for product applications based on some simple functional design of the module.

<!-- Source EN PDF p.23; unit 64 -->

Module-level API: Detailed parameter settings and queries for this module, without API differentiation of functions.

<!-- Source EN PDF p.23; unit 65 -->

The module-level APIs provided by RKAiq support synchronous and asynchronous modes, and functional- level APIs are encapsulated by default in the synchronous mode of module-level APIs.

<!-- Source EN PDF p.23; unit 66 -->

Sync mode: This mode is a blocking API, AIQ basically updates parameters with video frames as granularity, and in synchronous mode, the time that the thread calling the API may be blocked &lt;= video frame cycle time.

<!-- Source EN PDF p.23; unit 67 -->

Asynchronous Mode (ASync): This mode is a non-blocking API, the AIQ framework will store API setting parameters in the internal parameter buffer, and set the latest ISP parameter setting to the hardware at the time.

<!-- Source EN PDF p.23; unit 68 -->

Instructions for using the synchronous asynchronous mode of module-level APIs

<!-- Source EN PDF p.23; unit 69 -->

The second parameter structure of the module-level API is generally a collection of setting parameters, called a property structure. The internal rk_aiq_uapi_sync_t members of the structure can configure the call mode of the current API, referring to the following data types for details:

<!-- Source EN PDF p.24; unit 70 -->

#### 2.5.1  rk_aiq_uapi_sync_t

<!-- Source EN PDF p.24; unit 71 -->

【Description】 Module sync mode

<!-- Source EN PDF p.24; unit 72 -->

【Definition】

<!-- Source EN PDF p.24; unit 73 -->

```text
 typedef struct rk_aiq_uapi_sync_s {
     rk_aiq_uapi_mode_sync_e     sync_mode;
     bool                        done;
 } rk_aiq_uapi_sync_t;
```

<!-- Source EN PDF p.24; unit 74 -->

【Member】

<!-- Source EN PDF p.24; unit 75 -->

| Member<br>Name | Description |
|---|---|
| sync_mode | @setAttrib: Flag for parameter update mode;<br>RK_AIQ_UAPI_MODE_DEFAULT: The default is synchronous mode.<br>RK_AIQ_UAPI_MODE_SYNC: Synchronous mode.<br>RK_AIQ_UAPI_MODE_ASYNC: Asynchronous mode.<br>@getAttrib:<br>RK_AIQ_UAPI_MODE_DEFAULT: Get last set property by default (sync_mode ==<br>RK_AIQ_UAPI_MODE_ASYNC), may not take effect yet<br>RK_AIQ_UAPI_MODE_SYNC: Get the currently used properties.<br>RK_AIQ_UAPI_MODE_ASYNC: Same as RK_AIQ_UAPI_MODE_DEFAULT. |
| done | @done (parsm out): Flag for parameter update status,<br>true for parameter update, false for parameter not updated. |

<!-- Source EN PDF p.24; unit 76 -->

The AIQ API reference code is divided into modules, and API examples are provided separately, which is recommended for customers to refer to directly

<!-- Source EN PDF p.24; unit 77 -->

rkisp_demo/demo/sample

<!-- Source EN PDF p.25; unit 78 -->

| Filename | Module |
|---|---|
| sample_3dlut_module.cpp | 3DLUT |
| sample_ccm_module.cpp | CCM |
| sample_csm_module.cpp | CSM |
| sample_ablc_module.cpp | BLC |
| sample_abayer2dnr_module.cpp | BayerNR 2D |
| sample_abayertnr_module.cpp | BayerNR 3D |
| sample_aynr_module.cpp | YNR |
| sample_acnr_module.cpp | CNR |
| sample_asharp_module.cpp | Sharp |
| sample_amerge_module.cpp | Merge(HDR) |
| sample_adrc_module.cpp | DRC |
| sample_adehaze_module.cpp | Dehaze &amp; Enhance |
| sample_agamma_module.cpp | Gamma |
| sample_awb_module.cpp | AWB |
| sample_ae_module.cpp | AE |
| sample_af_module.cpp | AF |

<!-- Source EN PDF p.25; unit 79 -->

## 3.   System control

<!-- Source EN PDF p.25; unit 80 -->

### 3.1   Feature overview

<!-- Source EN PDF p.25; unit 81 -->

The system control section contains AIQ public attribute configuration, initializing AIQ, running AIQ, exiting AIQ, setting AIQ modules and other functions.

<!-- Source EN PDF p.25; unit 82 -->

### 3.2   API Reference

<!-- Source EN PDF p.25; unit 83 -->

#### 3.2.1  rk_aiq_uapi2_sysctl_preInit

<!-- Source EN PDF p.25; unit 84 -->

【Description】 Before initializing AIQ, preset some parameters, such as the IQ file used.

<!-- Source EN PDF p.25; unit 85 -->

【Grammar】

<!-- Source EN PDF p.26; unit 86 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_preInit (const char* sns_ent_name,
                          rk_aiq_working_mode_t mode,
                          const char* force_iq_file);
```

<!-- Source EN PDF p.26; unit 87 -->

【Parameters】

<!-- Source EN PDF p.26; unit 88 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sns_ent_name | sensor entity name | Input |
| mode | ISP mode of operation | Input |
| force_iq_file | Mandatory iq file | Input |

<!-- Source EN PDF p.26; unit 89 -->

【Return Value】

<!-- Source EN PDF p.26; unit 90 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.26; unit 91 -->

【Requirements】

<!-- Source EN PDF p.26; unit 92 -->

Header file: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.26; unit 93 -->

Library file: librkaiq.so

<!-- Source EN PDF p.26; unit 94 -->

【Note】

<!-- Source EN PDF p.26; unit 95 -->

Should precede rk_aiq_uapi2_sysctl_init call

<!-- Source EN PDF p.26; unit 96 -->

The parameter mode is only used to select IQ files, and does not configure the ISP operating mode, which needs to be configured in rk_aiq_uapi2_sysctl_prepare. If the parameter force_iq_file is not empty, the mode parameter is invalid

<!-- Source EN PDF p.26; unit 97 -->

Parameter force_iq_file is the full path

<!-- Source EN PDF p.26; unit 98 -->

This function is not required and is only used to change some default settings before rk_aiq_uapi2_sysctl_init

<!-- Source EN PDF p.26; unit 99 -->

#### 3.2.2  rk_aiq_uapi2_sysctl_preInit_scene

<!-- Source EN PDF p.26; unit 100 -->

【Description】 Before initializing AIQ, select IQ Scenario Parameters.

<!-- Source EN PDF p.26; unit 101 -->

【Grammar】

<!-- Source EN PDF p.26; unit 102 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_preInit_scene (const char* sns_ent_name,
                          const char *main_scene,
                         const char *sub_scene);
```

<!-- Source EN PDF p.26; unit 103 -->

【Parameters】

<!-- Source EN PDF p.27; unit 104 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sns_ent_name | sensor entity name | Input |
| main_scene | For the main scene, the values are defined in the IQ file | Input |
| sub_scene | For subscenarios, the values are defined in the IQ file | Input |

<!-- Source EN PDF p.27; unit 105 -->

【Return Value】

<!-- Source EN PDF p.27; unit 106 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.27; unit 107 -->

【Requirements】

<!-- Source EN PDF p.27; unit 108 -->

Header file: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.27; unit 109 -->

Library file: librkaiq.so

<!-- Source EN PDF p.27; unit 110 -->

【Note】

<!-- Source EN PDF p.27; unit 111 -->

Should precede rk_aiq_uapi2_sysctl_init call

<!-- Source EN PDF p.27; unit 112 -->

main_scene needs to be selected according to the main scene array in the IQ file, the default is generally "normal"

<!-- Source EN PDF p.27; unit 113 -->

sub_scene needs to be selected according to the sub-scene array in the main scene in the IQ file, the default is generally "day"

<!-- Source EN PDF p.27; unit 114 -->

Since the default selected scene is normal-day, if you want to run hdr-day, or other custom modes, You need to call this function to specify, otherwise the IQ parameter may be incorrect

<!-- Source EN PDF p.27; unit 115 -->

#### 3.2.3  rk_aiq_uapi2_sysctl_switch_scene

<!-- Source EN PDF p.27; unit 116 -->

【Description】 After initializing AIQ, switch the IQ scenario parameters.

<!-- Source EN PDF p.27; unit 117 -->

【Grammar】

<!-- Source EN PDF p.27; unit 118 -->

```text
 int
 rk_aiq_uapi2_sysctl_switch_scene (const rk_aiq_sys_ctx_t* sys_ctx,
                          const char *main_scene,
                         const char *sub_scene);
```

<!-- Source EN PDF p.27; unit 119 -->

【Parameters】

<!-- Source EN PDF p.27; unit 120 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| main_scene | For the main scene, the values are defined in the IQ file | Input |
| sub_scene | For subscenarios, the values are defined in the IQ file | Input |

<!-- Source EN PDF p.28; unit 121 -->

【Return Value】

<!-- Source EN PDF p.28; unit 122 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.28; unit 123 -->

【Requirements】

<!-- Source EN PDF p.28; unit 124 -->

Header file: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.28; unit 125 -->

Library file: librkaiq.so

<!-- Source EN PDF p.28; unit 126 -->

【Note】

<!-- Source EN PDF p.28; unit 127 -->

Called after rk_aiq_uapi2_sysctl_init

<!-- Source EN PDF p.28; unit 128 -->

main_scene needs to be selected based on the array of main scenes in the IQ file

<!-- Source EN PDF p.28; unit 129 -->

sub_scene needs to be selected based on the array of subscenes in the main scene in the IQ file

<!-- Source EN PDF p.28; unit 130 -->

This interface involves IQ dynamic switching, which is currently inadequately tested and may cause unexpected results, so use with caution

<!-- Source EN PDF p.28; unit 131 -->

#### 3.2.4  rk_aiq_uapi2_sysctl_init

<!-- Source EN PDF p.28; unit 132 -->

【Description】 Initialize the AIQ context.

<!-- Source EN PDF p.28; unit 133 -->

【Grammar】

<!-- Source EN PDF p.28; unit 134 -->

```text
 rk_aiq_sys_ctx_t*
 rk_aiq_uapi2_sysctl_init (const char* sns_ent_name,
                          const char* iq_file_dir,
                          rk_aiq_error_cb err_cb,
                          rk_aiq_metas_cb metas_cb);
```

<!-- Source EN PDF p.28; unit 135 -->

【Parameters】

<!-- Source EN PDF p.28; unit 136 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sns_ent_name | sensor entity name | Input |
| iq_file_dir | Calibration parameter file path | Input |
| err_cb | Error callback function, which can be NULL | Input |
| metas_cb | The meta data callback function, which can be NULL | Input |

<!-- Source EN PDF p.28; unit 137 -->

【Return Value】

<!-- Source EN PDF p.28; unit 138 -->

| Return value | Description |
|---|---|
| rk_aiq_sys_ctx_t* | AIQ context pointer |

<!-- Source EN PDF p.29; unit 139 -->

【Requirements】

<!-- Source EN PDF p.29; unit 140 -->

Header file: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.29; unit 141 -->

Library file: librkaiq.so

<!-- Source EN PDF p.29; unit 142 -->

【Note】

<!-- Source EN PDF p.29; unit 143 -->

Should precede other function calls.

<!-- Source EN PDF p.29; unit 144 -->

#### 3.2.5  rk_aiq_uapi2_sysctl_deinit

<!-- Source EN PDF p.29; unit 145 -->

【Description】 Deinitialize the AIQ context.

<!-- Source EN PDF p.29; unit 146 -->

【Grammar】

<!-- Source EN PDF p.29; unit 147 -->

```text
 void
 rk_aiq_uapi2_sysctl_deinit( rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.29; unit 148 -->

【Parameters】

<!-- Source EN PDF p.29; unit 149 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |

<!-- Source EN PDF p.29; unit 150 -->

【Return Value】

<!-- Source EN PDF p.29; unit 151 -->

| Return value | Description |
|---|---|
| None | None |

<!-- Source EN PDF p.29; unit 152 -->

【Requirements】

<!-- Source EN PDF p.29; unit 153 -->

Header file: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.29; unit 154 -->

Library file: librkaiq.so

<!-- Source EN PDF p.29; unit 155 -->

【Note】

<!-- Source EN PDF p.29; unit 156 -->

Should not be called when AIQ is in the start state.

<!-- Source EN PDF p.29; unit 157 -->

#### 3.2.6  rk_aiq_uapi2_sysctl_prepare

<!-- Source EN PDF p.29; unit 158 -->

【Description】 Prepare the AIQ operating environment.

<!-- Source EN PDF p.29; unit 159 -->

【Grammar】

<!-- Source EN PDF p.29; unit 160 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_prepare(const rk_aiq_sys_ctx_t* ctx,
                            uint32_t  width,
                            uint32_t  height,
                            rk_aiq_working_mode_t mode);
```

<!-- Source EN PDF p.30; unit 161 -->

【Parameters】

<!-- Source EN PDF p.30; unit 162 -->

| Parameter<br>Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| width | The resolution width of the sensor output, which is used only for<br>verification | Input |
| height | The resolution height of the sensor output, which is only used for<br>verification | Input |
| mode | ISP Pipeline mode of operation (NORMAL/HDR) | Input |

<!-- Source EN PDF p.30; unit 163 -->

【Return Value】

<!-- Source EN PDF p.30; unit 164 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.30; unit 165 -->

【Requirements】

<!-- Source EN PDF p.30; unit 166 -->

Header file: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.30; unit 167 -->

Library file: librkaiq.so

<!-- Source EN PDF p.30; unit 168 -->

【Note】

<!-- Source EN PDF p.30; unit 169 -->

Should be called before rk_aiq_uapi2_sysctl_start function.

<!-- Source EN PDF p.30; unit 170 -->

If you need to call this function after the rk_aiq_uapi2_sysctl_start, call the rk_aiq_uapi2_sysctl_stop function first, and then call rk_aiq_uapi2_sysctl_prepare to reprepare the running environment.

<!-- Source EN PDF p.30; unit 171 -->

#### 3.2.7  rk_aiq_uapi2_sysctl_start

<!-- Source EN PDF p.30; unit 172 -->

【Description】 Start the AIQ control system. After AIQ is started, it will continuously obtain 3A statistics from the ISP driver, run the 3A algorithm, and apply the calculated new parameters.

<!-- Source EN PDF p.30; unit 173 -->

【Grammar】

<!-- Source EN PDF p.30; unit 174 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_start(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.30; unit 175 -->

【Parameters】

<!-- Source EN PDF p.30; unit 176 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |

<!-- Source EN PDF p.30; unit 177 -->

【Return Value】

<!-- Source EN PDF p.31; unit 178 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.31; unit 179 -->

【Requirements】

<!-- Source EN PDF p.31; unit 180 -->

Header file: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.31; unit 181 -->

Library file: librkaiq.so

<!-- Source EN PDF p.31; unit 182 -->

【Note】

<!-- Source EN PDF p.31; unit 183 -->

Should be called after the rk_aiq_uapi2_sysctl_prepare function.

<!-- Source EN PDF p.31; unit 184 -->

#### 3.2.8  rk_aiq_uapi2_sysctl_stop

<!-- Source EN PDF p.31; unit 185 -->

【Description】 Stop the AIQ control system.

<!-- Source EN PDF p.31; unit 186 -->

【Grammar】

<!-- Source EN PDF p.31; unit 187 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_stop(const rk_aiq_sys_ctx_t* ctx, bool keep_ext_hw_st);
```

<!-- Source EN PDF p.31; unit 188 -->

【Parameters】

<!-- Source EN PDF p.31; unit 189 -->

| Parameter<br>Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| keep_ext_hw_st | After stop, whether the state of the external device such as<br>(ircut/cpsl) remains unchanged | Input |

<!-- Source EN PDF p.31; unit 190 -->

【Return Value】

<!-- Source EN PDF p.31; unit 191 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.31; unit 192 -->

【Requirements】

<!-- Source EN PDF p.31; unit 193 -->

Header file: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.31; unit 194 -->

Library file: librkaiq.so

<!-- Source EN PDF p.32; unit 195 -->

#### 3.2.9  rk_aiq_uapi2_sysctl_getStaticMetas

<!-- Source EN PDF p.32; unit 196 -->

【Description】 Query sensor corresponds to static information such as resolution, data format, etc.

<!-- Source EN PDF p.32; unit 197 -->

【Grammar】

<!-- Source EN PDF p.32; unit 198 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_getStaticMetas(const char* sns_ent_name,
 rk_aiq_static_info_t* static_info);
```

<!-- Source EN PDF p.32; unit 199 -->

【Parameters】

<!-- Source EN PDF p.32; unit 200 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sns_ent_name | sensor entity name | Input |
| static_info | Static information struct pointer | Output |

<!-- Source EN PDF p.32; unit 201 -->

【Return Value】

<!-- Source EN PDF p.32; unit 202 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.32; unit 203 -->

【Requirements】

<!-- Source EN PDF p.32; unit 204 -->

Header file: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.32; unit 205 -->

Library file: librkaiq.so

<!-- Source EN PDF p.32; unit 206 -->

#### 3.2.10  rk_aiq_uapi2_sysctl_enumStaticMetas

<!-- Source EN PDF p.32; unit 207 -->

【Description】 Enumerates the static information obtained by AIQ.

<!-- Source EN PDF p.32; unit 208 -->

【Grammar】

<!-- Source EN PDF p.32; unit 209 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_enumStaticMetas(int index, rk_aiq_static_info_t*
 static_info);
```

<!-- Source EN PDF p.32; unit 210 -->

【Parameters】

<!-- Source EN PDF p.32; unit 211 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| index | Index number, starting from 0 | Input |
| static_info | Static information struct pointer | Output |

<!-- Source EN PDF p.32; unit 212 -->

【Return Value】

<!-- Source EN PDF p.33; unit 213 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.33; unit 214 -->

【Requirements】

<!-- Source EN PDF p.33; unit 215 -->

Header file: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.33; unit 216 -->

Library file: librkaiq.so

<!-- Source EN PDF p.33; unit 217 -->

#### 3.2.11  rk_aiq_uapi2_sysctl_enableAxlib

<!-- Source EN PDF p.33; unit 218 -->

【Description】 Set the custom algorithm library running status.

<!-- Source EN PDF p.33; unit 219 -->

【Grammar】

<!-- Source EN PDF p.33; unit 220 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_enableAxlib(const rk_aiq_sys_ctx_t* ctx,
                                const int algo_type,
                                const int lib_id,
                                bool enable);
```

<!-- Source EN PDF p.33; unit 221 -->

【Parameters】

<!-- Source EN PDF p.33; unit 222 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| algo_type | The type of algorithm module to operate with | Input |
| lib_id | Algorithm library identification ID | Input |
| enable | Status Settings | Input |

<!-- Source EN PDF p.33; unit 223 -->

【Return Value】

<!-- Source EN PDF p.33; unit 224 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.33; unit 225 -->

【Requirements】

<!-- Source EN PDF p.33; unit 226 -->

Header file: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.33; unit 227 -->

Library file: librkaiq.so

<!-- Source EN PDF p.33; unit 228 -->

【Note】

<!-- Source EN PDF p.33; unit 229 -->

If the lib_id is equivalent to the currently running algorithm library, this function can be called in any state except uninitialized.

<!-- Source EN PDF p.34; unit 230 -->

In other cases, it is only called in the prepared state, and the algorithm library identified by the algo_type will be replaced by the new algorithm library identified by lib_id.

<!-- Source EN PDF p.34; unit 231 -->

#### 3.2.12  rk_aiq_uapi2_sysctl_getAxlibStatus

<!-- Source EN PDF p.34; unit 232 -->

【Description】 Gets the algorithm library status.

<!-- Source EN PDF p.34; unit 233 -->

【Grammar】

<!-- Source EN PDF p.34; unit 234 -->

```text
 bool
 rk_aiq_uapi2_sysctl_getAxlibStatus(const rk_aiq_sys_ctx_t* ctx,
                                   const int algo_type,
                                   const int lib_id);
```

<!-- Source EN PDF p.34; unit 235 -->

【Parameters】

<!-- Source EN PDF p.34; unit 236 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| algo_type | The type of algorithm module to operate with | Input |
| lib_id | Algorithm library identification ID | Input |

<!-- Source EN PDF p.34; unit 237 -->

【Return Value】

<!-- Source EN PDF p.34; unit 238 -->

| Return value | Description |
|---|---|
| false | Shutdown Status |
| true | Enable Status |

<!-- Source EN PDF p.34; unit 239 -->

【Requirements】

<!-- Source EN PDF p.34; unit 240 -->

Header file: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.34; unit 241 -->

Library file: librkaiq.so

<!-- Source EN PDF p.34; unit 242 -->

#### 3.2.13  rk_aiq_uapi2_sysctl_getEnabledAxlibCtx

<!-- Source EN PDF p.34; unit 243 -->

【Description】 Gets the context structure of the enable algorithm library.

<!-- Source EN PDF p.34; unit 244 -->

【Grammar】

<!-- Source EN PDF p.34; unit 245 -->

```text
 const RkAiqAlgoContext*
 rk_aiq_uapi2_sysctl_getEnabledAxlibCtx(const rk_aiq_sys_ctx_t* ctx, const int
 algo_type);
```

<!-- Source EN PDF p.34; unit 246 -->

【Parameters】

<!-- Source EN PDF p.35; unit 247 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| algo_type | The type of algorithm module to operate with | Input |

<!-- Source EN PDF p.35; unit 248 -->

【Return Value】

<!-- Source EN PDF p.35; unit 249 -->

| Return value | Description |
|---|---|
| NULL | Get failed |
| Non-NULL | Get Success |

<!-- Source EN PDF p.35; unit 250 -->

【Requirements】

<!-- Source EN PDF p.35; unit 251 -->

Header file: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.35; unit 252 -->

Library file: librkaiq.so

<!-- Source EN PDF p.35; unit 253 -->

【Note】

<!-- Source EN PDF p.35; unit 254 -->

The returned algorithm context struct will be used by the internal private function. For user-defined algorithm libraries, the function should be called after the rk_aiq_uapi2_sysctl_enableAxlib, otherwise NULL will be returned.

<!-- Source EN PDF p.35; unit 255 -->

#### 3.2.14  rk_aiq_uapi2_sysctl_setCpsLtCfg

<!-- Source EN PDF p.35; unit 256 -->

【Description】 Set fill light control information.

<!-- Source EN PDF p.35; unit 257 -->

【Grammar】

<!-- Source EN PDF p.35; unit 258 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_setCpsLtCfg(const rk_aiq_sys_ctx_t* ctx,
                        rk_aiq_cpsl_cfg_t* cfg);
```

<!-- Source EN PDF p.35; unit 259 -->

【Parameters】

<!-- Source EN PDF p.35; unit 260 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| cfg | Fill light configuration structure pointer | Input |

<!-- Source EN PDF p.35; unit 261 -->

【Return Value】

<!-- Source EN PDF p.35; unit 262 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.35; unit 263 -->

【Requirements】

<!-- Source EN PDF p.36; unit 264 -->

Header file: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.36; unit 265 -->

Library file: librkaiq.so

<!-- Source EN PDF p.36; unit 266 -->

#### 3.2.15  rk_aiq_uapi2_sysctl_getCpsLtInfo

<!-- Source EN PDF p.36; unit 267 -->

【Description】 Get fill light control information.

<!-- Source EN PDF p.36; unit 268 -->

【Grammar】

<!-- Source EN PDF p.36; unit 269 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_getCpsLtInfo(const rk_aiq_sys_ctx_t* ctx,
                        rk_aiq_cpsl_info_t* info);
```

<!-- Source EN PDF p.36; unit 270 -->

【Parameters】

<!-- Source EN PDF p.36; unit 271 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| info | Fill light configuration structure pointer | Output |

<!-- Source EN PDF p.36; unit 272 -->

【Return Value】

<!-- Source EN PDF p.36; unit 273 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.36; unit 274 -->

【Requirements】

<!-- Source EN PDF p.36; unit 275 -->

Header file: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.36; unit 276 -->

Library file: librkaiq.so

<!-- Source EN PDF p.36; unit 277 -->

#### 3.2.16  rk_aiq_uapi2_sysctl_queryCpsLtCap

<!-- Source EN PDF p.36; unit 278 -->

【Description】 Check the support capabilities of fill lights.

<!-- Source EN PDF p.36; unit 279 -->

【Grammar】

<!-- Source EN PDF p.36; unit 280 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_queryCpsLtCap(const rk_aiq_sys_ctx_t* ctx,
                        rk_aiq_cpsl_cap_t* cap);
```

<!-- Source EN PDF p.36; unit 281 -->

【Parameters】

<!-- Source EN PDF p.37; unit 282 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| cap | The fill light supports the ability to query the structure pointer | Output |

<!-- Source EN PDF p.37; unit 283 -->

【Return Value】

<!-- Source EN PDF p.37; unit 284 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.37; unit 285 -->

【Requirements】

<!-- Source EN PDF p.37; unit 286 -->

Header file: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.37; unit 287 -->

Library file: librkaiq.so

<!-- Source EN PDF p.37; unit 288 -->

#### 3.2.17  rk_aiq_uapi2_sysctl_getBindedSnsEntNmByVd

<!-- Source EN PDF p.37; unit 289 -->

【Description】 Query the sensor entity name corresponding to the video node.

<!-- Source EN PDF p.37; unit 290 -->

【Grammar】

<!-- Source EN PDF p.37; unit 291 -->

```text
 const char* rk_aiq_uapi2_sysctl_getBindedSnsEntNmByVd(const char* vd);
```

<!-- Source EN PDF p.37; unit 292 -->

【Parameters】

<!-- Source EN PDF p.37; unit 293 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| vd | Video path, such as /dev/video20 | Input |

<!-- Source EN PDF p.37; unit 294 -->

【Return Value】

<!-- Source EN PDF p.37; unit 295 -->

| Return value | Description |
|---|---|
| sensor entity name | String pointer |

<!-- Source EN PDF p.37; unit 296 -->

【Note】

<!-- Source EN PDF p.37; unit 297 -->

The parameter must be the ISPP scale node path.

<!-- Source EN PDF p.37; unit 298 -->

【Requirements】

<!-- Source EN PDF p.37; unit 299 -->

Header file: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.37; unit 300 -->

Library file: librkaiq.so

<!-- Source EN PDF p.38; unit 301 -->

#### 3.2.18  rk_aiq_uapi2_sysctl_updateIq

<!-- Source EN PDF p.38; unit 302 -->

【Description】 Dynamically update the currently used IQ parameter file without stopping the data flow.

<!-- Source EN PDF p.38; unit 303 -->

【Grammar】

<!-- Source EN PDF p.38; unit 304 -->

```text
 XCamReturn rk_aiq_uapi2_sysctl_updateIq(const rk_aiq_sys_ctx_t* sys_ctx, char*
 iqfile);
```

<!-- Source EN PDF p.38; unit 305 -->

【Parameters】

<!-- Source EN PDF p.38; unit 306 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| iqfile | New IQ file | Input |

<!-- Source EN PDF p.38; unit 307 -->

【Return Value】

<!-- Source EN PDF p.38; unit 308 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.38; unit 309 -->

【Note】

<!-- Source EN PDF p.38; unit 310 -->

iqfile needs to be a full path.

<!-- Source EN PDF p.38; unit 311 -->

Updating IQ parameters does not mean that the operating mode can be switched, such as switching HDR and normal, can not be updated IQ file implementation; However, the switching of some functions can be achieved through different configurations of IQ parameters, such as day and night switching Switching is achieved entirely through IQ configuration.

<!-- Source EN PDF p.38; unit 312 -->

When switching IQ, the configuration parameters in IQ will override the settings of the user API. For example, AWB module can be configured manually and automatically in IQ mode, then after executing this function, no matter what mode the current AWB is in, it will eventually be overwritten by the default configuration in the new IQ.

<!-- Source EN PDF p.38; unit 313 -->

【Requirements】

<!-- Source EN PDF p.38; unit 314 -->

Header file: rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.38; unit 315 -->

Library file: librkaiq.so

<!-- Source EN PDF p.38; unit 316 -->

#### 3.2.19  rk_aiq_uapi2_sysctl_getCrop

<!-- Source EN PDF p.38; unit 317 -->

【Description】 Get the crop parameter.

<!-- Source EN PDF p.38; unit 318 -->

【Grammar】

<!-- Source EN PDF p.39; unit 319 -->

```text
 XCamReturn
 rk_aiq_uapi2_sysctl_getCrop(const rk_aiq_sys_ctx_t* sys_ctx, rk_aiq_rect_t
 *rect);
```

<!-- Source EN PDF p.39; unit 320 -->

【Parameters】

<!-- Source EN PDF p.39; unit 321 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| rect | crop parameter struct pointer | Output |

<!-- Source EN PDF p.39; unit 322 -->

【Return Value】

<!-- Source EN PDF p.39; unit 323 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.39; unit 324 -->

### 3.3   Data type

<!-- Source EN PDF p.39; unit 325 -->

#### 3.3.1  rk_aiq_working_mode_t

<!-- Source EN PDF p.39; unit 326 -->

【Description】 AIQ pipeline working mode

<!-- Source EN PDF p.39; unit 327 -->

【Definition】

<!-- Source EN PDF p.39; unit 328 -->

```text
 typedef enum {
     RK_AIQ_WORKING_MODE_NORMAL,
     RK_AIQ_WORKING_MODE_ISP_HDR2    = 0x10,
     RK_AIQ_WORKING_MODE_ISP_HDR3    = 0x20,
 } rk_aiq_working_mode_t;
```

<!-- Source EN PDF p.39; unit 329 -->

【Member】

<!-- Source EN PDF p.39; unit 330 -->

| Member Name | Description |
|---|---|
| RK_AIQ_WORKING_MODE_NORMAL | Normal mode |
| RK_AIQ_WORKING_MODE_ISP_HDR2 | Two-frame HDR mode |
| RK_AIQ_WORKING_MODE_ISP_HDR3 | Three-frame HDR mode |

<!-- Source EN PDF p.39; unit 331 -->

【Precautions】

<!-- Source EN PDF p.39; unit 332 -->

You need to query the mode supported by sensor and AIQ first, if the set mode is not supported, the setting is invalid.

<!-- Source EN PDF p.40; unit 333 -->

#### 3.3.2  rk_aiq_static_info_t

<!-- Source EN PDF p.40; unit 334 -->

【Description】 AIQ static information

<!-- Source EN PDF p.40; unit 335 -->

【Definition】

<!-- Source EN PDF p.40; unit 336 -->

```text
 typedef struct {
     rk_aiq_sensor_info_t    sensor_info;
     rk_aiq_lens_info_t      lens_info;
     bool has_lens_vcm;
     bool has_fl;
     bool fl_strth_adj_sup;
     bool has_irc;
     bool fl_ir_strth_adj_sup;
 } rk_aiq_static_info_t;
```

<!-- Source EN PDF p.40; unit 337 -->

【Member】

<!-- Source EN PDF p.40; unit 338 -->

| Member Name | Description |
|---|---|
| sensor_info | Description of the sensor's name, supported resolutions, etc. |
| lens_info | Lens information |
| has_lens_vcm | With or without VCM |
| has_fl | With flash |
| fl_strth_adj_sup | With flash adjustable |
| bool has_irc | With IR-CUT |
| bool fl_ir_strth_adj_sup |  |

<!-- Source EN PDF p.40; unit 339 -->

#### 3.3.3  rk_aiq_sensor_info_t

<!-- Source EN PDF p.40; unit 340 -->

【Description】 Sensor information

<!-- Source EN PDF p.40; unit 341 -->

【Definition】

<!-- Source EN PDF p.40; unit 342 -->

```text
 typedef struct {
     char sensor_name[32];
     rk_frame_fmt_t  support_fmt[SUPPORT_FMT_MAX];
     int32_t num;
     /* binded pp stream media index */
     int8_t binded_strm_media_idx;
 } rk_aiq_sensor_info_t;
```

<!-- Source EN PDF p.40; unit 343 -->

【Member】

<!-- Source EN PDF p.41; unit 344 -->

| Member Name | Description |
|---|---|
| sensor_name | Name of the sensor |
| support_fmt | Supported formats |
| num | Number of supported formats |
| has_fl | With flash |
| binded_strm_media_idx | The media node number on which the sensor is mounted |

<!-- Source EN PDF p.41; unit 345 -->

#### 3.3.4  rk_aiq_module_id_t

<!-- Source EN PDF p.41; unit 346 -->

【Description】 AIQ module ID

<!-- Source EN PDF p.41; unit 347 -->

【Definition】

<!-- Source EN PDF p.41; unit 348 -->

```text
 typedef enum {
     RK_MODULE_INVAL = 0,
     RK_MODULE_DPCC,
     RK_MODULE_BLS,
     RK_MODULE_LSC,
     RK_MODULE_AWB_GAIN,
     RK_MODULE_CTK,
     RK_MODULE_GOC,
     RK_MODULE_SHARP,
     RK_MODULE_AE,
     RK_MODULE_AWB,
     RK_MODULE_NR,
     RK_MODULE_GIC,
     RK_MODULE_3DLUT,
     RK_MODULE_LDCH,
     RK_MODULE_TNR,
     RK_MODULE_FEC,
     RK_MODULE_MAX
 }rk_aiq_module_id_t;
```

<!-- Source EN PDF p.41; unit 349 -->

【Member】

<!-- Source EN PDF p.42; unit 350 -->

| Member Name | Description |
|---|---|
| RK_MODULE_DPCC | Dead pixel detection and correction |
| RK_MODULE_BLS | Black level |
| RK_MODULE_LSC | Lens shadow correction |
| RK_MODULE_AWB_GAIN | White balance gain |
| RK_MODULE_CTK | Color correction |
| RK_MODULE_GOC | Gamma |
| RK_MODULE_SHARP | Sharpen |
| RK_MODULE_AE | Exposure |
| RK_MODULE_AWB | White balance |
| RK_MODULE_NR | Denoising |
| RK_MODULE_GIC | Green Balance |
| RK_MODULE_3DLUT | 3DLUT |
| RK_MODULE_LDCH | LDCH |
| RK_MODULE_TNR | 3D denoising |
| RK_MODULE_FEC | Fisheye correction |

<!-- Source EN PDF p.42; unit 351 -->

#### 3.3.5  rk_aiq_cpsl_cfg_t

<!-- Source EN PDF p.42; unit 352 -->

【Description】 The fill light sets the information structure

<!-- Source EN PDF p.42; unit 353 -->

【Definition】

<!-- Source EN PDF p.42; unit 354 -->

```text
 typedef struct rk_aiq_cpsl_cfg_s {
     RKAiqOPMode_t mode;
     rk_aiq_cpsls_t lght_src;
     bool gray_on; /*!< force to gray if light on */
     union {
         struct {
             float sensitivity; /*!< Range [0-100] */
             uint32_t sw_interval; /*!< switch interval time, unit  seconds */
         } a; /*< auto mode */
         struct {
             uint8_t on; /*!< disable 0, enable 1 */
             float strength_led; /*!< Range [0-100] */
             float strength_ir; /*!< Range [0-100] */
         } m; /*!< manual mode */
     } u;
 } rk_aiq_cpsl_cfg_t;
```

<!-- Source EN PDF p.43; unit 355 -->

【Member】

<!-- Source EN PDF p.43; unit 356 -->

| Member Name | Description |
|---|---|
| mode | Working mode |
| lght_src | Light source type |
| gray_on | Whether to cut the picture to black and white after switching to night mode |
| sensitivity | Switch sensitivity in auto mode, range [0,100] |
| sw_interval | Switching interval in automatic mode, in seconds |
| on | Whether to switch to night mode in manual mode |
| strength_led | LED light intensity in manual mode, range [0,100] |
| strength_ir | Infrared lamp intensity in manual mode, range [0,100] |

<!-- Source EN PDF p.43; unit 357 -->

#### 3.3.6  rk_aiq_cpsl_info_t

<!-- Source EN PDF p.43; unit 358 -->

【Description】 The fill light queries the information structure

<!-- Source EN PDF p.43; unit 359 -->

【Definition】

<!-- Source EN PDF p.43; unit 360 -->

```text
 typedef struct rk_aiq_cpsl_info_s {
     int32_t mode;
     uint8_t on;
     bool gray;
     float strength_led;
     float strength_ir;
     float sensitivity;
     uint32_t sw_interval;
     int32_t lght_src;
 } rk_aiq_cpsl_info_t;
```

<!-- Source EN PDF p.43; unit 361 -->

【Member】

<!-- Source EN PDF p.44; unit 362 -->

| Member Name | Description |
|---|---|
| mode | Working mode |
| lght_src | Light source type |
| gray | Whether to cut the picture to black and white after switching to night mode |
| sensitivity | Switch sensitivity in auto mode, range [0,100] |
| sw_interval | Switching interval in automatic mode, in seconds |
| on | Whether to switch to night mode in manual mode |
| strength_led | LED light intensity in manual mode, range [0,100] |
| strength_ir | Infrared lamp intensity in manual mode, range [0,100] |

<!-- Source EN PDF p.44; unit 363 -->

#### 3.3.7  rk_aiq_cpsl_cap_t

<!-- Source EN PDF p.44; unit 364 -->

【Description】 The fill light supports the capability structure

<!-- Source EN PDF p.44; unit 365 -->

【Definition】

<!-- Source EN PDF p.44; unit 366 -->

```text
 typedef struct rk_aiq_cpsl_cap_s {
     int32_t supported_modes[RK_AIQ_OP_MODE_MAX];
     uint8_t modes_num;
     int32_t supported_lght_src[RK_AIQ_CPSLS_MAX];
     uint8_t lght_src_num;
     rk_aiq_range_t strength_led;
     rk_aiq_range_t sensitivity;
     rk_aiq_range_t strength_ir;
 } rk_aiq_cpsl_cap_t;
```

<!-- Source EN PDF p.44; unit 367 -->

【Member】

<!-- Source EN PDF p.44; unit 368 -->

| Member Name | Description |
|---|---|
| supported_modes | Supported working modes |
| modes_num | Number of modes supported |
| gray | Whether to cut the picture to black and white after switching to night mode |
| supported_lght_src | Supported light sources |
| lght_src_num | Number of light sources supported |
| strength_led | LED intensity range |
| sensitivity | Sensitivity range |
| strength_ir | Intensity range of infrared lamps |

<!-- Source EN PDF p.45; unit 369 -->

#### 3.3.8  rk_aiq_rect_t

<!-- Source EN PDF p.45; unit 370 -->

【Description】 Define the crop parameter structure

<!-- Source EN PDF p.45; unit 371 -->

【Definition】

<!-- Source EN PDF p.45; unit 372 -->

```text
 typedef struct rk_aiq_rect_s {
     int left;
     int top;
     int width;
     int height;
 } rk_aiq_rect_t;
```

<!-- Source EN PDF p.45; unit 373 -->

【Member】

<!-- Source EN PDF p.45; unit 374 -->

| Member Name | Description |
|---|---|
| left | horizontal output offset |
| top | vertical output offset |
| width | horizontal output size |
| height | vertical output size |

<!-- Source EN PDF p.46; unit 375 -->

## 4.   Offline frame processing

<!-- Source EN PDF p.46; unit 376 -->

### 4.1   Overview

<!-- Source EN PDF p.46; unit 377 -->

RKAIQ provides offline RAW frame processing function, that is, RK custom RAW format files are parsed by RKAIQ and sent to ISP for processing, and output as images that can display normal effects.

<!-- Source EN PDF p.46; unit 378 -->

Note: The offline frame processing feature has not been tested.

<!-- Source EN PDF p.46; unit 379 -->

### 4.2   Functional block diagram

<!-- Source EN PDF p.46; unit 380 -->

![Original technical figure — PDF p.46](/docs/rockchip-isp30-development/assets/en-p046-X802.png)

<!-- Source EN PDF p.46; unit 381 -->

Block diagram of offline frame processing

<!-- Source EN PDF p.46; unit 382 -->

### 4.3   Description of the feature

<!-- Source EN PDF p.46; unit 383 -->

Support RK-RAW file input. With the file input interface, the calling process is blocked until the file processing is complete and the output is successful.

<!-- Source EN PDF p.46; unit 384 -->

Support RK-RAW buffer input, asynchronous processing mode. Using the buffer input interface, the calling process will not block, and the callback function (if there is a registered callback function) will be called after the buffer processing is completed.

<!-- Source EN PDF p.47; unit 385 -->

Support RK-RAW buffer input, synchronous processing mode. With the buffer input interface, the calling process will be blocked until the buffer processing is complete and the output is successful.

<!-- Source EN PDF p.47; unit 386 -->

### 4.4   RK-RAW format description

<!-- Source EN PDF p.47; unit 387 -->

See the RK RAW File Format documentation

<!-- Source EN PDF p.47; unit 388 -->

### 4.5   Supported RAW formats

<!-- Source EN PDF p.47; unit 389 -->

Support raw8/raw10/raw12, support BGGR/GBRG/GRBG/RGGB four bayer formats.

<!-- Source EN PDF p.47; unit 390 -->

### 4.6   API reference

<!-- Source EN PDF p.47; unit 391 -->

### 4.7   Data structures

<!-- Source EN PDF p.47; unit 392 -->

### 4.8   Considerations

<!-- Source EN PDF p.47; unit 393 -->

Using the RK Raw data processing function, when creating an AIQ Context, the parameter sns_ent_name of the rk_aiq_uapi2_sysctl_init interface must be "FakeCamera".

<!-- Source EN PDF p.47; unit 394 -->

The processing of raw data relies on IQ XML effect files, and the resolution of the XML file should be generated at the same resolution as the incoming RK Raw frame data. The effect file must be named FakeCamera.xml and placed in the loading path of the XML file.

<!-- Source EN PDF p.47; unit 395 -->

### 4.9   Reference example

<!-- Source EN PDF p.47; unit 396 -->

For more information about how to use the offline frame processing API, see rkisp_demo, and the path is YOUR_SDK_DIR/external/camera_engine_rkaiq/rkisp_demo.

<!-- Source EN PDF p.48; unit 397 -->

## 5.   Camera group

<!-- Source EN PDF p.48; unit 398 -->

### 5.1   Overview

<!-- Source EN PDF p.48; unit 399 -->

For example, in application scenarios such as surround view, multiple cameras need to be grouped together for unified management, and parameters such as exposure need to be set in a unified manner. You can create a group to classify multiple cameras into the same group. The Camera Group API is implemented based on the AIQ API of a single camera, unless otherwise specified, the API that applies to a single AIQ also applies to a Camera group, and the internal implementation of AIQ will distribute requests to a Camera group or a single Camera according to the type of Context passed.

<!-- Source EN PDF p.48; unit 400 -->

#### 5.1.1  rk_aiq_uapi2_camgroup_create

<!-- Source EN PDF p.48; unit 401 -->

【Description】 When you create a Camera group, you will create a separate AIQ ctx for each Camera, and then hand it over to the Group Ctx to manage

<!-- Source EN PDF p.48; unit 402 -->

【Grammar】

<!-- Source EN PDF p.48; unit 403 -->

```text
 rk_aiq_camgroup_ctx_t*
 rk_aiq_uapi2_camgroup_create (rk_aiq_camgroup_instance_cfg_t* cfg);
```

<!-- Source EN PDF p.48; unit 404 -->

【Parameter】

<!-- Source EN PDF p.48; unit 405 -->

| Parameter name | Description | Input/Output |
|---|---|---|
| cfg | Configure parameters | Input |

<!-- Source EN PDF p.48; unit 406 -->

【Return value】

<!-- Source EN PDF p.48; unit 407 -->

| Return value | Description |
|---|---|
| rk_aiq_camgroup_ctx_t* | Group runtime |
| NULL | fail |

<!-- Source EN PDF p.48; unit 408 -->

【Demand】

<!-- Source EN PDF p.48; unit 409 -->

Header files：rk_aiq_user_api2_camgroup.h

<!-- Source EN PDF p.48; unit 410 -->

Library files：librkaiq.so

<!-- Source EN PDF p.48; unit 411 -->

【Note】

<!-- Source EN PDF p.48; unit 412 -->

Different from rk_aiq_uapi2_sysctl_init, rk_aiq_uapi2_sysctl_init create an AIQ runtime environment with a single camera. Use rk_aiq_uapi2_sysctl_init to create a sensor entity that runs and no longer use rk_aiq_uapi2_camgroup_create to create a group runtime and vice versa.

<!-- Source EN PDF p.49; unit 413 -->

Since the default IQ scene is normal-day, if you need to use HDR or other modes, you need to use rk_aiq_uapi2_sysctl_preInit_scene to set it in advance.

<!-- Source EN PDF p.49; unit 414 -->

#### 5.1.2  rk_aiq_uapi2_camgroup_prepare

<!-- Source EN PDF p.49; unit 415 -->

【Description】 According to the selected pipeline mode, initialization parameters are generated and pipelines are created. The rk_aiq_uapi2_sysctl_prepare corresponding to the AIQ ctx of each Camera will be called.

<!-- Source EN PDF p.49; unit 416 -->

【Grammar】

<!-- Source EN PDF p.49; unit 417 -->

```text
 XCamReturn
 rk_aiq_uapi2_camgroup_prepare (rk_aiq_camgroup_ctx_t* camgroup_ctx,
 rk_aiq_working_mode_t mode);
```

<!-- Source EN PDF p.49; unit 418 -->

【Parameter】

<!-- Source EN PDF p.49; unit 419 -->

| Parameter name | Description | Input/Output |
|---|---|---|
| camgroup_ctx | Group runtime | Input |
| mode | Pipeline working mode | Input |

<!-- Source EN PDF p.49; unit 420 -->

【Return value】

<!-- Source EN PDF p.49; unit 421 -->

| Return value | Description |
|---|---|
| 0 | succeed |
| Non-0 | See Error Codes |

<!-- Source EN PDF p.49; unit 422 -->

【Demand】

<!-- Source EN PDF p.49; unit 423 -->

Header files：rk_aiq_user_api2_camgroup.h Library files：librkaiq.so

<!-- Source EN PDF p.49; unit 424 -->

#### 5.1.3  rk_aiq_uapi2_camgroup_start

<!-- Source EN PDF p.49; unit 425 -->

【Description】 Run the Camera group. The rk_aiq_uapi2_sysctl_start corresponding to the AIQ ctx of each Camera will be called.

<!-- Source EN PDF p.49; unit 426 -->

【Grammar】

<!-- Source EN PDF p.49; unit 427 -->

```text
 XCamReturn
 rk_aiq_uapi2_camgroup_start (rk_aiq_camgroup_ctx_t* camgroup_ctx);
```

<!-- Source EN PDF p.49; unit 428 -->

【Parameter】

<!-- Source EN PDF p.50; unit 429 -->

| Parameter name | Description | Input/Output |
|---|---|---|
| camgroup_ctx | Group runtime | input |

<!-- Source EN PDF p.50; unit 430 -->

【Return Value】

<!-- Source EN PDF p.50; unit 431 -->

| Return Value | Description |
|---|---|
| 0 | succeed |
| Non-0 | Failed, see Error Code |

<!-- Source EN PDF p.50; unit 432 -->

【Demand】

<!-- Source EN PDF p.50; unit 433 -->

Header files：rk_aiq_user_api2_camgroup.h Library files：librkaiq.so

<!-- Source EN PDF p.50; unit 434 -->

#### 5.1.4  rk_aiq_uapi2_camgroup_stop

<!-- Source EN PDF p.50; unit 435 -->

【Description】 Stop the Camera group. The rk_aiq_uapi2_sysctl_stop corresponding to the AIQ ctx of each Camera will be called.

<!-- Source EN PDF p.50; unit 436 -->

【Grammar】

<!-- Source EN PDF p.50; unit 437 -->

```text
 XCamReturn
 rk_aiq_uapi2_camgroup_stop (rk_aiq_camgroup_ctx_t* camgroup_ctx);
```

<!-- Source EN PDF p.50; unit 438 -->

【Parameter】

<!-- Source EN PDF p.50; unit 439 -->

| Parameter name | Description | Input/Output |
|---|---|---|
| camgroup_ctx | Group runtime | input |

<!-- Source EN PDF p.50; unit 440 -->

【Return Value】

<!-- Source EN PDF p.50; unit 441 -->

| Return Value | Description |
|---|---|
| 0 | succeed |
| Non-0 | Failed, see Error Code |

<!-- Source EN PDF p.50; unit 442 -->

【Demand】

<!-- Source EN PDF p.50; unit 443 -->

Header files：rk_aiq_user_api2_camgroup.h Library files：librkaiq.so

<!-- Source EN PDF p.51; unit 444 -->

#### 5.1.5  rk_aiq_uapi2_camgroup_destroy

<!-- Source EN PDF p.51; unit 445 -->

【Description】 Destroy the Camera group. The rk_aiq_uapi2_sysctl_deinit corresponding to the AIQ ctx of each Camera will be called.

<!-- Source EN PDF p.51; unit 446 -->

【Grammar】

<!-- Source EN PDF p.51; unit 447 -->

```text
 XCamReturn
 rk_aiq_uapi2_camgroup_destroy (rk_aiq_camgroup_ctx_t* camgroup_ctx);
```

<!-- Source EN PDF p.51; unit 448 -->

【Parameter】

<!-- Source EN PDF p.51; unit 449 -->

| Parameter name | Description | Input/Output |
|---|---|---|
| camgroup_ctx | Group runtime | Input |

<!-- Source EN PDF p.51; unit 450 -->

【Return Value】

<!-- Source EN PDF p.51; unit 451 -->

| Return Value | Description |
|---|---|
| 0 | succeed |
| Non-0 | Failed, see Error Code |

<!-- Source EN PDF p.51; unit 452 -->

【Demand】

<!-- Source EN PDF p.51; unit 453 -->

Header files：rk_aiq_user_api2_camgroup.h Library files：librkaiq.so

<!-- Source EN PDF p.51; unit 454 -->

#### 5.1.6  rk_aiq_uapi2_camgroup_getOverlapMap

<!-- Source EN PDF p.51; unit 455 -->

【Description】 In the surround view scenario, obtain the overlapping area information of each camera from the CameraGroup context.

<!-- Source EN PDF p.51; unit 456 -->

【Grammar】

<!-- Source EN PDF p.51; unit 457 -->

```text
 struct RK_PS_SrcOverlapMap*
 rk_aiq_uapi2_camgroup_getOverlapMap (rk_aiq_camgroup_ctx_t* camgroup_ctx);
```

<!-- Source EN PDF p.51; unit 458 -->

【Parameter】

<!-- Source EN PDF p.51; unit 459 -->

| Parameter name | Description | Input/Output |
|---|---|---|
| camgroup_ctx | Group runtime | Input |

<!-- Source EN PDF p.51; unit 460 -->

【Return Value】

<!-- Source EN PDF p.52; unit 461 -->

| Return Value | Description |
|---|---|
| struct RK_PS_SrcOverlapMap* | Overlapping region information struct pointers |
| NULL | fail |

<!-- Source EN PDF p.52; unit 462 -->

【Demand】

<!-- Source EN PDF p.52; unit 463 -->

Header files：rk_aiq_user_api2_camgroup.h Library files：librkaiq.so

<!-- Source EN PDF p.52; unit 464 -->

#### 5.1.7  rk_aiq_uapi2_camgroup_getOverlapMap

<!-- Source EN PDF p.52; unit 465 -->

【Description】 In the surround view scenario, you can obtain the overlapping area information of each camera from the file.

<!-- Source EN PDF p.52; unit 466 -->

【Grammar】

<!-- Source EN PDF p.52; unit 467 -->

```text
 XCamReturn
 rk_aiq_uapi2_camgroup_getOverlapMap_from_file (const char* map_file,
                                                             struct
 RK_PS_SrcOverlapMap** overlapMap);
```

<!-- Source EN PDF p.52; unit 468 -->

【Parameter】

<!-- Source EN PDF p.52; unit 469 -->

| Parameter name | Description | Input/Output |
|---|---|---|
| map_file | A file that stores overlapping information | Input |
| overlapMap | Stores the acquired overlapping information | Input，Output |

<!-- Source EN PDF p.52; unit 470 -->

【Return Value】

<!-- Source EN PDF p.52; unit 471 -->

| Return Value | Description |
|---|---|
| 0 | succeed |
| Non-0 | Failed, see Error Code |

<!-- Source EN PDF p.52; unit 472 -->

【Demand】

<!-- Source EN PDF p.52; unit 473 -->

Header files：rk_aiq_user_api2_camgroup.h Library files：librkaiq.so

<!-- Source EN PDF p.52; unit 474 -->

#### 5.1.8  rk_aiq_uapi2_camgroup_getAiqCtxBySnsNm

<!-- Source EN PDF p.52; unit 475 -->

【Description】 Obtain the AIQ context of a single Camera by using the Sensor entity name in the group.

<!-- Source EN PDF p.52; unit 476 -->

【Grammar】

<!-- Source EN PDF p.53; unit 477 -->

```text
 rk_aiq_sys_ctx_t*
 rk_aiq_uapi2_camgroup_getAiqCtxBySnsNm (rk_aiq_camgroup_ctx_t* camgroup_ctx,
 const char* sns_entity_name);
```

<!-- Source EN PDF p.53; unit 478 -->

【Parameter】

<!-- Source EN PDF p.53; unit 479 -->

| Parameter name | Description | Input/Output |
|---|---|---|
| camgroup_ctx | Group runtime | Input |
| sns_entity_name | The name of the sensor entity in the group | Input |

<!-- Source EN PDF p.53; unit 480 -->

【Return Value】

<!-- Source EN PDF p.53; unit 481 -->

| Return Value | Description |
|---|---|
| rk_aiq_sys_ctx_t* | The obtained AIQ runtime environment |
| NULL | fail |

<!-- Source EN PDF p.53; unit 482 -->

【Demand】

<!-- Source EN PDF p.53; unit 483 -->

Header files：rk_aiq_user_api2_camgroup.h Library files：librkaiq.so

<!-- Source EN PDF p.53; unit 484 -->

#### 5.1.9  rk_aiq_uapi2_camgroup_getCamInfos

<!-- Source EN PDF p.53; unit 485 -->

【Description】 Obtain information about cameras in the group, such as the name of the sensor entity.

<!-- Source EN PDF p.53; unit 486 -->

【Grammar】

<!-- Source EN PDF p.53; unit 487 -->

```text
 XCamReturn
 rk_aiq_uapi2_camgroup_getCamInfos (rk_aiq_camgroup_ctx_t* camgroup_ctx,
                    rk_aiq_camgroup_camInfos_t* camInfos);
```

<!-- Source EN PDF p.53; unit 488 -->

【Parameter】

<!-- Source EN PDF p.53; unit 489 -->

| Parameter name | Description | Input/Output |
|---|---|---|
| camgroup_ctx | Group runtime | Input |
| camInfos | Obtained information about the cameras in the group | Output |

<!-- Source EN PDF p.53; unit 490 -->

【Return Value】

<!-- Source EN PDF p.53; unit 491 -->

| Return Value | Description |
|---|---|
| 0 | succeed |
| Non-0 | Failed, see Error Code |

<!-- Source EN PDF p.54; unit 492 -->

【Demand】

<!-- Source EN PDF p.54; unit 493 -->

Header files：rk_aiq_user_api2_camgroup.h Library files：librkaiq.so

<!-- Source EN PDF p.54; unit 494 -->

#### 5.1.10  rk_aiq_uapi2_camgroup_bind

<!-- Source EN PDF p.54; unit 495 -->

【Description】 Reserved interface, not implemented.

<!-- Source EN PDF p.54; unit 496 -->

#### 5.1.11  rk_aiq_uapi2_camgroup_unbind

<!-- Source EN PDF p.54; unit 497 -->

【Description】 Reserved interface, not implemented.

<!-- Source EN PDF p.54; unit 498 -->

### 5.2   Data Structure

<!-- Source EN PDF p.54; unit 499 -->

#### 5.2.1  rk_aiq_camgroup_instance_cfg_t

<!-- Source EN PDF p.54; unit 500 -->

【Illustrate】 Carmelaghrup configuration parameters

<!-- Source EN PDF p.54; unit 501 -->

【Definition】

<!-- Source EN PDF p.54; unit 502 -->

```text
   typedef struct rk_aiq_camgroup_instance_cfg_s {
       const char* sns_ent_nm_array[RK_AIQ_CAM_GROUP_MAX_CAMS];
       int sns_num;
       const char* config_file_dir;
        /* followings are relative path to config_file_dir */
        const char* single_iq_file;
        const char* group_iq_file;
        const char* overlap_map_file;
    } rk_aiq_camgroup_instance_cfg_t;
```

<!-- Source EN PDF p.54; unit 503 -->

【Member】

<!-- Source EN PDF p.55; unit 504 -->

| Member Name | Description |
|---|---|
| sns_ent_nm_array | It needs to be added to the Sensor entity array managed by the group |
| sns_num | The number of sensor entities that need to be added to the group |
| config_file_dir | Specify the IQ file path |
| single_iq_file | Specify the IQ file name, which can be NULL, and NULL is automatically selected<br>by AIQ |
| group_iq_file | The specified IQ configuration file of the Camera group is not currently in use |
| overlap_map_file | Specify the Camera overlap information file, which can be NULL |

<!-- Source EN PDF p.55; unit 505 -->

#### 5.2.2  rk_aiq_camgroup_camInfos_t

<!-- Source EN PDF p.55; unit 506 -->

【Illustrate】 Information about each camera in the Camera group

<!-- Source EN PDF p.55; unit 507 -->

【Definition】

<!-- Source EN PDF p.55; unit 508 -->

```text
    typedef struct rk_aiq_camgroup_camInfos_s {
        int valid_sns_num;
        const char* sns_ent_nm[RK_AIQ_CAM_GROUP_MAX_CAMS];
        int sns_camPhyId[RK_AIQ_CAM_GROUP_MAX_CAMS];
   } rk_aiq_camgroup_camInfos_t;
```

<!-- Source EN PDF p.55; unit 509 -->

【Member】

<!-- Source EN PDF p.55; unit 510 -->

| Member Name | Description |
|---|---|
| valid_sns_num | The number of Sensor entities contained in the group |
| sns_ent_nm | An array of Sensor entity names contained within the group |
| sns_camPhyId | An array of physical IDs corresponding to the Sensor entities contained in the group |

<!-- Source EN PDF p.55; unit 511 -->

#### 5.2.3  struct RK_PS_SrcOverlapMap

<!-- Source EN PDF p.55; unit 512 -->

【Illustrate】 Define the overlapping area of the camera

<!-- Source EN PDF p.55; unit 513 -->

【Definition】

<!-- Source EN PDF p.55; unit 514 -->

```text
        struct RK_PS_SrcOverlapMap
      {
            char versionInfo[64];
            RK_PS_SrcOverlapPosition srcOverlapPositon[8];
            unsigned char overlapMap[15 * 15 * 8];
        };
```

<!-- Source EN PDF p.56; unit 515 -->

【Member】

<!-- Source EN PDF p.56; unit 516 -->

| Member Name | Description |
|---|---|
| versionInfo | Version information |
| srcOverlapPositon | The rotation direction of each camera can be 0, 90, 180, and 270 degrees |
| overlapMap | The overlapping information of each statistical block of 8 cameras is as follows: the<br>statistical data of each camera is 15*15 columns, a total of 8 cameras (numbered<br>0~7), and if there are actually less than 8 cameras, the corresponding position is<br>filled with 0. Save by row, after saving the first row of the 8 cameras, then save the<br>second row. And so on. The value range is 0~255, the value is 0 if it is completely<br>non-overlapping, and the value is 255 if it is completely overlapping, and the partial<br>overlap is interpolated according to the proportion<br>camera0 row0; camera1 row0; camera2 row0; camera3 row0; camera4 row0;<br>camera5 row0; camera6 row0; camera7 row0;<br>camera0 row1; camera1 row1; camera2 row1; camera3 row1; camera4 row1;<br>camera5 row1; camera6 row1; camera7 row1;<br>......<br>camera0 row14; camera1 row14; camera2 row14; camera3 row14; camera4 row14;<br>camera5 row14; camera6 row14; camera7 row14; |

<!-- Source EN PDF p.57; unit 517 -->

## 6.   AE

<!-- Source EN PDF p.57; unit 518 -->

### 6.1   Overview

<!-- Source EN PDF p.57; unit 519 -->

The AE module achieves the function of obtaining the exposure of the current image according to the automatic metering system, and then automatically configuring the lens aperture, sensor shutter and gain to obtain the best image quality.

<!-- Source EN PDF p.57; unit 520 -->

### 6.2   Important concepts

<!-- Source EN PDF p.57; unit 521 -->

Exposure time: The time when the sensor accumulates charge is the time between the sensor pixel being exposed and the charge is read.

<!-- Source EN PDF p.57; unit 522 -->

Exposure gain: The total amplification factor of the output charge of the sensor, generally digital gain and analog gain, analog gain will introduce slightly less noise, so analog gain is generally preferred.

<!-- Source EN PDF p.57; unit 523 -->

Aperture: Aperture is a mechanism in the lens that can change the size of the clear aperture.

<!-- Source EN PDF p.57; unit 524 -->

Anti-flicker: The picture flicker caused by the mismatch between the power frequency of the lamp and the frame rate of the sensor is generally achieved by limiting the exposure time and modifying the frame rate of the sensor.

<!-- Source EN PDF p.57; unit 525 -->

### 6.3   Description of the feature

<!-- Source EN PDF p.57; unit 526 -->

The AE module consists of AE statistics and the algorithm of AE control strategy.

<!-- Source EN PDF p.57; unit 527 -->

### 6.4   Feature-level API reference

<!-- Source EN PDF p.57; unit 528 -->

#### 6.4.1  rk_aiq_uapi2_setAeLock

<!-- Source EN PDF p.57; unit 529 -->

【Description】

<!-- Source EN PDF p.57; unit 530 -->

Set AE exposure lock function.

<!-- Source EN PDF p.57; unit 531 -->

【Grammar】

<!-- Source EN PDF p.57; unit 532 -->

```text
 XCamReturn rk_aiq_uapi2_setAeLock（const rk_aiq_sys_ctx_t* ctx, bool on);
```

<!-- Source EN PDF p.57; unit 533 -->

【Parameters】

<!-- Source EN PDF p.57; unit 534 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| on | Lock Enable | Input |

<!-- Source EN PDF p.58; unit 535 -->

【Return Value】

<!-- Source EN PDF p.58; unit 536 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 |  |

<!-- Source EN PDF p.58; unit 537 -->

#### 6.4.2  rk_aiq_uapi2_setExpMode

<!-- Source EN PDF p.58; unit 538 -->

【Description】 Set exposure mode, support setting auto exposure and manual exposure.

<!-- Source EN PDF p.58; unit 539 -->

【Grammar】

<!-- Source EN PDF p.58; unit 540 -->

```text
 XCamReturn rk_aiq_uapi2_setExpMode(const rk_aiq_sys_ctx_t* ctx, opMode_t mode);
```

<!-- Source EN PDF p.58; unit 541 -->

【Parameters】

<!-- Source EN PDF p.58; unit 542 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| mode | Exposure Mode | Input |

<!-- Source EN PDF p.58; unit 543 -->

【Return Value】

<!-- Source EN PDF p.58; unit 544 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.58; unit 545 -->

【Note】

<!-- Source EN PDF p.58; unit 546 -->

The gain and exposure time when the exposure mode is cut to manual mode use the initial values defined in the image effect file. If you need to set the exposure value while switching the manual mode, you can use the rk_aiq_uapi2_setManualExp interface.

<!-- Source EN PDF p.58; unit 547 -->

【Requirements】

<!-- Source EN PDF p.58; unit 548 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.58; unit 549 -->

Library file: librkaiq.so

<!-- Source EN PDF p.58; unit 550 -->

#### 6.4.3  rk_aiq_uapi2_getExpMode

<!-- Source EN PDF p.58; unit 551 -->

【Description】 Gets the exposure mode.

<!-- Source EN PDF p.58; unit 552 -->

【Grammar】

<!-- Source EN PDF p.59; unit 553 -->

```text
 XCamReturn rk_aiq_uapi2_getExpMode(const rk_aiq_sys_ctx_t* ctx, opMode_t *mode);
```

<!-- Source EN PDF p.59; unit 554 -->

【Parameters】

<!-- Source EN PDF p.59; unit 555 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| mode | Exposure Mode | Output |

<!-- Source EN PDF p.59; unit 556 -->

【Return Value】

<!-- Source EN PDF p.59; unit 557 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.59; unit 558 -->

【Requirements】

<!-- Source EN PDF p.59; unit 559 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.59; unit 560 -->

Library file: librkaiq.so

<!-- Source EN PDF p.59; unit 561 -->

#### 6.4.4  rk_aiq_uapi2_setManualExp

<!-- Source EN PDF p.59; unit 562 -->

【Description】 Use the manual exposure mode and set the gain and exposure time.

<!-- Source EN PDF p.59; unit 563 -->

【Grammar】

<!-- Source EN PDF p.59; unit 564 -->

```text
 XCamReturn rk_aiq_uapi2_setManualExp(const rk_aiq_sys_ctx_t* ctx, float gain,
 float time);
```

<!-- Source EN PDF p.59; unit 565 -->

【Parameters】

<!-- Source EN PDF p.59; unit 566 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| gain | Exposure gain | Input |
| time | Exposure time | Input |

<!-- Source EN PDF p.59; unit 567 -->

【Return Value】

<!-- Source EN PDF p.59; unit 568 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.59; unit 569 -->

【Requirements】

<!-- Source EN PDF p.60; unit 570 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.60; unit 571 -->

Library file: librkaiq.so

<!-- Source EN PDF p.60; unit 572 -->

#### 6.4.5  rk_aiq_uapi2_setExpGainRange

<!-- Source EN PDF p.60; unit 573 -->

【Description】\*\* Set the gain range.

<!-- Source EN PDF p.60; unit 574 -->

【Grammar】

<!-- Source EN PDF p.60; unit 575 -->

```text
 XCamReturn rk_aiq_uapi2_setExpGainRange(const rk_aiq_sys_ctx_t* ctx, paRange_t
 *gain);
```

<!-- Source EN PDF p.60; unit 576 -->

【Parameters】

<!-- Source EN PDF p.60; unit 577 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| gain | Exposure gain range | Input |

<!-- Source EN PDF p.60; unit 578 -->

【Return Value】

<!-- Source EN PDF p.60; unit 579 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.60; unit 580 -->

【Requirements】

<!-- Source EN PDF p.60; unit 581 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.60; unit 582 -->

Library file: librkaiq.so

<!-- Source EN PDF p.60; unit 583 -->

#### 6.4.6  rk_aiq_uapi2_getExpGainRange

<!-- Source EN PDF p.60; unit 584 -->

【Description】 Get the gain range.

<!-- Source EN PDF p.60; unit 585 -->

【Grammar】

<!-- Source EN PDF p.60; unit 586 -->

```text
 XCamReturn rk_aiq_uapi2_getExpGainRange(const rk_aiq_sys_ctx_t* ctx, paRange_t
 *gain);
```

<!-- Source EN PDF p.60; unit 587 -->

【Parameters】

<!-- Source EN PDF p.61; unit 588 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| gain | Exposure gain range | Output |

<!-- Source EN PDF p.61; unit 589 -->

【Return Value】

<!-- Source EN PDF p.61; unit 590 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.61; unit 591 -->

【Requirements】

<!-- Source EN PDF p.61; unit 592 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.61; unit 593 -->

Library file: librkaiq.so

<!-- Source EN PDF p.61; unit 594 -->

#### 6.4.7  rk_aiq_uapi2_setExpTimeRange

<!-- Source EN PDF p.61; unit 595 -->

【Description】 Set the exposure time range.

<!-- Source EN PDF p.61; unit 596 -->

【Grammar】

<!-- Source EN PDF p.61; unit 597 -->

```text
 XCamReturn rk_aiq_uapi2_setExpTimeRange(const rk_aiq_sys_ctx_t* ctx, paRange_t
 *time);
```

<!-- Source EN PDF p.61; unit 598 -->

【Parameters】

<!-- Source EN PDF p.61; unit 599 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| time | Exposure time range | Input |

<!-- Source EN PDF p.61; unit 600 -->

【Return Value】

<!-- Source EN PDF p.61; unit 601 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.61; unit 602 -->

【Requirements】

<!-- Source EN PDF p.61; unit 603 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.61; unit 604 -->

Library file: librkaiq.so

<!-- Source EN PDF p.62; unit 605 -->

#### 6.4.8  rk_aiq_uapi2_getExpTimeRange

<!-- Source EN PDF p.62; unit 606 -->

【Description】 Gets the exposure time range.

<!-- Source EN PDF p.62; unit 607 -->

【Grammar】

<!-- Source EN PDF p.62; unit 608 -->

```text
 XCamReturn rk_aiq_uapi2_getExpTimeRange(const rk_aiq_sys_ctx_t* ctx, paRange_t
 *time);
```

<!-- Source EN PDF p.62; unit 609 -->

【Parameters】

<!-- Source EN PDF p.62; unit 610 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| time | Exposure time range | Output |

<!-- Source EN PDF p.62; unit 611 -->

【Return Value】

<!-- Source EN PDF p.62; unit 612 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.62; unit 613 -->

【Requirements】

<!-- Source EN PDF p.62; unit 614 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.62; unit 615 -->

Library file: librkaiq.so

<!-- Source EN PDF p.62; unit 616 -->

#### 6.4.9  rk_aiq_uapi2_setBLCMode

<!-- Source EN PDF p.62; unit 617 -->

【Description】 Backlight compensation switch, locale.

<!-- Source EN PDF p.62; unit 618 -->

【Grammar】

<!-- Source EN PDF p.62; unit 619 -->

```text
 XCamReturn rk_aiq_uapi2_setBLCMode(const rk_aiq_sys_ctx_t* ctx, bool on,
 aeMeasAreaType_t areaType);
```

<!-- Source EN PDF p.62; unit 620 -->

【Parameters】

<!-- Source EN PDF p.62; unit 621 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| on | Switch | Input |
| areaType | Compensation area selection | Input |

<!-- Source EN PDF p.62; unit 622 -->

【Return Value】

<!-- Source EN PDF p.63; unit 623 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.63; unit 624 -->

【Note】

<!-- Source EN PDF p.63; unit 625 -->

The interface is only available in linear mode.

<!-- Source EN PDF p.63; unit 626 -->

【Requirements】

<!-- Source EN PDF p.63; unit 627 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.63; unit 628 -->

Library file: librkaiq.so

<!-- Source EN PDF p.63; unit 629 -->

#### 6.4.10  rk_aiq_uapi2_setBLCStrength

<!-- Source EN PDF p.63; unit 630 -->

【Description】 Set dark areas to boost intensity.

<!-- Source EN PDF p.63; unit 631 -->

【Grammar】

<!-- Source EN PDF p.63; unit 632 -->

```text
 XCamReturn rk_aiq_uapi2_setBLCStrength(const rk_aiq_sys_ctx_t* ctx, int
 strength);
```

<!-- Source EN PDF p.63; unit 633 -->

【Parameters】

<!-- Source EN PDF p.63; unit 634 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| strength | Boost intensity, range [1,100] | Input |

<!-- Source EN PDF p.63; unit 635 -->

【Return Value】

<!-- Source EN PDF p.63; unit 636 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.63; unit 637 -->

【Note】

<!-- Source EN PDF p.63; unit 638 -->

The interface is only available in linear mode.

<!-- Source EN PDF p.63; unit 639 -->

【Requirements】

<!-- Source EN PDF p.63; unit 640 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.63; unit 641 -->

Library file: librkaiq.so

<!-- Source EN PDF p.64; unit 642 -->

#### 6.4.11  rk_aiq_uapi2_setHLCMode

<!-- Source EN PDF p.64; unit 643 -->

【Description】 Bright light suppression switch.

<!-- Source EN PDF p.64; unit 644 -->

【Grammar】

<!-- Source EN PDF p.64; unit 645 -->

```text
 XCamReturn rk_aiq_uapi2_setHLCMode(const rk_aiq_sys_ctx_t* ctx, bool on);
```

<!-- Source EN PDF p.64; unit 646 -->

【Parameters】

<!-- Source EN PDF p.64; unit 647 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| on | Switch | Input |

<!-- Source EN PDF p.64; unit 648 -->

【Return Value】

<!-- Source EN PDF p.64; unit 649 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.64; unit 650 -->

【Note】

<!-- Source EN PDF p.64; unit 651 -->

The interface is only available in linear mode.

<!-- Source EN PDF p.64; unit 652 -->

【Requirements】

<!-- Source EN PDF p.64; unit 653 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.64; unit 654 -->

Library file: librkaiq.so

<!-- Source EN PDF p.64; unit 655 -->

#### 6.4.12  rk_aiq_uapi2_setHLCStrength

<!-- Source EN PDF p.64; unit 656 -->

【Description】 Set the intensity of intense light suppression.

<!-- Source EN PDF p.64; unit 657 -->

【Grammar】

<!-- Source EN PDF p.64; unit 658 -->

```text
 XCamReturn rk_aiq_uapi2_setHLCStrength(const rk_aiq_sys_ctx_t* ctx, int
 strength);
```

<!-- Source EN PDF p.64; unit 659 -->

【Parameters】

<!-- Source EN PDF p.64; unit 660 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| strength | Inhibition intensity, range [1,100] | Input |

<!-- Source EN PDF p.65; unit 661 -->

【Return Value】

<!-- Source EN PDF p.65; unit 662 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.65; unit 663 -->

【Note】

<!-- Source EN PDF p.65; unit 664 -->

The interface is only available in linear mode.

<!-- Source EN PDF p.65; unit 665 -->

【Requirements】

<!-- Source EN PDF p.65; unit 666 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.65; unit 667 -->

Library file: librkaiq.sov

<!-- Source EN PDF p.65; unit 668 -->

#### 6.4.13  rk_aiq_uapi2_setAntiFlickerEn

<!-- Source EN PDF p.65; unit 669 -->

【Description】 Set the anti-power frequency flicker switch.

<!-- Source EN PDF p.65; unit 670 -->

【Grammar】

<!-- Source EN PDF p.65; unit 671 -->

```text
 XCamReturn rk_aiq_uapi2_setAntiFlickerEn(const rk_aiq_sys_ctx_t* ctx, bool on)；
```

<!-- Source EN PDF p.65; unit 672 -->

【Parameters】

<!-- Source EN PDF p.65; unit 673 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| on | Function switch parameters | Input |

<!-- Source EN PDF p.65; unit 674 -->

【Return Value】

<!-- Source EN PDF p.65; unit 675 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.65; unit 676 -->

【Requirements】

<!-- Source EN PDF p.65; unit 677 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.65; unit 678 -->

Library file: librkaiq.so

<!-- Source EN PDF p.66; unit 679 -->

#### 6.4.14  rk_aiq_uapi2_getAntiFlickerEn

<!-- Source EN PDF p.66; unit 680 -->

【Description】 Set the anti-power frequency flicker switch.

<!-- Source EN PDF p.66; unit 681 -->

【Grammar】

<!-- Source EN PDF p.66; unit 682 -->

```text
 XCamReturn rk_aiq_uapi2_getAntiFlickerEn(const rk_aiq_sys_ctx_t* ctx, bool* on)；
```

<!-- Source EN PDF p.66; unit 683 -->

【Parameters】

<!-- Source EN PDF p.66; unit 684 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| on | Function switch parameters | Input |

<!-- Source EN PDF p.66; unit 685 -->

【Return Value】

<!-- Source EN PDF p.66; unit 686 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.66; unit 687 -->

【Requirements】

<!-- Source EN PDF p.66; unit 688 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.66; unit 689 -->

Library file: librkaiq.so

<!-- Source EN PDF p.66; unit 690 -->

#### 6.4.15  rk_aiq_uapi2_setAntiFlickerMode

<!-- Source EN PDF p.66; unit 691 -->

【Description】 Set the anti-flash mode.

<!-- Source EN PDF p.66; unit 692 -->

【Grammar】

<!-- Source EN PDF p.66; unit 693 -->

```text
 XCamReturn rk_aiq_uapi2_setAntiFlickerMode(const rk_aiq_sys_ctx_t* ctx,
 antiFlickerMode_t mode);
```

<!-- Source EN PDF p.66; unit 694 -->

【Parameters】

<!-- Source EN PDF p.66; unit 695 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| mode | Anti-flash mode | Input |

<!-- Source EN PDF p.66; unit 696 -->

【Return Value】

<!-- Source EN PDF p.67; unit 697 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.67; unit 698 -->

【Requirements】

<!-- Source EN PDF p.67; unit 699 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.67; unit 700 -->

Library file: librkaiq.so

<!-- Source EN PDF p.67; unit 701 -->

#### 6.4.16  rk_aiq_uapi2_getAntiFlickerMode

<!-- Source EN PDF p.67; unit 702 -->

【Description】 Get the anti-flash mode.

<!-- Source EN PDF p.67; unit 703 -->

【Grammar】

<!-- Source EN PDF p.67; unit 704 -->

```text
 XCamReturn rk_aiq_uapi2_getAntiFlickerMode(const rk_aiq_sys_ctx_t* ctx,
 antiFlickerMode_t *mode);
```

<!-- Source EN PDF p.67; unit 705 -->

【Parameters】

<!-- Source EN PDF p.67; unit 706 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| mode | Anti-flash mode | Output |

<!-- Source EN PDF p.67; unit 707 -->

【Return Value】

<!-- Source EN PDF p.67; unit 708 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.67; unit 709 -->

【Requirements】

<!-- Source EN PDF p.67; unit 710 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.67; unit 711 -->

Library file: librkaiq.so

<!-- Source EN PDF p.67; unit 712 -->

#### 6.4.17  rk_aiq_uapi2_setExpPwrLineFreqMode

<!-- Source EN PDF p.67; unit 713 -->

【Description】 Set the anti-flash frequency.

<!-- Source EN PDF p.67; unit 714 -->

【Grammar】

<!-- Source EN PDF p.67; unit 715 -->

```text
 XCamReturn rk_aiq_uapi2_setExpPwrLineFreqMode(const rk_aiq_sys_ctx_t* ctx,
 expPwrLineFreq_t freq);
```

<!-- Source EN PDF p.68; unit 716 -->

【Parameters】

<!-- Source EN PDF p.68; unit 717 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| freq | Anti-flash frequency | Input |

<!-- Source EN PDF p.68; unit 718 -->

【Return Value】

<!-- Source EN PDF p.68; unit 719 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.68; unit 720 -->

【Requirements】

<!-- Source EN PDF p.68; unit 721 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.68; unit 722 -->

Library file: librkaiq.so

<!-- Source EN PDF p.68; unit 723 -->

#### 6.4.18  rk_aiq_uapi2_getExpPwrLineFreqMode

<!-- Source EN PDF p.68; unit 724 -->

【Description】\*\* Get the anti-flash frequency.

<!-- Source EN PDF p.68; unit 725 -->

【Grammar】

<!-- Source EN PDF p.68; unit 726 -->

```text
 XCamReturn rk_aiq_uapi2_getExpPwrLineFreqMode(const rk_aiq_sys_ctx_t* ctx,
 expPwrLineFreq_t *freq);
```

<!-- Source EN PDF p.68; unit 727 -->

【Parameters】

<!-- Source EN PDF p.68; unit 728 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| freq | Anti-flash frequency | Output |

<!-- Source EN PDF p.68; unit 729 -->

【Return Value】

<!-- Source EN PDF p.68; unit 730 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.68; unit 731 -->

【Requirements】

<!-- Source EN PDF p.68; unit 732 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.68; unit 733 -->

Library file: librkaiq.so

<!-- Source EN PDF p.69; unit 734 -->

### 6.5   Functional-level API data types

<!-- Source EN PDF p.69; unit 735 -->

#### 6.5.1  opMode_t

<!-- Source EN PDF p.69; unit 736 -->

【Description】 Define automatic manual mode.

<!-- Source EN PDF p.69; unit 737 -->

【Definition】

<!-- Source EN PDF p.69; unit 738 -->

```text
 typedef enum opMode_e {
     OP_AUTO = 0,
     OP_MANUALl = 1,
     OP_INVAL
 } opMode_t;
```

<!-- Source EN PDF p.69; unit 739 -->

【Member】

<!-- Source EN PDF p.69; unit 740 -->

| Member Name | Description |
|---|---|
| OP_AUTO | Automatic mode |
| OP_MANUALl | Manual mode |
| OP_INVAL | Invalid value |

<!-- Source EN PDF p.69; unit 741 -->

#### 6.5.2  paRange_t

<!-- Source EN PDF p.69; unit 742 -->

【Description】 Define parameter ranges.

<!-- Source EN PDF p.69; unit 743 -->

【Definition】

<!-- Source EN PDF p.69; unit 744 -->

```text
 typedef struct paRange_s {
     float max;
     float min;
 } paRange_t;
```

<!-- Source EN PDF p.69; unit 745 -->

【Member】

<!-- Source EN PDF p.69; unit 746 -->

| Member Name | Description |
|---|---|
| max | Upper limit value |
| min | Lower limit |

<!-- Source EN PDF p.70; unit 747 -->

#### 6.5.3  aeMeasAreaType_t

<!-- Source EN PDF p.70; unit 748 -->

【Description】 Define the AE measurement area type.

<!-- Source EN PDF p.70; unit 749 -->

【Definition】

<!-- Source EN PDF p.70; unit 750 -->

```text
 typedef enum aeMeasAreaType_e {
     AE_MEAS_AREA_AUTO = 0,
     AE_MEAS_AREA_UP,
     AE_MEAS_AREA_BOTTOM,
     AE_MEAS_AREA_LEFT,
     AE_MEAS_AREA_RIGHT,
     AE_MEAS_AREA_CENTER,
 } aeMeasAreaType_t;
```

<!-- Source EN PDF p.70; unit 751 -->

【Member】

<!-- Source EN PDF p.70; unit 752 -->

| Member Name | Description |
|---|---|
| AE_MEAS_AREA_AUTO | Automatic |
| AE_MEAS_AREA_UP | Upper area |
| AE_MEAS_AREA_BOTTOM | Lower area |
| AE_MEAS_AREA_LEFT | Left area |
| AE_MEAS_AREA_RIGHT | Right area |
| AE_MEAS_AREA_CENTER | Central Area |

<!-- Source EN PDF p.70; unit 753 -->

#### 6.5.4  expPwrLineFreq_t

<!-- Source EN PDF p.70; unit 754 -->

【Description】 Define the anti-flash frequency.

<!-- Source EN PDF p.70; unit 755 -->

【Definition】

<!-- Source EN PDF p.70; unit 756 -->

```text
 typedef enum expPwrLineFreq_e {
        EXP_PWR_LINE_FREQ_DIS   = 0,
        EXP_PWR_LINE_FREQ_50HZ  = 1,
        EXP_PWR_LINE_FREQ_60HZ  = 2,
 } expPwrLineFreq_t;
```

<!-- Source EN PDF p.70; unit 757 -->

【Member】

<!-- Source EN PDF p.71; unit 758 -->

| Member Name | Description |
|---|---|
| EXP_PWR_LINE_FREQ_DIS |  |
| EXP_PWR_LINE_FREQ_50HZ | 50 Hz |
| EXP_PWR_LINE_FREQ_60HZ | 60 Hz |

<!-- Source EN PDF p.71; unit 759 -->

#### 6.5.5  antiFlickerMode_t

<!-- Source EN PDF p.71; unit 760 -->

【Description】 Define the anti-flash mode.

<!-- Source EN PDF p.71; unit 761 -->

【Definition】

<!-- Source EN PDF p.71; unit 762 -->

```text
 typedef enum antiFlickerMode_e {
     ANTIFLICKER_NORMAL_MODE = 0,
     ANTIFLICKER_AUTO_MODE = 1,
 } antiFlickerMode_t;
```

<!-- Source EN PDF p.71; unit 763 -->

【Member】

<!-- Source EN PDF p.71; unit 764 -->

| Member Name | Description |
|---|---|
| ANTIFLICKER_NORMAL_MODE | Normal mode |
| ANTIFLICKER_AUTO_MODE | Auto Select Mode |

<!-- Source EN PDF p.71; unit 765 -->

### 6.6   Module-level API reference

<!-- Source EN PDF p.71; unit 766 -->

#### 6.6.1  rk_aiq_user_api2_ae_setExpSwAttr

<!-- Source EN PDF p.71; unit 767 -->

【Description】 Set AE exposure software properties.

<!-- Source EN PDF p.71; unit 768 -->

【Grammar】

<!-- Source EN PDF p.71; unit 769 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_setExpSwAttr(const rk_aiq_sys_ctx_t* ctx,
                                 const Uapi_ExpSwAttrV2_t expSwAttr);
```

<!-- Source EN PDF p.71; unit 770 -->

【Parameters】

<!-- Source EN PDF p.71; unit 771 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| expSwAttr | AE Common Function Control Parameter Struct | Input |

<!-- Source EN PDF p.71; unit 772 -->

【Return Value】

<!-- Source EN PDF p.72; unit 773 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.72; unit 774 -->

【Requirements】

<!-- Source EN PDF p.72; unit 775 -->

Header files: rk_aiq_user_api2_ae.h, rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.72; unit 776 -->

Library file: librkaiq.so

<!-- Source EN PDF p.72; unit 777 -->

【Example】

<!-- Source EN PDF p.72; unit 778 -->

Set manual exposure properties

<!-- Source EN PDF p.72; unit 779 -->

The exposure components include sensor exposure time, sensor exposure gain, and ISP digital gain. After setting the manual exposure mode, you also need to set the manual state (ManualGainEn, ManualTimeEn, ManualIspDgainEn) and its corresponding manual values for each exposure component. In manual exposure mode, all exposure components are required to be manual, and the value of each exposure component set is limited by the sensor and lens. If the set exposure component value exceeds the sensor's limit, the algorithm will automatically correct it.

<!-- Source EN PDF p.72; unit 780 -->

```text
 Uapi_ExpSwAttrV2_t expSwAttr;
 ret = rk_aiq_user_api2_ae_getExpSwAttr(ctx, &expSwAttr);
 expSwAttr.AecOpType = RK_AIQ_OP_MODE_MANUAL;
 //LinearAE
 expSwAttr.stManual.LinearAE.ManualGainEn = true;
 expSwAttr.stManual.LinearAE.ManualTimeEn = true;
 expSwAttr.stManual.LinearAE.GainValue = 1.0f; /*gain = 1x*/
 expSwAttr.stManual.LinearAE.TimeValue = 0.02f; /*time = 1/50s*/
 //HdrAE (should set all frames)
 expSwAttr.stManual.HdrAE.ManualGainEn = true;
 expSwAttr.stManual.HdrAE.ManualTimeEn = true;
 expSwAttr.stManual.HdrAE.GainValue[0] = 1.0f; /*sframe gain = 1x*/
 expSwAttr.stManual.HdrAE.TimeValue[0] = 0.002f; /*sframe time = 1/500s*/
 expSwAttr.stManual.HdrAE.GainValue[1] = 2.0f; /*mframe gain = 2x*/
 expSwAttr.stManual.HdrAE.TimeValue[1] = 0.01f; /*mframe time = 1/100s*/
 expSwAttr.stManual.HdrAE.GainValue[2] = 4.0f; /*lframe gain = 4x*/
 expSwAttr.stManual.HdrAE.TimeValue[2] = 0.02f; /*lframe time = 1/50s*/
 ret = rk_aiq_user_api2_ae_setExpSwAttr(ctx, expSwAttr);
```

<!-- Source EN PDF p.72; unit 781 -->

Set auto exposure properties

<!-- Source EN PDF p.72; unit 782 -->

Auto exposure can set the range of the exposure component, and if the set exposure component range exceeds the limit of the sensor, the algorithm will automatically correct it.

<!-- Source EN PDF p.72; unit 783 -->

【Note】: Setting the parameters of the exposure component range is different from the parameter of obtaining the exposure component range.

<!-- Source EN PDF p.72; unit 784 -->

```text
 Uapi_ExpSwAttrV2_t expSwAttr;
 ret = rk_aiq_user_api2_ae_getExpSwAttr(ctx, &expSwAttr);
 expSwAttr.AecOpType = RK_AIQ_OP_MODE_AUTO;
 //set time range in struct "stAdvanced"
 expSwAttr.stAdvanced.SetAeRangeEn = true;/*must enable*/
 //LinAE
 expSwAttr.stAdvanced.SetLinAeRange.stExpTimeRange.Max = 0.04f; /*time_max =
 0.04*/
 expSwAttr.stAdvanced.SetLinAeRange.stExpTimeRange.Min = 0.001f; /*time_min =
 0.001*/
 //HdrAE
 expSwAttr.stAdvanced.SetHdrAeRange.stExpTimeRange[0].Max = 0.002f; /*sframe
 time_max = 0.02*/
 expSwAttr.stAdvanced.SetHdrAeRange.stExpTimeRange[0].Min = 0.001f; /*sframe
 time_min = 0.01*/
 expSwAttr.stAdvanced.SetHdrAeRange.stExpTimeRange[1].Max = 0.003f; /*mframe
 time_max = 0.03*/
 expSwAttr.stAdvanced.SetHdrAeRange.stExpTimeRange[1].Min = 0.002f; /*mframe
 time_min = 0.02*/
 expSwAttr.stAdvanced.SetHdrAeRange.stExpTimeRange[2].Max = 0.04f; /*lframe
 time_max = 0.03*/
 expSwAttr.stAdvanced.SetHdrAeRange.stExpTimeRange[2].Min = 0.03f; /*lframe
 time_min = 0.02*/
 //get time range in struct "stAuto"
 printf("linear time range=[%f,%f]\n",
     expSwAttr.stAuto.LinAeRange.stExpTimeRange.Min,
 expSwAttr.stAuto.LinAeRange.stExpTimeRange.Max);
 printf("hdr stime range=[%f,%f], mtime range=[%f,%f], ltime range=[%f,%f]\n",
     expSwAttr.stAuto.HdrAeRange.stExpTimeRange[0].Min,
 expSwAttr.stAuto.HdrAeRange.stExpTimeRange[0].Max,
     expSwAttr.stAuto.HdrAeRange.stExpTimeRange[1].Min,
 expSwAttr.stAuto.HdrAeRange.stExpTimeRange[1].Max,
     expSwAttr.stAuto.HdrAeRange.stExpTimeRange[2].Min,
 expSwAttr.stAuto.HdrAeRange.stExpTimeRange[2].Max);
 //set gain range in struct "stAdvanced"
 expSwAttr.stAdvanced.SetAeRangeEn = true;/*must enable*/
 //LinAE
 expSwAttr.stAdvanced.SetLinAeRange.stGainRange.Max = 32.0f; /*gain_max = 32x*/
 expSwAttr.stAdvanced.SetLinAeRange.stGainRange.Min = 1.0f; /*gain_min = 1x*/
 //HdrAE
 expSwAttr.stAdvanced.SetHdrAeRange.stGainRange[0].Max = 32.0f; /*sframe gain_max
 = 2x*/
 expSwAttr.stAdvanced.SetHdrAeRange.stGainRange[0].Min = 1.0f; /*sframe gain_min =
 1x*/
 expSwAttr.stAdvanced.SetHdrAeRange.stGainRange[1].Max = 64.0f; /*mframe gain_max
 = 64x*/
 expSwAttr.stAdvanced.SetHdrAeRange.stGainRange[1].Min = 1.0f; /*mframe gian_min =
 1x*/
 expSwAttr.stAdvanced.SetHdrAeRange.stGainRange[2].Max = 64.0f; /*lframe gain_max
 = 64x*/
 expSwAttr.stAdvanced.SetHdrAeRange.stGainRange[2].Min = 1.0f; /*lframe gain_min =
 1x*/
 //get gain range in struct "stAuto"
 printf("linear gain range=[%f,%f]\n",
     expSwAttr.stAuto.LinAeRange.stGainRange.Min,
 expSwAttr.stAuto.LinAeRange.stGainRange.Max);
 printf("hdr sgain range=[%f,%f], mgain range=[%f,%f], lgain range=[%f,%f]\n",
     expSwAttr.stAuto.HdrAeRange.stGainRange[0].Min,
 expSwAttr.stAuto.HdrAeRange.stGainRange[0].Max,
     expSwAttr.stAuto.HdrAeRange.stGainRange[1].Min,
 expSwAttr.stAuto.HdrAeRange.stGainRange[1].Max,
     expSwAttr.stAuto.HdrAeRange.stGainRange[2].Min,
 expSwAttr.stAuto.HdrAeRange.stGainRange[2].Max);
 ret = rk_aiq_user_api2_ae_setExpSwAttr(ctx, expSwAttr);
```

<!-- Source EN PDF p.74; unit 785 -->

Set semi-manual exposure properties

<!-- Source EN PDF p.74; unit 786 -->

Semi-manual exposure is that at least one of the exposure components (sensor exposure time, sensor exposure gain, ISP digital gain) is manual, and the other exposure components are automatic, otherwise it will exit with an error. For example, in order to realize the semi-automatic exposure function of exposure gain manual, exposure time and ISP digital gain automatic, there are the following two ways to implement it: in the manual exposure mode, set the manual enable of exposure time and ISP digital gain to false, set the manual enable of exposure gain to true, and set the corresponding manual value; Method 2: In the auto exposure mode, the maximum and minimum values of the exposure gain are set to the value that needs to be fixed.

<!-- Source EN PDF p.74; unit 787 -->

【Note】Method 1: In HDR exposure mode, the manual behavior of all frames is synchronous (that is, the corresponding exposure components of each frame are manually consistent), and at the same time, it is necessary to ensure that the maximum exposure of long frames is greater than the maximum exposure of short frames, and the minimum exposure of long frames is greater than the minimum exposure of short frames; Method 2: In HDR exposure mode, the manual behavior of each frame is allowed to be inconsistent (such as short frame gain manual, long frame gain can be automatic), and at the same time, you need to ensure that the maximum exposure of long frames is greater than the maximum exposure of short frames, and the minimum exposure of long frames is greater than the minimum exposure of short frames.

<!-- Source EN PDF p.74; unit 788 -->

```text
 //Method One
 Uapi_ExpSwAttrV2_t expSwAttr;
 ret = rk_aiq_user_api2_ae_getExpSwAttr(ctx, &expSwAttr);
 expSwAttr.AecOpType = RK_AIQ_OP_MODE_MANUAL;
 //LinearAE
 expSwAttr.stManual.LinearAE.ManualGainEn = true;
 expSwAttr.stManual.LinearAE.ManualTimeEn = false;
 expSwAttr.stManual.LinearAE.ManualIspDgainEn = false;
 expSwAttr.stManual.LinearAE.GainValue = 2.0f; /*gain = 2x*/
 //HdrAE (need to set all frames)
 expSwAttr.stManual.HdrAE.ManualGainEn = true;
 expSwAttr.stManual.HdrAE.ManualTimeEn = false;
 expSwAttr.stManual.HdrAE.ManualIspDgainEn = false;
 expSwAttr.stManual.HdrAE.GainValue[0] = 1.0f; /*sframe gain = 1x*/
 expSwAttr.stManual.HdrAE.GainValue[1] = 2.0f; /*mframe gain = 2x*/
 expSwAttr.stManual.HdrAE.GainValue[2] = 4.0f; /*lframe gain = 4x*/
 ret = rk_aiq_user_api2_ae_setExpSwAttr(ctx, expSwAttr);
 //Method Two
 Uapi_ExpSwAttrV2_t expSwAttr;
 ret = rk_aiq_user_api2_ae_getExpSwAttr(ctx, &expSwAttr);
 expSwAttr.AecOpType = RK_AIQ_OP_MODE_AUTO;
 //set gain range
 expSwAttr.stAdvanced.SetAeRangeEn = true;/*Must be enabled*/
 //LinAE
 expSwAttr.stAdvanced.SetLinAeRange.stGainRange.Max = 2.0f; /*gain_max = 2x*/
 expSwAttr.stAdvanced.SetLinAeRange.stGainRange.Min = 2.0f;  /*gain_min = 2x*/
 //HdrAE (allow to set only one frame)
 expSwAttr.stAdvanced.SetHdrAeRange.stGainRange[0].Max = 2.0f; /*sframe gain_max =
 2x*/
 expSwAttr.stAdvanced.SetHdrAeRange.stGainRange[0].Min = 2.0f;  /*sframe gain_min
 = 2x*/
 ret = rk_aiq_user_api2_ae_setExpSwAttr(ctx, expSwAttr);
```

<!-- Source EN PDF p.75; unit 789 -->

Set a fixed frame rate or automatic frame reduction

<!-- Source EN PDF p.75; unit 790 -->

In fixed frame rate mode, the allowed frame rate must not exceed the maximum frame rate defined by the driver, if it exceeds it, there will be a log reminder and the frame rate setting will be disabled.

<!-- Source EN PDF p.75; unit 791 -->

```text
 //set fixed framemode
 Uapi_ExpSwAttrV2_t expSwAttr;
 ret = rk_aiq_user_api2_ae_getExpSwAttr(ctx, &expSwAttr);
 expSwAttr.stAuto.stFrmRate.isFpsFix = true;
 expSwAttr.stAuto.stFrmRate.FpsValue = 25; /*fps = 25*/
 ret = rk_aiq_user_api2_ae_setExpSwAttr(ctx, expSwAttr);
 //set auto framemode
 Uapi_ExpSwAttrV2_t expSwAttr;
 ret = rk_aiq_user_api2_ae_getExpSwAttr(ctx, &expSwAttr);
 expSwAttr.stAuto.stFrmRate.isFpsFix = false;
 /*Generally, the automatic frame reduction mode is configured by tuning personnel
 in advance with the minimum frame rate and the gain value corresponding to the
 switching frame rate*/
 ret = rk_aiq_user_api2_ae_setExpSwAttr(ctx, expSwAttr);
```

<!-- Source EN PDF p.75; unit 792 -->

Set the exposure adjustment speed and delay frame rate

<!-- Source EN PDF p.75; unit 793 -->

```text
 Uapi_ExpSwAttrV2_t expSwAttr;
 ret = rk_aiq_user_api2_ae_getExpSwAttr(ctx, &expSwAttr);
 //set ae speed
 expSwAttr.stAuto.stAeSpeed.DampOver = 0.8f;
 expSwAttr.stAuto.stAeSpeed.DampDark2Bright = 0.8f;
 expSwAttr.stAuto.stAeSpeed.DampUnder = 0.8f;
 expSwAttr.stAuto.stAeSpeed.DampBright2Dark = 0.8f;
 //set ae delay
 expSwAttr.stAuto.BlackDelayFrame = 2;
 expSwAttr.stAuto.WhiteDelayFrame = 4;
 ret = rk_aiq_user_api2_ae_setExpSwAttr(ctx, expSwAttr);
```

<!-- Source EN PDF p.75; unit 794 -->

Set up anti-flash

<!-- Source EN PDF p.75; unit 795 -->

```text
 Uapi_ExpSwAttr_t expSwAttr;
 ret = rk_aiq_user_api2_ae_getExpSwAttr(ctx, &expSwAttr);
 //set antifilicker mode
 expSwAttr.stAuto.stAntiFlicker.enable = true;
 expSwAttr.stAuto.stAntiFlicker.Frequency = AECV2_FLICKER_FREQUENCY_50HZ;
 expSwAttr.stAuto.stAntiFlicker.Mode = AECV2_ANTIFLICKER_AUTO_MODE;
 ret = rk_aiq_user_api2_ae_setExpSwAttr(ctx, expSwAttr);
```

<!-- Source EN PDF p.75; unit 796 -->

Set the AE weight

<!-- Source EN PDF p.76; unit 797 -->

Set the 15X15 weight, and the algorithm compresses the weight according to the actual block specifications of the hardware. At present, there are two ways to set the weight: way 1: directly modify the weight in JSON; Method 2: Modify the weight by stadvanced, and if you eliminate the enablement, you can restore the weight back to the JSON (this method is recommended).

<!-- Source EN PDF p.76; unit 798 -->

For face applications, the recommended use of expSwAttr.stAdvanced.enable = true, use the weight in the expSwAttr.stAdvanced structure when the face appears, and expSwAttr.stAdvanced.enable = false when the face disappears, use the original weight.

<!-- Source EN PDF p.76; unit 799 -->

```text
 Uapi_ExpSwAttr_t expSwAttr;
 ret = rk_aiq_user_api2_ae_getExpSwAttr(ctx, &expSwAttr);
 uint8_t GridWeights[225]={
 0,  0, 1,  2,  2,  3,  4,  5,  4, 3,  2,  2,  1,  0,  0,
 0,  1, 2,  3,  3,  4,  5,  6,  5, 4,  3,  3,  2,  1,  0,
 1,  2, 3,  5,  5,  6,  7,  8,  7, 6,  5,  5,  3,  2,  1,
 2,  3, 5,  7,  7,  8,  9, 10,  9, 8,  7,  7,  5,  3,  2,
 2,  3, 5,  7,  8,  9, 10, 11, 10, 9,  8,  7,  5,  3,  2,
 2,  4, 6,  8,  9, 10, 11, 12, 11,10,  9,  8,  6,  4,  2,
 2,  4, 6,  9, 10, 11, 12, 13, 12,11, 10,  9,  6,  4,  2,
 3,  5 ,7, 10, 11, 12, 13, 14, 13,12, 11, 10,  7,  5,  3,
 2,  4, 6,  9, 10, 11, 12, 13, 12,11, 10,  9,  6,  4,  2,
 2,  4, 6,  8,  9, 10, 11, 12, 11,10,  9,  8,  6,  4,  2,
 2,  3, 5,  7,  8,  9, 10, 11, 10, 9,  8,  7,  5,  3,  2,
 2,  3, 5,  7,  7,  8,  9, 10,  9, 8,  7,  7,  5,  3,  2,
 1,  2, 4,  6,  6,  7,  8,  9,  8, 7,  6,  6,  4,  2,  1,
 0,  1, 3,  5,  5,  6,  7,  8,  7, 6,  5,  5,  3,  1,  0,
 0,  1, 3,  5,  5,  6,  7,  8,  7, 6,  5,  5,  3,  1,  0
 };
 //method one：
 memcpy(expSwAttr.GridWeights.uCoeff, GridWeights,
 sizeof(expSwAttr.GridWeights.uCoeff));
 //method two:
 expSwAttr.stAdvanced.enable = true; //important! true means preferring to use these parameters
 memcpy(expSwAttr.stAdvanced.GridWeights, GridWeights,
 sizeof(expSwAttr.stAdvanced.GridWeights));
 ret = rk_aiq_user_api2_ae_setExpSwAttr(ctx, expSwAttr);
```

<!-- Source EN PDF p.76; unit 800 -->

#### 6.6.2  rk_aiq_user_api2_ae_getExpSwAttr

<!-- Source EN PDF p.76; unit 801 -->

【Description】 Gets the AE exposure software properties.

<!-- Source EN PDF p.76; unit 802 -->

【Grammar】

<!-- Source EN PDF p.76; unit 803 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_getExpSwAttr(const rk_aiq_sys_ctx_t* ctx,
                         Uapi_ExpSwAttrV2_t* pExpSwAttr);
```

<!-- Source EN PDF p.77; unit 804 -->

【Parameters】

<!-- Source EN PDF p.77; unit 805 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| pExpSwAttr | AE Exposure Software Properties Structure Pointer | Output |

<!-- Source EN PDF p.77; unit 806 -->

【Return Value】

<!-- Source EN PDF p.77; unit 807 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.77; unit 808 -->

【Requirements】

<!-- Source EN PDF p.77; unit 809 -->

Header files: rk_aiq_user_api2_ae.h, rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.77; unit 810 -->

Library file: librkaiq.so

<!-- Source EN PDF p.77; unit 811 -->

#### 6.6.3  rk_aiq_user_api2_ae_setLinAeRouteAttr

<!-- Source EN PDF p.77; unit 812 -->

【Description】 Set the scene exposure allocation strategy for AE in linear mode.

<!-- Source EN PDF p.77; unit 813 -->

【Grammar】

<!-- Source EN PDF p.77; unit 814 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_setLinAeRouteAttr(const rk_aiq_sys_ctx_t* ctx, const
 Uapi_LinAeRouteAttr_t linAeRouteAttr);
```

<!-- Source EN PDF p.77; unit 815 -->

【Parameters】

<!-- Source EN PDF p.77; unit 816 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| linAeRouteAttr | AE Exposure Allocation Strategy Structure | Input |

<!-- Source EN PDF p.77; unit 817 -->

【Return Value】

<!-- Source EN PDF p.77; unit 818 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.77; unit 819 -->

【Requirements】

<!-- Source EN PDF p.77; unit 820 -->

Header files: rk_aiq_user_api2_ae.h, rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.77; unit 821 -->

Library file: librkaiq.so

<!-- Source EN PDF p.78; unit 822 -->

【Example】

<!-- Source EN PDF p.78; unit 823 -->

```text
 Uapi_LinAeRouteAttr_t LinAeRouteAttr;
 memset(&LinAeRouteAttr,0x00,sizeof(Uapi_LinAeRouteAttr_t));
 rk_aiq_user_api2_ae_getLinAeRouteAttr(sys_ctx,&LinAeRouteAttr);
 int len = 8;
 float TimeDot[8]={0,0.01,0.01,0.02,0.02,0.03,0.03,0.04};
 float GainDot[8]={1,1,4,4,8,8,16,32};
 float IspGainDot[8]={1,1,1,1,1,1,1,1};
 int PirisDot[8]={512,512,512,512,512,512,512,512};
 LinAeRouteAttr.TimeDot_len = len;
 LinAeRouteAttr.GainDot_len = len;
 LinAeRouteAttr.IspDGainDot_len = len;
 LinAeRouteAttr.PIrisDot_len = len;
 LinAeRouteAttr.GainDot = GainDot;
 LinAeRouteAttr.IspDGainDot = IspGainDot;
 LinAeRouteAttr.TimeDot = TimeDot;
 LinAeRouteAttr.PIrisDot = PirisDot;
 rk_aiq_user_api2_ae_setLinAeRouteAttr(sys_ctx,LinAeRouteAttr);
```

<!-- Source EN PDF p.78; unit 824 -->

#### 6.6.4  rk_aiq_user_api2_ae_getLinAeRouteAttr

<!-- Source EN PDF p.78; unit 825 -->

【Description】 Gets the scene exposure allocation strategy for AE in linear mode.

<!-- Source EN PDF p.78; unit 826 -->

【Grammar】

<!-- Source EN PDF p.78; unit 827 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_getLinAeRouteAttr(const rk_aiq_sys_ctx_t* ctx,
 Uapi_LinAeRouteAttr_t* pLinAeRouteAttr);
```

<!-- Source EN PDF p.78; unit 828 -->

【Parameters】

<!-- Source EN PDF p.78; unit 829 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| pLinAeRouteAttr | AE Exposure Allocation Strategy Structure Pointer | Output |

<!-- Source EN PDF p.78; unit 830 -->

【Return Value】

<!-- Source EN PDF p.78; unit 831 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.78; unit 832 -->

【Requirements】

<!-- Source EN PDF p.79; unit 833 -->

Header files: rk_aiq_user_api2_ae.h, rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.79; unit 834 -->

Library file: librkaiq.so

<!-- Source EN PDF p.79; unit 835 -->

#### 6.6.5  rk_aiq_user_api2_ae_setHdrAeRouteAttr

<!-- Source EN PDF p.79; unit 836 -->

【Description】 Set the scene exposure allocation strategy for AE in HDR mode.

<!-- Source EN PDF p.79; unit 837 -->

【Grammar】

<!-- Source EN PDF p.79; unit 838 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_setHdrAeRouteAttr(const rk_aiq_sys_ctx_t* ctx, const
 Uapi_HdrAeRouteAttr_t hdrAeRouteAttr);
```

<!-- Source EN PDF p.79; unit 839 -->

【Parameters】

<!-- Source EN PDF p.79; unit 840 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| hdrAeRouteAttr | AE Exposure Allocation Strategy Structure | Input |

<!-- Source EN PDF p.79; unit 841 -->

【Return Value】

<!-- Source EN PDF p.79; unit 842 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.79; unit 843 -->

【Requirements】

<!-- Source EN PDF p.79; unit 844 -->

Header files: rk_aiq_user_api2_ae.h, rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.79; unit 845 -->

Library file: librkaiq.so

<!-- Source EN PDF p.79; unit 846 -->

【Example】

<!-- Source EN PDF p.79; unit 847 -->

```text
 Uapi_HdrAeRouteAttr_t stHdrRoute;
 memset(&stHdrRoute,0x00,sizeof(Uapi_HdrAeRouteAttr_t));
 ret = rk_aiq_user_api2_ae_getHdrAeRouteAttr(ctx,&stHdrRoute);
 int len = 6;
 float HdrTimeDot[3][6] = {0.0, 0.01, 0.01, 0.01, 0.01, 0.01,
                           0.0, 0.02, 0.02, 0.02, 0.02, 0.02,
                           0.0, 0.03, 0.03, 0.03, 0.03, 0.03};
 float HdrGainDot[3][6] = {1, 1, 4, 6, 8, 12,
                           1, 1, 4, 6, 8, 12,
                           1, 1, 4, 6, 8, 12};
 float HdrIspDGainDot[3][6] = {1, 1, 1, 1, 1, 1,
                               1, 1, 1, 1, 1, 1,
                               1, 1, 1, 1, 1, 1};
 int   HdrPIrisGainDot[6] = {1, 1, 1, 1, 1, 1};
 stHdrRoute.Frm0TimeDot_len = len;
 stHdrRoute.Frm0GainDot_len = len;
 stHdrRoute.Frm0IspDGainDot_len = len;
 stHdrRoute.Frm1TimeDot_len = len;
 stHdrRoute.Frm1GainDot_len = len;
 stHdrRoute.Frm1IspDGainDot_len = len;
 stHdrRoute.Frm2TimeDot_len = len;
 stHdrRoute.Frm2GainDot_len = len;
 stHdrRoute.Frm2IspDGainDot_len = len;
 stHdrRoute.PIrisDot_len = len;
 stHdrRoute.Frm0TimeDot = HdrTimeDot[0];
 stHdrRoute.Frm0GainDot = HdrGainDot[0];
 stHdrRoute.Frm0IspDGainDot = HdrIspDGainDot[0];
 stHdrRoute.Frm1TimeDot = HdrTimeDot[1];
 stHdrRoute.Frm1GainDot = HdrGainDot[1];
 stHdrRoute.Frm1IspDGainDot = HdrIspDGainDot[1];
 stHdrRoute.Frm2TimeDot = HdrTimeDot[2];
 stHdrRoute.Frm2GainDot = HdrGainDot[2];
 stHdrRoute.Frm2IspDGainDot = HdrIspDGainDot[2];
 stHdrRoute.PIrisDot = HdrPIrisGainDot;
 ret = rk_aiq_user_api2_ae_setHdrAeRouteAttr(ctx,stHdrRoute);
```

<!-- Source EN PDF p.80; unit 848 -->

#### 6.6.6  rk_aiq_user_api2_ae_getHdrAeRouteAttr

<!-- Source EN PDF p.80; unit 849 -->

【Description】 Gets the scene exposure distribution strategy for AE in HDR mode.

<!-- Source EN PDF p.80; unit 850 -->

【Grammar】

<!-- Source EN PDF p.80; unit 851 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_getHdrAeRouteAttr(const rk_aiq_sys_ctx_t* ctx,
 Uapi_HdrAeRouteAttr_t* pHdrAeRouteAttr);
```

<!-- Source EN PDF p.80; unit 852 -->

【Parameters】

<!-- Source EN PDF p.80; unit 853 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| pHdrAeRouteAttr | AE Exposure Allocation Strategy Structure Pointer | Output |

<!-- Source EN PDF p.80; unit 854 -->

【Return Value】

<!-- Source EN PDF p.80; unit 855 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.80; unit 856 -->

【Requirements】

<!-- Source EN PDF p.81; unit 857 -->

Header files: rk_aiq_user_api2_ae.h, rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.81; unit 858 -->

Library file: librkaiq.so

<!-- Source EN PDF p.81; unit 859 -->

#### 6.6.7  rk_aiq_user_api2_ae_setLinExpAttr

<!-- Source EN PDF p.81; unit 860 -->

【Description】 Set the AE linear mode exposure parameters.

<!-- Source EN PDF p.81; unit 861 -->

【Grammar】

<!-- Source EN PDF p.81; unit 862 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_setLinExpAttr(const rk_aiq_sys_ctx_t* ctx, const
 Uapi_LinExpAttrV2_t linExpAttr);
```

<!-- Source EN PDF p.81; unit 863 -->

【Parameters】

<!-- Source EN PDF p.81; unit 864 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| linExpAttr | AE exposure parameter structure | Input |

<!-- Source EN PDF p.81; unit 865 -->

【Return Value】

<!-- Source EN PDF p.81; unit 866 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.81; unit 867 -->

【Requirements】

<!-- Source EN PDF p.81; unit 868 -->

Header files: rk_aiq_user_api2_ae.h, rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.81; unit 869 -->

Library file: librkaiq.so

<!-- Source EN PDF p.81; unit 870 -->

【Example】

<!-- Source EN PDF p.81; unit 871 -->

Set AE linear mode exposure parameters, including but not limited to: setting to adjust brightness intensity Evbias, setting backlight compensation function BackLightCtrl, setting strong light suppression function OverExpCtrl, etc. It is important to note that backlight compensation and strong light suppression cannot be enabled at the same time.

<!-- Source EN PDF p.81; unit 872 -->

```text
 Uapi_LinExpAttrV2_t linExpAttr;
 memset(&linExpAttr,0,sizeof(Uapi_LinExpAttrV2_t));
 ret = rk_aiq_user_api2_ae_getLinExpAttr(ctx, &linExpAttr);
 //set Evbias
 printf("Evbias=%f\n", linExpAttr.Evbias);
 linExpAttr.Evbias = 100.0f;
 //set BackLightCtrl
 linExpAttr.BackLightCtrl.Enable = true;
 linExpAttr.BackLightCtrl.StrBias = 200.0f;
 //set OverExpCtrl
 linExpAttr.OverExpCtrl.Enable = true;
 linExpAttr.OverExpCtrl.StrBias = 100.0f;
 ret = rk_aiq_user_api2_ae_setLinExpAttr(ctx, linExpAttr);
```

<!-- Source EN PDF p.82; unit 873 -->

#### 6.6.8  rk_aiq_user_api2_ae_getLinExpAttr

<!-- Source EN PDF p.82; unit 874 -->

【Description】 Get the AE linear mode exposure parameters.

<!-- Source EN PDF p.82; unit 875 -->

【Grammar】

<!-- Source EN PDF p.82; unit 876 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_getLinExpAttr(const rk_aiq_sys_ctx_t* ctx,
 Uapi_LinExpAttrV2_t* pLinExpAttr);
```

<!-- Source EN PDF p.82; unit 877 -->

【Parameters】

<!-- Source EN PDF p.82; unit 878 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| pLinExpAttr | AE exposure parameter structure pointer | Output |

<!-- Source EN PDF p.82; unit 879 -->

【Return Value】

<!-- Source EN PDF p.82; unit 880 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.82; unit 881 -->

【Requirements】

<!-- Source EN PDF p.82; unit 882 -->

Header files: rk_aiq_user_api2_ae.h, rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.82; unit 883 -->

Library file: librkaiq.so

<!-- Source EN PDF p.82; unit 884 -->

#### 6.6.9  rk_aiq_user_api2_ae_setHdrExpAttr

<!-- Source EN PDF p.82; unit 885 -->

【Description】 Set AE HDR mode exposure parameters.

<!-- Source EN PDF p.82; unit 886 -->

【Grammar】

<!-- Source EN PDF p.82; unit 887 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_setHdrExpAttr(const rk_aiq_sys_ctx_t* ctx, const
 Uapi_HdrExpAttrV2_t hdrExpAttr);
```

<!-- Source EN PDF p.82; unit 888 -->

【Parameters】

<!-- Source EN PDF p.83; unit 889 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| hdrExpAttr | AE exposure parameter structure | Input |

<!-- Source EN PDF p.83; unit 890 -->

【Return Value】

<!-- Source EN PDF p.83; unit 891 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.83; unit 892 -->

【Requirements】

<!-- Source EN PDF p.83; unit 893 -->

Header files: rk_aiq_user_api2_ae.h, rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.83; unit 894 -->

Library file: librkaiq.so

<!-- Source EN PDF p.83; unit 895 -->

【Example】

<!-- Source EN PDF p.83; unit 896 -->

Set AE HDR mode exposure parameters, including but not limited to: setting the exposure ratio to manual or automatic, adjusting the brightness intensity Evbias.

<!-- Source EN PDF p.83; unit 897 -->

```text
 Uapi_HdrExpAttrV2_t HdrExpAttr;
 memset(&HdrExpAttr,0,sizeof(Uapi_HdrExpAttrV2_t));
 ret = rk_aiq_user_api2_ae_getHdrExpAttr(ctx, &HdrExpAttr);
 //set hdr mframe params
 int len = 8;
 float explevel[8] = {0, 0.096, 0.192, 0.384, 0.96, 1.344, 1.92, 3};
 float setpoint[8] = {50, 45, 40, 35, 30, 25, 20, 15};
 HdrExpAttr.HdrAEAttr.MframeCtrl.MExpLevel_len = len;
 HdrExpAttr.HdrAEAttr.MframeCtrl.MSetPoint_len = len;
 HdrExpAttr.HdrAEAttr.MframeCtrl.MExpLevel = explevel;
 HdrExpAttr.HdrAEAttr.MframeCtrl.MSetPoint = setpoint;
 //set ExpRatioType (AUTO/FIX)
 HdrExpAttr.ExpRatioCtrl.ExpRatioType = AECV2_HDR_RATIOTYPE_MODE_AUTO;
 //set Evbias
 HdrExpAttr.Evbias = -100.0f;
 ret = rk_aiq_user_api2_ae_setHdrExpAttr(ctx, HdrExpAttr);
```

<!-- Source EN PDF p.83; unit 898 -->

#### 6.6.10  rk_aiq_user_api2_ae_getHdrExpAttr

<!-- Source EN PDF p.83; unit 899 -->

【Description】 Get the AE HDR mode exposure parameters.

<!-- Source EN PDF p.83; unit 900 -->

【Grammar】

<!-- Source EN PDF p.84; unit 901 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_getHdrExpAttr(const rk_aiq_sys_ctx_t* ctx,
 Uapi_HdrExpAttrV2_t* pHdrExpAttr);
```

<!-- Source EN PDF p.84; unit 902 -->

【Parameters】

<!-- Source EN PDF p.84; unit 903 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| pHdrExpAttr | AE exposure parameter structure pointer | Output |

<!-- Source EN PDF p.84; unit 904 -->

【Return Value】

<!-- Source EN PDF p.84; unit 905 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.84; unit 906 -->

【Requirements】

<!-- Source EN PDF p.84; unit 907 -->

Header files: rk_aiq_user_api2_ae.h, rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.84; unit 908 -->

Library file: librkaiq.so

<!-- Source EN PDF p.84; unit 909 -->

#### 6.6.11  rk_aiq_user_api2_ae_setIrisAttr

<!-- Source EN PDF p.84; unit 910 -->

【Description】 Set AE aperture control parameters.

<!-- Source EN PDF p.84; unit 911 -->

【Grammar】

<!-- Source EN PDF p.84; unit 912 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_setIrisAttr(const rk_aiq_sys_ctx_t * sys_ctx, const
 Uapi_IrisAttrV2_t irisAttr);
```

<!-- Source EN PDF p.84; unit 913 -->

【Parameters】

<!-- Source EN PDF p.84; unit 914 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| irisAttr | Aperture control parameter structure | Input |

<!-- Source EN PDF p.84; unit 915 -->

【Return Value】

<!-- Source EN PDF p.84; unit 916 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.85; unit 917 -->

【Requirements】

<!-- Source EN PDF p.85; unit 918 -->

Header files: rk_aiq_user_api2_ae.h, rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.85; unit 919 -->

Library file: librkaiq.so

<!-- Source EN PDF p.85; unit 920 -->

【Example】

<!-- Source EN PDF p.85; unit 921 -->

```text
 Uapi_IrisAttrV2_t irisAttr;
 ret = rk_aiq_user_api2_ae_getIrisAttr(ctx, &irisAttr);
 irisAttr.enable = true; /*run AIris*/
 //set P-iris attributes
 irisAttr.IrisType = IRIS_P_TYPE;
 irisAttr.PIrisAttr.TotalStep = 81;
 irisAttr.PIrisAttr.EffcStep = 44;
 irisAttr.PIrisAttr.ZeroIsMax = true;
 uint16_t StepTable[1024] = {512, 511, 506, 499, 491, 483, 474, 465, 456,
                             446, 437, 427, 417, 408, 398, 388, 378, 368,
                             359, 349, 339, 329, 319, 309, 300, 290, 280,
                             271, 261, 252, 242, 233, 224, 214, 205, 196,
                             187, 178, 170, 161, 153, 144, 136, 128, 120,
                             112, 105, 98, 90, 83, 77, 70, 64, 58,
                             52, 46, 41, 36, 31, 27, 23, 19, 16,
                             13, 10, 8, 6, 4, 3, 1, 1, 0,
                             0, 0, 0, 0, 0, 0, 0, 0, 0};
 memcpy(irisAttr.PIrisAttr.StepTable,StepTable,sizeof(irisAttr.PIrisAttr.StepTable
 ));
 ret = rk_aiq_user_api2_ae_setIrisAttr(ctx, irisAttr);
 //set DC-iris attributes
 irisAttr.IrisType = IRIS_DC_TYPE;
 irisAttr.DCIrisAttr.Kp= 0.5f;
 irisAttr.DCIrisAttr.Ki= 0.2f;
 irisAttr.DCIrisAttr.Kd = 0.3f;
 irisAttr.DCIrisAttr.OpenPwmDuty = 40;
 irisAttr.DCIrisAttr.ClosePwmDuty = 22;
 irisAttr.DCIrisAttr.MinPwmDuty = 0;
 irisAttr.DCIrisAttr.MaxPwmDuty = 100;
 ret = rk_aiq_user_api2_ae_setIrisAttr(ctx, irisAttr);
 //set manual iris with auto ae
 irisAttr.IrisOpType = RK_AIQ_OP_MODE_MANUAL;
 if(irisAttr.IrisType == IRIS_P_TYPE);
     irisAttr.ManualAttr.PIrisGainValue = 512; /*p-iris F#=1.4*/
 if(irisAttr.IrisType == IRIS_DC_TYPE);
     irisAttr.ManualAttr.DCIrisHoldValue = 20; /*dc-iris PwmDuty=20*/
 ret = rk_aiq_user_api2_ae_setIrisAttr(ctx, irisAttr);
```

<!-- Source EN PDF p.85; unit 922 -->

#### 6.6.12  rk_aiq_user_api2_ae_getIrisAttr

<!-- Source EN PDF p.85; unit 923 -->

【Description】 Gets the AE aperture control parameters.

<!-- Source EN PDF p.85; unit 924 -->

【Grammar】

<!-- Source EN PDF p.86; unit 925 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_getIrisAttr(const rk_aiq_sys_ctx_t * sys_ctx, const
 Uapi_IrisAttrV2_t* irisAttr);
```

<!-- Source EN PDF p.86; unit 926 -->

【Parameters】

<!-- Source EN PDF p.86; unit 927 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| irisAttr | Aperture control parameter structure | Output |

<!-- Source EN PDF p.86; unit 928 -->

【Return Value】

<!-- Source EN PDF p.86; unit 929 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.86; unit 930 -->

【Requirements】

<!-- Source EN PDF p.86; unit 931 -->

Header files: rk_aiq_user_api2_ae.h, rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.86; unit 932 -->

Library file: librkaiq.so

<!-- Source EN PDF p.86; unit 933 -->

#### 6.6.13  rk_aiq_user_api2_ae_setExpWinAttr

<!-- Source EN PDF p.86; unit 934 -->

【Description】 Set the AE Statistics window properties.

<!-- Source EN PDF p.86; unit 935 -->

【Grammar】

<!-- Source EN PDF p.86; unit 936 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_setExpWinAttr(const rk_aiq_sys_ctx_t* sys_ctx, const
 Uapi_ExpWin_t ExpWin);
```

<!-- Source EN PDF p.86; unit 937 -->

【Parameters】

<!-- Source EN PDF p.86; unit 938 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| ExpWin | Window Properties Parameter | Input |

<!-- Source EN PDF p.86; unit 939 -->

【Return Value】

<!-- Source EN PDF p.86; unit 940 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.87; unit 941 -->

【Requirements】

<!-- Source EN PDF p.87; unit 942 -->

Header files: rk_aiq_user_api2_ae.h, rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.87; unit 943 -->

Library file: librkaiq.so

<!-- Source EN PDF p.87; unit 944 -->

【Example】

<!-- Source EN PDF p.87; unit 945 -->

Modify the AE statistical coordinates according to the face position to realize brightness statistics for the face area.

<!-- Source EN PDF p.87; unit 946 -->

Note: When setting statistical coordinates, ensure that ExpWin.h_offs+ExpWin.h_size&lt;=pic_width and ExpWin.v_offs+ExpWin.v_size&lt;=pic_height.

<!-- Source EN PDF p.87; unit 947 -->

```text
 Uapi_ExpWin_t ExpWin;
 //Suppose the sensor resolution is 2688X1520, the lateral offset of the face from the upper left corner of the screen is 100 pixel, the vertical offset is 100 pixel, and the face size is a square with a side length of 100 pixel
 ExpWin.h_offs=100;
 ExpWin.v_offs=100;
 ExpWin.h_size=100;
 ExpWin.v_size=100;
 rk_aiq_user_api2_ae_setExpWinAttr(ctx, ExpWin);
```

<!-- Source EN PDF p.87; unit 948 -->

#### 6.6.14  rk_aiq_user_api2_ae_getExpWinAttr

<!-- Source EN PDF p.87; unit 949 -->

【Description】 Gets the AE Statistics window properties.

<!-- Source EN PDF p.87; unit 950 -->

【Grammar】

<!-- Source EN PDF p.87; unit 951 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_getExpWinAttr(const rk_aiq_sys_ctx_t* sys_ctx,const
 Uapi_ExpWin_t* ExpWin);
```

<!-- Source EN PDF p.87; unit 952 -->

【Parameters】

<!-- Source EN PDF p.87; unit 953 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| ExpWin | Window Properties Parameter | Output |

<!-- Source EN PDF p.87; unit 954 -->

【Return Value】

<!-- Source EN PDF p.87; unit 955 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.87; unit 956 -->

【Requirements】

<!-- Source EN PDF p.87; unit 957 -->

Header files: rk_aiq_user_api2_ae.h, rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.88; unit 958 -->

Library file: librkaiq.so

<!-- Source EN PDF p.88; unit 959 -->

#### 6.6.15  rk_aiq_user_api2_ae_queryExpResInfo

<!-- Source EN PDF p.88; unit 960 -->

【Description】 Obtain AE internal state information.

<!-- Source EN PDF p.88; unit 961 -->

【Grammar】

<!-- Source EN PDF p.88; unit 962 -->

```text
 XCamReturn
 rk_aiq_user_api2_ae_queryExpResInfo(const rk_aiq_sys_ctx_t* ctx,
 Uapi_ExpQueryInfo_t* pExpResInfo);
```

<!-- Source EN PDF p.88; unit 963 -->

【Parameters】

<!-- Source EN PDF p.88; unit 964 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| pExpResInfo | AE Internal State Information Structure Pointer | Output |

<!-- Source EN PDF p.88; unit 965 -->

【Return Value】

<!-- Source EN PDF p.88; unit 966 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.88; unit 967 -->

【Requirements】

<!-- Source EN PDF p.88; unit 968 -->

Header files: rk_aiq_user_api2_ae.h, rk_aiq_uapi2_ae_int.h

<!-- Source EN PDF p.88; unit 969 -->

Library file: librkaiq.so

<!-- Source EN PDF p.88; unit 970 -->

### 6.7   Module-level API data types

<!-- Source EN PDF p.88; unit 971 -->

#### 6.7.1  Uapi_ExpSwAttr_t

<!-- Source EN PDF p.88; unit 972 -->

【Description】

<!-- Source EN PDF p.88; unit 973 -->

AE common function control parameter structure.

<!-- Source EN PDF p.88; unit 974 -->

【Definition】

<!-- Source EN PDF p.89; unit 975 -->

```text
 typedef struct Uapi_ExpSwAttrV2_s {
     rk_aiq_uapi_sync_t                 sync;
     uint8_t                            Enable;
     CalibDb_CamRawStatsModeV2_t        RawStatsMode;
     CalibDb_CamHistStatsModeV2_t       HistStatsMode;
     CalibDb_CamYRangeModeV2_t          YRangeMode;
     uint8_t                            AecRunInterval;
     RKAiqOPMode_t                      AecOpType;
     Cam15x15UCharMatrix_t              GridWeights;
     Uapi_AeAttrV2_t                    stAuto;
     Uapi_MeAttrV2_t                    stManual;
     Uapi_ExpSwAttr_AdvancedV2_t        stAdvanced;
 } Uapi_ExpSwAttrV2_t;
```

<!-- Source EN PDF p.89; unit 976 -->

【Member】

<!-- Source EN PDF p.89; unit 977 -->

| Member<br>Name | Description |
|---|---|
| sync | For rk_aiq_uapi_sync_t definitions, see Overview/API Description section |
| Enable | AEC enable switch. 1. Turn on the Aec algorithm; 0, turn off the Aec algorithm, and the<br>exposure remains at the value before it turned off |
| RawStatsMode | AEC module luminance statistics mode. There are four modes:<br>CAM_RAWSTATSV2_MODE_Y/R/G/B, and the default is Y mode. |
| HistStatsMode | AEC module histogram statistical mode. There are five modes:<br>CAM_HISTV2_MODE_Y/R/G/B, and the default is Y mode. |
| YRangeMode | Aec module Y-channel Range mode. The two modes are<br>CAM_YRANGEV2_MODE_FULL/LIMITED, and the default is FULL mode. |
| AecRunInterval | The AE algorithm runs at a value range of [0,255], and the default value is 0. If the<br>value is 0, run AE every frame; If the value is 1, run AE every 1 frame; And so on. |
| AecOpType | Exposure modes, divided into auto exposure (RK_AIQ_OP_MODE_AUTO) mode /<br>manual (RK_AIQ_OP_MODE_MANUAL) exposure mode. The default is AUTO<br>mode. Manual exposure mode needs to be used in conjunction with stManual to set the<br>manual exposure value |
| GridWeights | Window (histogram) weight, containing 15*15 array elements, value range [0,32] |
| stAuto | Auto exposure parameter structure |
| stManual | Manual exposure parameter structure |
| stAdvanced | Parameter structs |

<!-- Source EN PDF p.89; unit 978 -->

Related Data Type

<!-- Source EN PDF p.89; unit 979 -->

rk_aiq_uapi_sync_t

<!-- Source EN PDF p.89; unit 980 -->

Uapi_ExpSwAttr_AdvancedV2_t

<!-- Source EN PDF p.89; unit 981 -->

Uapi_AeAttrV2_t

<!-- Source EN PDF p.90; unit 982 -->

Uapi_MeAttrV2_t

<!-- Source EN PDF p.90; unit 983 -->

6.7.1.1  Uapi_ExpSwAttr_AdvancedV2_t

<!-- Source EN PDF p.90; unit 984 -->

【Description】

<!-- Source EN PDF p.90; unit 985 -->

Parameter structs are preferred.

<!-- Source EN PDF p.90; unit 986 -->

【Definition】

<!-- Source EN PDF p.90; unit 987 -->

```text
 typedef struct Aec_uapi_advanced_attr_s {
     bool                          enable;
     uint8_t                       GridWeights[15 * 15];
     bool                          SetAeRangeEn;
     Aec_LinAeRange_t              SetLinAeRange;
     Aec_HdrAeRange_t              SetHdrAeRange;
 } Aec_uapi_advanced_attr_t;
 typedef Aec_uapi_advanced_attr_t Uapi_ExpSwAttr_AdvancedV2_t;
```

<!-- Source EN PDF p.90; unit 988 -->

【Member】

<!-- Source EN PDF p.90; unit 989 -->

| Member Name | Description |
|---|---|
| enable | set 1 to give preference to the parameters in the struct |
| GridWeights | AE weight, size 15X15. |
| SetAeRangeEn | Set 1 to set the auto exposure component range; Set 0, do not set the auto exposure<br>component range, subject to the debug file |
| SetLinAeRange | The value of the range parameter of the auto exposure component of linear exposure<br>(not the final effective range) |
| SetHdrAeRange | The automatic exposure component of HDR exposure range parameter value (not the<br>final effective range) |

<!-- Source EN PDF p.90; unit 990 -->

【Precautions】

<!-- Source EN PDF p.90; unit 991 -->

Uapi_ExpSwAttrV2_t A set of AE weights is defined in the structure, and the number of weights is 15X15. The algorithm expands the weights according to the actual number of weights configured by the hardware. If you need to expose a similar face, you can use a set of AE weights defined in the Uapi_ExpSwAttr_AdvancedV2_t, and the number of weights is 15X15. The algorithm compresses the weights according to the actual number of weights configured by the hardware. If you want to use a set of AE weights defined in the Uapi_ExpSwAttr_Advanced_t, enable must be enabled and set to 1.

<!-- Source EN PDF p.90; unit 992 -->

When setting the AE parameter range through the API, you need to set SetAeRangeEn to 1, otherwise the automatic exposure parameter range in the debug file is used by default. The setting of the exposure parameter range is divided into two sets: SetLinAeRange and SetHdrAeRange according to different exposure modes. Among them, SetHdrAeRange supports setting the range of auto exposure parameters for each frame. In addition, the final effective exposure time and gain range need to be queried in the stAuto structure, where only the set range, not the final effective range.

<!-- Source EN PDF p.91; unit 993 -->

6.7.1.1.1 Aec_AeRange_t

<!-- Source EN PDF p.91; unit 994 -->

【Description】 Define the AE parameter range.

<!-- Source EN PDF p.91; unit 995 -->

【Definition】

<!-- Source EN PDF p.91; unit 996 -->

```text
 typedef struct Aec_AeRange_s {
     float                   Min;
     float                   Max;
 } Aec_AeRange_t;
```

<!-- Source EN PDF p.91; unit 997 -->

【Member】

<!-- Source EN PDF p.91; unit 998 -->

| Member Name | Description |
|---|---|
| Min | Lower limit |
| Max | Upper limit value |

<!-- Source EN PDF p.91; unit 999 -->

6.7.1.1.2 Aec_LinAeRange_t

<!-- Source EN PDF p.91; unit 1000 -->

【Description】 Define the parameter range for AE linear mode.

<!-- Source EN PDF p.91; unit 1001 -->

【Definition】

<!-- Source EN PDF p.91; unit 1002 -->

```text
 typedef struct Aec_LinAeRange_s {
     Aec_AeRange_t      stExpTimeRange;
     Aec_AeRange_t      stGainRange;
     Aec_AeRange_t      stIspDGainRange;
     Aec_AeRange_t      stPIrisRange;
 } Aec_LinAeRange_t;
```

<!-- Source EN PDF p.91; unit 1003 -->

【Member】

<!-- Source EN PDF p.91; unit 1004 -->

| Member Name | Description |
|---|---|
| stExpTimeRange | Exposure time range, set the maximum and minimum values in milliseconds |
| stGainRange | The Sensor simulates the gain range, setting the maximum and minimum values |
| stIspDGainRange | ISP digital gain range, set maximum and minimum values |
| stPIrisRange | Aperture equivalent gain range, only P-Iris aperture size control is supported |

<!-- Source EN PDF p.91; unit 1005 -->

【Precautions】

<!-- Source EN PDF p.91; unit 1006 -->

When the maximum/minimum value of each exposure component is the default value of 0, the set exposure component range does not take effect, and the actual maximum/minimum value of each exposure component is determined by the minimum and maximum values of the AecRoute exposure decomposition route node.

<!-- Source EN PDF p.92; unit 1007 -->

When the maximum/minimum value of each exposure component is not 0, the set exposure component range takes effect, when the set exposure component range does not exceed the limit of sensor or ISP, the actual maximum/minimum value of each exposure component is subject to the set exposure component range, and the AecRoute exposure decomposition route is corrected, and the node maximum/minimum value is changed to the set maximum / minimum value of the exposure component; If the limit of sensor or ISP is exceeded, the actual maximum/minimum value of each exposure component is subject to the maximum and minimum values of the AecRoute exposure decomposition route node

<!-- Source EN PDF p.92; unit 1008 -->

6.7.1.1.3 Aec_HdrAeRange_t

<!-- Source EN PDF p.92; unit 1009 -->

【Description】 Define the parameter range for AE HDR mode.

<!-- Source EN PDF p.92; unit 1010 -->

【Definition】

<!-- Source EN PDF p.92; unit 1011 -->

```text
 typedef struct Aec_HdrAeRange_s {
     Aec_AeRange_t      stExpTimeRange[3];
     Aec_AeRange_t      stGainRange[3];
     Aec_AeRange_t      stIspDGainRange[3];
     Aec_AeRange_t      stPIrisRange;
 } Aec_HdrAeRange_t;
```

<!-- Source EN PDF p.92; unit 1012 -->

【Member】

<!-- Source EN PDF p.92; unit 1013 -->

| Member Name | Description |
|---|---|
| stExpTimeRange | Exposure time range, set the maximum and minimum values in seconds, array 0/1/2<br>are short frames, medium frames, long frames, respectively. |
| stGainRange | Sensor analog gain range, set the maximum and minimum values, array 0/1/2 are<br>short frames, medium frames, long frames. |
| stIspDGainRange | ISP digital gain range, set the maximum and minimum values, array 0/1/2 are short<br>frames, medium frames, long frames. |
| stPIrisRange | Aperture equivalent gain value range, set the maximum and minimum values |

<!-- Source EN PDF p.92; unit 1014 -->

【Precautions】

<!-- Source EN PDF p.92; unit 1015 -->

stExpTimeRange, stGainRange, stIspDGainRange are predefined as arrays with 3 members. In the 2-frame HDR mode, only members 0 and 1 are valid, indicating the exposure component ranges corresponding to short frames and long frames, respectively. In 3-frame HDR mode, 0-2 is valid, indicating the exposure component range corresponding to short, medium, and long frames, respectively.

<!-- Source EN PDF p.92; unit 1016 -->

When the maximum/minimum value of each exposure component is the default value of 0, the set exposure component range does not take effect, and the actual maximum/minimum value of each exposure component is determined by the minimum and maximum values of the exposure decomposition route node corrected by the algorithm.

<!-- Source EN PDF p.92; unit 1017 -->

When the maximum / minimum value of each exposure component is not 0, the set exposure component range takes effect, when the set exposure component range does not exceed the limit of sensor or ISP, the actual maximum / minimum value of each exposure component is subject to the set exposure component range, and the exposure decomposition route is corrected, and the node maximum/minimum value is changed to the set maximum / minimum value of the exposure component; If the limit of sensor or ISP is

<!-- Source EN PDF p.93; unit 1018 -->

exceeded, the actual maximum/minimum value of each exposure component is subject to the maximum and minimum values of the exposure decomposition route node. The 1106 platform does not support the isp dgain function at the moment, so stIspDGainRange is temporarily invalid

<!-- Source EN PDF p.93; unit 1019 -->

6.7.1.2  Uapi_AeAttrV2_t

<!-- Source EN PDF p.93; unit 1020 -->

【Description】 Define AE auto exposure properties.

<!-- Source EN PDF p.93; unit 1021 -->

【Definition】

<!-- Source EN PDF p.93; unit 1022 -->

```text
 typedef struct Uapi_AeAttrV2_s {
     Uapi_AeSpeedV2_t           stAeSpeed;
     DelayFrmNum
     uint8_t                    BlackDelayFrame;
     uint8_t                    WhiteDelayFrame;
     Auto/Fixed fps
     Uapi_AeFpsAttrV2_t         stFrmRate;
     Uapi_AntiFlickerV2_t       stAntiFlicker;
     auto range
     Aec_LinAeRange_t           LinAeRange;//result LinAerange
     Aec_HdrAeRange_t           HdrAeRange;//result HdrAerange
 } Uapi_AeAttrV2_t;
```

<!-- Source EN PDF p.93; unit 1023 -->

【Member】

<!-- Source EN PDF p.93; unit 1024 -->

| Member Name | Description |
|---|---|
| stAeSpeed | Auto exposure adjustment speed |
| BlackDelayFrame | Auto exposure delay property, when the image brightness below the target value<br>exceeds the BlackDelayFrame frame, Ae starts adjusting |
| WhiteDelayFrame | Auto exposure delay property, when the image brightness exceeds the target value of<br>the WhiteDelayFrame frame, Ae starts adjusting |
| stFrmRate | Auto exposure frame rate mode structure, fixed frame rate mode or auto frame<br>reduction mode |
| stAntiFlicker | Anti-power frequency flicker parameters |
| LinAeRange | Linear mode AE range structure (final effective linear exposure range) |
| HdrAeRange | HDR mode AE range structure (final effective HDR exposure range) |

<!-- Source EN PDF p.93; unit 1025 -->

【Precautions】

<!-- Source EN PDF p.93; unit 1026 -->

LinAeRange/HdrAeRange is the range of parameters actually used after verification correction inside the algorithm. When the AE parameter range set by the API exceeds the parameter range limited by the sensor, the parameter range limited by the sensor will be used. The range of parameters limited by sensor can be found in the AE module sensorinfo parameter in the Rockchip_Tuning_Guide_ISP30_CN.pdf documentation.

<!-- Source EN PDF p.94; unit 1027 -->

To set the auto exposure component range, the API calls the parameter in the Uapi_ExpSwAttr_AdvancedV2_t above and sets SetAeRangeEn to 1, otherwise the auto exposure parameter range in the debug file is used by default.

<!-- Source EN PDF p.94; unit 1028 -->

6.7.1.2.1 Uapi_AeSpeedV2_t

<!-- Source EN PDF p.94; unit 1029 -->

【Description】 Define AE conditional speed properties.

<!-- Source EN PDF p.94; unit 1030 -->

【Definition】

<!-- Source EN PDF p.94; unit 1031 -->

```text
 typedef struct CalibDb_AeSpeedV2_s {
     float                   DampOver;
     float                   DampUnder;
     float                   DampDark2Bright;
     float                   DampBright2Dark;
 } CalibDb_AeSpeedV2_t;
 typedef CalibDb_AeSpeedV2_t Uapi_AeSpeedV2_t;
```

<!-- Source EN PDF p.94; unit 1032 -->

【Member】

<!-- Source EN PDF p.94; unit 1033 -->

| Member name | Description |
|---|---|
| DampOver | The ambient brightness is stable, and the corresponding exposure adjustment speed<br>when the image brightness is higher than the target value, the value range [0,1]. |
| DampUnder | The ambient brightness is stable, and the corresponding exposure adjustment speed<br>when the image brightness is lower than the target value, the value range [0,1]. |
| DampDark2Bright | Sudden change in ambient brightness, the corresponding exposure adjustment speed<br>from dark to light, value range [0,1]. |
| DampBright2Dark | Sudden change in ambient brightness, the corresponding exposure adjustment speed<br>from light to dark, value range [0,1]. |

<!-- Source EN PDF p.94; unit 1034 -->

6.7.1.2.2 Uapi_AeFpsAttrV2_t

<!-- Source EN PDF p.94; unit 1035 -->

【Description】 Define AE frame rate properties.

<!-- Source EN PDF p.94; unit 1036 -->

【Definition】

<!-- Source EN PDF p.94; unit 1037 -->

```text
 typedef struct CalibDb_AeFrmRateAttrV2_s {
     bool             isFpsFix;
     uint8_t          FpsValue;
 } CalibDb_AeFrmRateAttrV2_t;
 typedef CalibDb_AeFrmRateAttrV2_t Uapi_AeFpsAttrV2_t;
```

<!-- Source EN PDF p.94; unit 1038 -->

【Member】

<!-- Source EN PDF p.95; unit 1039 -->

| Member<br>Name | Description |
|---|---|
| isFpsFix | The auto exposure fixed frame rate mode is enabled, the default value is FALSE, that is,<br>the automatic frame reduction mode is used; A value of TRUE indicates a fixed frame rate<br>mode. |
| FpsValue | It is only valid when the frame rate is fixed, and when the default value is 0, the default<br>frame rate of the driver is used fixed; If the value is not 0, the set frame rate value is used. |

<!-- Source EN PDF p.95; unit 1040 -->

6.7.1.2.3 Uapi_AntiFlickerV2_t

<!-- Source EN PDF p.95; unit 1041 -->

【Description】 Define anti-flash properties.

<!-- Source EN PDF p.95; unit 1042 -->

【Definition】

<!-- Source EN PDF p.95; unit 1043 -->

```text
 typedef struct CalibDb_AntiFlickerAttrV2_s {
     bool                           enable;
     CalibDb_FlickerFreq_t          Frequency;
     CalibDb_AntiFlickerMode_t      Mode;
 } CalibDb_AntiFlickerAttrV2_t;
 typedef CalibDb_AntiFlickerAttrV2_t Uapi_AntiFlickerV2_t;
```

<!-- Source EN PDF p.95; unit 1044 -->

【Member】

<!-- Source EN PDF p.95; unit 1045 -->

| Member<br>Name | Description |
|---|---|
| enable | Power frequency anti-flash function enabled state, 0: turn off the anti-flash function; 1: Turn<br>on the anti-flash function |
| Frequency | Anti-flash frequency attribute, including a total of 3 frame rates, namely:<br>AECV2_FLICKER_FREQUENCY_OFF (effective when the anti-flash enable bit enables<br>0), AECV2_FLICKER_FREQUENCY_50HZ, AECV2_FLICKER_FREQUENCY_60HZ,<br>the default is AECV2_FLICKER_FREQUENCY_50HZ (power frequency 50 Hz). |
| Mode | Anti-flash mode, including two anti-flash modes:<br>AECV2_ANTIFLICKER_NORMAL_MODE (normal anti-flash mode),<br>AECV2_ANTIFLICKER_AUTO_MODE (automatic anti-flash mode) |

<!-- Source EN PDF p.95; unit 1046 -->

【Precautions】

<!-- Source EN PDF p.95; unit 1047 -->

To turn off the anti-flash function, you need to set the enable bit enable to 0, and the algorithm automatically configures Frequency=AECV2_FLICKER_FREQUENCY_OFF; If the anti-flash enable bit is set to 1, the anti-flash frequency is configured to AECV2_FLICKER_FREQUENCY_OFF, the frequency value will be invalid, and the default value will be used to AECV2_FLICKER_FREQUENCY_50HZ.

<!-- Source EN PDF p.95; unit 1048 -->

AECV2_ANTIFLICKER_NORMAL_MODE normal anti-flash mode, the exposure time can be adjusted according to the brightness, and the minimum exposure time is fixed at 1/120 sec (60Hz) or 1/100 sec (50Hz), not limited by the minimum exposure time.

<!-- Source EN PDF p.95; unit 1049 -->

Illuminated environment: The exposure time can be matched to the frequency of the light source, which prevents the image from flickering.

<!-- Source EN PDF p.96; unit 1050 -->

High brightness environment: The higher the brightness, the shortest exposure time required. The minimum exposure time of the normal anti-flash mode cannot match the frequency of the light source, resulting in overexposure. AECV2_ANTIFLICKER_AUTO_MODE is an automatic anti-flash mode, the exposure time can be adjusted according to the brightness, and the minimum exposure time can reach the minimum exposure time of the sensor. The difference from the normal anti-flash mode is mainly reflected in the high brightness environment. High brightness environment: The minimum exposure time can reach the minimum exposure time of the sensor, which can effectively suppress overexposure, but the anti-flash fails at this time.

<!-- Source EN PDF p.96; unit 1051 -->

6.7.1.3  Uapi_MeAttrV2_t

<!-- Source EN PDF p.96; unit 1052 -->

【Description】

<!-- Source EN PDF p.96; unit 1053 -->

Manual exposure parameter setting, according to the exposure mode is divided into LinearAE and HdrAE two sets of parameters.

<!-- Source EN PDF p.96; unit 1054 -->

【Definition】

<!-- Source EN PDF p.96; unit 1055 -->

```text
 typedef struct Uapi_MeAttrV2_s {
     Uapi_LinMeAttrV2_t     stLinMe;
     Uapi_HdrMeAttrV2_t     stHdrMe;
 } Uapi_MeAttrV2_t;
```

<!-- Source EN PDF p.96; unit 1056 -->

【Related data types】

<!-- Source EN PDF p.96; unit 1057 -->

Uapi_LinMeAttrV2_t

<!-- Source EN PDF p.96; unit 1058 -->

Uapi_HdrMeAttrV2_t

<!-- Source EN PDF p.96; unit 1059 -->

6.7.1.3.1 Uapi_LinMeAttrV2_t

<!-- Source EN PDF p.96; unit 1060 -->

【Description】

<!-- Source EN PDF p.96; unit 1061 -->

Manual exposure control parameters for LinearAE.

<!-- Source EN PDF p.96; unit 1062 -->

【Definition】

<!-- Source EN PDF p.96; unit 1063 -->

```text
 typedef struct Uapi_LinMeAttrV2_s {
     bool                 ManualTimeEn;
     bool                 ManualGainEn;
     bool                 ManualIspDgainEn;
     float                TimeValue;
     float                GainValue;
     float                IspDGainValue;
 } Uapi_LinMeAttrV2_t;
```

<!-- Source EN PDF p.96; unit 1064 -->

【Member】

<!-- Source EN PDF p.97; unit 1065 -->

| Member name | Description |
|---|---|
| ManualTimeEn | Manual exposure time enabled, default value is 1 |
| ManualGainEn | Manual sensor gain enable, default value is 1 |
| ManualIspDgainEn | Manual ISP digital gain enable, default value is 1 |
| TimeValue | Manual exposure time values in s, parameter values limited by sensor |
| GainValue | Manual sensor gain value, parameter value limited by sensor |
| IspDGainValue | Manual ISP digital gain value, parameter values limited by ISP |

<!-- Source EN PDF p.97; unit 1066 -->

【Precautions】

<!-- Source EN PDF p.97; unit 1067 -->

This module parameter is only valid when AeOptype = MANUAL. ManualTimeEn, ManualGainEn, ManualIspDgainEn are all 1, which is manual mode; As long as any of the above three is not enabled, it is semi-automatic mode; If all four of the above are 0, it is equivalent to automatic mode, and the system will report an error reminder.

<!-- Source EN PDF p.97; unit 1068 -->

In manual/semi-manual mode, the manual exposure time and gain are limited by the maximum/minimum exposure time and gain in automatic mode. After the auto exposure limit is exceeded, the maximum/minimum value in auto mode is used instead.

<!-- Source EN PDF p.97; unit 1069 -->

RK356X does not support ISP digital gain, so ManualIspDgainEn and IspDGainValue are invalid.

<!-- Source EN PDF p.97; unit 1070 -->

6.7.1.3.2 Uapi_HdrMeAttrV2_t

<!-- Source EN PDF p.97; unit 1071 -->

【Description】

<!-- Source EN PDF p.97; unit 1072 -->

Manual exposure control parameters for HdrAE.

<!-- Source EN PDF p.97; unit 1073 -->

【Definition】

<!-- Source EN PDF p.97; unit 1074 -->

```text
 typedef struct Uapi_HdrMeAttrV2_s {
     bool                    ManualTimeEn;
     bool                    ManualGainEn;
     bool                    ManualIspDgainEn;
     Cam3x1FloatMatrix_t     TimeValue;
     Cam3x1FloatMatrix_t     GainValue;
     Cam3x1FloatMatrix_t     IspDGainValue;
 } Uapi_HdrMeAttrV2_t;
```

<!-- Source EN PDF p.97; unit 1075 -->

【Member】

<!-- Source EN PDF p.97; unit 1076 -->

Variables have the same meaning as Uapi_LinMeAttrV2_t.

<!-- Source EN PDF p.97; unit 1077 -->

【Precautions】

<!-- Source EN PDF p.97; unit 1078 -->

TimeValue/GainValue/IspDGainValue are arrays with 3 members. In HDR 2 frame mode, the array [0-1] members are valid, representing short and long frames, respectively; In HDR 3 frame mode, the array [0-2] members are valid, corresponding to short, medium, and long frames, respectively.

<!-- Source EN PDF p.97; unit 1079 -->

In manual/semi-manual mode, the manual exposure time and gain are limited by the maximum/minimum exposure time and gain in automatic mode. After the auto exposure limit is exceeded, the maximum/minimum value in auto mode is used instead.

<!-- Source EN PDF p.97; unit 1080 -->

RK356X does not currently support ISP digital gain, so ManualIspDgainEn, IspDGainValue are invalid.

<!-- Source EN PDF p.98; unit 1081 -->

#### 6.7.2  Uapi_LinAeRouteAttr_t

<!-- Source EN PDF p.98; unit 1082 -->

【Description】 Define AE linear exposure decomposition path properties.

<!-- Source EN PDF p.98; unit 1083 -->

【Definition】

<!-- Source EN PDF p.98; unit 1084 -->

```text
 typedef struct CalibDb_LinAeRoute_AttrV2_s {
     float* TimeDot;
     int TimeDot_len;
     float* GainDot;
     int GainDot_len;
     float* IspDGainDot;
     int IspDGainDot_len;
     int* PIrisDot;
     int PIrisDot_len;
 } CalibDb_LinAeRoute_AttrV2_t;
 typedef struct Uapi_LinAeRouteAttr_s {
   rk_aiq_uapi_sync_t            sync;
   CalibDb_LinAeRoute_AttrV2_t   Params;
 } Uapi_LinAeRouteAttr_t;
```

<!-- Source EN PDF p.98; unit 1085 -->

【Member】

<!-- Source EN PDF p.98; unit 1086 -->

| Member Name | Description |
|---|---|
| TimeDot | The sensor exposure time node in s |
| GainDot | The sensor exposure gain node, |
| IspgainDot | ISP digital gain node |
| PIrisGainDot | Aperture equivalent gain node |

<!-- Source EN PDF p.98; unit 1087 -->

【Precautions】

<!-- Source EN PDF p.98; unit 1088 -->

There is no limit to the number of exposure decomposition curve nodes, but it is recommended not to have less than 6.

<!-- Source EN PDF p.98; unit 1089 -->

The exposure of a node is the product of each component such as exposure time, sensor gain, ISP digital gain, and aperture equivalent gain. The exposure of the node must be monotonically increasing, that is, the exposure of the latter node must be greater than the exposure of the previous node. The first node has the least exposure and the second node has the largest exposure.

<!-- Source EN PDF p.98; unit 1090 -->

The exposure time component in the node is in seconds, the minimum value is allowed to be 0, and the actual minimum exposure time code is internally corrected according to the sensor limit.

<!-- Source EN PDF p.98; unit 1091 -->

Aperture component only supports P-Iris, DC-Iris is not supported. The P-iris equivalent gain component is only valid when the Airis auto iris function is enabled, otherwise the default aperture is fixed to the initial value size. The calculation of the equivalent gain of P-iris is detailed in the AecIrisCtrl module.

<!-- Source EN PDF p.98; unit 1092 -->

The set exposure decomposition route node is not the final exposure decomposition route. The actual maximum/small value of each final exposure component of the system is determined by the combination of the exposure decomposition node and the manually configured exposure component maximum/small value. First make the first correction of the maximum/small value of the node of the exposure decomposition route,

<!-- Source EN PDF p.99; unit 1093 -->

and when the maximum/small value of the node does not exceed the limit of SENSOR or ISP, the maximum/small value of the node remains unchanged; When the node maximum/small value exceeds the limit of the sensor or ISP, the node maximum/small value is subject to the limit of the sensor or ISP. When the maximum/minimum value of the manually configured exposure component is 0, the final effective exposure decomposition route is subject to the decomposition route of the first correction; When the maximum/small value of the manually configured exposure component is not 0, and the maximum/small value set does not exceed the limit of SENSOR or ISP, the exposure decomposition route is corrected for the second time, and the node maximum/small value is subject to the manually set range; If the maximum/small value of the exposure component is set beyond the limit of the sensor or ISP, the node maximum/small value of the exposure component of the exposure decomposition route shall be subject to the result of the first correction. If the exposure of adjacent nodes increases, only one exposure component should increase and the others fixed. The added component determines the allocation strategy for that segment of the route. For example, if the gain component increases and the other components are fixed, then the distribution strategy of this segment of the route is gain first.

<!-- Source EN PDF p.99; unit 1094 -->

RK356X does not currently support ISP digital gain, so IspgainDot is invalid.

<!-- Source EN PDF p.99; unit 1095 -->

#### 6.7.3  Uapi_HdrAeRouteAttr_t

<!-- Source EN PDF p.99; unit 1096 -->

【Description】 Define AE HDR exposure decomposition path properties.

<!-- Source EN PDF p.99; unit 1097 -->

【Definition】

<!-- Source EN PDF p.99; unit 1098 -->

```text
 typedef struct CalibDb_HdrAeRoute_AttrV2_s {
     float* Frm0TimeDot;
     int Frm0TimeDot_len;
     float* Frm0GainDot;
     int Frm0GainDot_len;
     float* Frm0IspDGainDot;
     int Frm0IspDGainDot_len;
     float* Frm1TimeDot;
     int Frm1TimeDot_len;
     float* Frm1GainDot;
     int Frm1GainDot_len;
     float* Frm1IspDGainDot;
     int Frm1IspDGainDot_len;
     float* Frm2TimeDot;
     int Frm2TimeDot_len;
     float* Frm2GainDot;
     int Frm2GainDot_len;
     float* Frm2IspDGainDot;
     int Frm2IspDGainDot_len;
     int* PIrisDot;
     int PIrisDot_len;
 } CalibDb_HdrAeRoute_AttV2r_t;
 typedef struct Uapi_HdrAeRouteAttr_s {
   rk_aiq_uapi_sync_t            sync;
   CalibDb_HdrAeRoute_AttrV2_t   Params;
 } Uapi_HdrAeRouteAttr_t;
```

<!-- Source EN PDF p.100; unit 1099 -->

【Members】

<!-- Source EN PDF p.100; unit 1100 -->

| Member name | Description |
|---|---|
| Frm0/1/2TimeDot | Exposure time node, in seconds. In HDR 2 frame mode, only Frm0/1TimeDot is<br>valid; In HDR 3 frame mode, Frm0/1/2TimeDot is valid. FRM0~3 is the frame<br>sequence number from short to long exposure |
| Frm0/1/2GainDot | Sensor gain node. In Hdr 2 frame mode, only Frm0/1GainDot is valid; In HDR 3<br>frame mode, Frm0/1/2GainDot is valid. The gain value here is the actual value in<br>units of 1x. FRM0~3 is the frame sequence number from short to long exposure |
| Frm0/1/2IspDGainDot | ISP digital gain node. In Hdr 2 frame mode, only Frm0/1IspDGainDot is valid;<br>In HDR 3 frame mode, Frm0/1/2IspDGainDot is valid. The gain value here is<br>the actual value in units of 1x. FRM0~3 is the frame sequence number from<br>short to long exposure |
| PIrisDot | The aperture is equivalent to the gain node, where the gain value is the actual<br>value in units of 1x. |

<!-- Source EN PDF p.100; unit 1101 -->

【Precautions】

<!-- Source EN PDF p.100; unit 1102 -->

The number of exposure decomposition curve nodes is not limited, It is recommended to set at least 6 nodes to achieve smooth exposure decomposition.

<!-- Source EN PDF p.100; unit 1103 -->

It should be noted that in HDR 2 frame mode, only Frm0/1TimeDot, Frm0/1GainDot, Frm0/1IspDGainDot need to be set, corresponding to the actual short and long frames respectively; In HDR 3 frame mode, Frm0/1/2TimeDot, Frm0/1/2GainDot, Frm0/1/2IspDGainDot need to be set, corresponding to short, medium and long frames respectively. When setting the sensor exposure time for each frame in HDR mode, you need to allocate the exposure time reasonably, and the sum of the exposure time of each frame \*\* cannot exceed the maximum exposure time allowed by the frame rate\*\*!

<!-- Source EN PDF p.100; unit 1104 -->

The exposure of a node is the product of each component such as exposure time, sensor gain, ISP digital gain, and aperture equivalent gain. The exposure of the node must be monotonically increasing, that is, the exposure of the latter node must be greater than the exposure of the previous node. The first node has the least exposure and the second node has the largest exposure.

<!-- Source EN PDF p.100; unit 1105 -->

The exposure time component in the node is in seconds, the minimum value is allowed to be 0, and the actual minimum exposure time code is internally corrected according to the sensor limit.

<!-- Source EN PDF p.100; unit 1106 -->

Aperture component only supports P-Iris, DC-Iris is not supported. The P-iris equivalent gain component is only valid when the Airis auto iris function is enabled, otherwise the default aperture is fixed to the initial value size. The calculation of the equivalent gain of P-iris is detailed in the AecIrisCtrl module.

<!-- Source EN PDF p.100; unit 1107 -->

The set exposure decomposition route node is not the final exposure decomposition route. The actual maximum/small value of each final exposure component of the system is determined by the combination of the exposure decomposition node and the manually configured exposure component maximum/small value. First make the first correction of the maximum/small value of the node of the exposure decomposition route, and when the maximum/small value of the node does not exceed the limit of SENSOR or ISP, the maximum/small value of the node remains unchanged; When the node maximum/small value exceeds the limit of the sensor or ISP, the node maximum/small value is subject to the limit of the sensor or ISP. When the maximum/minimum value of the manually configured exposure component is 0, the final effective exposure decomposition route is subject to the decomposition route of the first correction; When the maximum/small value of the manually configured exposure component is not 0, and the maximum/small value set does not exceed the limit of SENSOR or ISP, the exposure decomposition route is corrected for the

<!-- Source EN PDF p.101; unit 1108 -->

second time, and the node maximum/small value is subject to the manually set range; If the maximum/small value of the exposure component is set beyond the limit of the sensor or ISP, the node maximum/small value of the exposure component of the exposure decomposition route shall be subject to the result of the first correction. If the exposure of adjacent nodes increases, only one exposure component should increase and the others fixed. The added component determines the allocation strategy for that segment of the route. For example, if the gain component increases and the other components are fixed, then the distribution strategy of this segment of the route is gain first.

<!-- Source EN PDF p.101; unit 1109 -->

356X does not currently support ISP digital gain, so Frm0/1/2ispDGainDot are invalid.

<!-- Source EN PDF p.101; unit 1110 -->

#### 6.7.4  Uapi_LinExpAttrV2_t

<!-- Source EN PDF p.101; unit 1111 -->

【Description】

<!-- Source EN PDF p.101; unit 1112 -->

Define AE linear exposure tuning parameters.

<!-- Source EN PDF p.101; unit 1113 -->

【Definition】

<!-- Source EN PDF p.101; unit 1114 -->

```text
 typedef struct CalibDb_LinearAE_AttrV2_s {
     uint8_t RawStatsEn;
     float ToleranceIn;
     float ToleranceOut;
     float Evbias;
     CalibDb_AeStrategyModeV2_t      StrategyMode;
     CalibDb_LinExpInitExpV2_t       InitExp;
     CalibDb_LinAeRoute_AttrV2_t     Route;
     CalibDb_AecDynamicSetpointV2_t  DySetpoint;
     CalibDb_AecBacklightV2_t        BackLightCtrl;
     CalibDb_AecOverExpCtrlV2_t OverExpCtrl;
 } CalibDb_LinearAE_AttrV2_t;
 typedef struct Uapi_LinExpAttrV2_s {
   rk_aiq_uapi_sync_t            sync;
   CalibDb_LinearAE_AttrV2_t     Params;
 } Uapi_LinExpAttrV2_t;
```

<!-- Source EN PDF p.101; unit 1115 -->

【Member】

<!-- Source EN PDF p.102; unit 1116 -->

| Member Name | Description |
|---|---|
| RawStatsEn | Linear exposure is enabled using the Raw domain statistical luminance function |
| EvBias | When adjusting the automatic exposure, the percentage deviation of the exposure<br>amount is % The reference value range is [-200, +200] |
| ToleranceIn/Out | The tolerance of the brightness of the picture when adjusting the auto exposure. The<br>unit is %, and the value range is [0,100] |
| StrategyMode | Auto exposure strategy mode, Highlight Priority or Low Light Priority [temporarily<br>inactive] |
| DySetpoint | The dynamic target brightness value attribute of the automatic exposure adjustment,<br>which dynamically changes with the exposure amount |
| BackLightCtrl | Backlight compensation function parameters |
| OverExpCtrl | Bright light suppression function parameters |

<!-- Source EN PDF p.102; unit 1117 -->

【Precautions】

<!-- Source EN PDF p.102; unit 1118 -->

EvBias for fine-tuning (SetPoint/IRSetPoint) of target luminance values (fixed/dynamic) in special scenarios. The true effective target brightness is (SetPoint)\*[1+abs(EvBias)/100]^[EvBias/abs(EvBias)]. If EvBias=100 is set, the target brightness is twice the default parameter. When EvBias=-100, the target brightness is 1/2 of the default parameter.

<!-- Source EN PDF p.102; unit 1119 -->

The tolerance of the brightness of the AE screen is Tolerance, and when the AE converges, the brightness value B should be within the range of [True Effective Target Brightness X(1-Tolerance/100), True Effective Target Luminance X(1+Tolerance/100)]. The ToleranceIn/Out setting is large, which will affect the response speed of AE on the one hand, and the EvBias value on the other. When the interval value of EvBias adjustment is lower than ToleranceIn/Out, it may cause the brightness adjustment to not take effect.

<!-- Source EN PDF p.102; unit 1120 -->

StrategyMode is currently invalid.

<!-- Source EN PDF p.102; unit 1121 -->

【Related data types】

<!-- Source EN PDF p.102; unit 1122 -->

CalibDb_AecDynamicSetpointV2_t

<!-- Source EN PDF p.102; unit 1123 -->

CalibDb_AecBacklightV2_t

<!-- Source EN PDF p.102; unit 1124 -->

CalibDb_AecOverExpCtrlV2_t

<!-- Source EN PDF p.102; unit 1125 -->

6.7.4.1  CalibDb_AecDynamicSetpointV2_t

<!-- Source EN PDF p.102; unit 1126 -->

【Description】 Define AE dynamic target values.

<!-- Source EN PDF p.102; unit 1127 -->

【Definition】

<!-- Source EN PDF p.102; unit 1128 -->

```text
 typedef struct CalibDb_AecDynamicSetpointV2_s {
     float* ExpLevel;
     int ExpLevel_len;
     float* DySetpoint;
     int DySetpoint_len;
 } CalibDb_AecDynamicSetpointV2_t;
```

<!-- Source EN PDF p.103; unit 1129 -->

【Member】

<!-- Source EN PDF p.103; unit 1130 -->

| Member<br>name | Description |
|---|---|
| ExpLevel | Dynamic exposure node attribute, the node value is the current exposure value, the number<br>of nodes is not limited, it is recommended to set at least 6 nodes to prevent the exposure<br>transition from being smooth. |
| DySetpoint | Dynamic target brightness value node attribute, node value dynamically changes with<br>exposure amount, the larger the exposure node value, the smaller the target brightness node<br>value, and corresponds to the exposure node one-to-one. The number of nodes is not<br>limited, it needs to be consistent with the number of ExpLevel nodes, it is recommended to<br>set at least 6 nodes to prevent the exposure transition from being smooth. |

<!-- Source EN PDF p.103; unit 1131 -->

#### 6.7.5  Uapi_HdrExpAttrV2_t

<!-- Source EN PDF p.103; unit 1132 -->

【Description】 Define AE HDR exposure debug parameters.

<!-- Source EN PDF p.103; unit 1133 -->

【Definition】

<!-- Source EN PDF p.103; unit 1134 -->

```text
 typedef struct CalibDb_HdrAE_AttrV2_s {
     float ToleranceIn;
     float ToleranceOut;
     float Evbias;
     CalibDb_AeStrategyModeV2_t StrategyMode;
     float LumaDistTh; //used for area-growing
     CalibDb_HdrExpInitExpV2_t InitExp;
     CalibDb_HdrAeRoute_AttrV2_t Route;
     CalibDb_ExpRatioCtrlV2_t ExpRatioCtrl;
     CalibDb_LongFrmCtrlV2_t LongFrmMode;
     CalibDb_LfrmCtrlV2_t LframeCtrl;
     CalibDb_MfrmCtrlV2_t MframeCtrl;
     CalibDb_SfrmCtrlV2_t SframeCtrl;
 } CalibDb_HdrAE_AttrV2_t;
 typedef struct Uapi_HdrExpAttrV2_s {
   rk_aiq_uapi_sync_t            sync;
   CalibDb_HdrAE_AttrV2_t        Params;
 } Uapi_HdrExpAttrV2_t;
```

<!-- Source EN PDF p.103; unit 1135 -->

【Member】

<!-- Source EN PDF p.104; unit 1136 -->

| Member Name | Description |
|---|---|
| ToleranceIn/Out | The tolerance of the brightness of the picture when adjusting the auto exposure. The unit is %, and the value range is [0,100] |
| LongfrmMode | Long frame mode parameter |
| StrategyMode | Auto Exposure Strategy Mode, Highlight Priority or Low Light Priority<br>(AECV2_STRATEGY_MODE_LOWLIGHT_PRIOR/AECV2_STRATEGY_MODE_HIGHLIGHT_PRIOR) |
| Evbias | When adjusting the automatic exposure, the percentage deviation of the exposure amount is % The reference value range is<br>[-200, +200] |
| ExpRatioCtrl | HdrAE exposure ratio control module, only valid in HDR mode multi-frame compositing |
| LframeCtrl | Long frame control parameters |
| MframeCtrl | Medium frame control parameter, valid only in HDR 3 frame mode |
| SframeCtrl | Short frame control parameters |

<!-- Source EN PDF p.104; unit 1137 -->

【Related data types】

<!-- Source EN PDF p.104; unit 1138 -->

CalibDb_LFrameCtrlV2_t

<!-- Source EN PDF p.104; unit 1139 -->

CalibDb_MFrameCtrlV2_t

<!-- Source EN PDF p.104; unit 1140 -->

CalibDb_SFrameCtrlV2_t

<!-- Source EN PDF p.104; unit 1141 -->

#### 6.7.6  Uapi_IrisAttrV2_t

<!-- Source EN PDF p.104; unit 1142 -->

【Description】

<!-- Source EN PDF p.104; unit 1143 -->

Aperture control parameters.

<!-- Source EN PDF p.104; unit 1144 -->

【Definition】

<!-- Source EN PDF p.104; unit 1145 -->

```text
 typedef struct CalibDb_AecIrisCtrlV2_s {
     uint8_t Enable;
     CalibDb_IrisTypeV2_t IrisType;
     RKAiqOPMode_t IrisOpType;
     CalibDb_MIris_AttrV2_t ManualAttr;
     CalibDb_PIris_AttrV2_t PIrisAttr;
     CalibDb_DCIris_AttrV2_t DCIrisAttr;
 } CalibDb_AecIrisCtrlV2_t;
 typedef struct Uapi_IrisAttrV2_s {
   rk_aiq_uapi_sync_t            sync;
   CalibDb_AecIrisCtrlV2_t       Params;
 } Uapi_IrisAttrV2_t;
```

<!-- Source EN PDF p.104; unit 1146 -->

【Member】

<!-- Source EN PDF p.105; unit 1147 -->

| Member<br>name | Description |
|---|---|
| Enable | Automatic iris control function enabled |
| IrisType | Aperture type, P (i.e. P-iris aperture) or DC (i.e. DC-iris aperture) |
| IrisOpType | Aperture control mode: divided into automatic (RK_AIQ_OP_MODE_AUTO) mode /<br>manual (RK_AIQ_OP_MODE_MANUAL) mode |
| ManualAttr | Manual aperture parameters |
| PIrisAttr | P-aperture attribute parameter |
| DCIrisAttr | DC Aperture Properties Parameter |

<!-- Source EN PDF p.105; unit 1148 -->

6.7.6.1  CalibDb_MIris_AttrV2_t

<!-- Source EN PDF p.105; unit 1149 -->

【Description】

<!-- Source EN PDF p.105; unit 1150 -->

Manual aperture parameters.

<!-- Source EN PDF p.105; unit 1151 -->

【Definition】

<!-- Source EN PDF p.105; unit 1152 -->

```text
 typedef struct CalibDb_MIris_AttrV2_s {
     int PIrisGainValue;
     int DCIrisHoldValue;
 } CalibDb_MIris_AttrV2_t;
```

<!-- Source EN PDF p.105; unit 1153 -->

【Member】

<!-- Source EN PDF p.105; unit 1154 -->

| Member name | Description |
|---|---|
| PIrisGainValue | Manual P-aperture equivalent gain value, parameter value limited by P-aperture<br>device, the value range is [1,1024] |
| DCIrisHoldValue | DC aperture HoldValue value, parameter value is related to DC aperture device, the<br>value range is [0,100] |

<!-- Source EN PDF p.105; unit 1155 -->

【Precautions】

<!-- Source EN PDF p.105; unit 1156 -->

IrisOpType = RK_AIQ_OP_MODE_MANUAL, manual aperture enabled. When the aperture type is P- aperture, only PirisGainValue is valid; When the aperture type is DC aperture, only DCIrisHoldValue is valid.

<!-- Source EN PDF p.105; unit 1157 -->

DCIrisHoldValue, directly set the PWM duty cycle value of the motor in manual mode, the value range [0,100]. If the HoldValue value is set in manual mode (that is, the value in the range from ClosePwmDuty to OpenPwmDuty in AecIrisCtrl), the DC aperture aperture remains at the current size; If the value set is greater than OpenPwmDuty, the aperture is turned on, and the larger the value, the greater the opening speed; If the value set is less than ClosePwmDuty, the aperture is off, and the smaller the value, the greater the speed of closing.

<!-- Source EN PDF p.106; unit 1158 -->

6.7.6.2  CalibDb_PIris_AttrV2_t

<!-- Source EN PDF p.106; unit 1159 -->

【Description】

<!-- Source EN PDF p.106; unit 1160 -->

P aperture attribute parameter.

<!-- Source EN PDF p.106; unit 1161 -->

【Definition】

<!-- Source EN PDF p.106; unit 1162 -->

```text
 #define AEC_PIRIS_STAP_TABLE_MAX (1024)
 typedef struct CalibDb_PIris_AttrV2_s {
     uint16_t              TotalStep;
     uint16_t              EffcStep;
     bool                  ZeroIsMax;
     uint16_t              StepTable[AEC_PIRIS_STAP_TABLE_MAX];
 } CalibDb_PIris_AttrV2_t;
```

<!-- Source EN PDF p.106; unit 1163 -->

【Member】

<!-- Source EN PDF p.106; unit 1164 -->

| Member<br>name | Description |
|---|---|
| TotalStep | The total number of steps of the P-iris stepper motor, the specific size is related to the P-iris<br>lens. |
| EffcStep | The number of steps available for the P-iris stepper motor, the specific size is related to the<br>P-iris lens |
| ZeroIsMax | Whether the P-iris stepper motor step0 corresponds to the maximum aperture position, the<br>specific value is related to the P-iris lens. This value is 0, which means that when the<br>stepper motor position is step0, the aperture is turned to the minimum; The value is 1,<br>which means that when the stepper motor position is step0, the aperture is turned to the<br>maximum. |
| StepTable | A mapping table of the position of the P-iris stepper motor to the equivalent gain of the<br>aperture, the specific value is related to the P-iris lens |

<!-- Source EN PDF p.106; unit 1165 -->

6.7.6.3  CalibDb_DCIris_AttrV2_t

<!-- Source EN PDF p.106; unit 1166 -->

【Description】

<!-- Source EN PDF p.106; unit 1167 -->

DC aperture property.

<!-- Source EN PDF p.106; unit 1168 -->

【Definition】

<!-- Source EN PDF p.106; unit 1169 -->

```text
 typedef struct CalibDb_DCIris_AttrV2_s {
     float       Kp;
     float       Ki;
     float       Kd;
     int         MinPwmDuty;
     int         MaxPwmDuty;
     int         OpenPwmDuty;
     int         ClosePwmDuty;
 } CalibDb_DCIris_AttrV2_t;
```

<!-- Source EN PDF p.107; unit 1170 -->

【Member】

<!-- Source EN PDF p.107; unit 1171 -->

| Member name | Description |
|---|---|
| Kp | A scale factor that limits the switching speed of the aperture drastically changing<br>timecircle, the larger the value, the slower the light aperture changes the timecircle<br>opens and closes. If this value is too large, the adjustment process braking will be<br>ahead, resulting in too long adjustment time; If this value is too small, the braking will<br>lag behind during the adjustment process, resulting in an increase in overshoot. The<br>reasonable setting of this value is related to the DC-iris lens and circuit characteristics.<br>The recommended value is 0.5. The range of values is [0,1]. |
| Ki | The integration coefficient that adjusts the switching speed of the aperture, the larger<br>the aperture, the greater the speed at which the aperture opens and closes. This value is<br>too large, and it is easy to overshoot and cause oscillation; If this value is too small,<br>oscillations tend to occur when the aperture adjustment speed is slower and the ambient<br>brightness changes sharply. The recommended value is 0.2. The range of values is [0,1]. |
| Kd | A differential coefficient that adjusts the switching speed of the aperture, the larger the<br>value, the greater the speed at which the aperture opens and closes. The recommended<br>value is 0.3. The range of values is [0,1]. |
| MinPwmDuty | Minimum PWM duty cycle, the specific size is related to the DC-iris lens and circuit<br>characteristics, in %. The smaller the value, the faster the supported aperture closes, but<br>tends to cause aperture oscillation. The value range is [0,100], and the default value is<br>0. |
| MaxPwmDuty | The maximum PWM duty cycle, the specific size is related to the DC-iris lens and<br>circuit characteristics, in %. A higher value opens the supported aperture faster, and too<br>small a value may cause the aperture control to exit before the maximum aperture has<br>been reached. The value range is [0,100], and the default value is 100. |
| OpenPwmDuty | PWM duty cycle threshold when aperture open, aperture on when aperture PWM duty<br>cycle is higher than (not included) OpenPwmDuty. The specific size is related to the<br>DC-iris lens and is in %. |
| ClosePwmDuty | PWM duty cycle threshold when aperture is off, aperture off when aperture PWM duty<br>cycle is less than (not included) ClosePwmDuty. The specific size is related to the DC-<br>iris lens and is in %. |

<!-- Source EN PDF p.107; unit 1172 -->

【Precautions】

<!-- Source EN PDF p.107; unit 1173 -->

When the auto iris function is turned off, for DC-iris aperture, it will be turned on to the maximum by default; For the P-iris aperture, the stepper motor position corresponding to the maximum aperture is turned on by default. If you want to change the above aperture position, you can modify InitPIrisGainValue and InitDCIrisDutyValue in the AecInitValue module.

<!-- Source EN PDF p.107; unit 1174 -->

The basic control flow of the automatic iris Airis algorithm is as follows:

<!-- Source EN PDF p.107; unit 1175 -->

For DC-iris lenses, Airis controls the aperture size of the DC-iris lens based on the deviation of the current brightness from the target brightness. When the exposure reaches the minimum value, and the current brightness exceeds the target brightness tolerance range, the AE control will be exited, and the exposure time and exposure gain will be fixed and enter the AIRIS control range. If the current screen brightness is stable and the PWM duty

<!-- Source EN PDF p.108; unit 1176 -->

of DC-iris is greater than OpenPwmDuty, the current aperture is considered to have reached the maximum, and the Airis aperture control is withdrawn, and the control is handed over to AE.

<!-- Source EN PDF p.108; unit 1177 -->

For P-iris lenses, aperture control is performed via the AecRoute module. The aperture size of the P-iris lens is converted to the equivalent gain and participates in the exposure decomposition calculation.

<!-- Source EN PDF p.108; unit 1178 -->

P-iris stepper motor position and aperture equivalent gain mapping table StepTable is generally made according to the correspondence between stepper motor position and aperture aperture provided by lens manufacturers. The control of P-iris is controlled by AE's AecRoute module, which converts the aperture aperture size into equivalent gain, so P-iris control needs to have good linearity. The equivalent gain ranges from [1,1024], with an equivalent gain of 1024 for F1.0, an equivalent gain of 512 for F1.4, and so on, an equivalent gain of 1 for F32.0. When making a table, it is necessary to convert the aperture aperture corresponding to the stepper motor position to the equivalent gain, fill it in the StepTable, and fix it to increment according to the stepper motor position (i.e. step0, step1...). stepN).

<!-- Source EN PDF p.108; unit 1179 -->

TotalStep represents the total number of steps of the P-iris stepper motor, and the specific size is related to the P-iris lens. EffcStep indicates the number of steps available for P-iris stepper motors, which is generally less than TotalStep. Because the position near the closed end of the aperture has a large error in the value corresponding to the equivalent gain, and oscillations are prone to occur during iris adjustment, the step position near the closed end of the aperture is usually not used.

<!-- Source EN PDF p.108; unit 1180 -->

Table 4-1 is a table corresponding to the position of the P-iris stepper motor to the aperture aperture and equivalent gain, and use this table as an example to illustrate how to set the StepTable. The correspondence between the stepper motor position step and the aperture aperture area in columns 1-2 and 4-5 in Table 4-1 is provided by a lens manufacturer. The P-iris lens has a stepper motor adjustment total of 81 steps, with the largest aperture aperture at step0 and a nominal maximum aperture of 1.4. A number of apertures of 1.4 corresponds to an equivalent gain of 512, so the equivalent gain at step 0 is 512. The equivalent gain corresponding to the other aperture areas, here taking step 3 as an example, is calculated as follows: the aperture area of step 3 is 195.869, and the corresponding equivalent gain = 512\* (195.869/201.062)=499(rounded). By analogy, the equivalent gain values corresponding to the positions of other stepper motors can also be calculated from this. It can be seen from Table 1-1 that when the stepper motor position is close to the closed end, the corresponding aperture area is very small, and the difference from the largest aperture area can be thousands of times, and the corresponding equivalent gain value error is large, so it is recommended that the stepper motor position close to the closed end of the aperture should not be used, so as not to cause exposure oscillation due to errors. The equivalent gain corresponding to each stepper motor position in the table is incremented according to the stepper motor position (i.e., step0, step1...). stepN) is filled in the StepTable.

<!-- Source EN PDF p.108; unit 1181 -->

DC-iris' OpenPwmDuty and ClosePwmDuty values need to be measured and are related to DC-iris lenses. For some lenses, when the PWM duty cycle is greater than OpenPwmDuty, the aperture performs an open operation; When the PWM duty cycle is less than OpenPwmDuty, the aperture performs a closed operation; When the PWM duty cycle is greater than or equal to ClosePwmDuty and less than or equal to OpenPwmDuty, the aperture is stable at the current position, and the values in this interval are HoldValue. In addition, there are some lenses, and there is only a threshold of the aperture switch, that is, when the PWM duty cycle is greater than this threshold, the aperture performs an open operation; When the PWM duty cycle is less than this threshold, the aperture performs a off operation; When the PWM duty cycle is equal to this threshold, the aperture stabilizes at the current position, which is HoldValue. In this case, you can make ClosePwmDuty = OpenPwmDuty = HoldValue.

<!-- Source EN PDF p.108; unit 1182 -->

The manual mode parameter setting of the aperture is consistent with the manual mode of exposure. When you need to use the manual iris function, set the AecOpType to manual mode and enable the ManualIrisEn parameter in the AecManualCtrl module. When IrisType is P-iris, only PirisGainValue is valid; When IrisType is P-iris, only DCIrisValue is valid.

<!-- Source EN PDF p.109; unit 1183 -->

Table 4-1 P-iris stepper motor position and aperture aperture and equivalent gain correspondence table

<!-- Source EN PDF p.110; unit 1184 -->

| Step | Aperture<br>area(mm2) | Equivalent<br>gain | Step | Aperture<br>area(mm2) | Equivalent<br>gain |
|---|---|---|---|---|---|
| 0 | 201.062 | 512 | 41 | 56.653 | 144 |
| 1 | 200.759 | 511 | 42 | 53.438 | 136 |
| 2 | 198.583 | 506 | 43 | 50.282 | 128 |
| 3 | 195.869 | 499 | 44 | 47.188 | 120 |
| 4 | 192.879 | 491 | 45 | 44.159 | 112 |
| 5 | 189.677 | 483 | 46 | 41.197 | 105 |
| 6 | 186.293 | 474 | 47 | 38.307 | 98 |
| 7 | 182.744 | 465 | 48 | 35.49 | 90 |
| 8 | 179.035 | 456 | 49 | 32.751 | 83 |
| 9 | 175.271 | 446 | 50 | 30.093 | 77 |
| 10 | 171.484 | 437 | 51 | 27.519 | 70 |
| 11 | 167.681 | 427 | 52 | 25.034 | 64 |
| 12 | 163.865 | 417 | 53 | 22.642 | 58 |
| 13 | 160.036 | 408 | 54 | 20.347 | 52 |
| 14 | 156.198 | 398 | 55 | 18.154 | 46 |
| 15 | 152.351 | 388 | 56 | 16.068 | 41 |
| 16 | 148.499 | 378 | 57 | 14.096 | 36 |
| 17 | 144.642 | 368 | 58 | 12.245 | 31 |
| 18 | 140.783 | 359 | 59 | 10.522 | 27 |
| 19 | 136.925 | 349 | 60 | 8.935 | 23 |
| 20 | 133.069 | 339 | 61 | 7.484 | 19 |
| 21 | 129.217 | 329 | 62 | 6.169 | 16 |
| 22 | 125.371 | 319 | 63 | 4.987 | 13 |
| 23 | 121.535 | 309 | 64 | 3.936 | 10 |
| 24 | 117.709 | 300 | 65 | 3.014 | 8 |
| 25 | 113.897 | 290 | 66 | 2.22 | 6 |
| 26 | 110.1 | 280 | 67 | 1.55 | 4 |
| 27 | 106.321 | 271 | 68 | 1.003 | 3 |
| 28 | 102.562 | 261 | 69 | 0.577 | 1 |

<!-- Source EN PDF p.111; unit 1185 -->

| Step | Aperture<br>area(mm2) | Equivalent<br>gain | Step | Aperture<br>area(mm2) | Equivalent<br>gain |
|---|---|---|---|---|---|
| 29 | 98.826 | 252 | 70 | 0.268 | 1 |
| 30 | 95.115 | 242 | 71 | 0.075 | 0 |
| 31 | 91.431 | 233 | 72 | close | 0 |
| 32 | 87.777 | 224 | 73 | close | 0 |
| 33 | 84.156 | 214 | 74 | close | 0 |
| 34 | 80.569 | 205 | 75 | close | 0 |
| 35 | 77.02 | 196 | 76 | close | 0 |
| 36 | 73.51 | 187 | 77 | close | 0 |
| 37 | 70.043 | 178 | 78 | close | 0 |
| 38 | 66.621 | 170 | 79 | close | 0 |
| 39 | 63.247 | 161 | 80 | close | 0 |
| 40 | 59.923 | 153 |  |  |  |

<!-- Source EN PDF p.111; unit 1186 -->

#### 6.7.7  Uapi_ExpWin_t

<!-- Source EN PDF p.111; unit 1187 -->

【Description】 Define AE Statistics Window Properties parameters.

<!-- Source EN PDF p.111; unit 1188 -->

【Definition】

<!-- Source EN PDF p.111; unit 1189 -->

```text
 typedef struct window {
     uint16_t h_offs;
     uint16_t v_offs;
     uint16_t h_size;
     uint16_t v_size;
 } window_t;
 typedef struct Uapi_ExpWin_s {
   rk_aiq_uapi_sync_t            sync;
   window                        Params;
 } Uapi_ExpWin_t;
```

<!-- Source EN PDF p.111; unit 1190 -->

【Member】

<!-- Source EN PDF p.112; unit 1191 -->

| Member<br>Name | Description |
|---|---|
| h_offs | The horizontal offset value of the upper left corner of the window relative to the coordinate<br>origin, where the coordinate origin refers to the upper left corner of the sensor's<br>photosensitive area |
| v_offs | The vertical offset value of the upper left corner of the window relative to the coordinate<br>origin, where the coordinate origin refers to the upper left corner of the sensor sensitive<br>area |
| h_size | Window horizontal dimensions |
| v_size | Window vertical dimension |

<!-- Source EN PDF p.112; unit 1192 -->

#### 6.7.8  Uapi_ExpQueryInfo_t

<!-- Source EN PDF p.112; unit 1193 -->

【Description】 Define AE exposure parameter queries.

<!-- Source EN PDF p.112; unit 1194 -->

【Definition】

<!-- Source EN PDF p.112; unit 1195 -->

```text
 typedef struct Uapi_ExpQueryInfo_s {
     bool              IsConverged;
     bool              IsExpMax;
     float             LumaDeviation;
     float             HdrLumaDeviation[3];
     float             MeanLuma;
     float             HdrMeanLuma[3];
     float             GlobalEnvLux;
     float             BlockEnvLux[ISP2_RAWAE_WINNUM_MAX];
     RKAiqAecExpInfo_t CurExpInfo;
     unsigned short    Piris;
     float             LinePeriodsPerField;
     float             PixelPeriodsPerLine;
     float             PixelClockFreqMHZ;
 } Uapi_ExpQueryInfo_t;
```

<!-- Source EN PDF p.112; unit 1196 -->

【Member】

<!-- Source EN PDF p.113; unit 1197 -->

| Member Name | Description |
|---|---|
| IsConverged | Whether the auto exposure converges |
| IsExpMax | Whether ISP exposure is at maximum |
| LumaDeviation | In linear mode, the difference between the target value of the AEC and the actual<br>brightness of the image, a positive value indicates that the actual brightness is<br>greater than the target brightness, a negative value indicates that the actual<br>brightness is less than the target brightness, and a value of 0 indicates that the<br>actual brightness of the target value is within the tolerance range of the target<br>value |
| HdrLumaDeviation | In HDR mode, the difference between the target brightness of each frame and the<br>actual brightness of each frame is positive, indicating that the actual brightness is<br>greater than the target brightness, a negative value indicates that the actual<br>brightness is less than the target brightness, and a value of 0 indicates that the<br>actual brightness is within the tolerance range of the target value. In 2-frame<br>mode, only 0 and 1 are valid for short and long frames, respectively, and in 3-<br>frame mode, 0-2 are valid for short, medium, and long frames, respectively. |
| MeanLuma | In linear mode, the average brightness of the current picture |
| HdrMeanLuma | In HDR mode, the average brightness of the current frame in each frame. In the 2-<br>frame mode, only members 0 and 1 of the array are valid, indicating short and<br>long frames, respectively, and in 3-frame mode, all members of the array are valid,<br>representing short, medium, and long frames, respectively |
| CurExpInfo | The current exposure parameters, including sensor exposure time and sensor<br>exposure gain value. According to the exposure mode, it is divided into two sets of<br>exposure parameters: LinearExp and HdrExp[3]. |
| Piris | Aperture |
| LinePeriodsPerField | sensor VTS |
| PixelPeriodsPerLine | sensor HTS |
| PixelClockFreqMHZ | Sensor's pixel clock frequency (in megahertz) |

<!-- Source EN PDF p.114; unit 1198 -->

### 6.8   Common problem location and debug method

<!-- Source EN PDF p.114; unit 1199 -->

If problems such as screen brightness flicker, overshoot, or brightness not meeting expectations occur, it is recommended to capture the AE LOG of the problematic scene for analysis, which can help quickly locate the problem and improve work efficiency.

<!-- Source EN PDF p.114; unit 1200 -->

#### 6.8.1  Exposure statistics synchronous test function

<!-- Source EN PDF p.114; unit 1201 -->

Before calibrating the ISP module, the driver or tuning personnel need to fill in the SensorInfo parameter in the debugging IQ XML. This module involves the setting of exposure parameters, such as incorrect settings may cause exposure errors, flickering and other phenomena. It is recommended that after configuring the sensorinfo parameter, enable the SyncTest function for self-testing. SensorInfo parameter meaning description refer to Rockchip_Tuning_Guide_ISP30.

<!-- Source EN PDF p.114; unit 1202 -->

The SyncTest function can test whether the exposure time and exposure gain of the sensor, and the effective frame number of DCG switching are correct by cyclically setting N groups of different exposure values, and can also be used to test the linearity of the exposure, so as to confirm whether the register value conversion formula and related parameters of the exposure time and exposure gain are correct.

<!-- Source EN PDF p.114; unit 1203 -->

The SyncTest function parameters are described as follows:

<!-- Source EN PDF p.114; unit 1204 -->

【Description】

<!-- Source EN PDF p.114; unit 1205 -->

The synchronous test function of exposure and statistics supports cyclic setting of N groups of different exposure values according to the number of frames at a given interval, which is used to debug and verify whether the effective frame number of exposure components (exposure time, exposure gain) and sensor exposure parameter settings are correct.

<!-- Source EN PDF p.114; unit 1206 -->

【Member】

<!-- Source EN PDF p.114; unit 1207 -->

| Member name | Description |
|---|---|
| Enable | Enables the simultaneous testing of exposure and statistics |
| IntervalFrm | Number of frames between exposure switching |
| AlterExp | Exposure switching parameters |

<!-- Source EN PDF p.114; unit 1208 -->

AlterExp

<!-- Source EN PDF p.114; unit 1209 -->

According to the different modes, it is divided into two sets of parameters: LinearAE and HdrAE.

<!-- Source EN PDF p.115; unit 1210 -->

| Member name | Description |
|---|---|
| TimeValue | Exposure time value |
| GainValue | Exposure gain value |
| IspDgainValue | ISP digital gain value |
| DcgMode | DCG mode value |
| PIrisGainValue | P-iris equivalent gain |

<!-- Source EN PDF p.115; unit 1211 -->

If the parameters are set correctly, the following example is used for LOG (only the key information in LOG is intercepted). The red frame shows the exposure switching position, the visible brightness has not changed and matches the exposure value, there is no delay or advance linearity, at this time, it can be basically judged that the sensorinfo parameter is set correctly.

<!-- Source EN PDF p.115; unit 1212 -->

![Original technical figure — PDF p.115](/docs/rockchip-isp30-development/assets/en-p115-X1039.png)

<!-- Source EN PDF p.115; unit 1213 -->

#### 6.8.2  Flickering occurs when exposure changes

<!-- Source EN PDF p.115; unit 1214 -->

There are several reasons why flicker can occur when exposure changes:

<!-- Source EN PDF p.115; unit 1215 -->

(1) The frame number of the gain and time effective moments in the CISExpUpdate module is wrong. Examples of common LOGS are as follows (only key LOG lines per frame are intercepted):

<!-- Source EN PDF p.115; unit 1216 -->

![Original technical figure — PDF p.115](/docs/rockchip-isp30-development/assets/en-p115-X1040.png)

<!-- Source EN PDF p.115; unit 1217 -->

The red frame is marked with the brightness error position, and it can be seen that as the exposure increases or decreases, the corresponding brightness is opposite to the exposure change trend. By observation, it can be seen that the sudden change in luminance occurs in the second frame after both the exposure time and exposure gain change. The change trend of brightness is consistent with the trend of exposure time, so it can be judged that the effective frame number of gain and time is wrong, and the change of exposure time and exposure gain does not take effect at the same time, resulting in a mismatch between brightness and exposure. You can solve this problem by modifying the number of frames in gain and time. The above problems can be reproduced using AE's syncTest

<!-- Source EN PDF p.116; unit 1218 -->

function, setting two sets of exposures (different exposure gain and exposure time), and making them switch back and forth to see if the LOG can know if it is reproduced.

<!-- Source EN PDF p.116; unit 1219 -->

(2) The brightness oscillation back and forth caused by driving errors cannot converge, often occurs in highlight scenes, common LOG examples are as follows (only intercept the key LOG line of each frame)

<!-- Source EN PDF p.116; unit 1220 -->

![Original technical figure — PDF p.116](/docs/rockchip-isp30-development/assets/en-p116-X1044.png)

<!-- Source EN PDF p.116; unit 1221 -->

As shown in the figure, it can be observed that the exposure oscillates back and forth between 59ms and 44ms, and looking at the corresponding brightness average of 59ms and 44ms, it will be found that the ratio of brightness and the ratio of exposure of the two has a large gap, and there is a problem with linearity. The first step requires the sensor's drive detection, where the exposure register value is printed to see if the register value is consistent with the exposure in the log. The above problem can be reproduced using AE's syncTest function, setting multiple sets of exposures (including the one in question), making them switch back and forth to see if the brightness change corresponding to each frame of exposure in LOG is linear.

<!-- Source EN PDF p.116; unit 1222 -->

![Original technical figure — PDF p.116](/docs/rockchip-isp30-development/assets/en-p116-X1045.png)

<!-- Source EN PDF p.116; unit 1223 -->

(3) Flickering caused by AE subsequent modules, common LOG examples are as follows (only intercept the key LOG lines of each frame):

<!-- Source EN PDF p.116; unit 1224 -->

![Original technical figure — PDF p.116](/docs/rockchip-isp30-development/assets/en-p116-X1046.png)

<!-- Source EN PDF p.117; unit 1225 -->

From LOG, it can be seen that during the decline of SMeanLuma and MMeanLuma on the left, the brightness of the output of the TmoMeanluma module has changed, and when this happens, it is necessary to debug the TMO module.

<!-- Source EN PDF p.118; unit 1226 -->

## 7.   AWB

<!-- Source EN PDF p.118; unit 1227 -->

### 7.1   Overview

<!-- Source EN PDF p.118; unit 1228 -->

The function of the AWB module is to uniformly compensate for the color deviation caused by the color temperature environment and the deviation of the inherent color channel gain of the shooting equipment by changing the gain of the color channel of the shooting equipment, so that the obtained image can correctly reflect the true color of the object.

<!-- Source EN PDF p.118; unit 1229 -->

### 7.2   Important concepts

<!-- Source EN PDF p.118; unit 1230 -->

Color temperature: The color temperature is defined by the absolute black body, and when the radiation of the light source is exactly the same as the radiation of the absolute black body in the visible area, the temperature of the black body is called the color temperature of the light source.

<!-- Source EN PDF p.118; unit 1231 -->

White balance: Under light sources with different color temperatures, the response of white in the sensor will be bluish or reddish. The white balance algorithm adjusts the intensity of the three color channels R, G, and B to make white appear realistically.

<!-- Source EN PDF p.118; unit 1232 -->

### 7.3   Description of the feature

<!-- Source EN PDF p.118; unit 1233 -->

The AWB module consists of two parts: WB information statistics and AWB policy control algorithm.

<!-- Source EN PDF p.118; unit 1234 -->

### 7.4   Feature-level API reference

<!-- Source EN PDF p.118; unit 1235 -->

#### 7.4.1  rk_aiq_uapi2_setWBMode

<!-- Source EN PDF p.118; unit 1236 -->

【Description】 Set the white balance operating mode.

<!-- Source EN PDF p.118; unit 1237 -->

【Grammar】

<!-- Source EN PDF p.118; unit 1238 -->

```text
 XCamReturn rk_aiq_uapi2_setWBMode(const rk_aiq_sys_ctx_t* ctx, opMode_t mode);
```

<!-- Source EN PDF p.118; unit 1239 -->

【Parameters】

<!-- Source EN PDF p.118; unit 1240 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| mode | White balance operating mode | Input |

<!-- Source EN PDF p.118; unit 1241 -->

【Return Value】

<!-- Source EN PDF p.119; unit 1242 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.119; unit 1243 -->

【Note】

<!-- Source EN PDF p.119; unit 1244 -->

If set to manual mode, the white balance gain value is controlled by the current manual white balance parameter. If you need to switch manual mode while setting a specific gain value, you can use the rk_aiq_uapi2_setMWBGain interface.

<!-- Source EN PDF p.119; unit 1245 -->

【Requirements】

<!-- Source EN PDF p.119; unit 1246 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.119; unit 1247 -->

Library file: librkaiq.so

<!-- Source EN PDF p.119; unit 1248 -->

【Example】

<!-- Source EN PDF p.119; unit 1249 -->

Reference sample_awb_module.cpp

<!-- Source EN PDF p.119; unit 1250 -->

#### 7.4.2  rk_aiq_uapi2_getWBMode

<!-- Source EN PDF p.119; unit 1251 -->

【Description】 Gets the white balance operating mode.

<!-- Source EN PDF p.119; unit 1252 -->

【Grammar】

<!-- Source EN PDF p.119; unit 1253 -->

```text
 XCamReturn rk_aiq_uapi2_getWBMode(const rk_aiq_sys_ctx_t* ctx, opMode_t *mode);
```

<!-- Source EN PDF p.119; unit 1254 -->

【Parameters】

<!-- Source EN PDF p.119; unit 1255 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| mode | White balance operating mode | Output |

<!-- Source EN PDF p.119; unit 1256 -->

【Return Value】

<!-- Source EN PDF p.119; unit 1257 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.119; unit 1258 -->

【Requirements】

<!-- Source EN PDF p.119; unit 1259 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.119; unit 1260 -->

Library file: librkaiq.so

<!-- Source EN PDF p.119; unit 1261 -->

【Example】

<!-- Source EN PDF p.119; unit 1262 -->

Reference sample_awb_module.cpp

<!-- Source EN PDF p.120; unit 1263 -->

#### 7.4.3  rk_aiq_uapi2_lockAWB

<!-- Source EN PDF p.120; unit 1264 -->

【Description】 Locks the current white balance parameters.

<!-- Source EN PDF p.120; unit 1265 -->

【Grammar】

<!-- Source EN PDF p.120; unit 1266 -->

```text
 XCamReturn rk_aiq_uapi2_lockAWB(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.120; unit 1267 -->

【Parameters】

<!-- Source EN PDF p.120; unit 1268 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |

<!-- Source EN PDF p.120; unit 1269 -->

【Return Value】

<!-- Source EN PDF p.120; unit 1270 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.120; unit 1271 -->

【Requirements】

<!-- Source EN PDF p.120; unit 1272 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.120; unit 1273 -->

Library file: librkaiq.so

<!-- Source EN PDF p.120; unit 1274 -->

【Example】

<!-- Source EN PDF p.120; unit 1275 -->

Reference sample_awb_module.cpp

<!-- Source EN PDF p.120; unit 1276 -->

#### 7.4.4  rk_aiq_uapi2_unlockAWB

<!-- Source EN PDF p.120; unit 1277 -->

【Description】 Unlock locked white balance parameters.

<!-- Source EN PDF p.120; unit 1278 -->

【Grammar】

<!-- Source EN PDF p.120; unit 1279 -->

```text
 XCamReturn rk_aiq_uapi2_unlockAWB(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.120; unit 1280 -->

【Parameters】

<!-- Source EN PDF p.120; unit 1281 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |

<!-- Source EN PDF p.120; unit 1282 -->

【Return Value】

<!-- Source EN PDF p.121; unit 1283 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.121; unit 1284 -->

【Requirements】

<!-- Source EN PDF p.121; unit 1285 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.121; unit 1286 -->

Library file: librkaiq.so

<!-- Source EN PDF p.121; unit 1287 -->

【Example】

<!-- Source EN PDF p.121; unit 1288 -->

Reference sample_awb_module.cpp

<!-- Source EN PDF p.121; unit 1289 -->

#### 7.4.5  rk_aiq_uapi2_setMWBScene

<!-- Source EN PDF p.121; unit 1290 -->

【Description】 Set the white balance scene.

<!-- Source EN PDF p.121; unit 1291 -->

【Grammar】

<!-- Source EN PDF p.121; unit 1292 -->

```text
 XCamReturn rk_aiq_uapi2_setMWBScene(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_wb_scene_t scene);
```

<!-- Source EN PDF p.121; unit 1293 -->

【Parameters】

<!-- Source EN PDF p.121; unit 1294 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| scene | White balance scene | Input |

<!-- Source EN PDF p.121; unit 1295 -->

【Return Value】

<!-- Source EN PDF p.121; unit 1296 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.121; unit 1297 -->

【Requirements】

<!-- Source EN PDF p.121; unit 1298 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.121; unit 1299 -->

Library file: librkaiq.so

<!-- Source EN PDF p.121; unit 1300 -->

【Example】

<!-- Source EN PDF p.121; unit 1301 -->

Reference sample_awb_module.cpp

<!-- Source EN PDF p.122; unit 1302 -->

#### 7.4.6  rk_aiq_uapi2_getMWBScene

<!-- Source EN PDF p.122; unit 1303 -->

【Description】 Get the white balance scene.

<!-- Source EN PDF p.122; unit 1304 -->

【Grammar】

<!-- Source EN PDF p.122; unit 1305 -->

```text
 XCamReturn rk_aiq_uapi2_getMWBScene(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_wb_scene_t *scene);
```

<!-- Source EN PDF p.122; unit 1306 -->

【Parameters】

<!-- Source EN PDF p.122; unit 1307 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| scene | White balance scene | Output |

<!-- Source EN PDF p.122; unit 1308 -->

【Return Value】

<!-- Source EN PDF p.122; unit 1309 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.122; unit 1310 -->

【Requirements】

<!-- Source EN PDF p.122; unit 1311 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.122; unit 1312 -->

Library file: librkaiq.so

<!-- Source EN PDF p.122; unit 1313 -->

【Example】

<!-- Source EN PDF p.122; unit 1314 -->

Reference sample_awb_module.cpp

<!-- Source EN PDF p.122; unit 1315 -->

#### 7.4.7  rk_aiq_uapi2_setMWBGain

<!-- Source EN PDF p.122; unit 1316 -->

【Description】 Set the manual white balance gain factor.

<!-- Source EN PDF p.122; unit 1317 -->

【Grammar】

<!-- Source EN PDF p.122; unit 1318 -->

```text
 XCamReturn rk_aiq_uapi2_setMWBGain(const rk_aiq_sys_ctx_t* ctx, rk_aiq_wb_gain_t
 *gain);
```

<!-- Source EN PDF p.122; unit 1319 -->

【Parameters】

<!-- Source EN PDF p.122; unit 1320 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| gain | White balance gain factor | Input |

<!-- Source EN PDF p.123; unit 1321 -->

【Return Value】

<!-- Source EN PDF p.123; unit 1322 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.123; unit 1323 -->

【Requirements】

<!-- Source EN PDF p.123; unit 1324 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.123; unit 1325 -->

Library file: librkaiq.so

<!-- Source EN PDF p.123; unit 1326 -->

【Example】

<!-- Source EN PDF p.123; unit 1327 -->

Reference sample_awb_module.cpp

<!-- Source EN PDF p.123; unit 1328 -->

#### 7.4.8  rk_aiq_uapi2_getWBGain

<!-- Source EN PDF p.123; unit 1329 -->

【Description】 Gets the white balance gain factor. This function is used for both manual and auto white balance

<!-- Source EN PDF p.123; unit 1330 -->

【Grammar】

<!-- Source EN PDF p.123; unit 1331 -->

```text
 XCamReturn rk_aiq_uapi2_getWBGain(const rk_aiq_sys_ctx_t* ctx, rk_aiq_wb_gain_t
 *gain);
```

<!-- Source EN PDF p.123; unit 1332 -->

【Parameters】

<!-- Source EN PDF p.123; unit 1333 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| gain | White balance gain factor | Output |

<!-- Source EN PDF p.123; unit 1334 -->

【Return Value】

<!-- Source EN PDF p.123; unit 1335 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.123; unit 1336 -->

【Requirements】

<!-- Source EN PDF p.123; unit 1337 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.123; unit 1338 -->

Library file: librkaiq.so

<!-- Source EN PDF p.123; unit 1339 -->

【Example】

<!-- Source EN PDF p.123; unit 1340 -->

Reference sample_awb_module.cpp

<!-- Source EN PDF p.124; unit 1341 -->

#### 7.4.9  rk_aiq_uapi2_setMWBCT

<!-- Source EN PDF p.124; unit 1342 -->

【Description】 Set the manual white balance color temperature parameter.

<!-- Source EN PDF p.124; unit 1343 -->

【Grammar】

<!-- Source EN PDF p.124; unit 1344 -->

```text
 XCamReturn rk_aiq_uapi2_setMWBCT(const rk_aiq_sys_ctx_t* ctx, unsigned int ct);
```

<!-- Source EN PDF p.124; unit 1345 -->

【Parameters】

<!-- Source EN PDF p.124; unit 1346 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| ct | White balance color temperature parameters | Input |

<!-- Source EN PDF p.124; unit 1347 -->

【Return Value】

<!-- Source EN PDF p.124; unit 1348 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.124; unit 1349 -->

【Requirements】

<!-- Source EN PDF p.124; unit 1350 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.124; unit 1351 -->

Library file: librkaiq.so

<!-- Source EN PDF p.124; unit 1352 -->

【Example】

<!-- Source EN PDF p.124; unit 1353 -->

Reference sample_awb_module.cpp

<!-- Source EN PDF p.124; unit 1354 -->

#### 7.4.10  rk_aiq_uapi2_getWBCT

<!-- Source EN PDF p.124; unit 1355 -->

【Description】 Get the white balance color temperature. This function is used both automatically and manually

<!-- Source EN PDF p.124; unit 1356 -->

【Grammar】

<!-- Source EN PDF p.124; unit 1357 -->

```text
 XCamReturn rk_aiq_uapi2_getWBCT(const rk_aiq_sys_ctx_t* ctx, unsigned int *ct);
```

<!-- Source EN PDF p.124; unit 1358 -->

【Parameters】

<!-- Source EN PDF p.124; unit 1359 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| ct | White balance color temperature | Output |

<!-- Source EN PDF p.124; unit 1360 -->

【Return Value】

<!-- Source EN PDF p.125; unit 1361 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.125; unit 1362 -->

【Requirements】

<!-- Source EN PDF p.125; unit 1363 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.125; unit 1364 -->

Library file: librkaiq.so

<!-- Source EN PDF p.125; unit 1365 -->

【Example】

<!-- Source EN PDF p.125; unit 1366 -->

Reference sample_awb_module.cpp

<!-- Source EN PDF p.125; unit 1367 -->

#### 7.4.11  rk_aiq_uapi2_setAwbGainOffsetAttrib

<!-- Source EN PDF p.125; unit 1368 -->

【Description】 Sets the offset of the auto white balance gain.

<!-- Source EN PDF p.125; unit 1369 -->

【Grammar】

<!-- Source EN PDF p.125; unit 1370 -->

```text
 XCamReturn rk_aiq_uapi2_setAwbGainOffsetAttrib(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_uapiV2_wb_awb_wbGainOffset_t attr);
```

<!-- Source EN PDF p.125; unit 1371 -->

【Parameters】

<!-- Source EN PDF p.125; unit 1372 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | wbgain offset parameter | Input |

<!-- Source EN PDF p.125; unit 1373 -->

【Return Value】

<!-- Source EN PDF p.125; unit 1374 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.125; unit 1375 -->

【Requirements】

<!-- Source EN PDF p.125; unit 1376 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.125; unit 1377 -->

Library file: librkaiq.so

<!-- Source EN PDF p.125; unit 1378 -->

【Example】

<!-- Source EN PDF p.125; unit 1379 -->

Reference sample_awb_module.cpp

<!-- Source EN PDF p.126; unit 1380 -->

#### 7.4.12  rk_aiq_uapi2_getAwbGainOffsetAttrib

<!-- Source EN PDF p.126; unit 1381 -->

【Description】 Gets the offset of the auto white balance gain

<!-- Source EN PDF p.126; unit 1382 -->

【Grammar】

<!-- Source EN PDF p.126; unit 1383 -->

```text
 XCamReturn rk_aiq_uapi2_getAwbGainOffsetAttrib(const rk_aiq_sys_ctx_t* ctx,
 CalibDbV2_Awb_gain_offset_cfg_t *attr);
```

<!-- Source EN PDF p.126; unit 1384 -->

【Parameters】

<!-- Source EN PDF p.126; unit 1385 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | wbgain offset parameter | Output |

<!-- Source EN PDF p.126; unit 1386 -->

【Return Value】

<!-- Source EN PDF p.126; unit 1387 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.126; unit 1388 -->

【Requirements】

<!-- Source EN PDF p.126; unit 1389 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.126; unit 1390 -->

Library file: librkaiq.so

<!-- Source EN PDF p.126; unit 1391 -->

【Example】

<!-- Source EN PDF p.126; unit 1392 -->

Reference sample_awb_module.cpp

<!-- Source EN PDF p.126; unit 1393 -->

#### 7.4.13  rk_aiq_uapi2_setAwbGainAdjustAttrib

<!-- Source EN PDF p.126; unit 1394 -->

【Description】 Sets the tone adjustment parameters in auto white balance mode.

<!-- Source EN PDF p.126; unit 1395 -->

【Grammar】

<!-- Source EN PDF p.126; unit 1396 -->

```text
 XCamReturn rk_aiq_uapi2_setAwbGainAdjustAttrib(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_uapiV2_wb_awb_wbGainAdjust_t attr);
```

<!-- Source EN PDF p.126; unit 1397 -->

【Parameters】

<!-- Source EN PDF p.126; unit 1398 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | White balance tone adjustment parameters | Input |

<!-- Source EN PDF p.127; unit 1399 -->

【Return Value】

<!-- Source EN PDF p.127; unit 1400 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.127; unit 1401 -->

【Requirements】

<!-- Source EN PDF p.127; unit 1402 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.127; unit 1403 -->

Library file: librkaiq.so

<!-- Source EN PDF p.127; unit 1404 -->

【Example】

<!-- Source EN PDF p.127; unit 1405 -->

Reference sample_awb_module.cpp

<!-- Source EN PDF p.127; unit 1406 -->

#### 7.4.14  rk_aiq_uapi2_getAwbGainAdjustAttrib

<!-- Source EN PDF p.127; unit 1407 -->

【Description】 Gets the tone adjustment parameters in auto white balance mode.

<!-- Source EN PDF p.127; unit 1408 -->

【Grammar】

<!-- Source EN PDF p.127; unit 1409 -->

```text
 XCamReturn rk_aiq_uapi2_getAwbGainAdjustAttrib(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_uapiV2_wb_awb_wbGainAdjust_t *attr);
```

<!-- Source EN PDF p.127; unit 1410 -->

【Parameters】

<!-- Source EN PDF p.127; unit 1411 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | White balance tone adjustment parameters | Output |

<!-- Source EN PDF p.127; unit 1412 -->

【Return Value】

<!-- Source EN PDF p.127; unit 1413 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.127; unit 1414 -->

【Requirements】

<!-- Source EN PDF p.127; unit 1415 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.127; unit 1416 -->

Library file: librkaiq.so

<!-- Source EN PDF p.127; unit 1417 -->

【Example】

<!-- Source EN PDF p.127; unit 1418 -->

Reference sample_awb_module.cpp

<!-- Source EN PDF p.128; unit 1419 -->

#### 7.4.15  rk_aiq_uapi2_setAwbV30AllAttrib

<!-- Source EN PDF p.128; unit 1420 -->

【Description】 Set all parameters supported by the White Balance API.

<!-- Source EN PDF p.128; unit 1421 -->

【Grammar】

<!-- Source EN PDF p.128; unit 1422 -->

```text
 XCamReturn rk_aiq_uapi2_setAwbV30AllAttrib(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_uapiV2_wbV30_attrib_t attr);
```

<!-- Source EN PDF p.128; unit 1423 -->

【Parameter】

<!-- Source EN PDF p.128; unit 1424 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | input |
| attr | All parameters supported by the White Balance API. | input |

<!-- Source EN PDF p.128; unit 1425 -->

【Return value】

<!-- Source EN PDF p.128; unit 1426 -->

| Return value | Description |
|---|---|
| 0 | succeed |
| Non-0 | Failed, see the error code table for details |

<!-- Source EN PDF p.128; unit 1427 -->

【Demand】

<!-- Source EN PDF p.128; unit 1428 -->

Header files:rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.128; unit 1429 -->

Library files:librkaiq.so

<!-- Source EN PDF p.128; unit 1430 -->

【Example】

<!-- Source EN PDF p.128; unit 1431 -->

Refer to sample_awb_module.cpp

<!-- Source EN PDF p.128; unit 1432 -->

#### 7.4.16  rk_aiq_uapi2_getAwbV30AllAttrib

<!-- Source EN PDF p.128; unit 1433 -->

【Description】 Get all the parameters supported by the White Balance API.

<!-- Source EN PDF p.128; unit 1434 -->

【Grammar】

<!-- Source EN PDF p.128; unit 1435 -->

```text
 XCamReturn rk_aiq_uapi2_getAwbV30AllAttrib(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_uapiV2_wbV30_attrib_t *attr);
```

<!-- Source EN PDF p.128; unit 1436 -->

【Parameter】

<!-- Source EN PDF p.128; unit 1437 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | input |
| attr | wbgain offset parameter | output |

<!-- Source EN PDF p.129; unit 1438 -->

【Return value】

<!-- Source EN PDF p.129; unit 1439 -->

| Return value | Description |
|---|---|
| 0 | succeed |
| Non-0 | Failed, see the error code table for details |

<!-- Source EN PDF p.129; unit 1440 -->

【Demand】

<!-- Source EN PDF p.129; unit 1441 -->

Header files:rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.129; unit 1442 -->

Library files:librkaiq.so

<!-- Source EN PDF p.129; unit 1443 -->

【Example】

<!-- Source EN PDF p.129; unit 1444 -->

Refer to sample_awb_module.cpp

<!-- Source EN PDF p.129; unit 1445 -->

### 7.5   Functional-level API data types

<!-- Source EN PDF p.129; unit 1446 -->

#### 7.5.1  rk_aiq_wb_op_mode_t

<!-- Source EN PDF p.129; unit 1447 -->

【Description】 Defines the white balance operating mode

<!-- Source EN PDF p.129; unit 1448 -->

【Definition】

<!-- Source EN PDF p.129; unit 1449 -->

```text
 typedef enum rk_aiq_wb_op_mode_s {
     RK_AIQ_WB_MODE_INVALID        = 0,
     RK_AIQ_WB_MODE_MANUAL         = 1,
     RK_AIQ_WB_MODE_AUTO           = 2,
     RK_AIQ_WB_MODE_MAX
 } rk_aiq_wb_op_mode_t;
```

<!-- Source EN PDF p.129; unit 1450 -->

【Member】

<!-- Source EN PDF p.129; unit 1451 -->

| Member Name | Description |
|---|---|
| RK_AIQ_WB_MODE_MANUAL | White balance manual mode |
| RK_AIQ_WB_MODE_AUTO | White balance auto mode |

<!-- Source EN PDF p.129; unit 1452 -->

#### 7.5.2  rk_aiq_wb_mwb_mode_t

<!-- Source EN PDF p.129; unit 1453 -->

【Description】 Defines the manual white balance mode type

<!-- Source EN PDF p.129; unit 1454 -->

【Definition】

<!-- Source EN PDF p.130; unit 1455 -->

```text
 typedef enum rk_aiq_wb_mwb_mode_e {
     RK_AIQ_MWB_MODE_INVAILD              = 0,
     RK_AIQ_MWB_MODE_CCT                  = 1,
     RK_AIQ_MWB_MODE_WBGAIN               = 2,
     RK_AIQ_MWB_MODE_SCENE                = 3,
 } rk_aiq_wb_mwb_mode_t;
```

<!-- Source EN PDF p.130; unit 1456 -->

【Member】

<!-- Source EN PDF p.130; unit 1457 -->

| Member Name | Description |
|---|---|
| RK_AIQ_MWB_MODE_CCT | Color temperature |
| RK_AIQ_MWB_MODE_WBGAIN | Gain factor |
| RK_AIQ_MWB_MODE_SCENE | Scenario |

<!-- Source EN PDF p.130; unit 1458 -->

#### 7.5.3  rk_aiq_wb_gain_t

<!-- Source EN PDF p.130; unit 1459 -->

【Description】 Define the white balance gain parameters

<!-- Source EN PDF p.130; unit 1460 -->

【Definition】

<!-- Source EN PDF p.130; unit 1461 -->

```text
 typedef struct rk_aiq_wb_gain_s {
     float rgain;
     float grgain;
     float gbgain;
     float bgain;
 } rk_aiq_wb_gain_t;
```

<!-- Source EN PDF p.130; unit 1462 -->

【Member】

<!-- Source EN PDF p.130; unit 1463 -->

| Member Name | Description |
|---|---|
| rgain | R channel gain |
| grgain | G-channel gain |
| gbgain | GB channel gain |
| bgain | B-channel gain |

<!-- Source EN PDF p.130; unit 1464 -->

#### 7.5.4  rk_aiq_wb_scene_t

<!-- Source EN PDF p.130; unit 1465 -->

【Description】 Define the white balance gain parameters

<!-- Source EN PDF p.130; unit 1466 -->

【Definition】

<!-- Source EN PDF p.131; unit 1467 -->

```text
 typedef enum rk_aiq_wb_scene_e {
     RK_AIQ_WBCT_INCANDESCENT = 0,
     RK_AIQ_WBCT_FLUORESCENT,
     RK_AIQ_WBCT_WARM_FLUORESCENT,
     RK_AIQ_WBCT_DAYLIGHT,
     RK_AIQ_WBCT_CLOUDY_DAYLIGHT,
     RK_AIQ_WBCT_TWILIGHT,
     RK_AIQ_WBCT_SHADE
 } rk_aiq_wb_scene_t;
```

<!-- Source EN PDF p.131; unit 1468 -->

【Member】

<!-- Source EN PDF p.131; unit 1469 -->

| Member Name | Description |
|---|---|
| RK_AIQ_WBCT_INCANDESCENT | Incandescent lamp |
| RK_AIQ_WBCT_FLUORESCENT | Fluorescent lamps |
| RK_AIQ_WBCT_WARM_FLUORESCENT | Warm fluorescent lamp |
| RK_AIQ_WBCT_DAYLIGHT | Daylight |
| RK_AIQ_WBCT_CLOUDY_DAYLIGHT | Cloudy |
| RK_AIQ_WBCT_TWILIGHT | Twilight |
| RK_AIQ_WBCT_SHADE | Shadow |

<!-- Source EN PDF p.131; unit 1470 -->

#### 7.5.5  rk_aiq_wb_cct_t

<!-- Source EN PDF p.131; unit 1471 -->

【Description】 Define the white balance gain parameters

<!-- Source EN PDF p.131; unit 1472 -->

【Definition】

<!-- Source EN PDF p.131; unit 1473 -->

```text
 typedef struct rk_aiq_wb_cct_s {
     float CCT;
     float CCRI;
 } rk_aiq_wb_cct_t;
```

<!-- Source EN PDF p.131; unit 1474 -->

【Member】

<!-- Source EN PDF p.131; unit 1475 -->

| Member Name | Description |
|---|---|
| CCT | Correlated color temperature |
| CCRI | Correlation color rendering index |

<!-- Source EN PDF p.132; unit 1476 -->

#### 7.5.6  rk_aiq_wb_mwb_attrib_t

<!-- Source EN PDF p.132; unit 1477 -->

【Description】 Define manual white balance properties

<!-- Source EN PDF p.132; unit 1478 -->

【Definition】

<!-- Source EN PDF p.132; unit 1479 -->

```text
 typedef struct rk_aiq_wb_mwb_attrib_s {
     rk_aiq_wb_mwb_mode_t mode;
     union MWBPara_u {
         rk_aiq_wb_gain_t gain;
         rk_aiq_wb_scene_t scene;
         rk_aiq_wb_cct_t cct;
     } para;
 } rk_aiq_wb_mwb_attrib_t;
```

<!-- Source EN PDF p.132; unit 1480 -->

【Member】

<!-- Source EN PDF p.132; unit 1481 -->

| Member Name | Description |
|---|---|
| mode | Mode selection |

<!-- Source EN PDF p.132; unit 1482 -->

#### 7.5.7  rk_aiq_uapiV2_wb_awb_wbGainOffset_t

<!-- Source EN PDF p.132; unit 1483 -->

【Description】 Define the auto white balance gain offset

<!-- Source EN PDF p.132; unit 1484 -->

【Definition】

<!-- Source EN PDF p.132; unit 1485 -->

```text
 typedef struct rk_aiq_uapiV2_wb_awb_wbGainOffset_s{
   rk_aiq_uapi_sync_t sync;
   CalibDbV2_Awb_gain_offset_cfg_t gainOffset;
 }rk_aiq_uapiV2_wb_awb_wbGainOffset_t;
```

<!-- Source EN PDF p.132; unit 1486 -->

【Member】

<!-- Source EN PDF p.132; unit 1487 -->

| Member name | Description |
|---|---|
| sync | Refer to rk_aiq_uapi_sync_t definition in the Overview/API Description section |
| gainOffset | See Description CalibDbV2_Awb_gain_offset_cfg_t Later |

<!-- Source EN PDF p.132; unit 1488 -->

#### 7.5.8  CalibDbV2_Awb_gain_offset_cfg_t

<!-- Source EN PDF p.132; unit 1489 -->

【Description】 Define the auto white balance gain offset

<!-- Source EN PDF p.132; unit 1490 -->

【Definition】

<!-- Source EN PDF p.133; unit 1491 -->

```text
 typedef struct CalibDbV2_Awb_gain_offset_cfg_s{
   bool enable;
   float offset[4];
 }CalibDbV2_Awb_gain_offset_cfg_t;
```

<!-- Source EN PDF p.133; unit 1492 -->

【Member】

<!-- Source EN PDF p.133; unit 1493 -->

| Member<br>name | Description |
|---|---|
| enable | The enable switch<br>takes a value of 0 or 1, which means no enable and enable |
| offset | wbgain and offset are added, and the offset range corresponding to R GR GB B channel is<br>determined by the addition of wbgain and offset, and the<br>range after adding wbgain and offset is in the range of [0,8] (ISP21) |

<!-- Source EN PDF p.133; unit 1494 -->

#### 7.5.9  rk_aiq_uapiV2_wb_awb_wbGainAdjust_t

<!-- Source EN PDF p.133; unit 1495 -->

【Description】 Define automatic white balance tonal adjustment parameters

<!-- Source EN PDF p.133; unit 1496 -->

【Definition】

<!-- Source EN PDF p.133; unit 1497 -->

```text
 typedef struct rk_aiq_uapiV2_wb_awb_wbGainAdjustLut_s {
   float lumaValue;
   int ct_grid_num;
   int cri_grid_num;
   float ct_in_range[2];//min,max, equal distance sapmle
   float cri_in_range[2];//min,max
   float *ct_lut_out;//size is ct_grid_num*cri_grid_num
   float *cri_lut_out;
 } rk_aiq_uapiV2_wb_awb_wbGainAdjustLut_t;
 typedef struct rk_aiq_uapiV2_wb_awb_wbGainAdjust_s {
   rk_aiq_uapi_sync_t sync;
   bool enable;
   rk_aiq_uapiV2_wb_awb_wbGainAdjustLut_t *lutAll;
   int lutAll_len;
 } rk_aiq_uapiV2_wb_awb_wbGainAdjust_t;
```

<!-- Source EN PDF p.133; unit 1498 -->

【Member】

<!-- Source EN PDF p.134; unit 1499 -->

| Member name | Description |
|---|---|
| sync | Refer to rk_aiq_uapi_sync_t definition in the Overview/API Description section |
| enable | The value of<br>tone adjustment enabled is 0 or 1, which means not enabled and enabled |
| lutAll | Different ambient brightness can be configured with different output color<br>temperature tables |
| lutAll_len | Specify the number of temperature tables |
| lutAll.ct_grid_num | The number of<br>sampling points for the color temperature input into the color temperature table is<br>unlimited |
| lutAll.ct_in_range | The range<br>of color temperature entered into the color temperature table is not limited |
| lutAll.cri_grid_num | The number of<br>sampling points for the color rendering index of the input color temperature table is<br>not limited |
| lutAll.cri_in_range | The range<br>of the color rendering index of the input color temperature table is not limited |
| lutAll.ct_out | As shown in the tool interface diagram, the ct value of each dot is from left to right<br>(hue from cold to warm), that is, the value range of CT from small to large<br>is 0-255000 |
| lutAll.cri_out | As shown in the tool interface diagram, the cri of each dot is from bottom to top<br>(hue from purple to green), that is, the CRI from negative number to positive<br>number **<br>The range of values is not limited |

<!-- Source EN PDF p.134; unit 1500 -->

For more instructions, refer to the WBGain color adjustment chapter in the Rockchip_Color_Optimization_Guide documentation

<!-- Source EN PDF p.134; unit 1501 -->

#### 7.5.10  rk_aiq_uapiV2_wbV30_awb_attrib_t

<!-- Source EN PDF p.134; unit 1502 -->

【Description】 Define auto white balance API parameters

<!-- Source EN PDF p.134; unit 1503 -->

【Definition】

<!-- Source EN PDF p.134; unit 1504 -->

```text
 typedef struct rk_aiq_uapiV2_wbV30_awb_attrib_s {
     rk_aiq_uapiV2_wb_awb_wbGainAdjust_t wbGainAdjust;
     CalibDbV2_Awb_gain_offset_cfg_t wbGainOffset;
 } rk_aiq_uapiV2_wbV30_awb_attrib_t;
```

<!-- Source EN PDF p.134; unit 1505 -->

【Member】

<!-- Source EN PDF p.135; unit 1506 -->

| Member name | Description |
|---|---|
| wbGainAdjust | Refer to the CalibDbV2_Awb_gain_offset_cfg_t |
| wbGainOffset | Refer to the rk_aiq_uapiV2_wb_awb_wbGainAdjust_t |
| multiWindow | Refer to the rk_aiq_uapiV2_wbV32_awb_mulWindow_t |

<!-- Source EN PDF p.135; unit 1507 -->

#### 7.5.11  rk_aiq_uapiV2_wbV32_attrib_t

<!-- Source EN PDF p.135; unit 1508 -->

【Description】 Define all parameters supported by the White Balance API.

<!-- Source EN PDF p.135; unit 1509 -->

【Definition】

<!-- Source EN PDF p.135; unit 1510 -->

```text
 typedef struct rk_aiq_uapiV2_wbV30_attrib_s {
     rk_aiq_uapi_sync_t sync;
     bool byPass;
     rk_aiq_wb_op_mode_t mode;
     rk_aiq_wb_mwb_attrib_t stManual;
     rk_aiq_uapiV2_wbV30_awb_attrib_t stAuto;
 } rk_aiq_uapiV2_wbV30_attrib_t;
```

<!-- Source EN PDF p.135; unit 1511 -->

【Member】

<!-- Source EN PDF p.135; unit 1512 -->

| Member<br>name | Description |
|---|---|
| sync | For rk_aiq_uapi_sync_t description, see **Overview/API Description】 section |
| bypass | The value 0 or 1 0 means to do white balance correction, and the white balance<br>gain used is controlled by the parameter control at the end of the table<br>, 1 means that no white balance correction is performed |
| mode | For automatic or manual white balance mode control parameters, refer to<br>rk_aiq_wb_op_mode_t |
| stManual | For manual white balance parameters, refer to rk_aiq_wb_mwb_attrib_t |
| stAuto | For auto white balance parameters, refer to rk_aiq_uapiV2_wbV21_awb_attrib_t |

<!-- Source EN PDF p.135; unit 1513 -->

### 7.6   Module-level API reference

<!-- Source EN PDF p.135; unit 1514 -->

#### 7.6.1  rk_aiq_user_api2_awbV30_SetAllAttrib

<!-- Source EN PDF p.135; unit 1515 -->

【Description】 Set all parameters supported by the White Balance API.

<!-- Source EN PDF p.135; unit 1516 -->

【Grammar】

<!-- Source EN PDF p.136; unit 1517 -->

```text
 XCamReturn
 rk_aiq_user_api2_awbV30_SetAllAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapiV2_wbV30_attrib_t attr);
```

<!-- Source EN PDF p.136; unit 1518 -->

【Parameters】

<!-- Source EN PDF p.136; unit 1519 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | All parameters supported by the White Balance API | Output |

<!-- Source EN PDF p.136; unit 1520 -->

【Return Value】

<!-- Source EN PDF p.136; unit 1521 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.136; unit 1522 -->

【Requirements】

<!-- Source EN PDF p.136; unit 1523 -->

Header files: rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.136; unit 1524 -->

Library file: librkaiq.so

<!-- Source EN PDF p.136; unit 1525 -->

【Example】

<!-- Source EN PDF p.136; unit 1526 -->

Reference sample_awb_module.cpp

<!-- Source EN PDF p.136; unit 1527 -->

#### 7.6.2  rk_aiq_user_api2_awbV30_GetAllAttrib

<!-- Source EN PDF p.136; unit 1528 -->

【Description】 Get all parameters supported by the White Balance API.

<!-- Source EN PDF p.136; unit 1529 -->

【Grammar】

<!-- Source EN PDF p.136; unit 1530 -->

```text
 XCamReturn
 rk_aiq_user_api2_awbV30_GetAllAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapiV2_wbV30_attrib_t *attr);
```

<!-- Source EN PDF p.136; unit 1531 -->

【Parameters】

<!-- Source EN PDF p.136; unit 1532 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | All parameters supported by the White Balance API | Output |

<!-- Source EN PDF p.136; unit 1533 -->

【Return Value】

<!-- Source EN PDF p.137; unit 1534 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.137; unit 1535 -->

【Requirements】

<!-- Source EN PDF p.137; unit 1536 -->

Header files: rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.137; unit 1537 -->

Library file: librkaiq.so

<!-- Source EN PDF p.137; unit 1538 -->

【Example】

<!-- Source EN PDF p.137; unit 1539 -->

Reference sample_awb_module.cpp

<!-- Source EN PDF p.137; unit 1540 -->

#### 7.6.3  rk_aiq_user_api2_awb_GetCCT

<!-- Source EN PDF p.137; unit 1541 -->

【Description】 Get the white balance color temperature. This function is used both automatically and manually

<!-- Source EN PDF p.137; unit 1542 -->

【Grammar】

<!-- Source EN PDF p.137; unit 1543 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_GetCCT(const rk_aiq_sys_ctx_t* sys_ctx, rk_aiq_wb_cct_t
 *cct);
```

<!-- Source EN PDF p.137; unit 1544 -->

【Parameters】

<!-- Source EN PDF p.137; unit 1545 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| cct | Color temperature parameters for white balance | Output |

<!-- Source EN PDF p.137; unit 1546 -->

【Return Value】

<!-- Source EN PDF p.137; unit 1547 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.137; unit 1548 -->

【Requirements】

<!-- Source EN PDF p.137; unit 1549 -->

Header files: rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.137; unit 1550 -->

Library file: librkaiq.so

<!-- Source EN PDF p.137; unit 1551 -->

【Example】

<!-- Source EN PDF p.137; unit 1552 -->

Reference sample_awb_module.cpp

<!-- Source EN PDF p.138; unit 1553 -->

#### 7.6.4  rk_aiq_user_api2_awb_QueryWBInfo

<!-- Source EN PDF p.138; unit 1554 -->

【Description】 Get the white balance gain factor, color temperature.

<!-- Source EN PDF p.138; unit 1555 -->

【Grammar】

<!-- Source EN PDF p.138; unit 1556 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_QueryWBInfo(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_wb_querry_info_t *wb_querry_info);
```

<!-- Source EN PDF p.138; unit 1557 -->

【Parameters】

<!-- Source EN PDF p.138; unit 1558 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| wb_querry_info | Color-dependent status parameters | Output |

<!-- Source EN PDF p.138; unit 1559 -->

【Return Value】

<!-- Source EN PDF p.138; unit 1560 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.138; unit 1561 -->

【Requirements】

<!-- Source EN PDF p.138; unit 1562 -->

Header files: rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.138; unit 1563 -->

Library file: librkaiq.so

<!-- Source EN PDF p.138; unit 1564 -->

【Example】

<!-- Source EN PDF p.138; unit 1565 -->

Reference sample_awb_module.cpp

<!-- Source EN PDF p.138; unit 1566 -->

#### 7.6.5  rk_aiq_user_api2_awb_Lock

<!-- Source EN PDF p.138; unit 1567 -->

【Description】 Locks the current white balance parameters.

<!-- Source EN PDF p.138; unit 1568 -->

【Grammar】

<!-- Source EN PDF p.138; unit 1569 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_Lock(const rk_aiq_sys_ctx_t* sys_ctx);
```

<!-- Source EN PDF p.138; unit 1570 -->

【Parameters】

<!-- Source EN PDF p.138; unit 1571 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |

<!-- Source EN PDF p.139; unit 1572 -->

【Return Value】

<!-- Source EN PDF p.139; unit 1573 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.139; unit 1574 -->

【Requirements】

<!-- Source EN PDF p.139; unit 1575 -->

Header files: rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.139; unit 1576 -->

Library file: librkaiq.so

<!-- Source EN PDF p.139; unit 1577 -->

【Example】

<!-- Source EN PDF p.139; unit 1578 -->

Reference sample_awb_module.cpp

<!-- Source EN PDF p.139; unit 1579 -->

#### 7.6.6  rk_aiq_user_api2_awb_Unlock

<!-- Source EN PDF p.139; unit 1580 -->

【Description】 Unlock locked white balance parameters.

<!-- Source EN PDF p.139; unit 1581 -->

【Grammar】

<!-- Source EN PDF p.139; unit 1582 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_Lock(const rk_aiq_sys_ctx_t* sys_ctx);
```

<!-- Source EN PDF p.139; unit 1583 -->

【Parameters】

<!-- Source EN PDF p.139; unit 1584 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |

<!-- Source EN PDF p.139; unit 1585 -->

【Return Value】

<!-- Source EN PDF p.139; unit 1586 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.139; unit 1587 -->

【Requirements】

<!-- Source EN PDF p.139; unit 1588 -->

Header files: rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.139; unit 1589 -->

Library file: librkaiq.so

<!-- Source EN PDF p.139; unit 1590 -->

【Example】

<!-- Source EN PDF p.139; unit 1591 -->

Reference sample_awb_module.cpp

<!-- Source EN PDF p.140; unit 1592 -->

#### 7.6.7  rk_aiq_user_api2_awb_SetWpModeAttrib

<!-- Source EN PDF p.140; unit 1593 -->

【Description】 Set the white balance operating mode.

<!-- Source EN PDF p.140; unit 1594 -->

【Grammar】

<!-- Source EN PDF p.140; unit 1595 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_SetWpModeAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapiV2_wb_opMode_t attr);
```

<!-- Source EN PDF p.140; unit 1596 -->

【Parameters】

<!-- Source EN PDF p.140; unit 1597 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | White balance operating mode | Output |

<!-- Source EN PDF p.140; unit 1598 -->

【Return Value】

<!-- Source EN PDF p.140; unit 1599 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.140; unit 1600 -->

【Requirements】

<!-- Source EN PDF p.140; unit 1601 -->

Header files: rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.140; unit 1602 -->

Library file: librkaiq.so

<!-- Source EN PDF p.140; unit 1603 -->

【Example】

<!-- Source EN PDF p.140; unit 1604 -->

Reference sample_awb_module.cpp

<!-- Source EN PDF p.140; unit 1605 -->

#### 7.6.8  rk_aiq_user_api2_awb_GetWpModeAttrib

<!-- Source EN PDF p.140; unit 1606 -->

【Description】 Gets the white balance operating mode.

<!-- Source EN PDF p.140; unit 1607 -->

【Grammar】

<!-- Source EN PDF p.140; unit 1608 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_GetWpModeAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapiV2_wb_opMode_t *attr);
```

<!-- Source EN PDF p.140; unit 1609 -->

【Parameters】

<!-- Source EN PDF p.141; unit 1610 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | White balance operating mode | Output |

<!-- Source EN PDF p.141; unit 1611 -->

【Return Value】

<!-- Source EN PDF p.141; unit 1612 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.141; unit 1613 -->

【Requirements】

<!-- Source EN PDF p.141; unit 1614 -->

Header files: rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.141; unit 1615 -->

Library file: librkaiq.so

<!-- Source EN PDF p.141; unit 1616 -->

【Example】

<!-- Source EN PDF p.141; unit 1617 -->

Reference sample_awb_module.cpp

<!-- Source EN PDF p.141; unit 1618 -->

#### 7.6.9  rk_aiq_user_api2_awb_SetMwbAttrib

<!-- Source EN PDF p.141; unit 1619 -->

【Description】 Set manual white balance parameters.

<!-- Source EN PDF p.141; unit 1620 -->

【Grammar】

<!-- Source EN PDF p.141; unit 1621 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_SetMwbAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_wb_mwb_attrib_t attr);
```

<!-- Source EN PDF p.141; unit 1622 -->

【Parameters】

<!-- Source EN PDF p.141; unit 1623 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | Manual white balance parameters | Input |

<!-- Source EN PDF p.141; unit 1624 -->

【Return Value】

<!-- Source EN PDF p.141; unit 1625 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.141; unit 1626 -->

【Requirements】

<!-- Source EN PDF p.141; unit 1627 -->

Header files: rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.142; unit 1628 -->

Library file: librkaiq.so

<!-- Source EN PDF p.142; unit 1629 -->

【Example】

<!-- Source EN PDF p.142; unit 1630 -->

Reference sample_awb_module.cpp

<!-- Source EN PDF p.142; unit 1631 -->

#### 7.6.10  rk_aiq_user_api2_awb_GetMwbAttrib

<!-- Source EN PDF p.142; unit 1632 -->

【Description】 Set manual white balance parameters.

<!-- Source EN PDF p.142; unit 1633 -->

【Grammar】

<!-- Source EN PDF p.142; unit 1634 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_SetMwbAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_wb_mwb_attrib_t attr);
```

<!-- Source EN PDF p.142; unit 1635 -->

【Parameters】

<!-- Source EN PDF p.142; unit 1636 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | Manual white balance parameters | Input |

<!-- Source EN PDF p.142; unit 1637 -->

【Return Value】

<!-- Source EN PDF p.142; unit 1638 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.142; unit 1639 -->

【Requirements】

<!-- Source EN PDF p.142; unit 1640 -->

Header files: rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.142; unit 1641 -->

Library file: librkaiq.so

<!-- Source EN PDF p.142; unit 1642 -->

【Example】

<!-- Source EN PDF p.142; unit 1643 -->

Reference sample_awb_module.cpp

<!-- Source EN PDF p.142; unit 1644 -->

#### 7.6.11  rk_aiq_user_api2_awb_SetWbGainAdjustAttrib

<!-- Source EN PDF p.142; unit 1645 -->

【Description】 Sets the tone adjustment parameters in auto white balance mode.

<!-- Source EN PDF p.142; unit 1646 -->

【Grammar】

<!-- Source EN PDF p.142; unit 1647 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_SetWbGainAdjustAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapiV2_wb_awb_wbGainAdjust_t attr);
```

<!-- Source EN PDF p.143; unit 1648 -->

【Parameters】

<!-- Source EN PDF p.143; unit 1649 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | Tone adjustment parameters | Input |

<!-- Source EN PDF p.143; unit 1650 -->

【Return Value】

<!-- Source EN PDF p.143; unit 1651 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.143; unit 1652 -->

【Requirements】

<!-- Source EN PDF p.143; unit 1653 -->

Header files: rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.143; unit 1654 -->

Library file: librkaiq.so

<!-- Source EN PDF p.143; unit 1655 -->

【Example】

<!-- Source EN PDF p.143; unit 1656 -->

Reference sample_awb_module.cpp

<!-- Source EN PDF p.143; unit 1657 -->

#### 7.6.12  rk_aiq_user_api2_awb_GetWbGainAdjustAttrib

<!-- Source EN PDF p.143; unit 1658 -->

【Description】 Gets the tone adjustment parameters in auto white balance mode.

<!-- Source EN PDF p.143; unit 1659 -->

【Grammar】

<!-- Source EN PDF p.143; unit 1660 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_GetWbGainAdjustAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapiV2_wb_awb_wbGainAdjust_t *attr);
```

<!-- Source EN PDF p.143; unit 1661 -->

【Parameters】

<!-- Source EN PDF p.143; unit 1662 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | Tone adjustment parameters | Input |

<!-- Source EN PDF p.143; unit 1663 -->

【Return Value】

<!-- Source EN PDF p.143; unit 1664 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.143; unit 1665 -->

【Requirements】

<!-- Source EN PDF p.144; unit 1666 -->

Header files: rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.144; unit 1667 -->

Library file: librkaiq.so

<!-- Source EN PDF p.144; unit 1668 -->

【Example】

<!-- Source EN PDF p.144; unit 1669 -->

Reference sample_awb_module.cpp

<!-- Source EN PDF p.144; unit 1670 -->

#### 7.6.13  rk_aiq_user_api2_awb_SetWbGainOffsetAttrib

<!-- Source EN PDF p.144; unit 1671 -->

【Description】 Sets the offset of the auto white balance gain

<!-- Source EN PDF p.144; unit 1672 -->

【Grammar】

<!-- Source EN PDF p.144; unit 1673 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_SetWbGainOffsetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapiV2_wb_awb_wbGainOffset_t attr);
```

<!-- Source EN PDF p.144; unit 1674 -->

【Parameters】

<!-- Source EN PDF p.144; unit 1675 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | Tone adjustment parameters | Input |

<!-- Source EN PDF p.144; unit 1676 -->

【Return Value】

<!-- Source EN PDF p.144; unit 1677 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.144; unit 1678 -->

【Requirements】

<!-- Source EN PDF p.144; unit 1679 -->

Header files: rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.144; unit 1680 -->

Library file: librkaiq.so

<!-- Source EN PDF p.144; unit 1681 -->

【Example】

<!-- Source EN PDF p.144; unit 1682 -->

Reference sample_awb_module.cpp

<!-- Source EN PDF p.144; unit 1683 -->

#### 7.6.14  rk_aiq_user_api2_awb_GetWbGainOffsetAttrib

<!-- Source EN PDF p.144; unit 1684 -->

【Description】 Gets the offset of the auto white balance gain

<!-- Source EN PDF p.144; unit 1685 -->

【Grammar】

<!-- Source EN PDF p.145; unit 1686 -->

```text
 XCamReturn
 rk_aiq_user_api2_awb_GetWbGainOffsetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapiV2_wb_awb_wbGainOffset_t *attr);
```

<!-- Source EN PDF p.145; unit 1687 -->

【Parameters】

<!-- Source EN PDF p.145; unit 1688 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | Tone adjustment parameters | Input |

<!-- Source EN PDF p.145; unit 1689 -->

【Return Value】

<!-- Source EN PDF p.145; unit 1690 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.145; unit 1691 -->

【Requirements】

<!-- Source EN PDF p.145; unit 1692 -->

Header files: rk_aiq_user_api2_awb.h, rk_aiq_uapi2_awb_int.h

<!-- Source EN PDF p.145; unit 1693 -->

Library file: librkaiq.so

<!-- Source EN PDF p.145; unit 1694 -->

【Example】

<!-- Source EN PDF p.145; unit 1695 -->

Reference sample_awb_module.cpp

<!-- Source EN PDF p.145; unit 1696 -->

### 7.7   Module-level API data types

<!-- Source EN PDF p.145; unit 1697 -->

#### 7.7.1  rk_aiq_wb_querry_info_t

<!-- Source EN PDF p.145; unit 1698 -->

【Description】 Define white balance query information

<!-- Source EN PDF p.145; unit 1699 -->

【Definition】

<!-- Source EN PDF p.145; unit 1700 -->

```text
 typedef struct rk_aiq_wb_querry_info_s {
     rk_aiq_wb_gain_t gain;
     rk_aiq_wb_cct_t cctGloabl;
     bool awbConverged;
     uint32_t LVValue;
 } rk_aiq_wb_querry_info_t;
```

<!-- Source EN PDF p.145; unit 1701 -->

【Member】

<!-- Source EN PDF p.146; unit 1702 -->

| Member Name | Description |
|---|---|
| gain | Gain |
| cctGloabl | Global Color Temperature Parameter |
| LVValue | Related ambient brightness |

<!-- Source EN PDF p.146; unit 1703 -->

#### 7.7.2  rk_aiq_wb_op_mode_t

<!-- Source EN PDF p.146; unit 1704 -->

【Description】 Defines the white balance operating mode

<!-- Source EN PDF p.146; unit 1705 -->

【Definition】

<!-- Source EN PDF p.146; unit 1706 -->

```text
 typedef struct rk_aiq_uapiV2_wb_opMode_s {
   rk_aiq_uapi_sync_t sync;
   rk_aiq_wb_op_mode_t mode;
 } rk_aiq_uapiV2_wb_opMode_t;
```

<!-- Source EN PDF p.146; unit 1707 -->

【Member】

<!-- Source EN PDF p.146; unit 1708 -->

| Member Name | Description |
|---|---|
| sync | For rk_aiq_uapi_sync_t description, see **Overview/API Description】 section |
| mode | Refer to rk_aiq_wb_op_mode_t Description |

<!-- Source EN PDF p.146; unit 1709 -->

#### 7.7.3  rk_aiq_wb_mwb_attrib_t

<!-- Source EN PDF p.146; unit 1710 -->

【Description】 Define manual white balance properties

<!-- Source EN PDF p.146; unit 1711 -->

【Definition】

<!-- Source EN PDF p.146; unit 1712 -->

```text
 typedef struct rk_aiq_wb_mwb_attrib_s {
      rk_aiq_uapi_sync_t sync;
     rk_aiq_wb_mwb_mode_t mode;
     union MWBPara_u {
         rk_aiq_wb_gain_t gain;
         rk_aiq_wb_scene_t scene;
         rk_aiq_wb_cct_t cct;
     } para;
 } rk_aiq_wb_mwb_attrib_t;
```

<!-- Source EN PDF p.146; unit 1713 -->

【Member】

<!-- Source EN PDF p.147; unit 1714 -->

| Member Name | Description |
|---|---|
| sync | For rk_aiq_uapi_sync_t definitions, see Overview/API Description section |
| mode | Mode selection |
| para | Parameter configuration for the mode |

<!-- Source EN PDF p.147; unit 1715 -->

## 8.   AF

<!-- Source EN PDF p.147; unit 1716 -->

### 8.1   Overview

<!-- Source EN PDF p.147; unit 1717 -->

The function of the AF module refers to the process of adjusting the camera lens so that the image of the subject is clear.

<!-- Source EN PDF p.147; unit 1718 -->

### 8.2   Description of the feature

<!-- Source EN PDF p.147; unit 1719 -->

The AF module consists of two parts: AF information statistics and AF control algorithm. The figure below shows the block diagram of the AF information statistics module

<!-- Source EN PDF p.147; unit 1720 -->

![Original technical figure — PDF p.147](/docs/rockchip-isp30-development/assets/en-p147-X1161.png)

<!-- Source EN PDF p.147; unit 1721 -->

Among them, ch0/ch1/ch2 corresponds to the S/M/L frame in HDR mode, and debayer is the composite frame in HDR mode.

<!-- Source EN PDF p.147; unit 1722 -->

The output of windowA mainly contains 15\*15 V1/V2/H1/H2 FV information, brightness information and highlight count.

<!-- Source EN PDF p.147; unit 1723 -->

The output of windowB mainly contains an FV information, brightness information, and highlight count.

<!-- Source EN PDF p.148; unit 1724 -->

### 8.3   Development of userAF algorithms

<!-- Source EN PDF p.148; unit 1725 -->

![Original technical figure — PDF p.148](/docs/rockchip-isp30-development/assets/en-p148-X1167.png)

<!-- Source EN PDF p.148; unit 1726 -->

Reference code location: sdk: external/camera_engine_rkaiq/rkisp_demo/demo/af_algo_demo

<!-- Source EN PDF p.148; unit 1727 -->

### 8.4   Feature-level API reference

<!-- Source EN PDF p.148; unit 1728 -->

#### 8.4.1  rk_aiq_uapi2_setFocusMode

<!-- Source EN PDF p.148; unit 1729 -->

【Description】 ：Configure the focus mode.

<!-- Source EN PDF p.148; unit 1730 -->

【Grammar】

<!-- Source EN PDF p.148; unit 1731 -->

```text
 XCamReturn rk_aiq_uapi2_setFocusMode(const rk_aiq_sys_ctx_t* ctx, opMode_t mode);
```

<!-- Source EN PDF p.148; unit 1732 -->

【Parameters】

<!-- Source EN PDF p.148; unit 1733 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| mode | Focus mode | Input |

<!-- Source EN PDF p.148; unit 1734 -->

【Return Value】

<!-- Source EN PDF p.148; unit 1735 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.148; unit 1736 -->

【Requirements】

<!-- Source EN PDF p.148; unit 1737 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.148; unit 1738 -->

Library file: librkaiq.so

<!-- Source EN PDF p.149; unit 1739 -->

#### 8.4.2  rk_aiq_uapi2_getFocusMode

<!-- Source EN PDF p.149; unit 1740 -->

【Description】: Gets the current focus mode.

<!-- Source EN PDF p.149; unit 1741 -->

【Grammar】

<!-- Source EN PDF p.149; unit 1742 -->

```text
 XCamReturn rk_aiq_uapi2_getFocusMode(const rk_aiq_sys_ctx_t* ctx, opMode_t
 *mode);
```

<!-- Source EN PDF p.149; unit 1743 -->

【Parameters】

<!-- Source EN PDF p.149; unit 1744 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| mode | Focus mode | Output |

<!-- Source EN PDF p.149; unit 1745 -->

【Return Value】

<!-- Source EN PDF p.149; unit 1746 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.149; unit 1747 -->

【Requirements】

<!-- Source EN PDF p.149; unit 1748 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.149; unit 1749 -->

Library file: librkaiq.so

<!-- Source EN PDF p.149; unit 1750 -->

#### 8.4.3  rk_aiq_uapi2_setFocusWin

<!-- Source EN PDF p.149; unit 1751 -->

【Description】 Set the autofocus window.

<!-- Source EN PDF p.149; unit 1752 -->

【Grammar】

<!-- Source EN PDF p.149; unit 1753 -->

```text
 XCamReturn rk_aiq_uapi2_setFocusWin(const rk_aiq_sys_ctx_t* ctx, paRect_t *rect);
```

<!-- Source EN PDF p.149; unit 1754 -->

【Parameters】

<!-- Source EN PDF p.149; unit 1755 -->

| Parameter<br>Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| rect | Focus window, the value range is determined by the sensor input<br>size | Input |

<!-- Source EN PDF p.149; unit 1756 -->

【Return Value】

<!-- Source EN PDF p.150; unit 1757 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.150; unit 1758 -->

【Requirements】

<!-- Source EN PDF p.150; unit 1759 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.150; unit 1760 -->

Library file: librkaiq.so

<!-- Source EN PDF p.150; unit 1761 -->

#### 8.4.4  rk_aiq_uapi2_getFocusWin

<!-- Source EN PDF p.150; unit 1762 -->

【Description】 Set the autofocus window.

<!-- Source EN PDF p.150; unit 1763 -->

【Grammar】

<!-- Source EN PDF p.150; unit 1764 -->

```text
 XCamReturn rk_aiq_uapi2_getFocusWin(const rk_aiq_sys_ctx_t* ctx, paRect_t *rect);
```

<!-- Source EN PDF p.150; unit 1765 -->

【Parameters】

<!-- Source EN PDF p.150; unit 1766 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| rect | Focus window | Output |

<!-- Source EN PDF p.150; unit 1767 -->

【Return Value】

<!-- Source EN PDF p.150; unit 1768 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.150; unit 1769 -->

【Requirements】

<!-- Source EN PDF p.150; unit 1770 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.150; unit 1771 -->

Library file: librkaiq.so

<!-- Source EN PDF p.150; unit 1772 -->

#### 8.4.5  rk_aiq_uapi2_lockFocus

<!-- Source EN PDF p.150; unit 1773 -->

【Description】 ：Lock autofocus, focus pause action.

<!-- Source EN PDF p.150; unit 1774 -->

【Grammar】

<!-- Source EN PDF p.150; unit 1775 -->

```text
 XCamReturn rk_aiq_uapi2_lockFocus(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.150; unit 1776 -->

【Parameters】

<!-- Source EN PDF p.151; unit 1777 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |

<!-- Source EN PDF p.151; unit 1778 -->

【Return Value】

<!-- Source EN PDF p.151; unit 1779 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.151; unit 1780 -->

【Requirements】

<!-- Source EN PDF p.151; unit 1781 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.151; unit 1782 -->

Library file: librkaiq.so

<!-- Source EN PDF p.151; unit 1783 -->

#### 8.4.6  rk_aiq_uapi2_unlockFocus

<!-- Source EN PDF p.151; unit 1784 -->

【Description】 Unlock autofocus, focus continues action.

<!-- Source EN PDF p.151; unit 1785 -->

【Grammar】

<!-- Source EN PDF p.151; unit 1786 -->

```text
 XCamReturn rk_aiq_uapi2_unlockFocus(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.151; unit 1787 -->

【Parameters】

<!-- Source EN PDF p.151; unit 1788 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |

<!-- Source EN PDF p.151; unit 1789 -->

【Return Value】

<!-- Source EN PDF p.151; unit 1790 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.151; unit 1791 -->

【Requirements】

<!-- Source EN PDF p.151; unit 1792 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.151; unit 1793 -->

Library file: librkaiq.so

<!-- Source EN PDF p.151; unit 1794 -->

#### 8.4.7  rk_aiq_uapi2_oneshotFocus

<!-- Source EN PDF p.151; unit 1795 -->

【Description】 Trigger a single focus, after the focus is completed, the focus will not continue.

<!-- Source EN PDF p.151; unit 1796 -->

【Grammar】

<!-- Source EN PDF p.152; unit 1797 -->

```text
 XCamReturn rk_aiq_uapi2_oneshotFocus(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.152; unit 1798 -->

【Parameters】

<!-- Source EN PDF p.152; unit 1799 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |

<!-- Source EN PDF p.152; unit 1800 -->

【Return Value】

<!-- Source EN PDF p.152; unit 1801 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.152; unit 1802 -->

【Requirements】

<!-- Source EN PDF p.152; unit 1803 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.152; unit 1804 -->

Library file: librkaiq.so

<!-- Source EN PDF p.152; unit 1805 -->

#### 8.4.8  rk_aiq_uapi2_manualTrigerFocus

<!-- Source EN PDF p.152; unit 1806 -->

【Description】 Manually trigger focus, after the focus is completed, continue to monitor whether the picture is blurry, if the picture is blurry, perform focus again.

<!-- Source EN PDF p.152; unit 1807 -->

【Grammar】

<!-- Source EN PDF p.152; unit 1808 -->

```text
 XCamReturn rk_aiq_uapi2_manualTrigerFocus(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.152; unit 1809 -->

【Parameters】

<!-- Source EN PDF p.152; unit 1810 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |

<!-- Source EN PDF p.152; unit 1811 -->

【Return Value】

<!-- Source EN PDF p.152; unit 1812 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.152; unit 1813 -->

【Requirements】

<!-- Source EN PDF p.152; unit 1814 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.152; unit 1815 -->

Library file: librkaiq.so

<!-- Source EN PDF p.153; unit 1816 -->

#### 8.4.9  rk_aiq_uapi2_trackingFocus

<!-- Source EN PDF p.153; unit 1817 -->

【Description】 Continue to monitor whether the picture is blurry, if the picture is blurry, perform focus again, generally use after rk_aiq_uapi2_oneshotFocus.

<!-- Source EN PDF p.153; unit 1818 -->

【Grammar】

<!-- Source EN PDF p.153; unit 1819 -->

```text
 XCamReturn rk_aiq_uapi2_trackingFocus(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.153; unit 1820 -->

【Parameters】

<!-- Source EN PDF p.153; unit 1821 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |

<!-- Source EN PDF p.153; unit 1822 -->

【Return Value】

<!-- Source EN PDF p.153; unit 1823 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.153; unit 1824 -->

【Requirements】

<!-- Source EN PDF p.153; unit 1825 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.153; unit 1826 -->

Library file: librkaiq.so

<!-- Source EN PDF p.153; unit 1827 -->

#### 8.4.10  rk_aiq_uapi2_getSearchResult

<!-- Source EN PDF p.153; unit 1828 -->

【Description】 Get the focus result.

<!-- Source EN PDF p.153; unit 1829 -->

【Grammar】

<!-- Source EN PDF p.153; unit 1830 -->

```text
 XCamReturn rk_aiq_uapi2_getSearchResult(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_af_result_t* result);
```

<!-- Source EN PDF p.153; unit 1831 -->

【Parameters】

<!-- Source EN PDF p.153; unit 1832 -->

| Parameter<br>Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| result | For focusing results, refer to the description of the structure<br>rk_aiq_af_result_t | Output |

<!-- Source EN PDF p.153; unit 1833 -->

【Return Value】

<!-- Source EN PDF p.154; unit 1834 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.154; unit 1835 -->

【Requirements】

<!-- Source EN PDF p.154; unit 1836 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.154; unit 1837 -->

Library file: librkaiq.so

<!-- Source EN PDF p.154; unit 1838 -->

#### 8.4.11  rk_aiq_uapi2_getZoomRange

<!-- Source EN PDF p.154; unit 1839 -->

【Description】Gets the zoom range value, which is used to limit the zoom code parameters rk_aiq_uapi_setOpZoomPosition input.

<!-- Source EN PDF p.154; unit 1840 -->

【Grammar】

<!-- Source EN PDF p.154; unit 1841 -->

```text
 XCamReturn rk_aiq_uapi2_getZoomRange(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_af_zoomrange* range);
```

<!-- Source EN PDF p.154; unit 1842 -->

【Parameters】

<!-- Source EN PDF p.154; unit 1843 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| range | Zoom movable range, refer to structure rk_aiq_af_zoomrange | Output |

<!-- Source EN PDF p.154; unit 1844 -->

【Return Value】

<!-- Source EN PDF p.154; unit 1845 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.154; unit 1846 -->

【Requirements】

<!-- Source EN PDF p.154; unit 1847 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.154; unit 1848 -->

Library file: librkaiq.so

<!-- Source EN PDF p.154; unit 1849 -->

#### 8.4.12  rk_aiq_uapi2_setOpZoomPosition

<!-- Source EN PDF p.154; unit 1850 -->

【Description】 Set zoom position, modify zoom position.

<!-- Source EN PDF p.154; unit 1851 -->

【Grammar】

<!-- Source EN PDF p.154; unit 1852 -->

```text
 XCamReturn rk_aiq_uapi2_setOpZoomPosition(const rk_aiq_sys_ctx_t* ctx, int pos);
```

<!-- Source EN PDF p.154; unit 1853 -->

【Parameters】

<!-- Source EN PDF p.155; unit 1854 -->

| Parameter<br>Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| pos | zoom position, the value range is determined by<br>rk_aiq_uapi2_getZoomRange | Input |

<!-- Source EN PDF p.155; unit 1855 -->

【Return Value】

<!-- Source EN PDF p.155; unit 1856 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.155; unit 1857 -->

【Requirements】

<!-- Source EN PDF p.155; unit 1858 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.155; unit 1859 -->

Library file: librkaiq.so

<!-- Source EN PDF p.155; unit 1860 -->

#### 8.4.13  rk_aiq_uapi2_getOpZoomPosition

<!-- Source EN PDF p.155; unit 1861 -->

【Description】 Get the zoom location.

<!-- Source EN PDF p.155; unit 1862 -->

【Grammar】

<!-- Source EN PDF p.155; unit 1863 -->

```text
 XCamReturn rk_aiq_uapi2_getOpZoomPosition(const rk_aiq_sys_ctx_t* ctx, int *pos);
```

<!-- Source EN PDF p.155; unit 1864 -->

【Parameters】

<!-- Source EN PDF p.155; unit 1865 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| pos | zoom position | Output |

<!-- Source EN PDF p.155; unit 1866 -->

【Return Value】

<!-- Source EN PDF p.155; unit 1867 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.155; unit 1868 -->

【Requirements】

<!-- Source EN PDF p.155; unit 1869 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.155; unit 1870 -->

Library file: librkaiq.so

<!-- Source EN PDF p.156; unit 1871 -->

#### 8.4.14  rk_aiq_uapi2_endOpZoomChange

<!-- Source EN PDF p.156; unit 1872 -->

【Description】 End the setting of the zoom device position, call after the rk_aiq_uapi_setOpZoomPosition, and perform the focus action after being called.

<!-- Source EN PDF p.156; unit 1873 -->

【Grammar】

<!-- Source EN PDF p.156; unit 1874 -->

```text
 XCamReturn rk_aiq_uapi2_endOpZoomChange(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.156; unit 1875 -->

【Parameters】

<!-- Source EN PDF p.156; unit 1876 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |

<!-- Source EN PDF p.156; unit 1877 -->

【Return Value】

<!-- Source EN PDF p.156; unit 1878 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.156; unit 1879 -->

【Requirements】

<!-- Source EN PDF p.156; unit 1880 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.156; unit 1881 -->

Library file: librkaiq.so

<!-- Source EN PDF p.156; unit 1882 -->

#### 8.4.15  rk_aiq_uapi2_getFocusRange

<!-- Source EN PDF p.156; unit 1883 -->

【Description】 Gets the focus range value, which is used to limit the focus code parameter rk_aiq_uapi_setFocusPosition input.

<!-- Source EN PDF p.156; unit 1884 -->

【Grammar】

<!-- Source EN PDF p.156; unit 1885 -->

```text
 XCamReturn rk_aiq_uapi2_getFocusRange(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_af_focusrange* range);
```

<!-- Source EN PDF p.156; unit 1886 -->

【Parameters】

<!-- Source EN PDF p.156; unit 1887 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| range | Focus movable range, refer to the structure rk_aiq_af_focusrange | Output |

<!-- Source EN PDF p.156; unit 1888 -->

【Return Value】

<!-- Source EN PDF p.157; unit 1889 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.157; unit 1890 -->

【Requirements】

<!-- Source EN PDF p.157; unit 1891 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.157; unit 1892 -->

Library file: librkaiq.so

<!-- Source EN PDF p.157; unit 1893 -->

#### 8.4.16  rk_aiq_uapi2_setFocusPosition

<!-- Source EN PDF p.157; unit 1894 -->

【Description】 Set the focus position in manual focus mode.

<!-- Source EN PDF p.157; unit 1895 -->

【Grammar】

<!-- Source EN PDF p.157; unit 1896 -->

```text
 XCamReturn rk_aiq_uapi2_setFocusPosition(const rk_aiq_sys_ctx_t* ctx, unsigned
 short code);
```

<!-- Source EN PDF p.157; unit 1897 -->

【Parameters】

<!-- Source EN PDF p.157; unit 1898 -->

| Parameter<br>Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| code | Focus code value, the value range is determined by<br>rk_aiq_uapi2_getFocusRange | Input |

<!-- Source EN PDF p.157; unit 1899 -->

【Return Value】

<!-- Source EN PDF p.157; unit 1900 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.157; unit 1901 -->

【Requirements】

<!-- Source EN PDF p.157; unit 1902 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.157; unit 1903 -->

Library file: librkaiq.so

<!-- Source EN PDF p.157; unit 1904 -->

#### 8.4.17  rk_aiq_uapi2_getFocusPosition

<!-- Source EN PDF p.157; unit 1905 -->

【Description】 Gets the current focus position.

<!-- Source EN PDF p.157; unit 1906 -->

【Grammar】

<!-- Source EN PDF p.157; unit 1907 -->

```text
 XCamReturn rk_aiq_uapi2_getFocusPosition(const rk_aiq_sys_ctx_t* ctx, unsigned
 short *code);
```

<!-- Source EN PDF p.158; unit 1908 -->

【Parameters】

<!-- Source EN PDF p.158; unit 1909 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| code | Focus code value | Output |

<!-- Source EN PDF p.158; unit 1910 -->

【Return Value】

<!-- Source EN PDF p.158; unit 1911 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.158; unit 1912 -->

【Requirements】

<!-- Source EN PDF p.158; unit 1913 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.158; unit 1914 -->

Library file: librkaiq.so

<!-- Source EN PDF p.158; unit 1915 -->

#### 8.4.18  rk_aiq_uapi2_startZoomCalib

<!-- Source EN PDF p.158; unit 1916 -->

【Description】 Perform electric motor module correction.

<!-- Source EN PDF p.158; unit 1917 -->

【Grammar】

<!-- Source EN PDF p.158; unit 1918 -->

```text
 XCamReturn rk_aiq_uapi2_startZoomCalib(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.158; unit 1919 -->

【Parameters】

<!-- Source EN PDF p.158; unit 1920 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |

<!-- Source EN PDF p.158; unit 1921 -->

【Return Value】

<!-- Source EN PDF p.158; unit 1922 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.158; unit 1923 -->

【Requirements】

<!-- Source EN PDF p.158; unit 1924 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.158; unit 1925 -->

Library file: librkaiq.so

<!-- Source EN PDF p.159; unit 1926 -->

#### 8.4.19  rk_aiq_uapi2_resetZoom

<!-- Source EN PDF p.159; unit 1927 -->

【Description】 Perform an electric motor module reset.

<!-- Source EN PDF p.159; unit 1928 -->

【Grammar】

<!-- Source EN PDF p.159; unit 1929 -->

```text
 XCamReturn rk_aiq_uapi2_resetZoom(const rk_aiq_sys_ctx_t* ctx);
```

<!-- Source EN PDF p.159; unit 1930 -->

【Parameters】

<!-- Source EN PDF p.159; unit 1931 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |

<!-- Source EN PDF p.159; unit 1932 -->

【Return Value】

<!-- Source EN PDF p.159; unit 1933 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.159; unit 1934 -->

【Requirements】

<!-- Source EN PDF p.159; unit 1935 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.159; unit 1936 -->

Library file: librkaiq.so

<!-- Source EN PDF p.159; unit 1937 -->

### 8.5   Functional-level API data types

<!-- Source EN PDF p.159; unit 1938 -->

#### 8.5.1  opMode_t

<!-- Source EN PDF p.159; unit 1939 -->

【Description】 Define the AF information statistics working mode

<!-- Source EN PDF p.159; unit 1940 -->

【Definition】

<!-- Source EN PDF p.159; unit 1941 -->

```text
 typedef enum opMode_e {
     OP_AUTO   = 0,
     OP_MANUAL = 1,
     OP_SEMI_AUTO = 2,
     OP_INVAL
 } opMode_t;
```

<!-- Source EN PDF p.159; unit 1942 -->

【Member】

<!-- Source EN PDF p.160; unit 1943 -->

| Member Name | Description |
|---|---|
| OP_AUTO | Autofocus mode, running the built-in AF algorithm |
| OP_MANUAL | Manual focus mode, stop the built-in AF algorithm |
| OP_SEMI_AUTO | Semi-autofocus mode, set zoom position API call to perform an autofocus |

<!-- Source EN PDF p.160; unit 1944 -->

#### 8.5.2  rk_aiq_af_zoomrange

<!-- Source EN PDF p.160; unit 1945 -->

【Description】 Define the zoom value range

<!-- Source EN PDF p.160; unit 1946 -->

【Definition】

<!-- Source EN PDF p.160; unit 1947 -->

```text
 typedef struct {
     int min_pos;
     int max_pos;
     float min_fl;
     float max_fl;
 } rk_aiq_af_zoomrange;
```

<!-- Source EN PDF p.160; unit 1948 -->

【Member】

<!-- Source EN PDF p.160; unit 1949 -->

| Member Name | Description |
|---|---|
| min_pos | zoom minimum |
| max_pos | zoommax |
| min_fl | Minimum focal length |
| max_fl | Maximum focal length |

<!-- Source EN PDF p.160; unit 1950 -->

#### 8.5.3  rk_aiq_af_focusrange

<!-- Source EN PDF p.160; unit 1951 -->

【Description】 Define the focus value range

<!-- Source EN PDF p.160; unit 1952 -->

【Definition】

<!-- Source EN PDF p.160; unit 1953 -->

```text
 typedef struct {
     int min_pos;
     int max_pos;
 } rk_aiq_af_focusrange;
```

<!-- Source EN PDF p.160; unit 1954 -->

【Member】

<!-- Source EN PDF p.160; unit 1955 -->

| Member Name | Description |
|---|---|
| min_pos | Focus Minimum |
| max_pos | Focus Max |

<!-- Source EN PDF p.161; unit 1956 -->

#### 8.5.4  rk_aiq_af_result_t

<!-- Source EN PDF p.161; unit 1957 -->

【Description】 Define AF search results

<!-- Source EN PDF p.161; unit 1958 -->

【Definition】

<!-- Source EN PDF p.161; unit 1959 -->

```text
 typedef enum rk_aiq_af_sec_stat_e
 {
     RK_AIQ_AF_SEARCH_INVAL   = 0,
     RK_AIQ_AF_SEARCH_RUNNING = 1,
     RK_AIQ_AF_SEARCH_END     = 2
 } rk_aiq_af_sec_stat_t;
 typedef struct {
     rk_aiq_af_sec_stat_t stat;
     int32_t final_pos;
 } rk_aiq_af_result_t;
```

<!-- Source EN PDF p.161; unit 1960 -->

【Member】

<!-- Source EN PDF p.161; unit 1961 -->

| Member Name | Description |
|---|---|
| stat | Focus Status |
| final_pos | Final focus location |

<!-- Source EN PDF p.161; unit 1962 -->

### 8.6   Module-level API reference

<!-- Source EN PDF p.161; unit 1963 -->

#### 8.6.1  rk_aiq_user_api2_af_SetAttrib

<!-- Source EN PDF p.161; unit 1964 -->

【Description】 Set the focus properties.

<!-- Source EN PDF p.161; unit 1965 -->

【Grammar】

<!-- Source EN PDF p.161; unit 1966 -->

```text
 XCamReturn
 rk_aiq_user_api2_af_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx, rk_aiq_af_attrib_t
 attr);
```

<!-- Source EN PDF p.161; unit 1967 -->

【Parameters】

<!-- Source EN PDF p.161; unit 1968 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | Parameter properties of focus | Input |

<!-- Source EN PDF p.161; unit 1969 -->

【Return Value】

<!-- Source EN PDF p.162; unit 1970 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.162; unit 1971 -->

【Requirements】

<!-- Source EN PDF p.162; unit 1972 -->

Header file: rk_aiq_user_api2_af.h

<!-- Source EN PDF p.162; unit 1973 -->

Library file: librkaiq.so

<!-- Source EN PDF p.162; unit 1974 -->

#### 8.6.2  rk_aiq_user_api2_af_GetAttrib

<!-- Source EN PDF p.162; unit 1975 -->

【Description】 Gets the focus properties.

<!-- Source EN PDF p.162; unit 1976 -->

【Grammar】

<!-- Source EN PDF p.162; unit 1977 -->

```text
 XCamReturn
 rk_aiq_user_api2_af_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx, rk_aiq_af_attrib_t
 *attr);
```

<!-- Source EN PDF p.162; unit 1978 -->

【Parameters】

<!-- Source EN PDF p.162; unit 1979 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | Parameter properties of focus | Output |

<!-- Source EN PDF p.162; unit 1980 -->

【Return Value】

<!-- Source EN PDF p.162; unit 1981 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.162; unit 1982 -->

【Requirements】

<!-- Source EN PDF p.162; unit 1983 -->

Header file: rk_aiq_user_api2_af.h

<!-- Source EN PDF p.162; unit 1984 -->

Library file: librkaiq.so

<!-- Source EN PDF p.163; unit 1985 -->

### 8.7   Module-level API data types

<!-- Source EN PDF p.163; unit 1986 -->

#### 8.7.1  RKAIQ_AF_MODE

<!-- Source EN PDF p.163; unit 1987 -->

【Description】 Defines the focus operating mode

<!-- Source EN PDF p.163; unit 1988 -->

【Definition】

<!-- Source EN PDF p.163; unit 1989 -->

```text
 typedef enum _RKAIQ_AF_MODE
 {
     RKAIQ_AF_MODE_NOT_SET = -1,
     RKAIQ_AF_MODE_AUTO,
     RKAIQ_AF_MODE_MACRO,
     RKAIQ_AF_MODE_INFINITY,
     RKAIQ_AF_MODE_FIXED,
     RKAIQ_AF_MODE_EDOF,
     RKAIQ_AF_MODE_CONTINUOUS_VIDEO,
     RKAIQ_AF_MODE_CONTINUOUS_PICTURE,
     RKAIQ_AF_MODE_ONESHOT_AFTER_ZOOM,
 } RKAIQ_AF_MODE;
```

<!-- Source EN PDF p.163; unit 1990 -->

【Member】

<!-- Source EN PDF p.163; unit 1991 -->

| Member Name | Description |
|---|---|
| RKAIQ_AF_MODE_NOT_SET | The focus mode is not set |
| RKAIQ_AF_MODE_AUTO | Autofocus mode |
| RKAIQ_AF_MODE_MACRO | Macro focus mode |
| RKAIQ_AF_MODE_INFINITY | Long Focus Mode |
| RKAIQ_AF_MODE_FIXED | Fixed focus mode |
| RKAIQ_AF_MODE_EDOF | Depth of field focus mode |
| RKAIQ_AF_MODE_CONTINUOUS_VIDEO | Smooth continuous focus mode |
| RKAIQ_AF_MODE_CONTINUOUS_PICTURE | Fast continuous focus mode |
| RKAIQ_AF_MODE_ONESHOT_AFTER_ZOOM | Semi-autofocus mode, set zoom position call,<br>automatically trigger a focus |

<!-- Source EN PDF p.163; unit 1992 -->

#### 8.7.2  RKAIQ_AF_HWVER

<!-- Source EN PDF p.163; unit 1993 -->

【Description】 Defines the focus operating mode

<!-- Source EN PDF p.163; unit 1994 -->

【Definition】

<!-- Source EN PDF p.164; unit 1995 -->

```text
 typedef enum _RKAIQ_AF_HWVER
 {
     RKAIQ_AF_HW_V20 = 0,
     RKAIQ_AF_HW_V30,
     RKAIQ_AF_HW_VMAX
 } RKAIQ_AF_HWVER;
```

<!-- Source EN PDF p.164; unit 1996 -->

【Member】

<!-- Source EN PDF p.164; unit 1997 -->

| Member Name | Description |
|---|---|
| RKAIQ_AF_HW_V20 | AF hardware version 2.0 |
| RKAIQ_AF_HW_V30 | AF hardware version 3.0 |

<!-- Source EN PDF p.164; unit 1998 -->

#### 8.7.3  rk_aiq_af_algo_meas_v30_t

<!-- Source EN PDF p.164; unit 1999 -->

【Description】 Define the AF information statistics working mode

<!-- Source EN PDF p.164; unit 2000 -->

【Definition】

<!-- Source EN PDF p.164; unit 2001 -->

```text
 typedef struct {
     unsigned char af_en;
     unsigned char rawaf_sel;
     unsigned char gamma_en;
     unsigned char gaus_en;
     unsigned char v1_fir_sel;
     unsigned char hiir_en;
     unsigned char viir_en;
     unsigned char v1_fv_outmode;    // 0 square, 1 absolute
     unsigned char v2_fv_outmode;    // 0 square, 1 absolute
     unsigned char h1_fv_outmode;    // 0 square, 1 absolute
     unsigned char h2_fv_outmode;    // 0 square, 1 absolute
     unsigned char ldg_en;
     unsigned char accu_8bit_mode;   //fix to 1
     unsigned char ae_mode;
     unsigned char y_mode;           //fix to 0
     unsigned char line_en[RKAIQ_RAWAF_LINE_NUM];
     unsigned char line_num[RKAIQ_RAWAF_LINE_NUM];
     unsigned char window_num;
     unsigned short wina_h_offs;
     unsigned short wina_v_offs;
     unsigned short wina_h_size;
     unsigned short wina_v_size;
     unsigned short winb_h_offs;
     unsigned short winb_v_offs;
     unsigned short winb_h_size;
     unsigned short winb_v_size;
     unsigned short gamma_y[RKAIQ_RAWAF_GAMMA_NUM];
     // [old version param]
     unsigned short thres;
     unsigned char shift_sum_a;
     unsigned char shift_sum_b;
     unsigned char shift_y_a;
     unsigned char shift_y_b;
```

<!-- Source EN PDF p.165; unit 2002 -->

```text
     /**********[Vertical IIR (v1 & v2)]************/
     short v1_iir_coe[9];
     short v1_fir_coe[3];
     short v2_iir_coe[3];
     short v2_fir_coe[3];
     /**********[Horizontal IIR (h1 & h2)]************/
     short h1_iir1_coe[6];
     short h2_iir1_coe[6];
     short h1_iir2_coe[6];
     short h2_iir2_coe[6];
     /**********[Focus value statistic param]**********/
     // level depended gain
     // input8 lumi, output8bit gain
     unsigned char h_ldg_lumth[2];    //luminance thresh
     unsigned char h_ldg_gain[2];     //gain for [minLum,maxLum]
     unsigned short h_ldg_gslp[2];    //[slope_low,-slope_high]
     unsigned char v_ldg_lumth[2];
     unsigned char v_ldg_gain[2];
     unsigned short v_ldg_gslp[2];
     // coring
     unsigned short v_fv_thresh;
     unsigned short h_fv_thresh;
     // left shift, more needed if outmode=square
     unsigned char v1_fv_shift; //only for sel1
     unsigned char v2_fv_shift;
     unsigned char h1_fv_shift;
     unsigned char h2_fv_shift;
     /**********[High light]**********/
     unsigned short highlit_thresh;
 }  rk_aiq_af_algo_meas_v30_t;
```

<!-- Source EN PDF p.165; unit 2003 -->

【Member】

<!-- Source EN PDF p.166; unit 2004 -->

| Member Name | Description |
|---|---|
| af_en | Whether AF information statistics are enabled, 0 is off, 1 is on |
| rawaf_sel | Select the channel of AF information statistics, the value range is 0-3, the<br>long/medium/short/synthetic frame channel selection corresponding to HDR mode, the<br>general AF selection medium frame channel, the non-HDR mode is set to 0, and the<br>HDR mode is set to 1 |
| gamma_en | Gamma module enables switch, 0 is off, 1 is on |
| gaus_en | The setting needs to be fixed to 1 |
| v1_fir_sel | The setting needs to be fixed to 1 |
| hiir_en | H1/H2 channel enable switch, 0 is off, 1 is on |
| viir_en | V1/V2 channel enable switch, 0 is off and 1 is on. Note that when the gamma_en is<br>opened, the viir_en must be set to 1 |
| v1_fv_outmode | V1 channel FV output mode selection, 0 for squared mode, 1 for absolute value mode |
| v2_fv_outmode | V2 channel FV output mode selection, 0 for squared mode, 1 for absolute value mode |
| ldg_en | LDG function enable switch, 0 is off, 1 is on |
| accu_8bit_mode | The setting needs to be fixed to 1 |
| ae_mode | When the ae_mode is set to 1, RAWAF enables 15x15 brightness averaging statistics,<br>multiplexing the logic of the RAWAE_BIG module |
| y_mode | The setting needs to be fixed to 0 |
| sobel_sel | The setting needs to be fixed to 0 |
| v_dnscl_mode | Wide and narrow band mode selection, set according to the output of the AF filter<br>coefficient generation tool |
| from_awb | The AF statistics input is obtained from AWB |
| from_ynr | The AF statistics input is obtained from YNR |
| ae_config_use | Fixed configuration 0 |
| line_en | Currently not effective |
| line_num | Currently not effective |
| window_num | The number of windows in effect, when the window_num is 1, WinA (main window)<br>takes effect; When the window_num is 2, wina (main window) and winb (independent<br>window) take effect |
| wina_h_offs | The horizontal coordinate of the first pixel in the upper left corner of WinA (main<br>window), which must be greater than or equal to 2 |
| wina_v_offs | The vertical coordinate of the first pixel in the upper-left corner of wina (main<br>window), which must be greater than or equal to 1 |

<!-- Source EN PDF p.167; unit 2005 -->

| Member Name | Description |
|---|---|
| wina_h_size | the window width of Wina (main window), which must be less than the image width<br>-2-wina_h_offs; The value must also be a multiple of 15; |
| wina_v_size | the window height of Wina (main window), which must be less than the image height<br>-2-wina_v_offs; The value must also be a multiple of 15; |
| winb_h_offs | The horizontal coordinate of the first pixel in the upper-left corner of winb (separate<br>window), which must be greater than or equal to 2 |
| winb_v_offs | The vertical coordinate of the first pixel in the upper-left corner of winb (stand-alone<br>window), which must be greater than or equal to 1 |
| winb_h_size | The window width of winb (independent window), which must be less than the image<br>width -2-wina_h_offs |
| winb_v_size | The window height of winb (independent window), which must be less than the image<br>height -2-wina_v_offs |
| gamma_y | The y value of the gamma table, the value range is 0-1023; The x-coordinate segment<br>is 0 to 1023: 16 16 16 16 32 32 32 32 64 64 64 128 128 128 128 128 |
| thres | The AF statistical threshold of win b (independent window), when the calculated fv<br>value is less than this value, the fv value is changed to 0, which can reduce the<br>influence of noise, and the value range is 0-0xFFFF |
| shift_sum_a | Currently unavailable, fixed setting to 0 |
| shift_y_a | Currently unavailable, fixed setting to 0 |
| v1_iir_coe[9] | The 3X3 IIR coefficient for the V1 channel is set according to the output of the AF<br>Filter Factor Generation tool |
| v1_fir_coe[3] | The 1x3 FIR factor for the V1 channel is set according to the output of the AF filter<br>coefficient generation tool |
| v2_iir_coe[3] | The 1x3 IIR coefficient for the V2 channel is set according to the output of the AF<br>filter coefficient generation tool |
| v2_fir_coe[3] | The 1x3 FIR factor for the V2 channel is set according to the output of the AF Filter<br>Factor Generation tool |
| h1_iir1_coe[6] | The 1X6 IIR1 coefficient for the H1 channel, set according to the output of the AF<br>Filter Factor Generation tool |
| h2_iir1_coe[6] | The 1X6 IIR1 coefficient for the H2 channel is set according to the output of the AF<br>Filter Factor Generation tool |
| h1_iir2_coe[6] | The 1X6 IIR2 coefficient for the H1 channel is set according to the output of the AF<br>Filter Factor Generation tool |
| h2_iir2_coe[6] | 1X6 IIR2 coefficient for H2 channel, set according to the output of the AF filter<br>coefficient generation tool |

<!-- Source EN PDF p.168; unit 2006 -->

| Member Name | Description |
|---|---|
| h_ldg_lumth[2] | The brightness threshold coefficient of the ldg module used for H1/H2 channels, 0 is<br>set for the left dark area, 1 is set for the right highlight area, and the value range is<br>0~255 |
| h_ldg_gain[2] | The minimum gain value of the ldg module used for H1/H2 channels, 0 is the left dark<br>area setting, 1 is the right highlight area setting, the value range is 0~255 |
| h_ldg_gslp[2] | The slope coefficient of the ldg module used for H1/H2 channels, 0 is set for the left<br>dark area, 1 is set for the right highlight area, and the value range is 0~65535 |
| v_ldg_lumth[2] | The brightness threshold coefficient of the ldg module used for V1/V2 channels, 0 is<br>set for the left dark area, 1 is the right highlight area, and the value range is 0~255 |
| v_ldg_gain[2] | The minimum gain value of the ldg module used for V1/V2 channels, 0 is the left dark<br>area setting, 1 is the right highlight area setting, the value range is 0~255 |
| v_ldg_gslp[2] | The minimum gain value of the ldg module used for V1/V2 channels, 0 is the left dark<br>area setting, 1 is the right highlight area setting, the value range is 0~255 |
| v_fv_thresh | For the AF statistical threshold of V1/V2 channels, when the calculated fv value is less<br>than this value, the fv value is changed to 0, which can reduce the influence of noise,<br>and the value range is 0-0x0FFF |
| h_fv_thresh | For the AF statistical threshold used for H1/H2 channels, when the calculated fv value<br>is less than this value, the fv value is changed to 0, which can reduce the influence of<br>noise, and the value range is 0-0x0FFF |
| v1_fv_shift | The shit bit value of the fv value used for the V1 channel will shift the fv value to the<br>right according to this value to avoid the overflow of the obtained fv value, and the<br>value range is 0-7 |
| v2_fv_shift | The shit bit value of the fv value used for the V2 channel will shift the fv value to the<br>right according to this value to avoid the overflow of the obtained fv value, and the<br>value range is 0-7 |
| h1_fv_shift | The shit bit value of the fv value used for the H1 channel will shift the fv value to the<br>right according to this value to avoid the overflow of the obtained fv value, and the<br>value range is 0-7 |
| h2_fv_shift | The shit bit value of the fv value used for the H2 channel will shift the fv value to the<br>right according to this value to avoid the overflow of the obtained fv value, and the<br>value range is 0-7 |
| highlit_thresh | Indicates the threshold of the highlight statistics, when it is higher than this value, it is<br>considered to be high highlights, and it is included in the statistics, and only the<br>number of high highlights in each area is accumulated, and the value range is 0-<br>0x0FFF |

<!-- Source EN PDF p.169; unit 2007 -->

#### 8.7.4  rk_aiq_af_attrib_t

<!-- Source EN PDF p.169; unit 2008 -->

【Description】 Focus configuration information

<!-- Source EN PDF p.169; unit 2009 -->

【Definition】

<!-- Source EN PDF p.169; unit 2010 -->

```text
 typedef struct rk_aiq_af_attrib_s {
     rk_aiq_uapi_sync_t sync;
     RKAIQ_AF_MODE AfMode;
     RKAIQ_AF_HWVER AfHwVer;
     bool contrast_af;
     bool laser_af;
     bool pdaf;
     int h_offs;
     int v_offs;
     unsigned int h_size;
     unsigned int v_size;
     short fixedModeDefCode;
     short macroModeDefCode;
     short infinityModeDefCode;
     union {
         rk_aiq_af_algo_meas_v20_t manual_meascfg;
         rk_aiq_af_algo_meas_v30_t manual_meascfg_v30;
     };
 } rk_aiq_af_attrib_t;
```

<!-- Source EN PDF p.169; unit 2011 -->

【Member】

<!-- Source EN PDF p.170; unit 2012 -->

| Member Name | Description |
|---|---|
| sync | For information about synchronous asynchronous APIs, refer to<br>rk_aiq_uapi_sync_t definitions, see Overview/API Description section |
| AfMode | Focus mode |
| contrast_af | Enable contrast focus |
| laser_af | Enable laser focus |
| pdaf | Enable phase focus |
| h_offs | The starting horizontal coordinate of the focus window |
| v_offs | The starting vertical coordinate of the focus window |
| h_size | Focus window width |
| v_size | Focus window height |
| fixedModeDefCode | Focus code value |
| macroModeDefCode | The stop code value in macro focus mode is 0-value |
| infinityModeDefCode | The starting code value in long-range focus mode with a focus range of -64 |
| manual_meascfg | AF2.0 Custom Focus Statistics Configuration |
| manual_meascfg_v30 | AF3.0 Custom Focus Statistics Configuration |

<!-- Source EN PDF p.170; unit 2013 -->

### 8.8   Additional instructions

<!-- Source EN PDF p.170; unit 2014 -->

#### 8.8.1  VCM motor module driver verification

<!-- Source EN PDF p.170; unit 2015 -->

1\. Whether the starting current and termination current of the VCM drive are set correctly,

<!-- Source EN PDF p.170; unit 2016 -->

First of all, it is necessary to obtain relevant information about the starting current and termination current from the module factory.

<!-- Source EN PDF p.170; unit 2017 -->

Next, select a few modules to confirm whether the information is correct, as follows:

<!-- Source EN PDF p.170; unit 2018 -->

In dts, set the start current and termination current to the maximum range that the VCM can support.

<!-- Source EN PDF p.170; unit 2019 -->

Switch the focus mode to manual mode, gradually adjust the VCM position from 64, when the lens starts to move and the telefocus object (more than 10 meters) is clear, record the current position value,

<!-- Source EN PDF p.170; unit 2020 -->

The starting current is (vcm_max_mA - vcm_min_mA) \* (64 - curPos) / 64.

<!-- Source EN PDF p.170; unit 2021 -->

Continue to adjust the VCM position, and when the near-focus object (10cm or 20cm) is clear, record the current position value,

<!-- Source EN PDF p.170; unit 2022 -->

The termination current is (vcm_max_mA - vcm_min_mA) \* (64 - curPos) / 64.

<!-- Source EN PDF p.170; unit 2023 -->

2\. Whether the final residence position is stable when the VCM is moved in different directions.

<!-- Source EN PDF p.171; unit 2024 -->

Switch the focus mode to manual mode, select a position, move from 0 to this position and from 64 to this position, compare whether the two images are consistent in clarity and whether the AF statistics are close.

<!-- Source EN PDF p.171; unit 2025 -->

3\. Whether the time required to move the lens is correct.

<!-- Source EN PDF p.171; unit 2026 -->

#### 8.8.2  Electric motor module drive verification

<!-- Source EN PDF p.171; unit 2027 -->

1\. Whether multiple single step movements and one multi-step move end up staying in the same position

<!-- Source EN PDF p.171; unit 2028 -->

1\. First select a zoom/focus motor position to make the image reach the clearest state, record the current motor position, and grab an image A;

<!-- Source EN PDF p.171; unit 2029 -->

2\. Let the zoom or focus motor step back a certain number of steps, and then move the zoom or focus motor in one step until it reaches the recorded zoom/focus motor position, and grab an image B;

<!-- Source EN PDF p.171; unit 2030 -->

3\. Let the zoom or focus motor go back a certain number of steps again, move the zoom or focus motor once, reach the recorded zoom/focus motor position, and grab an image C;

<!-- Source EN PDF p.171; unit 2031 -->

4\. Compare whether the clarity of image A, image B and image C is consistent, and whether the field of view is consistent;

<!-- Source EN PDF p.171; unit 2032 -->

2\. Whether the motor moves randomly and ends up staying in the same position

<!-- Source EN PDF p.171; unit 2033 -->

1\. First select a zoom/focus motor position to make the image reach the clearest state, record the current motor position, and grab an image A;

<!-- Source EN PDF p.171; unit 2034 -->

2\. Second, let the zoom or focus motor move randomly through the script, move it 400 to 500 times, return to the original zoom/focus motor position, and grab an image B;

<!-- Source EN PDF p.171; unit 2035 -->

3\. Compare image A and image B to determine whether the clarity is consistent and whether the field of view is consistent;

<!-- Source EN PDF p.171; unit 2036 -->

3\. Whether the final residence position of the motor moving at the same time is the same

<!-- Source EN PDF p.171; unit 2037 -->

1\. First select a zoom/focus motor position to make the image reach the clearest state, record the current motor position, and grab an image A;

<!-- Source EN PDF p.171; unit 2038 -->

2\. Secondly, let the zoom and focus motor move randomly at the same time through the script, move 400 to 500 times, return to the original zoom/focus motor position, and grab an image B;

<!-- Source EN PDF p.171; unit 2039 -->

3\. Compare image A and image B to determine whether the clarity is consistent and whether the field of view is consistent;

<!-- Source EN PDF p.171; unit 2040 -->

## 9.   IMGPROC

<!-- Source EN PDF p.171; unit 2041 -->

### 9.1   Overview

<!-- Source EN PDF p.171; unit 2042 -->

imgproc refers to the module that affects the effect of the image.

<!-- Source EN PDF p.172; unit 2043 -->

### 9.2   Merge

<!-- Source EN PDF p.172; unit 2044 -->

#### 9.2.1  Description of the feature

<!-- Source EN PDF p.172; unit 2045 -->

Merge is a module that combines multiple frames of an image into a single frame.

<!-- Source EN PDF p.172; unit 2046 -->

#### 9.2.2  Important concepts

<!-- Source EN PDF p.172; unit 2047 -->

Takes effect in and only in HDR mode.

<!-- Source EN PDF p.172; unit 2048 -->

#### 9.2.3  Functional level API reference

<!-- Source EN PDF p.172; unit 2049 -->

#### 9.2.4  Module-level API reference

<!-- Source EN PDF p.172; unit 2050 -->

9.2.4.1  rk_aiq_user_api2_amerge_SetAttrib

<!-- Source EN PDF p.172; unit 2051 -->

【Description】 Set the merge property.

<!-- Source EN PDF p.172; unit 2052 -->

【Grammar】

<!-- Source EN PDF p.172; unit 2053 -->

```text
 XCamReturn
 rk_aiq_user_api2_amerge_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 amerge_attrib_t attr);
```

<!-- Source EN PDF p.172; unit 2054 -->

【Parameters】

<!-- Source EN PDF p.172; unit 2055 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | The parameter property of merge | Input |

<!-- Source EN PDF p.172; unit 2056 -->

【Return Value】

<!-- Source EN PDF p.172; unit 2057 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.172; unit 2058 -->

【Requirements】

<!-- Source EN PDF p.172; unit 2059 -->

Header file: rk_aiq_user_api2_amerge.h

<!-- Source EN PDF p.172; unit 2060 -->

Library file: librkaiq.so

<!-- Source EN PDF p.173; unit 2061 -->

9.2.4.2  rk_aiq_user_api2_amerge_GetAttrib

<!-- Source EN PDF p.173; unit 2062 -->

【Description】 Gets the merge property.

<!-- Source EN PDF p.173; unit 2063 -->

【Grammar】

<!-- Source EN PDF p.173; unit 2064 -->

```text
 XCamReturn
 rk_aiq_user_api2_amerge_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 amerge_attrib_t* attr);
```

<!-- Source EN PDF p.173; unit 2065 -->

【Parameters】

<!-- Source EN PDF p.173; unit 2066 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | The parameter property of merge | Output |

<!-- Source EN PDF p.173; unit 2067 -->

【Return Value】

<!-- Source EN PDF p.173; unit 2068 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.173; unit 2069 -->

【Requirements】

<!-- Source EN PDF p.173; unit 2070 -->

Header file: rk_aiq_user_api2_amerge.h

<!-- Source EN PDF p.173; unit 2071 -->

Library file: librkaiq.so

<!-- Source EN PDF p.173; unit 2072 -->

#### 9.2.5  Module-level API data types

<!-- Source EN PDF p.173; unit 2073 -->

9.2.5.1  merge_OpMode_t

<!-- Source EN PDF p.173; unit 2074 -->

【Description】 Define the merge mode of operation

<!-- Source EN PDF p.173; unit 2075 -->

【Definition】

<!-- Source EN PDF p.173; unit 2076 -->

```text
 typedef enum merge_OpModeV21_e {
     MERGE_OPMODE_API_OFF = 0,
     MERGE_OPMODE_MANU    = 1,
 } merge_OpModeV21_t;
```

<!-- Source EN PDF p.173; unit 2077 -->

【Member】

<!-- Source EN PDF p.174; unit 2078 -->

| Member Name | Description |
|---|---|
| MERGE_OPMODE_API_OFF | API is turned off mode, and the algorithm is in AUTO mode, using the<br>parameter |
| MERGE_OPMODE_MANU | Manual mode |

<!-- Source EN PDF p.174; unit 2079 -->

9.2.5.2  MergeBaseFrame_t

<!-- Source EN PDF p.174; unit 2080 -->

【Description】 Defines datum frame properties when blending

<!-- Source EN PDF p.174; unit 2081 -->

【Definition】

<!-- Source EN PDF p.174; unit 2082 -->

```text
 typedef enum MergeBaseFrame_e {
     BASEFRAME_LONG  = 0,
     BASEFRAME_SHORT = 1,
 } MergeBaseFrame_t;
```

<!-- Source EN PDF p.174; unit 2083 -->

【Member】

<!-- Source EN PDF p.174; unit 2084 -->

| Member Name | Description |
|---|---|
| BASEFRAME_LONG | When blending, long frames are used as the benchmark |
| BASEFRAME_SHORT | When blending, short frames are used as the benchmark |

<!-- Source EN PDF p.174; unit 2085 -->

9.2.5.3  MergeCurrCtlData_t

<!-- Source EN PDF p.174; unit 2086 -->

【Description】 Define Merge control parameter attributes.

<!-- Source EN PDF p.174; unit 2087 -->

【Definition】

<!-- Source EN PDF p.174; unit 2088 -->

```text
 typedef struct MergeCurrCtlData_s {
     float Envlv;
     float MoveCoef;
 } MergeCurrCtlData_t;
```

<!-- Source EN PDF p.174; unit 2089 -->

【Member】

<!-- Source EN PDF p.174; unit 2090 -->

| Member<br>Name | Description |
|---|---|
| Envlv | The current ambient brightness ranges from 0,1 to 0.000001 |
| MoveCoef | The current motion coefficient, the value range: [0,1], the accuracy is 0.000001, and the<br>value is temporarily fixed. |

<!-- Source EN PDF p.175; unit 2091 -->

9.2.5.4  mMergeOECurveV21_t

<!-- Source EN PDF p.175; unit 2092 -->

【Description】 Define the Manual Merge Overexposure Curve property

<!-- Source EN PDF p.175; unit 2093 -->

【Definition】

<!-- Source EN PDF p.175; unit 2094 -->

```text
 typedef struct mMergeOECurveV21_s {
     float Smooth;
     float Offset;
 } mMergeOECurveV21_t;
```

<!-- Source EN PDF p.175; unit 2095 -->

【Member】

<!-- Source EN PDF p.175; unit 2096 -->

| Member<br>Name | Description |
|---|---|
| Smooth | The slope of the overexposure curve, the value range [0,1], the default value is 0.4, and<br>the accuracy is 0.01. |
| Offset | The offset value of the overexposure curve is in the range [108,280], the default value is<br>210, and the accuracy is 0.1. |

<!-- Source EN PDF p.175; unit 2097 -->

9.2.5.5  mMergeMDCurveV21_t

<!-- Source EN PDF p.175; unit 2098 -->

【Description】 Defines motion curve properties in long frame mode

<!-- Source EN PDF p.175; unit 2099 -->

【Definition】

<!-- Source EN PDF p.175; unit 2100 -->

```text
 typedef struct mMergeMDCurveV21_s {
     float LM_smooth;
     float LM_offset;
     float MS_smooth;
     float MS_offset;
 } mMergeMDCurveV21_t;
```

<!-- Source EN PDF p.175; unit 2101 -->

【Member】

<!-- Source EN PDF p.176; unit 2102 -->

| Member<br>name | Description |
|---|---|
| LM_smooth | The slope of the motion curve between the long frame and the middle frame, the value<br>range is [0,1], the default value is 0.4, and the accuracy is 0.01. On the RK356x platform,<br>this value is invalid. |
| LM_offset | The offset value of the motion curve between the long frame and the medium frame is in<br>the range of [0.26,1], the default value is 0.38, and the accuracy is 0.01. On the RK356x<br>platform, this value is invalid |
| MS_smooth | The slope of the motion curve between medium and short frames, the value range is [0,1],<br>the default value is 0.4, and the accuracy is 0.01. |
| MS_offset | The value of the motion curve offset between medium frame and short frame is [0.26,1],<br>the default value is 0.38, and the accuracy is 0.01. |

<!-- Source EN PDF p.176; unit 2103 -->

9.2.5.6  mMergeAttrV21_t

<!-- Source EN PDF p.176; unit 2104 -->

【Description】 Define the manual merge attribute in RK3588.

<!-- Source EN PDF p.176; unit 2105 -->

【Definition】

<!-- Source EN PDF p.176; unit 2106 -->

```text
 typedef struct mMergeAttrV21_s {
     mMergeOECurveV21_t OECurve;
     mMergeMDCurveV21_t MDCurve;
 } mMergeAttrV21_t;
```

<!-- Source EN PDF p.176; unit 2107 -->

【Member】

<!-- Source EN PDF p.176; unit 2108 -->

| Member Name | Description |
|---|---|
| OECurve | Overexposure curve parameter |
| MDCurve | Motion Profile Parameter |

<!-- Source EN PDF p.176; unit 2109 -->

9.2.5.7  mergeAttrV21_t

<!-- Source EN PDF p.176; unit 2110 -->

【Description】 Configure the merge attribute under the RK356x chip

<!-- Source EN PDF p.176; unit 2111 -->

【Definition】

<!-- Source EN PDF p.176; unit 2112 -->

```text
 typedef struct mergeAttrV21_s {
     merge_OpModeV21_t    opMode;
     mMergeAttrV21_t      stManual;
     MergeCurrCtlData_t   CtlInfo;
 } mergeAttrV21_t;
```

<!-- Source EN PDF p.176; unit 2113 -->

【Member】

<!-- Source EN PDF p.177; unit 2114 -->

| Member Name | Description |
|---|---|
| opMode | Mode selection |
| stManual | Manual merge property |
| CtlInfo | Control quantity parameters |

<!-- Source EN PDF p.177; unit 2115 -->

9.2.5.8  mLongFrameModeData_t

<!-- Source EN PDF p.177; unit 2116 -->

【Description】 Defines the control parameter properties in long frame mode

<!-- Source EN PDF p.177; unit 2117 -->

【Definition】

<!-- Source EN PDF p.177; unit 2118 -->

```text
 typedef struct mLongFrameModeData_s {
     mMergeOECurveV21_t OECurve;
     mMergeMDCurveV21_t MDCurve;
 } mLongFrameModeData_t;
```

<!-- Source EN PDF p.177; unit 2119 -->

【Member】

<!-- Source EN PDF p.177; unit 2120 -->

| Member name | Description |
|---|---|
| OECurve | Overexposure curve parameters |
| MDCurve | Motion profile parameters |

<!-- Source EN PDF p.177; unit 2121 -->

9.2.5.9  mMergeMDCurveV30Short_t

<!-- Source EN PDF p.177; unit 2122 -->

【Description】 Defines motion curve properties in short frame mode

<!-- Source EN PDF p.177; unit 2123 -->

【Definition】

<!-- Source EN PDF p.177; unit 2124 -->

```text
 typedef struct mMergeMDCurveV30Short_s{
     float Coef;
     float ms_thd0;
     float lm_thd0;
 } mMergeMDCurveV30Short_t;
```

<!-- Source EN PDF p.177; unit 2125 -->

【Member】

<!-- Source EN PDF p.178; unit 2126 -->

| Member<br>name | Description |
|---|---|
| Coef | Control coefficient, value range [0,1], default value is 0.05, accuracy 0.0001. |
| ms_thd0 | The medium and short frame control coefficient has a value range of [0,1], and the default<br>value is 0.0 and the accuracy is 0.1. |
| lm_thd0 | The long medium frame control coefficient has a value range of [0,1], the default value is<br>0.0, and the accuracy is 0.1. |

<!-- Source EN PDF p.178; unit 2127 -->

9.2.5.10  mShortFrameModeData_t

<!-- Source EN PDF p.178; unit 2128 -->

【Description】 Define control parameter properties in short frame mode

<!-- Source EN PDF p.178; unit 2129 -->

【Definition】

<!-- Source EN PDF p.178; unit 2130 -->

```text
 typedef struct mShortFrameModeData_s {
     mMergeOECurveV21_t      OECurve;
     mMergeMDCurveV30Short_t MDCurve;
 } mShortFrameModeData_t;
```

<!-- Source EN PDF p.178; unit 2131 -->

【Member】

<!-- Source EN PDF p.178; unit 2132 -->

| Member name | Description |
|---|---|
| OECurve | Overexposure curve parameters |
| MDCurve | Motion profile parameters |

<!-- Source EN PDF p.178; unit 2133 -->

9.2.5.11  mMergeAttrV30_t

<!-- Source EN PDF p.178; unit 2134 -->

【Description】 Define the manual merge attribute in RK3588

<!-- Source EN PDF p.178; unit 2135 -->

【Definition】

<!-- Source EN PDF p.178; unit 2136 -->

```text
 typedef struct mMergeAttrV30_s {
     MergeBaseFrame_t      BaseFrm;
     mLongFrameModeData_t  LongFrmModeData;
     mShortFrameModeData_t ShortFrmModeData;
 } mMergeAttrV30_t;
```

<!-- Source EN PDF p.178; unit 2137 -->

【Member】

<!-- Source EN PDF p.178; unit 2138 -->

| Member Name | Description |
|---|---|
| BaseFrm | Fused datum frame |
| LongFrmModeData | When the reference value is a long frame, control data data |

<!-- Source EN PDF p.179; unit 2139 -->

9.2.5.12  MergeOECurveV10_t

<!-- Source EN PDF p.179; unit 2140 -->

【Description】 Define the Auto Merge overexposure curve properties

<!-- Source EN PDF p.179; unit 2141 -->

【Definition】

<!-- Source EN PDF p.179; unit 2142 -->

```text
 typedef struct MergeOECurveV10_s {
     float EnvLv[MERGE_ENVLV_STEP_MAX];
     float Smooth[MERGE_ENVLV_STEP_MAX];
     float Offset[MERGE_ENVLV_STEP_MAX];
 } MergeOECurveV10_t;
```

<!-- Source EN PDF p.179; unit 2143 -->

【Member】

<!-- Source EN PDF p.179; unit 2144 -->

| Member<br>name | Description |
|---|---|
| EnvLv | Ambient brightness, value range [0,1], 0: all black, 1: brightest. |
| Smooth | The slope of the overexposure curve, the value range [0,1], the default value is 0.4, and<br>the accuracy is 0.01. |
| Offset | The offset value of the overexposure curve is in the range [108,280], the default value is<br>210, and the accuracy is 0.1. |

<!-- Source EN PDF p.179; unit 2145 -->

9.2.5.13  MergeMDCurveV10_t

<!-- Source EN PDF p.179; unit 2146 -->

【Description】 Defines motion curve properties in long frame mode

<!-- Source EN PDF p.179; unit 2147 -->

【Definition】

<!-- Source EN PDF p.179; unit 2148 -->

```text
 typedef struct MergeMDCurveV10_s {
     float MoveCoef[MERGE_ENVLV_STEP_MAX];
     float LM_smooth[MERGE_ENVLV_STEP_MAX];
     float LM_offset[MERGE_ENVLV_STEP_MAX];
     float MS_smooth[MERGE_ENVLV_STEP_MAX];
     float MS_offset[MERGE_ENVLV_STEP_MAX];
 } MergeMDCurveV10_t;
```

<!-- Source EN PDF p.179; unit 2149 -->

【Member】

<!-- Source EN PDF p.180; unit 2150 -->

| Member<br>name | Description |
|---|---|
| MoveCoef | The degree of screen motion, the value range [0,1], where 0 represents complete<br>stationary, 1 represents full motion |
| LM_smooth | The slope of the motion curve between long and medium frames, the value range is [0,1],<br>and the default value is 0.4. In HDR x2 mode, it does not take effect |
| LM_offset | The motion curve offset value between long and medium frames is in the range of<br>[0.26,1], and the default value is 0.38. In HDR x2 mode, it does not take effect |
| MS_smooth | The slope of the motion curve between medium and short frames, the value range is [0,1],<br>and the default value is 0.4. |
| MS_offset | The value of the motion curve offset between medium frame and short frame is [0.26,1],<br>and the default value is 0.38. |

<!-- Source EN PDF p.180; unit 2151 -->

9.2.5.14  MergeEachChnCurveV12_t

<!-- Source EN PDF p.180; unit 2152 -->

【Description】 Define the properties of the subchannel detection curve in long frame mode

<!-- Source EN PDF p.180; unit 2153 -->

【Definition】

<!-- Source EN PDF p.180; unit 2154 -->

```text
 typedef struct MergeEachChnCurveV12_s {
     float EnvLv[MERGE_ENVLV_STEP_MAX];
     float Smooth[MERGE_ENVLV_STEP_MAX];
     float Offset[MERGE_ENVLV_STEP_MAX];
 } MergeEachChnCurveV12_t;
```

<!-- Source EN PDF p.180; unit 2155 -->

【Member】

<!-- Source EN PDF p.180; unit 2156 -->

| Member<br>Name | Description |
|---|---|
| EnvLv | Ambient brightness, value range [0,1], 0: all black, 1: brightest. |
| Smooth | The slope of the sub-channel overexposure curve, the value range [0,1], the default value<br>is 0.4, and the accuracy is 0.01. |
| Offset | The offset value of the sub-channel overexposure curve, the value range [0,1], the default<br>value is 0.38, and the accuracy is 0.01. |

<!-- Source EN PDF p.180; unit 2157 -->

9.2.5.15  LongFrameModeDataV12_t

<!-- Source EN PDF p.180; unit 2158 -->

【Description】 Defines the control parameter properties in long frame mode

<!-- Source EN PDF p.180; unit 2159 -->

【Definition】

<!-- Source EN PDF p.181; unit 2160 -->

```text
 typedef struct LongFrameModeDataV12_s {
     bool                   EnableEachChn;
     MergeOECurveV10_t      OECurve;
     MergeMDCurveV10_t      MDCurve;
     MergeEachChnCurveV12_t EachChnCurve;
     float                  OECurve_damp;
     float                  MDCurveLM_damp;
     float                  MDCurveMS_damp;
 } LongFrameModeDataV12_t;
```

<!-- Source EN PDF p.181; unit 2161 -->

【Member】

<!-- Source EN PDF p.181; unit 2162 -->

| Member name | Description |
|---|---|
| EnableEachChn | Split channel detection switch |
| OECurve | Overexposure curve parameters |
| MDCurve | Motion profile parameters |
| EachChnCurve | Split Channel Detection Curve Parameters |
| MDCurveLM_damp | The smoothing coefficient of the change of motion curve between long frames and<br>medium frames is the proportion of the current frame parameter, the value range is<br>[0,1], and the default value is 0.9. In HDR x2 mode, it does not take effect |
| MDCurveMS_damp | The smoothing coefficient of the change of the motion curve between the middle<br>frame and the short frame is the proportion of the current frame parameter, the<br>value range is [0,1], and the default value is 0.9. |

<!-- Source EN PDF p.181; unit 2163 -->

9.2.5.16  MergeMDCurveV11Short_t

<!-- Source EN PDF p.181; unit 2164 -->

【Description】 Defines motion curve properties in short frame mode

<!-- Source EN PDF p.181; unit 2165 -->

【Definition】

<!-- Source EN PDF p.181; unit 2166 -->

```text
 typedef struct MergeMDCurveV11Short_s{
     float Coef;
     float ms_thd0;
     float lm_thd0;
 } MergeMDCurveV11Short_t;
```

<!-- Source EN PDF p.181; unit 2167 -->

【Member】

<!-- Source EN PDF p.182; unit 2168 -->

| Member<br>name | Description |
|---|---|
| Coef | Control coefficient, value range [0,1], default value is 0.05, accuracy 0.0001. |
| ms_thd0 | The medium and short frame control coefficient has a value range of [0,1], and the default<br>value is 0.0 and the accuracy is 0.1. |
| lm_thd0 | The long medium frame control coefficient has a value range of [0,1], the default value is<br>0.0, and the accuracy is 0.1. |

<!-- Source EN PDF p.182; unit 2169 -->

9.2.5.17  ShortFrameModeData_t

<!-- Source EN PDF p.182; unit 2170 -->

【Description】 Define control parameter properties in short frame mode

<!-- Source EN PDF p.182; unit 2171 -->

【Definition】

<!-- Source EN PDF p.182; unit 2172 -->

```text
 typedef struct ShortFrameModeData_s {
     MergeOECurveV10_t      OECurve;
     MergeMDCurveV11Short_t MDCurve;
     float                  OECurve_damp;
     float                  MDCurve_damp;
 } ShortFrameModeData_t;
```

<!-- Source EN PDF p.182; unit 2173 -->

【Member】

<!-- Source EN PDF p.182; unit 2174 -->

| Member name | Description |
|---|---|
| OECurve | Overexposure curve parameters |
| MDCurve | Motion profile parameters |
| OECurve_damp | The smoothing coefficient of the change of the overexposure curve is the proportion of<br>the current frame parameter, the value range is [0,1], and the default value is 0.9. |
| MDCurve_damp | The smoothing coefficient of the change of the motion curve is the proportion of the<br>current frame parameter, the value range is [0,1], and the default value is 0.9. |

<!-- Source EN PDF p.182; unit 2175 -->

9.2.5.18  CalibDbV2_merge_V12_t

<!-- Source EN PDF p.182; unit 2176 -->

【Description】 Define the automerge property

<!-- Source EN PDF p.182; unit 2177 -->

【Definition】

<!-- Source EN PDF p.183; unit 2178 -->

```text
 typedef struct CalibDbV2_merge_V12_s {
     MergeBaseFrame_t       BaseFrm;
     float                  ByPassThr;
     LongFrameModeDataV12_t LongFrmModeData;
     ShortFrameModeData_t   ShortFrmModeData;
 } CalibDbV2_merge_V12_t;
```

<!-- Source EN PDF p.183; unit 2179 -->

【Member】

<!-- Source EN PDF p.183; unit 2180 -->

| Member Name | Description |
|---|---|
| BaseFrm | Fused datum frame |
| ByPassThr | bypass current module threshold, value range [0,1]. If the percentage difference<br>between the current ambient brightness and the ambient brightness of the previous<br>frame is less than ByPassThr, the parameters of this module are not updated. |
| LongFrmModeData | When the reference value is a long frame, control data data |

<!-- Source EN PDF p.183; unit 2181 -->

9.2.5.19  MergeCurrCtlData_t

<!-- Source EN PDF p.183; unit 2182 -->

【Description】 RK3588 chip under merge attribute configuration

<!-- Source EN PDF p.183; unit 2183 -->

【Definition】

<!-- Source EN PDF p.183; unit 2184 -->

```text
 typedef struct mergeAttrV30_s {
     merge_OpModeV21_t    opMode;
     mMergeAttrV30_t      stManual;
     MergeCurrCtlData_t   CtlInfo;
 } mergeAttrV30_t;
```

<!-- Source EN PDF p.183; unit 2185 -->

【Member】

<!-- Source EN PDF p.183; unit 2186 -->

| Member Name | Description |
|---|---|
| opMode | Mode selection |
| stManual | Manual merge property |
| CtlInfo | Control quantity parameters |

<!-- Source EN PDF p.183; unit 2187 -->

9.2.5.20  mergeAttr_t

<!-- Source EN PDF p.183; unit 2188 -->

【Description】 The merge property is configured

<!-- Source EN PDF p.183; unit 2189 -->

【Definition】

<!-- Source EN PDF p.184; unit 2190 -->

```text
 typedef struct mergeAttr_s {
     rk_aiq_uapi_sync_t  sync;
     mergeAttrV21_t      attrV21;
     mergeAttrV30_t      attrV30;
 } mergeAttr_t;
```

<!-- Source EN PDF p.184; unit 2191 -->

【Member】

<!-- Source EN PDF p.184; unit 2192 -->

| Member Name | Description |
|---|---|
| sync | For rk_aiq_uapi_sync_t definitions, see Overview/API Description section |
| attrV21 | The merge attribute under the RK356x chip is invalid in the RK3588 chip |
| attrV30 | The merge attribute under the RK3588 chip is invalid in the RK356x chip |

<!-- Source EN PDF p.184; unit 2193 -->

### 9.3   DRC

<!-- Source EN PDF p.184; unit 2194 -->

#### 9.3.1  Description of the feature

<!-- Source EN PDF p.184; unit 2195 -->

DRC (High Dynamic Range Compression), which compresses high-bit images to low-bit images.

<!-- Source EN PDF p.184; unit 2196 -->

#### 9.3.2  Important concepts

<!-- Source EN PDF p.184; unit 2197 -->

DRC can be used in either linear or HDR mode.

<!-- Source EN PDF p.184; unit 2198 -->

#### 9.3.3  Feature-level API reference

<!-- Source EN PDF p.184; unit 2199 -->

9.3.3.1  rk_aiq_uapi2_setDrcGain

<!-- Source EN PDF p.184; unit 2200 -->

【Description】

<!-- Source EN PDF p.184; unit 2201 -->

Quickly set DrcGain curve-related parameters.

<!-- Source EN PDF p.184; unit 2202 -->

【Grammar】

<!-- Source EN PDF p.184; unit 2203 -->

```text
 XCamReturn rk_aiq_uapi2_setDrcGain(const rk_aiq_sys_ctx_t* ctx, float Gain, float
 Alpha, float Clip);
```

At this time, the mode of the api is DRC_OPMODE_DRC_GAIN, after calling the interface, the interface parameters will be stored in stDrcGain, the three parameters that constitute the DrcGain curve are determined by stDrcGain, and the other parameters of the DRC module are still determined by the parameters of the DRC module in the json file.

<!-- Source EN PDF p.184; unit 2204 -->

【Parameters】

<!-- Source EN PDF p.185; unit 2205 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| Gain | Gain value<br>range: [1,8] | Input |
| Alpha | Alpha value<br>range: [0,1] | Input |
| Clip | Clip value<br>range: [0,64] | Input |

<!-- Source EN PDF p.185; unit 2206 -->

【Return Value】

<!-- Source EN PDF p.185; unit 2207 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.185; unit 2208 -->

【Requirements】

<!-- Source EN PDF p.185; unit 2209 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.185; unit 2210 -->

Library file: librkaiq.so

<!-- Source EN PDF p.185; unit 2211 -->

9.3.3.2  rk_aiq_uapi2_getDrcGain

<!-- Source EN PDF p.185; unit 2212 -->

【Description】

<!-- Source EN PDF p.185; unit 2213 -->

Get the parameters associated with the fast DrcGain curve.

<!-- Source EN PDF p.185; unit 2214 -->

The parameters related to the DrcGain curve obtained by the API are the parameters in stDrcGain, and only when the api mode is set to DRC_OPMODE_DRC_GAIN, the parameters that are actually used are the current parameters.

<!-- Source EN PDF p.185; unit 2215 -->

【Grammar】

<!-- Source EN PDF p.185; unit 2216 -->

```text
 XCamReturn rk_aiq_uapi2_getDrcGain(const rk_aiq_sys_ctx_t* ctx, float Gain, float
 Alpha, float Clip);
```

<!-- Source EN PDF p.185; unit 2217 -->

【Parameters】

<!-- Source EN PDF p.186; unit 2218 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| Gain | Gain value<br>range: [1,8] | Output |
| Alpha | Alpha value<br>range: [0,1] | output |
| Clip | Clip value<br>range: [0,64] | output |

<!-- Source EN PDF p.186; unit 2219 -->

【Return Value】

<!-- Source EN PDF p.186; unit 2220 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.186; unit 2221 -->

【Requirements】

<!-- Source EN PDF p.186; unit 2222 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.186; unit 2223 -->

Library file: librkaiq.so

<!-- Source EN PDF p.186; unit 2224 -->

9.3.3.3  rk_aiq_uapi2_setDrcHiLit

<!-- Source EN PDF p.186; unit 2225 -->

【Description】

<!-- Source EN PDF p.186; unit 2226 -->

Quickly set DrcHiLit parameters.

<!-- Source EN PDF p.186; unit 2227 -->

In this case, the mode of the API is DRC_OPMODE_HILIT, after calling the interface, the interface parameters will be stored in stHiLit, the HiLight parameters will be determined by stHiLit, and other parameters of the DRC module will still be determined by the parameters of the DRC module in the json file.

<!-- Source EN PDF p.186; unit 2228 -->

【Grammar】

<!-- Source EN PDF p.186; unit 2229 -->

```text
 XCamReturn rk_aiq_uapi2_setDrcHiLit(const rk_aiq_sys_ctx_t* ctx, float Strength);
```

<!-- Source EN PDF p.186; unit 2230 -->

【Parameters】

<!-- Source EN PDF p.186; unit 2231 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| Strength | Intensity<br>value range: [0,1] | Input |

<!-- Source EN PDF p.186; unit 2232 -->

【Return Value】

<!-- Source EN PDF p.187; unit 2233 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.187; unit 2234 -->

【Requirements】

<!-- Source EN PDF p.187; unit 2235 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.187; unit 2236 -->

Library file: librkaiq.so

<!-- Source EN PDF p.187; unit 2237 -->

9.3.3.4  rk_aiq_uapi2_getDrcHiLit

<!-- Source EN PDF p.187; unit 2238 -->

【Description】

<!-- Source EN PDF p.187; unit 2239 -->

Get the relevant parameters for quick DrcHiLit.

<!-- Source EN PDF p.187; unit 2240 -->

The DrcHiLit parameters obtained by the API are the parameters in stHiLit, and only when the API mode is set to DRC_OPMODE_HILIT, the parameters that are currently in use are the parameters that are actually used.

<!-- Source EN PDF p.187; unit 2241 -->

【Grammar】

<!-- Source EN PDF p.187; unit 2242 -->

```text
 XCamReturn rk_aiq_uapi2_getDrcHiLit(const rk_aiq_sys_ctx_t* ctx, float Strength);
```

<!-- Source EN PDF p.187; unit 2243 -->

【Parameters】

<!-- Source EN PDF p.187; unit 2244 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| Strength | Intensity<br>value range: [0,1] | output |

<!-- Source EN PDF p.187; unit 2245 -->

【Return Value】

<!-- Source EN PDF p.187; unit 2246 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.187; unit 2247 -->

【Requirements】

<!-- Source EN PDF p.187; unit 2248 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.187; unit 2249 -->

Library file: librkaiq.so

<!-- Source EN PDF p.187; unit 2250 -->

9.3.3.5  rk_aiq_uapi2_setDrcLocalData

<!-- Source EN PDF p.187; unit 2251 -->

【Description】

<!-- Source EN PDF p.187; unit 2252 -->

Quickly set DrcLocalData parameters.

<!-- Source EN PDF p.188; unit 2253 -->

In this case, the mode of the API is DRC_OPMODE_LOCAL_TMO, after calling the API, the interface parameters will be stored in stLocalDataV30, the LocalData parameters will be determined by stLocalDataV30, and other parameters of the DRC module will still be determined by the parameters of the DRC module in the json file.

<!-- Source EN PDF p.188; unit 2254 -->

【Grammar】

<!-- Source EN PDF p.188; unit 2255 -->

```text
 XCamReturn rk_aiq_uapi2_setDrcLocalData(const rk_aiq_sys_ctx_t* ctx, float
 LocalWeit, float GlobalContrast, float LoLitContrast，int LocalAutoEnable, float
 LocalAutoWeit);
```

<!-- Source EN PDF p.188; unit 2256 -->

【Parameters】

<!-- Source EN PDF p.188; unit 2257 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| LocalWeit | LocalWeit value<br>range: [0,1] | Input |
| GlobalContrast | GlobalContrast value<br>range: [0,1] | Input |
| LoLitContrast | LoLitContrast value<br>range: [0,1] | Input |
| LocalAutoEnable | Automatic Local switch<br>value range: [0,1] | Input |
| LocalAutoWeit | Automatic LocalWeit value<br>range: [0,1] | Input |

<!-- Source EN PDF p.188; unit 2258 -->

【Return Value】

<!-- Source EN PDF p.188; unit 2259 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.188; unit 2260 -->

【Requirements】

<!-- Source EN PDF p.188; unit 2261 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.188; unit 2262 -->

Library file: librkaiq.so

<!-- Source EN PDF p.188; unit 2263 -->

9.3.3.6  rk_aiq_uapi2_getDrcLocalData

<!-- Source EN PDF p.188; unit 2264 -->

【Description】

<!-- Source EN PDF p.188; unit 2265 -->

Obtain the parameters related to DrcLocalData.

<!-- Source EN PDF p.188; unit 2266 -->

The LocalData parameters obtained by the API are the parameters in stLocalDataV30 and are used only when the API mode is set to DRC_OPMODE_LOCAL_TMO.

<!-- Source EN PDF p.189; unit 2267 -->

【Grammar】

<!-- Source EN PDF p.189; unit 2268 -->

```text
 XCamReturn rk_aiq_uapi2_getDrcLocalData(const rk_aiq_sys_ctx_t* ctx, float*
 LocalWeit, float* GlobalContrast, float* LoLitContrast，int* LocalAutoEnable,
 float* LocalAutoWeit);
```

<!-- Source EN PDF p.189; unit 2269 -->

【Parameters】

<!-- Source EN PDF p.189; unit 2270 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| LocalWeit | LocalWeit value<br>range: [0,1] | output |
| GlobalContrast | GlobalContrast value<br>range: [0,1] | output |
| LoLitContrast | LoLitContrast value<br>range: [0,1] | output |
| ocalAutoEnable | Automatic Local switch<br>value range: [0,1] | output |
| LocalAutoWeit | Automatic LocalWeit value<br>range: [0,1] | output |

<!-- Source EN PDF p.189; unit 2271 -->

【Return Value】

<!-- Source EN PDF p.189; unit 2272 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.189; unit 2273 -->

【Requirements】

<!-- Source EN PDF p.189; unit 2274 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.189; unit 2275 -->

Library file: librkaiq.so

<!-- Source EN PDF p.189; unit 2276 -->

#### 9.3.4  Module-level API reference

<!-- Source EN PDF p.189; unit 2277 -->

9.3.4.1  rk_aiq_user_api2_adrc_SetAttrib

<!-- Source EN PDF p.189; unit 2278 -->

【Description】 Set the DRC software properties.

<!-- Source EN PDF p.189; unit 2279 -->

【Grammar】

<!-- Source EN PDF p.189; unit 2280 -->

```text
 XCamReturn
 rk_aiq_user_api2_adrc_SetAttrib(RkAiqAlgoContext* ctx,
                            drc_attrib_t attr);
```

<!-- Source EN PDF p.190; unit 2281 -->

【Parameters】

<!-- Source EN PDF p.190; unit 2282 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| attr | DRC Software Property Structure | Input |

<!-- Source EN PDF p.190; unit 2283 -->

【Return Value】

<!-- Source EN PDF p.190; unit 2284 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.190; unit 2285 -->

【Requirements】

<!-- Source EN PDF p.190; unit 2286 -->

Header file: rk_aiq_user_api2_adrc.h

<!-- Source EN PDF p.190; unit 2287 -->

Library file: librkaiq.so

<!-- Source EN PDF p.190; unit 2288 -->

【Description】

<!-- Source EN PDF p.190; unit 2289 -->

9.3.4.2  rk_aiq_user_api2_adrc_GetAttrib

<!-- Source EN PDF p.190; unit 2290 -->

【Description】 Obtain DRC software properties.

<!-- Source EN PDF p.190; unit 2291 -->

【Grammar】

<!-- Source EN PDF p.190; unit 2292 -->

```text
 XCamReturn
 rk_aiq_user_api2_adrc_GetAttrib(RkAiqAlgoContext* ctx,
                            drc_attrib_t* attr);
```

<!-- Source EN PDF p.190; unit 2293 -->

【Parameters】

<!-- Source EN PDF p.190; unit 2294 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| attr | DRC Software Property Structure | Output |

<!-- Source EN PDF p.190; unit 2295 -->

【Return Value】

<!-- Source EN PDF p.190; unit 2296 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.190; unit 2297 -->

【Requirements】

<!-- Source EN PDF p.190; unit 2298 -->

Header file: rk_aiq_user_api2_adrc.h

<!-- Source EN PDF p.191; unit 2299 -->

Library file: librkaiq.so

<!-- Source EN PDF p.191; unit 2300 -->

【Description】

<!-- Source EN PDF p.191; unit 2301 -->

#### 9.3.5  Module-level API data types

<!-- Source EN PDF p.191; unit 2302 -->

9.3.5.1  AdrcVersion_t

<!-- Source EN PDF p.191; unit 2303 -->

【Description】 Define the DRC version attributes

<!-- Source EN PDF p.191; unit 2304 -->

【Definition】

<!-- Source EN PDF p.191; unit 2305 -->

```text
 typedef enum AdrcVersion_e {
     ADRC_VERSION_356X = 0,
     ADRC_VERSION_3588 = 1,
     ADRC_VERSION_MAX
 } AdrcVersion_t;
```

<!-- Source EN PDF p.191; unit 2306 -->

【Member】

<!-- Source EN PDF p.191; unit 2307 -->

| Member Name | Description |
|---|---|
| ADRC_VERSION_356X | RK356x |
| ADRC_VERSION_3588 | RK3588 |
| ADRC_VERSION_MAX | Maximum version mode |

<!-- Source EN PDF p.191; unit 2308 -->

9.3.5.2  drc_OpMode_t

<!-- Source EN PDF p.191; unit 2309 -->

【Description】 Define the DRC operating mode

<!-- Source EN PDF p.191; unit 2310 -->

【Definition】

<!-- Source EN PDF p.191; unit 2311 -->

```text
 typedef enum drc_OpMode_e {
     DRC_OPMODE_API_OFF   = 0,
     DRC_OPMODE_MANU      = 1,
     DRC_OPMODE_DRC_GAIN  = 2,
     DRC_OPMODE_HILIT     = 3,
     DRC_OPMODE_LOCAL_TMO = 4,
 } drc_OpMode_t;
```

<!-- Source EN PDF p.191; unit 2312 -->

【Member】

<!-- Source EN PDF p.192; unit 2313 -->

| Member Name | Description |
|---|---|
| DRC_OPMODE_API_OFF | In automatic mode, all parameters in the Drc module are determined<br>by json |
| DRC_OPMODE_MANU | In manual mode, all parameters in the Drc module are determined by<br>stManualV30 |
| DRC_OPMODE_DRC_GAIN | In DrcGain mode, some parameters of DrcGain are determined by<br>stDrcGain, and other parameters are determined by the relevant<br>parameters in the json file |
| DRC_OPMODE_HILIT | In HiLit mode, some parameters of HiLight are determined by stHiLit,<br>and other parameters are determined by relevant parameters in the<br>json file |
| DRC_OPMODE_LOCAL_TMO | In LocalTMO mode, some parameters of LocalData are determined by<br>stLocalDataV30, and other parameters are determined by relevant<br>parameters in the json file |

<!-- Source EN PDF p.192; unit 2314 -->

9.3.5.3  mDrcGain_t

<!-- Source EN PDF p.192; unit 2315 -->

【Description】 Define manual DrcGain parameter properties

<!-- Source EN PDF p.192; unit 2316 -->

【Definition】

<!-- Source EN PDF p.192; unit 2317 -->

```text
 typedef struct mDrcGain_s {
     float DrcGain;
     float Alpha;
     float Clip;
 } mDrcGain_t;
```

<!-- Source EN PDF p.192; unit 2318 -->

【Member】

<!-- Source EN PDF p.192; unit 2319 -->

| Member Name | Description |
|---|---|
| DrcGain | Manual DrcGain value, value range [1,8], default value is 1, accuracy 0.01 |
| Alpha | Manual alpha value, value range [0,1], default value is 0.2, precision 0.01 |
| Clip | Manual Clip value, value range [0,64], default value is 16, precision 0.01 |

<!-- Source EN PDF p.192; unit 2320 -->

9.3.5.4  mDrcHiLit_t

<!-- Source EN PDF p.192; unit 2321 -->

【Description】 Define the manual Drc HiLit parameter properties

<!-- Source EN PDF p.192; unit 2322 -->

【Definition】

<!-- Source EN PDF p.193; unit 2323 -->

```text
 typedef struct mDrcHiLit_s {
     float Strength;
 } mDrcHiLit_t;
```

<!-- Source EN PDF p.193; unit 2324 -->

【Member】

<!-- Source EN PDF p.193; unit 2325 -->

| Member Name | Description |
|---|---|
| Strength | Manual Strength value, value range [0,1], default value is 0, precision 0.01 |

<!-- Source EN PDF p.193; unit 2326 -->

9.3.5.5  mLocalDataV21_t

<!-- Source EN PDF p.193; unit 2327 -->

【Description】 Define the DRC Local parameter attribute under RK356x

<!-- Source EN PDF p.193; unit 2328 -->

【Definition】

<!-- Source EN PDF p.193; unit 2329 -->

```text
 typedef struct mLocalDataV21_s {
     float LocalWeit;
     float GlobalContrast;
     float LoLitContrast;
 } mLocalDataV21_t;
```

<!-- Source EN PDF p.193; unit 2330 -->

【Member】

<!-- Source EN PDF p.193; unit 2331 -->

| Member<br>Name | Description |
|---|---|
| LocalWeit | Manual LocalWeit value in the range of 0,1, the default value is 1, and the accuracy is<br>0.01 |
| GlobalContrast | Manual GlobalContrast value, the value range is 0,1, the default value is 0, and the<br>accuracy is 0.01 |
| LoLitContrast | Manual LoLitContrast value in the range of 0,1, the default value is 0, and the accuracy<br>is 0.01 |

<!-- Source EN PDF p.193; unit 2332 -->

9.3.5.6  mLocalDataV30_t

<!-- Source EN PDF p.193; unit 2333 -->

【Description】 Define the DRC Local parameter attribute under RK356x

<!-- Source EN PDF p.193; unit 2334 -->

【Definition】

<!-- Source EN PDF p.194; unit 2335 -->

```text
 typedef struct mLocalDataV30_s {
     float         LocalWeit;
     int           LocalAutoEnable;
     float         LocalAutoWeit;
     float         GlobalContrast;
     float         LoLitContrast;
 } mLocalDataV30_t;
```

<!-- Source EN PDF p.194; unit 2336 -->

【Member】

<!-- Source EN PDF p.194; unit 2337 -->

| Member Name | Description |
|---|---|
| LocalWeit | Manual LocalWeit value, value range [0,1], default value is 1, precision 0.01. |
| LocalAutoEnable | Automatic LocalWeit switch, value range [0,1], default value is 1, accuracy 1 |
| LocalAutoWeit | Automatic LocalWeit value, value range [0,1], default value is 0.4, accuracy 0.01. |
| GlobalContrast | Manual GlobalContrast value, value range [0,1], default value is 0, precision 0.01. |
| LoLitContrast | Manual LoLitContrast value, value range [0,1], default value is 0, precision 0.01. |

<!-- Source EN PDF p.194; unit 2338 -->

9.3.5.7  mDrcLocalV21_t

<!-- Source EN PDF p.194; unit 2339 -->

【Description】 Define the DRC Local parameter attribute under RK356x

<!-- Source EN PDF p.194; unit 2340 -->

【Definition】

<!-- Source EN PDF p.194; unit 2341 -->

```text
 typedef struct mDrcLocalV21_s {
     mLocalDataV21_t LocalData;
     float           curPixWeit;
     float           preFrameWeit;
     float           Range_force_sgm;
     float           Range_sgm_cur;
     float           Range_sgm_pre;
     int             Space_sgm_cur;
     int             Space_sgm_pre;
 } mDrcLocalV21_t;
```

<!-- Source EN PDF p.194; unit 2342 -->

【Member】

<!-- Source EN PDF p.195; unit 2343 -->

| Member Name | Description |
|---|---|
| LocalData | Manually set LocalData to |
| curPixWeit | The two-sided weight of the current point, the value range is [0,1], the default value<br>is 0.37, and the accuracy is 0.001. |
| preFrameWeit | The bilateral weight of the previous frame, the value range is [0,1], the default value<br>is 0.8, and the accuracy is 0.001 |
| Range_force_sgm | The reciprocal of the two-sided value range sigma, the value range is [0,1], the<br>default value is 0, and the precision is 0.0001. |
| Range_sgm_cur | The reciprocal of the sigma in the bilateral airspace of the previous frame can be in<br>the range of 0,1, with a default value of 0.2 and an accuracy of 0.0001. |
| Range_sgm_pre | The reciprocal of the sigma in the bilateral airspace of the previous frame, the value<br>range is [0,1], the default value is 0.2, and the accuracy is 0.0001. |
| Space_sgm_cur | The reciprocal of the two-sided value range of the current frame, the value range is<br>[0,4095], the default value is 4068, and the precision is 1. |
| Space_sgm_pre | The reciprocal of the two-sided value range sigma in the previous frame, the value<br>range is [0,4095], the default value is 3068, and the precision is 1. |

<!-- Source EN PDF p.195; unit 2344 -->

9.3.5.8  mDrcLocalV30_t

<!-- Source EN PDF p.195; unit 2345 -->

【Description】 Define the DRC Local parameter attribute in RK3588

<!-- Source EN PDF p.195; unit 2346 -->

【Definition】

<!-- Source EN PDF p.195; unit 2347 -->

```text
 typedef struct mDrcLocalV30_s {
     mLocalDataV30_t LocalData;
     float           curPixWeit;
     float           preFrameWeit;
     float           Range_force_sgm;
     float           Range_sgm_cur;
     float           Range_sgm_pre;
     int             Space_sgm_cur;
     int             Space_sgm_pre;
 } mDrcLocalV30_t;
```

<!-- Source EN PDF p.195; unit 2348 -->

【Member】

<!-- Source EN PDF p.196; unit 2349 -->

| Member Name | Description |
|---|---|
| LocalData | Manual LocalData settings |
| curPixWeit | The bilateral weight of the current point, the value range [0,1], the default value is<br>0.37, and the accuracy is 0.001 |
| preFrameWeit | The bilateral weight of the previous frame, the value range [0,1], the default value is<br>0.8, and the precision is 0.001 |
| Range_force_sgm | The reciprocal of the bilateral value range sigma, the value range [0,1], the default<br>value is 0, and the precision is 0.0001 |
| Range_sgm_cur | The reciprocal of the bilateral airspace sigma in the previous frame, the value range<br>[0,1], the default value is 0.2, and the accuracy is 0.0001 |
| Range_sgm_pre | The reciprocal of the bilateral airspace sigma in the previous frame, the value range<br>[0,1], the default value is 0.2, and the accuracy is 0.0001 |
| Space_sgm_cur | The reciprocal of the bilateral value range sigma of the current frame, the value range<br>[0,4095], the default value is 4068, and the precision is 1 |
| Space_sgm_pre | The reciprocal of the previous two-sided value range sigma, the value range [0,4095],<br>the default value is 3068, and the precision is 1 |

<!-- Source EN PDF p.196; unit 2350 -->

9.3.5.9  CompressMode_t

<!-- Source EN PDF p.196; unit 2351 -->

【Description】 Define the manual mode, DrcCompress curve operating mode

<!-- Source EN PDF p.196; unit 2352 -->

【Definition】

<!-- Source EN PDF p.196; unit 2353 -->

```text
 typedef enum CompressMode_s {
     COMPRESS_AUTO   = 0,
     COMPRESS_MANUAL = 1,
 } CompressMode_t;
```

<!-- Source EN PDF p.196; unit 2354 -->

【Member】

<!-- Source EN PDF p.196; unit 2355 -->

| Member Name | Description |
|---|---|
| COMPRESS_AUTO | Manual mode, Compress curve automatic mode |
| COMPRESS_MANUAL | Manual mode, Compress curve manual mode |

<!-- Source EN PDF p.196; unit 2356 -->

9.3.5.10  mDrcCompress_t

<!-- Source EN PDF p.196; unit 2357 -->

【Description】 Define the manual DrcCompress parameter property

<!-- Source EN PDF p.196; unit 2358 -->

【Definition】

<!-- Source EN PDF p.197; unit 2359 -->

```text
 typedef struct mDrcCompress_s {
     CompressMode_t Mode;
     uint16_t       Manual_curve[17];
 } mDrcCompress_t;
```

<!-- Source EN PDF p.197; unit 2360 -->

【Member】

<!-- Source EN PDF p.197; unit 2361 -->

| Member Name | Description |
|---|---|
| Mode | Switch function |
| Manual_curve | In manual mode, Manual Compress Curve |

<!-- Source EN PDF p.197; unit 2362 -->

9.3.5.11  mdrcAttr_V21_t

<!-- Source EN PDF p.197; unit 2363 -->

【Description】 Define the manual DRC properties under the RK356x chip

<!-- Source EN PDF p.197; unit 2364 -->

【Definition】

<!-- Source EN PDF p.197; unit 2365 -->

```text
 typedef struct mdrcAttr_V21_s {
     bool           Enable;
     mDrcGain_t     DrcGain;
     mDrcHiLit_t    HiLight;
     mDrcLocalV21_t LocalSetting;
     mDrcCompress_t CompressSetting;
     int            Scale_y[ADRC_Y_NUM];
     float          Edge_Weit;
     bool           OutPutLongFrame;
     int            IIR_frame;
 } mdrcAttr_V21_t;
```

<!-- Source EN PDF p.197; unit 2366 -->

【Member】

<!-- Source EN PDF p.198; unit 2367 -->

| Member Name | Description |
|---|---|
| Enable | Manual DRC switch |
| DrcGain | Manual DrcGain settings |
| HiLight | Manual HiLit settings |
| LocalSetting | Manual Local Settings |
| CompressSetting | Compression curve settings |
| Scale_y | Gain-corrected scale table, value range [0,2048], accuracy 1. |
| Edge_Weit | The edge response scale value is in the value range [0,1], the default value is 0.02,<br>and the accuracy is 0.01. Used to reduce high-contrast edge Artifact |
| OutPutLongFrame | Only output long frame switch, 0: off, 1: on. |
| IIR_frame | The number of frames of the IIR filter, the value range [1,1000], the default value is<br>2. |

<!-- Source EN PDF p.198; unit 2368 -->

9.3.5.12  mdrcAttr_V30_t

<!-- Source EN PDF p.198; unit 2369 -->

【Description】 Define the manual DRC attributes under the RK3588 chip

<!-- Source EN PDF p.198; unit 2370 -->

【Definition】

<!-- Source EN PDF p.198; unit 2371 -->

```text
 typedef struct mdrcAttr_V30_s {
     bool           Enable;
     mDrcGain_t     DrcGain;
     mDrcHiLit_t    HiLight;
     mDrcLocalV30_t LocalSetting;
     mDrcCompress_t CompressSetting;
     int            Scale_y[ADRC_Y_NUM];
     float          Edge_Weit;
     bool           OutPutLongFrame;
     int            IIR_frame;
 } mdrcAttr_V30_t;
```

<!-- Source EN PDF p.198; unit 2372 -->

【Member】

<!-- Source EN PDF p.199; unit 2373 -->

| Member Name | Description |
|---|---|
| Enable | Manual DRC switch |
| DrcGain | Manual DrcGain settings |
| HiLight | Manual HiLit settings |
| LocalSetting | Manual Local Settings |
| CompressSetting | Compression curve settings |
| Scale_y | Gain-corrected scale table, value range [0,2048], accuracy 1. |
| Edge_Weit | The edge response scale value is in the value range [0,1], the default value is 0.02,<br>and the accuracy is 0.01. Used to reduce high-contrast edge Artifact |
| OutPutLongFrame | Only output long frame switch, 0: off, 1: on. |
| IIR_frame | The number of frames of the IIR filter, the value range [1,1000], the default value is<br>2. |

<!-- Source EN PDF p.199; unit 2374 -->

9.3.5.13  DrcInfo_t

<!-- Source EN PDF p.199; unit 2375 -->

【Description】 Define DRC control parameter properties

<!-- Source EN PDF p.199; unit 2376 -->

【Definition】

<!-- Source EN PDF p.199; unit 2377 -->

```text
 typedef struct DrcInfo_s {
     float EnvLv;
     float ISO;
 } DrcInfo_t;
```

<!-- Source EN PDF p.199; unit 2378 -->

【Member】

<!-- Source EN PDF p.199; unit 2379 -->

| Member Name | Description |
|---|---|
| EnvLv | Current ambient brightness |
| ISO | Current ISO |

<!-- Source EN PDF p.199; unit 2380 -->

9.3.5.14  drcAttr_t

<!-- Source EN PDF p.199; unit 2381 -->

【Description】 Define DRC properties

<!-- Source EN PDF p.199; unit 2382 -->

【Definition】

<!-- Source EN PDF p.200; unit 2383 -->

```text
 typedef struct drcAttr_s {
     rk_aiq_uapi_sync_t sync;
     AdrcVersion_t      Version;
     drc_OpMode_t       opMode;
     mdrcAttr_V21_t     stManualV21;
     mdrcAttr_V30_t     stManualV30;
     mDrcGain_t         stDrcGain;
     mDrcHiLit_t        stHiLit;
     mLocalDataV21_t    stLocalDataV21;
     mLocalDataV30_t    stLocalDataV30;
     DrcInfo_t          Info;
 } drcAttr_t;
```

<!-- Source EN PDF p.200; unit 2384 -->

【Member】

<!-- Source EN PDF p.200; unit 2385 -->

| Member Name | Description |
|---|---|
| sync | For rk_aiq_uapi_sync_t definitions, see Overview/API Description section |
| Version | Version information |
| opMode | API pattern |
| stManualV21 | The manual DRC attribute on the RK356x chip takes effect when opMode is<br>DRC_OPMODE_MANU |
| stManualV30 | The RK3588 is a manual DRC attribute on the chip, and the parameters take effect<br>when opMode is DRC_OPMODE_MANU |
| stDrcGain | DrcGain property, which takes effect when opMode is DRC_OPMODE_DRC_GAIN |
| stHiLit | The Hillitt attribute, the parameter is in effect when Optmod is Dirk_Optmod_Hillit |
| stLocalDataV21 | The LocalData attribute of the RK356x chip takes effect when opMode is<br>DRC_OPMODE_LOCAL_TMO |
| stLocalDataV30 | The LocalData attribute of the RK3588 chip takes effect when opMode is set to<br>DRC_OPMODE_LOCAL_TMO |
| Info | Control parameter information |

<!-- Source EN PDF p.200; unit 2386 -->

### 9.4   Noise Removal

<!-- Source EN PDF p.200; unit 2387 -->

#### 9.4.1  Description of the feature

<!-- Source EN PDF p.200; unit 2388 -->

Image noise refers to unnecessary or unwanted interference information that exists in image data. Image denoising is the process of reducing noise in digital images.

<!-- Source EN PDF p.201; unit 2389 -->

#### 9.4.2  Functional level API reference

<!-- Source EN PDF p.201; unit 2390 -->

9.4.2.1  rk_aiq_uapi2_setNRMode

<!-- Source EN PDF p.201; unit 2391 -->

【Description】 Set the denoising mode.

<!-- Source EN PDF p.201; unit 2392 -->

【Grammar】

<!-- Source EN PDF p.201; unit 2393 -->

```text
 XCamReturn rk_aiq_uapi2_setNRMode(const rk_aiq_sys_ctx_t* ctx, opMode_t mode);
```

<!-- Source EN PDF p.201; unit 2394 -->

【Parameters】

<!-- Source EN PDF p.201; unit 2395 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| mode | Working mode | Input |

<!-- Source EN PDF p.201; unit 2396 -->

【Return Value】

<!-- Source EN PDF p.201; unit 2397 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.201; unit 2398 -->

【Requirements】

<!-- Source EN PDF p.201; unit 2399 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.201; unit 2400 -->

Library file: librkaiq.so

<!-- Source EN PDF p.201; unit 2401 -->

9.4.2.2  rk_aiq_uapi2_getNRMode

<!-- Source EN PDF p.201; unit 2402 -->

【Description】 Gets the current denoising mode.

<!-- Source EN PDF p.201; unit 2403 -->

【Grammar】

<!-- Source EN PDF p.201; unit 2404 -->

```text
 XCamReturn rk_aiq_uapi2_getNRMode(const rk_aiq_sys_ctx_t* ctx, opMode_t* mode);
```

<!-- Source EN PDF p.201; unit 2405 -->

【Parameters】

<!-- Source EN PDF p.201; unit 2406 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| mode | Working mode | Output |

<!-- Source EN PDF p.201; unit 2407 -->

【Return Value】

<!-- Source EN PDF p.202; unit 2408 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.202; unit 2409 -->

【Requirements】

<!-- Source EN PDF p.202; unit 2410 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.202; unit 2411 -->

Library file: librkaiq.so

<!-- Source EN PDF p.202; unit 2412 -->

9.4.2.3  rk_aiq_uapi2_setANRStrth

<!-- Source EN PDF p.202; unit 2413 -->

【Description】 Set the normal denoising intensity.

<!-- Source EN PDF p.202; unit 2414 -->

【Grammar】

<!-- Source EN PDF p.202; unit 2415 -->

```text
 XCamReturn rk_aiq_uapi2_setANRStrth(const rk_aiq_sys_ctx_t* ctx, unsigned int
 level);
```

<!-- Source EN PDF p.202; unit 2416 -->

【Parameters】

<!-- Source EN PDF p.202; unit 2417 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| level | Denoising intensity, value range 0.0-100.0, default value 50. | Input |

<!-- Source EN PDF p.202; unit 2418 -->

【Return Value】

<!-- Source EN PDF p.202; unit 2419 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.202; unit 2420 -->

【Requirements】

<!-- Source EN PDF p.202; unit 2421 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.202; unit 2422 -->

Library file: librkaiq.so

<!-- Source EN PDF p.202; unit 2423 -->

9.4.2.4  rk_aiq_uapi2_getANRStrth

<!-- Source EN PDF p.202; unit 2424 -->

【Description】 Get normal denoising intensity.

<!-- Source EN PDF p.202; unit 2425 -->

【Grammar】

<!-- Source EN PDF p.202; unit 2426 -->

```text
 XCamReturn rk_aiq_uapi2_getANRStrth(const rk_aiq_sys_ctx_t* ctx, unsigned int*
 level);
```

<!-- Source EN PDF p.202; unit 2427 -->

【Parameters】

<!-- Source EN PDF p.203; unit 2428 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| level | Denoising intensity, value range 0.0-100.0, default value 50. | Output |

<!-- Source EN PDF p.203; unit 2429 -->

【Return Value】

<!-- Source EN PDF p.203; unit 2430 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.203; unit 2431 -->

【Requirements】

<!-- Source EN PDF p.203; unit 2432 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.203; unit 2433 -->

Library file: librkaiq.so

<!-- Source EN PDF p.203; unit 2434 -->

9.4.2.5  rk_aiq_uapi2_setMSpaNRStrth

<!-- Source EN PDF p.203; unit 2435 -->

【Description】 Set the airspace denoising intensity.

<!-- Source EN PDF p.203; unit 2436 -->

【Grammar】

<!-- Source EN PDF p.203; unit 2437 -->

```text
 XCamReturn rk_aiq_uapi2_setMSpaNRStrth(const rk_aiq_sys_ctx_t* ctx, bool on,
 unsigned int level);
```

<!-- Source EN PDF p.203; unit 2438 -->

【Parameters】

<!-- Source EN PDF p.203; unit 2439 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| on | Switch | Input |
| level | Denoising intensity, value range 0.0-100.0, default value 50. | Input |

<!-- Source EN PDF p.203; unit 2440 -->

【Return Value】

<!-- Source EN PDF p.203; unit 2441 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.203; unit 2442 -->

【Requirements】

<!-- Source EN PDF p.203; unit 2443 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.203; unit 2444 -->

Library file: librkaiq.so

<!-- Source EN PDF p.204; unit 2445 -->

9.4.2.6  rk_aiq_uapi2_getMSpaNRStrth

<!-- Source EN PDF p.204; unit 2446 -->

【Description】 Get the airspace denoising intensity.

<!-- Source EN PDF p.204; unit 2447 -->

【Grammar】

<!-- Source EN PDF p.204; unit 2448 -->

```text
 XCamReturn rk_aiq_uapi2_getMSpaNRStrth(const rk_aiq_sys_ctx_t* ctx, bool *on,
 unsigned int *level);
```

<!-- Source EN PDF p.204; unit 2449 -->

【Parameters】

<!-- Source EN PDF p.204; unit 2450 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| on | Switch | Output |
| level | Denoising intensity, value range 0.0-100.0, default value 50. | Output |

<!-- Source EN PDF p.204; unit 2451 -->

【Return Value】

<!-- Source EN PDF p.204; unit 2452 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.204; unit 2453 -->

【Requirements】

<!-- Source EN PDF p.204; unit 2454 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.204; unit 2455 -->

Library file: librkaiq.so

<!-- Source EN PDF p.204; unit 2456 -->

9.4.2.7  rk_aiq_uapi2_setMTNRStrth

<!-- Source EN PDF p.204; unit 2457 -->

【Description】 Set the temporal domain denoising intensity.

<!-- Source EN PDF p.204; unit 2458 -->

【Grammar】

<!-- Source EN PDF p.204; unit 2459 -->

```text
 XCamReturn rk_aiq_uapi2_setMTNRStrth(const rk_aiq_sys_ctx_t* ctx, bool on,
 unsigned int level);
```

<!-- Source EN PDF p.204; unit 2460 -->

【Parameters】

<!-- Source EN PDF p.204; unit 2461 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| on | Switch | Input |
| level | Denoising intensity, value range 0.0-100.0, default value 50. | Input |

<!-- Source EN PDF p.204; unit 2462 -->

【Return Value】

<!-- Source EN PDF p.205; unit 2463 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.205; unit 2464 -->

【Requirements】

<!-- Source EN PDF p.205; unit 2465 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.205; unit 2466 -->

Library file: librkaiq.so

<!-- Source EN PDF p.205; unit 2467 -->

9.4.2.8  rk_aiq_uapi2_getMTNRStrth

<!-- Source EN PDF p.205; unit 2468 -->

【Description】 Get the temporal domain denoising intensity.

<!-- Source EN PDF p.205; unit 2469 -->

【Grammar】

<!-- Source EN PDF p.205; unit 2470 -->

```text
 XCamReturn rk_aiq_uapi2_getMTNRStrth(const rk_aiq_sys_ctx_t* ctx, bool *on，
 unsigned int *level);
```

<!-- Source EN PDF p.205; unit 2471 -->

【Parameters】

<!-- Source EN PDF p.205; unit 2472 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| on | Switch | Output |
| level | Denoising intensity, value range 0.0-100.0, default value 50. | Output |

<!-- Source EN PDF p.205; unit 2473 -->

【Return Value】

<!-- Source EN PDF p.205; unit 2474 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.205; unit 2475 -->

【Requirements】

<!-- Source EN PDF p.205; unit 2476 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.205; unit 2477 -->

Library file: librkaiq.so

<!-- Source EN PDF p.206; unit 2478 -->

#### 9.4.3  Module-level API reference

<!-- Source EN PDF p.206; unit 2479 -->

9.4.3.1  rk_aiq_user_api2_abayer2dnrV2_SetAttrib

<!-- Source EN PDF p.206; unit 2480 -->

【Description】 Set the denoising algorithm properties.

<!-- Source EN PDF p.206; unit 2481 -->

【Grammar】

<!-- Source EN PDF p.206; unit 2482 -->

```text
 XCamReturn
 rk_aiq_user_api2_abayer2dnrV2_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_bayer2dnr_attrib_v2_t* attr);
```

<!-- Source EN PDF p.206; unit 2483 -->

【Parameters】

<!-- Source EN PDF p.206; unit 2484 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | Parameter properties for denoising | Input |

<!-- Source EN PDF p.206; unit 2485 -->

【Return Value】

<!-- Source EN PDF p.206; unit 2486 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.206; unit 2487 -->

【Requirements】

<!-- Source EN PDF p.206; unit 2488 -->

Header files: rk_aiq_user_api2_abayer2dnr_v2.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.206; unit 2489 -->

Library file: librkaiq.so

<!-- Source EN PDF p.206; unit 2490 -->

9.4.3.2  rk_aiq_user_api2_abayer2dnrV2_GetAttrib

<!-- Source EN PDF p.206; unit 2491 -->

【Description】 Gets the denoising algorithm properties.

<!-- Source EN PDF p.206; unit 2492 -->

【Grammar】

<!-- Source EN PDF p.206; unit 2493 -->

```text
 XCamReturn
 rk_aiq_user_api2_abayer2dnrV2_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_bayer2dnr_attrib_v2_t* attr);
```

<!-- Source EN PDF p.206; unit 2494 -->

【Parameters】

<!-- Source EN PDF p.207; unit 2495 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | Parameter properties for denoising | Input |

<!-- Source EN PDF p.207; unit 2496 -->

【Return Value】

<!-- Source EN PDF p.207; unit 2497 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.207; unit 2498 -->

【Requirements】

<!-- Source EN PDF p.207; unit 2499 -->

Header files: rk_aiq_user_api2_abayer2dnr_v2.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.207; unit 2500 -->

Library file: librkaiq.so

<!-- Source EN PDF p.207; unit 2501 -->

9.4.3.3  rk_aiq_user_api2_abayer2dnrV2_SetStrength

<!-- Source EN PDF p.207; unit 2502 -->

【Description】 Set the denoising force.

<!-- Source EN PDF p.207; unit 2503 -->

【Grammar】

<!-- Source EN PDF p.207; unit 2504 -->

```text
 XCamReturn
 rk_aiq_user_api2_abayer2dnrV2_SetStrength(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_bayer2dnr_strength_v2_t *pStrength)
```

<!-- Source EN PDF p.207; unit 2505 -->

【Parameters】

<!-- Source EN PDF p.207; unit 2506 -->

| Parameter<br>Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| pStrength | For structures related to denoising intensity, the percent value range<br>in the structure is 0.0-1.0 | Input |

<!-- Source EN PDF p.207; unit 2507 -->

【Return Value】

<!-- Source EN PDF p.207; unit 2508 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.207; unit 2509 -->

【Requirements】

<!-- Source EN PDF p.208; unit 2510 -->

Header files: rk_aiq_user_api2_abayer2dnr_v2.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.208; unit 2511 -->

Library file: librkaiq.so

<!-- Source EN PDF p.208; unit 2512 -->

9.4.3.4  rk_aiq_user_api2_abayer2dnrV2_GetStrength

<!-- Source EN PDF p.208; unit 2513 -->

【Description】 Get denoising power.

<!-- Source EN PDF p.208; unit 2514 -->

【Grammar】

<!-- Source EN PDF p.208; unit 2515 -->

```text
 XCamReturn
 rk_aiq_user_api2_abayer2dnrV2_GetStrength(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_bayer2dnr_strength_v2_t *pStrength);
```

<!-- Source EN PDF p.208; unit 2516 -->

【Parameters】

<!-- Source EN PDF p.208; unit 2517 -->

| Parameter<br>Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| pPercnt | Denoising strength structure pointer, the percentage value range in<br>the structure is 0.0-1.0 | Input |

<!-- Source EN PDF p.208; unit 2518 -->

【Return Value】

<!-- Source EN PDF p.208; unit 2519 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.208; unit 2520 -->

【Requirements】

<!-- Source EN PDF p.208; unit 2521 -->

Header files: rk_aiq_user_api2_abayer2dnr_v2.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.208; unit 2522 -->

Library file: librkaiq.so

<!-- Source EN PDF p.208; unit 2523 -->

9.4.3.5  rk_aiq_user_api2_abayertnrV2_SetAttrib

<!-- Source EN PDF p.208; unit 2524 -->

【Description】 Set the denoising algorithm properties.

<!-- Source EN PDF p.208; unit 2525 -->

【Grammar】

<!-- Source EN PDF p.208; unit 2526 -->

```text
 XCamReturn
 rk_aiq_user_api2_abayertnrV2_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_bayertnr_attrib_v2_t* attr);
```

<!-- Source EN PDF p.208; unit 2527 -->

【Parameters】

<!-- Source EN PDF p.209; unit 2528 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | Parameter properties for denoising | Input |

<!-- Source EN PDF p.209; unit 2529 -->

【Return Value】

<!-- Source EN PDF p.209; unit 2530 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.209; unit 2531 -->

【Requirements】

<!-- Source EN PDF p.209; unit 2532 -->

Header files: rk_aiq_user_api2_abayertnr_v2.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.209; unit 2533 -->

Library file: librkaiq.so

<!-- Source EN PDF p.209; unit 2534 -->

9.4.3.6  rk_aiq_user_api2_abayertnrV2_GetAttrib

<!-- Source EN PDF p.209; unit 2535 -->

【Description】 Gets the denoising algorithm properties.

<!-- Source EN PDF p.209; unit 2536 -->

【Grammar】

<!-- Source EN PDF p.209; unit 2537 -->

```text
 XCamReturn
 rk_aiq_user_api2_abayertnrV2_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_bayertnr_attrib_v2_t* attr);
```

<!-- Source EN PDF p.209; unit 2538 -->

【Parameters】

<!-- Source EN PDF p.209; unit 2539 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | Parameter properties for denoising | Input |

<!-- Source EN PDF p.209; unit 2540 -->

【Return Value】

<!-- Source EN PDF p.209; unit 2541 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.209; unit 2542 -->

【Requirements】

<!-- Source EN PDF p.209; unit 2543 -->

Header files: rk_aiq_user_api2_abayertnr_v2.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.209; unit 2544 -->

Library file: librkaiq.so

<!-- Source EN PDF p.210; unit 2545 -->

9.4.3.7  rk_aiq_user_api2_abayertnrV2_SetStrength

<!-- Source EN PDF p.210; unit 2546 -->

【Description】 Set the denoising force.

<!-- Source EN PDF p.210; unit 2547 -->

【Grammar】

<!-- Source EN PDF p.210; unit 2548 -->

```text
 XCamReturn
 rk_aiq_user_api2_abayertnrV2_SetStrength(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_bayertnr_strength_v2_t *pStrength);
```

<!-- Source EN PDF p.210; unit 2549 -->

【Parameters】

<!-- Source EN PDF p.210; unit 2550 -->

| Parameter<br>Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| pStrength | Denoising strength structure pointer, the percentage value range in<br>the structure is 0.0-1.0 | Input |

<!-- Source EN PDF p.210; unit 2551 -->

【Return Value】

<!-- Source EN PDF p.210; unit 2552 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.210; unit 2553 -->

【Requirements】

<!-- Source EN PDF p.210; unit 2554 -->

Header files: rk_aiq_user_api2_abayertnr_v2.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.210; unit 2555 -->

Library file: librkaiq.so

<!-- Source EN PDF p.210; unit 2556 -->

9.4.3.8  rk_aiq_user_api2_abayertnrV2_GetStrength

<!-- Source EN PDF p.210; unit 2557 -->

【Description】 Get denoising power.

<!-- Source EN PDF p.210; unit 2558 -->

【Grammar】

<!-- Source EN PDF p.210; unit 2559 -->

```text
 XCamReturn
 rk_aiq_user_api2_abayertnrV2_GetStrength(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_bayertnr_strength_v2_t *pStrength);
```

<!-- Source EN PDF p.210; unit 2560 -->

【Parameters】

<!-- Source EN PDF p.211; unit 2561 -->

| Parameter<br>Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| pStrength | Denoising strength structure pointer, the percentage value range in<br>the structure is 0.0-1.0 | Input |

<!-- Source EN PDF p.211; unit 2562 -->

【Return Value】

<!-- Source EN PDF p.211; unit 2563 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.211; unit 2564 -->

【Requirements】

<!-- Source EN PDF p.211; unit 2565 -->

Header files: rk_aiq_user_api2_abayertnr_v2.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.211; unit 2566 -->

Library file: librkaiq.so

<!-- Source EN PDF p.211; unit 2567 -->

9.4.3.9  rk_aiq_user_api2_aynrV3_SetAttrib

<!-- Source EN PDF p.211; unit 2568 -->

【Description】 Set the denoising algorithm properties.

<!-- Source EN PDF p.211; unit 2569 -->

【Grammar】

<!-- Source EN PDF p.211; unit 2570 -->

```text
 XCamReturn
 rk_aiq_user_api2_aynrV3_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_ynr_attrib_v3_t* attr);
```

<!-- Source EN PDF p.211; unit 2571 -->

【Parameters】

<!-- Source EN PDF p.211; unit 2572 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | Parameter properties for denoising | Input |

<!-- Source EN PDF p.211; unit 2573 -->

【Return Value】

<!-- Source EN PDF p.211; unit 2574 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.211; unit 2575 -->

【Requirements】

<!-- Source EN PDF p.211; unit 2576 -->

Header files: rk_aiq_user_api2_aynr_v3.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.212; unit 2577 -->

Library file: librkaiq.so

<!-- Source EN PDF p.212; unit 2578 -->

9.4.3.10  rk_aiq_user_api2_aynrV3_GetAttrib

<!-- Source EN PDF p.212; unit 2579 -->

【Description】 Gets the denoising algorithm properties.

<!-- Source EN PDF p.212; unit 2580 -->

【Grammar】

<!-- Source EN PDF p.212; unit 2581 -->

```text
 XCamReturn
 rk_aiq_user_api2_aynrV3_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_ynr_attrib_v3_t* attr);
```

<!-- Source EN PDF p.212; unit 2582 -->

【Parameters】

<!-- Source EN PDF p.212; unit 2583 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | Parameter properties for denoising | Input |

<!-- Source EN PDF p.212; unit 2584 -->

【Return Value】

<!-- Source EN PDF p.212; unit 2585 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.212; unit 2586 -->

【Requirements】

<!-- Source EN PDF p.212; unit 2587 -->

Header files: rk_aiq_user_api2_aynr_v3.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.212; unit 2588 -->

Library file: librkaiq.so

<!-- Source EN PDF p.212; unit 2589 -->

9.4.3.11  rk_aiq_user_api2_aynrV3_SetStrength

<!-- Source EN PDF p.212; unit 2590 -->

【Description】 Set the denoising force.

<!-- Source EN PDF p.212; unit 2591 -->

【Grammar】

<!-- Source EN PDF p.212; unit 2592 -->

```text
 XCamReturn
 rk_aiq_user_api2_aynrV3_SetStrength(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_ynr_strength_v3_t* pStrength);
```

<!-- Source EN PDF p.212; unit 2593 -->

【Parameters】

<!-- Source EN PDF p.213; unit 2594 -->

| Parameter<br>Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| pStrength | Denoising strength structure pointer, the percentage value range in<br>the structure is 0.0-1.0 | Input |

<!-- Source EN PDF p.213; unit 2595 -->

【Return Value】

<!-- Source EN PDF p.213; unit 2596 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.213; unit 2597 -->

【Requirements】

<!-- Source EN PDF p.213; unit 2598 -->

Header files: rk_aiq_user_api2_aynr_v3.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.213; unit 2599 -->

Library file: librkaiq.so

<!-- Source EN PDF p.213; unit 2600 -->

9.4.3.12  rk_aiq_user_api2_aynrV3_GetStrength

<!-- Source EN PDF p.213; unit 2601 -->

【Description】 Get denoising power.

<!-- Source EN PDF p.213; unit 2602 -->

【Grammar】

<!-- Source EN PDF p.213; unit 2603 -->

```text
 XCamReturn
 rk_aiq_user_api2_aynrV3_GetStrength(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_ynr_strength_v3_t* pStrength);
```

<!-- Source EN PDF p.213; unit 2604 -->

【Parameters】

<!-- Source EN PDF p.213; unit 2605 -->

| Parameter<br>Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| pStrength | Denoising strength structure pointer, the percentage value range in<br>the structure is 0.0-1.0 | Input |

<!-- Source EN PDF p.213; unit 2606 -->

【Return Value】

<!-- Source EN PDF p.213; unit 2607 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.213; unit 2608 -->

【Requirements】

<!-- Source EN PDF p.214; unit 2609 -->

Header files: rk_aiq_user_api2_aynr_v3.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.214; unit 2610 -->

Library file: librkaiq.so

<!-- Source EN PDF p.214; unit 2611 -->

9.4.3.13  rk_aiq_user_api2_acnrV2_SetAttrib

<!-- Source EN PDF p.214; unit 2612 -->

【Description】 Set the denoising algorithm properties.

<!-- Source EN PDF p.214; unit 2613 -->

【Grammar】

<!-- Source EN PDF p.214; unit 2614 -->

```text
 XCamReturn
 rk_aiq_user_api2_acnrV2_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_cnr_attrib_v2_t* attr);
```

<!-- Source EN PDF p.214; unit 2615 -->

【Parameters】

<!-- Source EN PDF p.214; unit 2616 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | Parameter properties for denoising | Input |

<!-- Source EN PDF p.214; unit 2617 -->

【Return Value】

<!-- Source EN PDF p.214; unit 2618 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.214; unit 2619 -->

【Requirements】

<!-- Source EN PDF p.214; unit 2620 -->

Header files: rk_aiq_user_api2_acnr_v2.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.214; unit 2621 -->

Library file: librkaiq.so

<!-- Source EN PDF p.214; unit 2622 -->

9.4.3.14  rk_aiq_user_api2_acnrV2_GetAttrib

<!-- Source EN PDF p.214; unit 2623 -->

【Description】 Gets the denoising algorithm properties.

<!-- Source EN PDF p.214; unit 2624 -->

【Grammar】

<!-- Source EN PDF p.214; unit 2625 -->

```text
 XCamReturn
 rk_aiq_user_api2_acnrV2_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_cnr_attrib_v2_t* attr);
```

<!-- Source EN PDF p.214; unit 2626 -->

【Parameters】

<!-- Source EN PDF p.215; unit 2627 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | Parameter properties for denoising | Input |

<!-- Source EN PDF p.215; unit 2628 -->

【Return Value】

<!-- Source EN PDF p.215; unit 2629 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.215; unit 2630 -->

【Requirements】

<!-- Source EN PDF p.215; unit 2631 -->

Header files: rk_aiq_user_api2_acnr_v2.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.215; unit 2632 -->

Library file: librkaiq.so

<!-- Source EN PDF p.215; unit 2633 -->

9.4.3.15  rk_aiq_user_api2_acnrV2_SetStrength

<!-- Source EN PDF p.215; unit 2634 -->

【Description】 Set the denoising force.

<!-- Source EN PDF p.215; unit 2635 -->

【Grammar】

<!-- Source EN PDF p.215; unit 2636 -->

```text
 XCamReturn
 rk_aiq_user_api2_acnrV2_SetStrength(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_cnr_strength_v2_t *pStrength);
```

<!-- Source EN PDF p.215; unit 2637 -->

【Parameters】

<!-- Source EN PDF p.215; unit 2638 -->

| Parameter<br>Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| pStrength | Denoising strength structure pointer, the percentage value range in<br>the structure is 0.0-1.0 | Input |

<!-- Source EN PDF p.215; unit 2639 -->

【Return Value】

<!-- Source EN PDF p.215; unit 2640 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.215; unit 2641 -->

【Requirements】

<!-- Source EN PDF p.215; unit 2642 -->

Header files: rk_aiq_user_api2_acnr_v2.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.216; unit 2643 -->

Library file: librkaiq.so

<!-- Source EN PDF p.216; unit 2644 -->

9.4.3.16  rk_aiq_user_api2_acnrV2_GetStrength

<!-- Source EN PDF p.216; unit 2645 -->

【Description】 Get denoising power.

<!-- Source EN PDF p.216; unit 2646 -->

【Grammar】

<!-- Source EN PDF p.216; unit 2647 -->

```text
 XCamReturn
 rk_aiq_user_api2_acnrV2_GetStrength(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_cnr_strength_v2_t *pStrength);
```

<!-- Source EN PDF p.216; unit 2648 -->

【Parameters】

<!-- Source EN PDF p.216; unit 2649 -->

| Parameter<br>Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| pStrength | Denoising strength structure pointer, the percentage value range in<br>the structure is 0.0-1.0 | Input |

<!-- Source EN PDF p.216; unit 2650 -->

【Return Value】

<!-- Source EN PDF p.216; unit 2651 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.216; unit 2652 -->

【Requirements】

<!-- Source EN PDF p.216; unit 2653 -->

Header files: rk_aiq_user_api2_acnr_v2.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.216; unit 2654 -->

Library file: librkaiq.so

<!-- Source EN PDF p.216; unit 2655 -->

#### 9.4.4  Module-level API data types

<!-- Source EN PDF p.216; unit 2656 -->

9.4.4.1  rk_aiq_bayer2dnr_attrib_v2_t

<!-- Source EN PDF p.216; unit 2657 -->

【Description】 Define the parameters of the denoising module

<!-- Source EN PDF p.216; unit 2658 -->

【Definition】

<!-- Source EN PDF p.217; unit 2659 -->

```text
 typedef struct rk_aiq_bayer2dnr_attrib_v2_s {
     rk_aiq_uapi_sync_t sync;
 Abayer2dnr_OPMode_V2_t eMode;
     Abayer2dnr_Auto_Attr_V2_t stAuto;
     Abayer2dnr_Manual_Attr_V2_t stManual;
 } rk_aiq_bayer2dnr_attrib_v2_t;
```

<!-- Source EN PDF p.217; unit 2660 -->

【Member】

<!-- Source EN PDF p.217; unit 2661 -->

| Member Name | Description |
|---|---|
| sync | For synchronous asynchronous mode selection, see Overview/API Description section |
| eMode | Bayer2DNR Denoising Module Mode |
| stAuto | Bayer2DNR Denoising Module Auto Mode Parameters |
| stManual | Bayer2DNR Denoising Module Manual Mode Parameters |

<!-- Source EN PDF p.217; unit 2662 -->

9.4.4.2  Abayer2dnr_OPMode_V2_t

<!-- Source EN PDF p.217; unit 2663 -->

【Description】 Define the mode of the denoising module

<!-- Source EN PDF p.217; unit 2664 -->

【Definition】

<!-- Source EN PDF p.217; unit 2665 -->

```text
 typedef enum Abayer2dnr_OPMode_V2_e {
     ABAYER2DNR_OP_MODE_INVALID           = 0,
     ABAYER2DNR_OP_MODE_AUTO              = 1,
     ABAYER2DNR_OP_MODE_MANUAL            = 2,
     ABAYER2DNR_OP_MODE_REG_MANUAL        = 3,
     ABAYER2DNR_OP_MODE_MAX
 } Abayer2dnr_OPMode_V2_t;
```

<!-- Source EN PDF p.217; unit 2666 -->

【Member】

<!-- Source EN PDF p.217; unit 2667 -->

| Member Name | Description |
|---|---|
| ABAYER2DNR_OP_MODE_INVALID | Bayer Domain 2DNR Denoising Module Invalid Mode |
| ABAYER2DNR_OP_MODE_AUTO | Bayer Domain 2DNR Denoising Module Auto Mode |
| ABAYER2DNR_OP_MODE_MANUAL | Bayer Domain 2DNR Denoising Module Manual Mode<br>Algorithm Settings |
| ABAYER2DNR_OP_MODE_REG_MANUAL | Bayer domain 2DNR denoising module register<br>settings for manual mode |
| ABAYER2DNR_OP_MODE_MAX | Bayer domain 2DNR denoising module mode<br>maximum, is an invalid mode |

<!-- Source EN PDF p.218; unit 2668 -->

9.4.4.3  Abayer2dnr_Auto_Attr_V2_t

<!-- Source EN PDF p.218; unit 2669 -->

【Description】 Define the automatic properties of the denoising module

<!-- Source EN PDF p.218; unit 2670 -->

【Definition】

<!-- Source EN PDF p.218; unit 2671 -->

```text
 typedef struct Abayer2dnr_Auto_Attr_V2_s
 {
     RK_Bayer2dnr_Params_V2_t st2DParams;
     RK_Bayer2dnr_Params_V2_Select_t st2DSelect;
 } Abayer2dnr_Auto_Attr_V2_t;
```

<!-- Source EN PDF p.218; unit 2672 -->

【Member】

<!-- Source EN PDF p.218; unit 2673 -->

| Member Name | Description |
|---|---|
| st2DParams | Bayer2DNR module each ISO corresponds to the algorithm attribute parameter |
| st2DSelect | The bayer2dnr module calculates the attribute parameter |

<!-- Source EN PDF p.218; unit 2674 -->

9.4.4.4  Abayer2dnr_Manual_Attr_V2_t

<!-- Source EN PDF p.218; unit 2675 -->

【Description】 Define manual properties for the denoising module

<!-- Source EN PDF p.218; unit 2676 -->

【Definition】

<!-- Source EN PDF p.218; unit 2677 -->

```text
 typedef struct Abayer2dnr_Manual_Attr_V2_s
 {
     RK_Bayer2dnr_Params_V2_Select_t st2DSelect;
     RK_Bayer2dnr_Fix_V2_t st2Dfix;
 } Abayer2dnr_Manual_Attr_V2_t;
```

<!-- Source EN PDF p.218; unit 2678 -->

【Member】

<!-- Source EN PDF p.218; unit 2679 -->

| Member Name | Description |
|---|---|
| st2DSelect | Bayer2DNR algorithm parameter value |
| st2Dfix | Bayer2DNR register value in manual mode |

<!-- Source EN PDF p.218; unit 2680 -->

9.4.4.5  RK_Bayer2dnr_Params_V2_t

<!-- Source EN PDF p.218; unit 2681 -->

【Description】 Define the automatic mode of the denoising module, and the corresponding ISO algorithm attribute parameters

<!-- Source EN PDF p.218; unit 2682 -->

【Definition】

<!-- Source EN PDF p.219; unit 2683 -->

```text
 typedef struct RK_Bayer2dnr_Params_V2_s
 {
     int enable;
     float iso[RK_BAYER2DNR_V2_MAX_ISO_NUM];
     int   lumapoint[16];
     int   sigma[RK_BAYER2DNR_V2_MAX_ISO_NUM][16];
     float filter_strength[RK_BAYER2DNR_V2_MAX_ISO_NUM];
     float edgesofts[RK_BAYER2DNR_V2_MAX_ISO_NUM];
     float ratio[RK_BAYER2DNR_V2_MAX_ISO_NUM];
     float weight[RK_BAYER2DNR_V2_MAX_ISO_NUM];
     int   gauss_guide[RK_BAYER2DNR_V2_MAX_ISO_NUM];
     int pix_diff[RK_BAYER2DNR_V2_MAX_ISO_NUM];
     int diff_thld[RK_BAYER2DNR_V2_MAX_ISO_NUM];
 } RK_Bayer2dnr_Params_V2_t;
```

<!-- Source EN PDF p.219; unit 2684 -->

【Member】

<!-- Source EN PDF p.220; unit 2685 -->

| Member<br>Name | Parameter<br>type | Description |
|---|---|---|
| enable | Debug<br>parameter | The module switch is enabled. 1: The module is on, 0: The module<br>is closed. |
| ISO | Debug<br>parameter | Different ISO gears, corresponding to different debugging<br>parameters. Currently, only 13 gears are supported |
| lumapoint | Calibration<br>Data | Different pixel brightness corresponds to different noise sigma curve<br>points. A total of 16 points |
| sigma | Calibration<br>Data | Different pixel brightness corresponds to different noise sigma curve<br>points. A total of 16 points |
| gauss_guide | Debug<br>parameter | Whether the Gaussian steering is enabled. 1: Enable. 0: Closed. |
| filter_strength | Debug<br>parameter | Denoising velocity parameter. The value range is [0, 16], the higher<br>the value, the greater the denoising power |
| edgesofts | Debug<br>parameter | Affects airspace weights. The value ranges from 1 to 16, and the<br>default value is 1. |
| ratio | Debug<br>parameter | Soft threshold weights. The value range is 0, 1.0. The lower the<br>value, the greater the denoising power |
| weight | Debug<br>parameter | The higher the filter output weight, the greater the denoising<br>intensity |
| pix_diff | Debug<br>parameter | 5x5 window pixel difference threshold for bilateral filtering; Default<br>configuration value 0x3fff. |
| diff_thld | Debug<br>parameter | The square difference threshold for calculating Euclidean distances<br>for bilateral filtering is 0x3ff; |

<!-- Source EN PDF p.220; unit 2686 -->

9.4.4.6  RK_Bayer2dnr_Params_V2_Select_t

<!-- Source EN PDF p.220; unit 2687 -->

【Description】 Define the manual mode algorithm properties of the denoising module

<!-- Source EN PDF p.220; unit 2688 -->

【Definition】

<!-- Source EN PDF p.220; unit 2689 -->

```text
 typedef struct RK_Bayer2dnr_Params_V2_Select_s
 {
     int enable;
     int lumapoint[16];
     int sigma[16];
     float filter_strength;
     float edgesofts;
     float ratio;
     float weight;
     int gauss_guide;
     int pix_diff;
     int diff_thld;
 } RK_Bayer2dnr_Params_V2_Select_t;
```

<!-- Source EN PDF p.221; unit 2690 -->

【Members】

<!-- Source EN PDF p.221; unit 2691 -->

| Member<br>name | Parameter<br>type | Description |
|---|---|---|
| enable | Debug<br>parameters | The module switch is enabled. 1: Module open, 0: Module off. |
| lumapoint | Calibration<br>data | Different Pixel brightness corresponds to different noise SIGMA<br>curve points. A total of 16 points. |
| sigma | Calibration<br>data | Different Pixel brightness corresponds to different noise SIGMA<br>curve points. A total of 16 points. |
| gauss_guide | Debug<br>parameters | Whether Gaussian guidance is enabled. 1: Enable. 0: Close. |
| filter_strength | Debug<br>parameters | Denoising force parameters. Value range [0, 16], the larger the<br>value, the greater the denoising force. |
| edgesofts | Debug<br>parameters | Affects airspace weights. The value range is [1, 16], and the default<br>value is 1. |
| ratio | Debug<br>parameters | Soft threshold weights. The value range is [0, 1.0]. The smaller the<br>value, the greater the denoising force. |
| weight | Debug<br>parameter | The higher the filter output weight, the greater the denoising<br>intensity |
| pix_diff | Debug<br>parameter | 5x5 window pixel difference threshold for bilateral filtering;<br>Default configuration value 0x3fff. |
| diff_thld | Debug<br>parameter | The square difference threshold for calculating Euclidean distances<br>for bilateral filtering is 0x3ff; |

<!-- Source EN PDF p.221; unit 2692 -->

9.4.4.7  RK_Bayer2dnr_Fix_V2_t

<!-- Source EN PDF p.221; unit 2693 -->

【Description】 Define the manual mode register configuration for the denoising module

<!-- Source EN PDF p.221; unit 2694 -->

【Definition】

<!-- Source EN PDF p.221; unit 2695 -->

```text
 typedef struct RK_Bayer2dnr_Fix_V2_s {
     //ISP_BAYNR_3A00_CTRL
     uint8_t baynr_lg2_mode;
     uint8_t baynr_gauss_en;
     uint8_t baynr_log_bypass;
     uint8_t baynr_en;
     // ISP_BAYNR_3A00_DGAIN0-2
     uint16_t baynr_dgain[3];
     // ISP_BAYNR_3A00_PIXDIFF
     uint16_t baynr_pix_diff;
     // ISP_BAYNR_3A00_THLD
     uint16_t baynr_diff_thld;
     uint16_t baynr_softthld;
     // ISP_BAYNR_3A00_W1_STRENG
     uint16_t bltflt_streng;
     uint16_t baynr_reg_w1;
     // ISP_BAYNR_3A00_SIGMAX0-15
     uint16_t sigma_x[16];
     // ISP_BAYNR_3A00_SIGMAY0-15
     uint16_t sigma_y[16];
     // ISP_BAYNR_3A00_WRIT_D
     uint16_t weit_d[3];
     uint16_t lg2_lgoff;
     uint16_t lg2_off;
     uint32_t dat_max;
 } RK_Bayer2dnr_Fix_V2_t;
 } RK_Bayer2dnr_Fix_V23_t;
```

<!-- Source EN PDF p.222; unit 2696 -->

【Members】

<!-- Source EN PDF p.223; unit 2697 -->

| Parameter | Bit<br>width | Parameter description |
|---|---|---|
| baynr_gauss_en | 1 | Gaussian 3x3 Guided Filter Switch Enable Position;<br>1: Turn on filtering;<br>0: Turn off filtering;<br>The default value is 0; |
| baynr_log_bypass | 1 | log transform whether to perform the control bit, HDR hardware<br>internal forced shutdown;<br>1: Turn on log transformation bypass, that is, turn off log<br>transformation;<br>0: Disable log conversion bypass, that is, enable log transformation;<br>The default value is 0; |
| baynr_en | 1 | Bayer noise reduction switching enable bit;<br>1: Turn on noise reduction;<br>0: Turn off noise reduction;<br>The default configuration value is 0; |
| baynr_dgain | 18 | In HDR mode, the parameter corresponding to the gain of three frames,<br>decimal 10bit. |
| baynr_pix_diff | 14 | 5x5 window pixel difference threshold for bilateral filtering;<br>Default configuration value 0x3fff |
| baynr_diff_thld | 10 | The square difference threshold for calculating the Euclidean distance<br>for bilateral filtering has<br>a default configuration value of 0x3ff; |
| baynr_softthld | 10 | Weight value of soft threshold, larger value, larger threshold, more noise<br>retained,<br>10 bits decimal, default configuration value 0xa; |
| bltflt_streng | 12 | the noise reduction intensity of bilateral filtering;<br>decimal 8bit; Default configuration value 0xa3 |
| baynr_reg_w1 | 10 | Filter output weight value, the larger the value, the more filtered output<br>value is used, and the smaller the more the original value is used.<br>Decimal places 10bit, default configuration value 0x3ff; |
| sigma_x | 16 | The 16 brightness levels of the noise curve should be configured to<br>ensure that the interpolation of the two values is to the<br>power of 2; |
| sigma_y | 16 | 16 noise sigma levels for the noise curve;<br>The configuration parameters are calibrated. |
| weit_d | 10 | The airspace weight values represent the weight values of different<br>locations.<br>Decimal 10bit; The default configuration values are 0x178, 0x249,<br>0x31d; |

<!-- Source EN PDF p.224; unit 2698 -->

9.4.4.8  rk_aiq_bayer2dnr_strength_v2_t

<!-- Source EN PDF p.224; unit 2699 -->

【Description】 Define the denoising intensity configuration structure of the denoising module

<!-- Source EN PDF p.224; unit 2700 -->

【Definition】

<!-- Source EN PDF p.224; unit 2701 -->

```text
 typedef struct rk_aiq_bayer2dnr_strength_v2_s {
     rk_aiq_uapi_sync_t sync;
     float percent;
 } rk_aiq_bayer2dnr_strength_v2_t;
```

<!-- Source EN PDF p.224; unit 2702 -->

【Member】

<!-- Source EN PDF p.224; unit 2703 -->

| Member Name | Description |
|---|---|
| sync | For synchronous asynchronous mode selection, see Overview/API Description section |
| percent | Denoising intensity, the value range is 0.0-1.0. |

<!-- Source EN PDF p.224; unit 2704 -->

9.4.4.9  rk_aiq_bayertnr_attrib_v2_t

<!-- Source EN PDF p.224; unit 2705 -->

【Description】 Define the denoising module parameters

<!-- Source EN PDF p.224; unit 2706 -->

【Definition】

<!-- Source EN PDF p.224; unit 2707 -->

```text
 typedef struct rk_aiq_bayertnr_attrib_v2_s {
     rk_aiq_uapi_sync_t sync;
     Abayertnr_OPMode_V2_t eMode;
     Abayertnr_Auto_Attr_V2_t stAuto;
     Abayertnr_Manual_Attr_V2_t stManual;
 } rk_aiq_bayertnr_attrib_v2_t;
```

<!-- Source EN PDF p.224; unit 2708 -->

【Member】

<!-- Source EN PDF p.224; unit 2709 -->

| Member Name | Description |
|---|---|
| sync | For synchronous asynchronous mode selection, see Overview/API Description section |
| eMode | Bayertnr Denoising Module Mode |
| stAuto | Bayertnr Denoising Module Auto Mode Parameters |
| stManual | Bayertnr Denoising Module Manual Mode Parameters |

<!-- Source EN PDF p.225; unit 2710 -->

9.4.4.10  Abayertnr_OPMode_V2_t

<!-- Source EN PDF p.225; unit 2711 -->

【Description】 Define the mode of the denoising module

<!-- Source EN PDF p.225; unit 2712 -->

【Definition】

<!-- Source EN PDF p.225; unit 2713 -->

```text
 typedef enum Abayertnr_OPMode_V2_e {
     ABAYERTNRV2_OP_MODE_INVALID           = 0,
     ABAYERTNRV2_OP_MODE_AUTO              = 1,
     ABAYERTNRV2_OP_MODE_MANUAL            = 2,
     ABAYERTNRV2_OP_MODE_REG_MANUAL        = 3,
     ABAYERTNRV2_OP_MODE_MAX
 } Abayertnr_OPMode_V2_t;
```

<!-- Source EN PDF p.225; unit 2714 -->

【Member】

<!-- Source EN PDF p.225; unit 2715 -->

| Member Name | Description |
|---|---|
| ABAYERTNRV2_OP_MODE_INVALID | Bayer Domain TNR Denoising Module Invalid Mode |
| ABAYERTNRV2_OP_MODE_AUTO | Bayer Domain TNR Denoising Module Auto Mode |
| ABAYERTNRV2_OP_MODE_MANUAL | Bayer domain TNR denoising module manual mode<br>algorithm settings |
| ABAYERTNRV2_OP_MODE_MAX | Bayer domain TNR denoising module mode maximum, is an<br>invalid mode |

<!-- Source EN PDF p.225; unit 2716 -->

9.4.4.11  Abayertnr_Auto_Attr_V2_t

<!-- Source EN PDF p.225; unit 2717 -->

【Description】 Define the automatic properties of the denoising module

<!-- Source EN PDF p.225; unit 2718 -->

【Definition】

<!-- Source EN PDF p.225; unit 2719 -->

```text
 typedef struct Abayertnr_Auto_Attr_V2_s
 {
     int bayernr3DEn;
     RK_Bayertnr_Params_V2_t st3DParams;
     RK_Bayertnr_Params_V2_Select_t st3DSelect;
 } Abayertnr_Auto_Attr_V2_t;
```

<!-- Source EN PDF p.225; unit 2720 -->

【Member】

<!-- Source EN PDF p.226; unit 2721 -->

| Member<br>Name | Description |
|---|---|
| bayernr3DEn | Bayer3dnr module enables switch |
| st3DParams | Bayer3DNR module automatic mode each ISO corresponding algorithm attribute<br>parameter |
| st3DSelect | The bayer3dnr module calculates the attribute parameter |

<!-- Source EN PDF p.226; unit 2722 -->

9.4.4.12  Abayertnr_Manual_Attr_V23_t

<!-- Source EN PDF p.226; unit 2723 -->

【Description】 Define manual properties for the denoising module

<!-- Source EN PDF p.226; unit 2724 -->

【Definition】

<!-- Source EN PDF p.226; unit 2725 -->

```text
 typedef struct Abayertnr_Manual_Attr_V2_s
 {
     int bayernr3DEn;
     RK_Bayertnr_Params_V2_Select_t st3DSelect;
     RK_Bayertnr_Fix_V2_t st3DFix;
 } Abayertnr_Manual_Attr_V2_t;
```

<!-- Source EN PDF p.226; unit 2726 -->

【Member】

<!-- Source EN PDF p.226; unit 2727 -->

| Member Name | Description |
|---|---|
| bayernr3DEn | Bayer3dnr module enables switch |
| st3DSelect | Bayer3DNR manual mode algorithm parameter value |
| st3Dfix | Bayer3DNR register value in manual mode |

<!-- Source EN PDF p.226; unit 2728 -->

9.4.4.13  RK_Bayertnr_Params_V2_t

<!-- Source EN PDF p.226; unit 2729 -->

【Description】 Define the automatic mode of the denoising module, and the corresponding ISO algorithm attribute parameters

<!-- Source EN PDF p.226; unit 2730 -->

【Definition】

<!-- Source EN PDF p.226; unit 2731 -->

```text
 typedef struct RK_Bayertnr_Params_V2_s
 {
     int enable;
     float iso[RK_BAYERNR_V2_MAX_ISO_NUM];
     //calib
     int   lumapoint[16];
     int   sigma[RK_BAYERNR_V2_MAX_ISO_NUM][16];
     int   lumapoint2[16];
     int   lo_sigma[RK_BAYERNR_V2_MAX_ISO_NUM][16];
     int   hi_sigma[RK_BAYERNR_V2_MAX_ISO_NUM][16];
     //tuning
     int   thumbds[RK_BAYERNR_V2_MAX_ISO_NUM];
     int   lo_enable[RK_BAYERNR_V2_MAX_ISO_NUM];
     int   hi_enable[RK_BAYERNR_V2_MAX_ISO_NUM];
     int   lo_med_en[RK_BAYERNR_V2_MAX_ISO_NUM];
     int   lo_gsbay_en[RK_BAYERNR_V2_MAX_ISO_NUM];
     int   lo_gslum_en[RK_BAYERNR_V2_MAX_ISO_NUM];
     int   hi_med_en[RK_BAYERNR_V2_MAX_ISO_NUM];
     int   hi_gslum_en[RK_BAYERNR_V2_MAX_ISO_NUM];
     int   global_pk_en[RK_BAYERNR_V2_MAX_ISO_NUM];
     int   global_pksq[RK_BAYERNR_V2_MAX_ISO_NUM];
     float lo_filter_strength[RK_BAYERNR_V2_MAX_ISO_NUM];
     float hi_filter_strength[RK_BAYERNR_V2_MAX_ISO_NUM];
     float soft_threshold_ratio[RK_BAYERNR_V2_MAX_ISO_NUM];
     float hi_wgt_comp[RK_BAYERNR_V2_MAX_ISO_NUM];
     float clipwgt[RK_BAYERNR_V2_MAX_ISO_NUM];
     float hidif_th[RK_BAYERNR_V2_MAX_ISO_NUM];
 } RK_Bayertnr_Params_V2_t;
```

<!-- Source EN PDF p.227; unit 2732 -->

【Member】

<!-- Source EN PDF p.228; unit 2733 -->

| Member Name | Parameter<br>Type | Description |
|---|---|---|
| Enable | Debug<br>parameters | Module Enable Switch |
| iso | Debug<br>parameter | Different ISO gears, corresponding to different debugging<br>parameters. Currently, only 13 |
| lumapoint / sigma | Calibration<br>parameter | The value of the noise curve corresponding to different<br>brightness. A total of 16 points.<br>Lumapoint corresponds to pixel brightness, and sigma<br>corresponds to noise curve value |
| lumapoint2 /<br>lo_sigma | Calibration<br>parameter | The value of the noise curve corresponding to different<br>brightness. A total of 16 points.<br>Lumapoint2 corresponds to the brightness of the pixels, and<br>lo_sigma corresponds to the noise curve value |
| lumapoint2 /<br>hi_sigma | Calibration<br>parameter | The value of the noise curve corresponding to different<br>brightness. A total of 16 points.<br>lumapoint2 corresponds to pixel brightness, and hi_sigma<br>corresponds to noise curve value |
| thumbds | Debug<br>parameter | Downsampling scale |
| lo_enable | Debug<br>parameter | The low-frequency movement determines whether it is open<br>or not, 1 opens, 0 closes. It is turned on by default. |
| hi_enable | Debug<br>parameter | High-frequency motion judgment whether to open, 1 open, 0<br>off. It is turned on by default |
| lo_med_en | Debug<br>parameter | Internal low-frequency sub-module switch, 1 on, 0 off. It is<br>turned on by default |
| lo_gsbay_en | Debug<br>parameter | Internal low-frequency sub-module switch, 1 on, 0 off. It is<br>turned on by default |
| lo_gslum_en | Debug<br>parameter | Internal low-frequency sub-module switch, 1 on, 0 off. It is<br>turned on by default |
| hi_med_en | Debug<br>parameter | Internal high-frequency submodule switch, 1 on, 0 off. It is<br>turned on by default |
| hi_gslum_en | Debug<br>parameter | Internal high-frequency submodule switch, 1 on, 0 off. It is<br>turned on by default |
| global_pk_en | Debug<br>parameter | Whether to use global PK for time domain denoising, 1 is<br>used, 0 is not used.<br>Currently, only 0. |

<!-- Source EN PDF p.229; unit 2734 -->

| Member Name | Parameter<br>Type | Description |
|---|---|---|
| global_pksq | Debug<br>parameter | The square value of the global pk, which is used when the<br>global_pk_en is 1.<br>The default value is 1024, and the value range is [0,<br>268435455] |
| lo_filter_strength | Debug<br>parameter | High-frequency exercise determines strength. Ultimately, it<br>affects Hi Sigma, which in turn affects the denoising intensity<br>in the time domain.<br>The default value is 1, and the value range is [0.0, 16.0] |
| hi_filter_strength | Debug<br>parameter | High-frequency exercise determines strength. Ultimately, it<br>affects Hi Sigma, which in turn affects the denoising intensity<br>in the time domain.<br>The default value is 1, and the value range is [0.0, 16.0] |
| soft_threshold_ratio | Debug<br>parameter | Soft threshold weights. The higher the value, the more noise<br>is<br>retained, and the value range is [0.0 1.0], and the default value<br>is 0 |
| hi_wgt_comp | Debug<br>parameter | The proportional coefficient value of the superposition weight<br>compensation is only useful when the high frequency is<br>turned on;<br>The default value is 0.16, and the value range is [0.0, 1.0]. |
| clipwgt | Debug<br>parameter | The weight limit value of the image overlay.<br>The default value is 0.03215, and the value range is [0.0, 1.0]. |
| hidif_th | Debug<br>parameter | High-frequency difference threshold.<br>The default value is 32767, and the value range is [0, 65535]. |

<!-- Source EN PDF p.229; unit 2735 -->

9.4.4.14  RK_Bayertnr_Params_V2_Select_t

<!-- Source EN PDF p.229; unit 2736 -->

【Description】 Defines the algorithm property struct in manual mode for the Denoising module

<!-- Source EN PDF p.229; unit 2737 -->

【Definition】

<!-- Source EN PDF p.229; unit 2738 -->

```text
 typedef struct RK_Bayertnr_Params_V2_Select_s
 {
     int enable;
     //calib
     int lumapoint[16];
     int sigma[16];
     int lumapoint2[16];
     int lo_sigma[16];
     int hi_sigma[16];
     //tuning
     int thumbds;
     int lo_enable;
     int hi_enable;
     int lo_med_en;
     int lo_gsbay_en;
     int lo_gslum_en;
     int hi_med_en;
     int hi_gslum_en;
     int global_pk_en;
     int global_pksq;
     float lo_filter_strength;
     float hi_filter_strength;
     float soft_threshold_ratio;
     float clipwgt;
     float hi_wgt_comp;
     float hidif_th;
 } RK_Bayertnr_Params_V2_Select_t;
```

<!-- Source EN PDF p.230; unit 2739 -->

【Member】

<!-- Source EN PDF p.231; unit 2740 -->

| Member Name | Parameter<br>Type | Description |
|---|---|---|
| Enable | Debugging<br>parameters | The module enables the switch |
| lumapoint / sigma | Calibration<br>parameters | The value of the noise curve corresponding to different<br>brightness. A total of 16 points.<br>Lumapoint corresponds to pixel brightness, and sigma<br>corresponds to noise curve value |
| lumapoint2 /<br>lo_sigma | Calibration<br>parameters | The value of the noise curve corresponding to different<br>brightness. A total of 16 points.<br>Lumapoint2 corresponds to the brightness of the pixels, and<br>lo_sigma corresponds to the noise curve value |
| lumapoint2 /<br>hi_sigma | Calibration<br>parameters | The value of the noise curve corresponding to different<br>brightness. A total of 16 points.<br>Lumapoint2 corresponds to the brightness of the pixels, and<br>hi_sigma corresponds to the noise curve value |
| thumbds | Debugging<br>parameters | Downsampling ratio |
| lo_enable | Debugging<br>parameters | The low-frequency movement determines whether it is open<br>or not, 1 opens, 0 closes. It is turned on by default. |
| hi_enable | Debugging<br>parameters | High-frequency motion judgment whether to open, 1 open, 0<br>off. It is turned on by default. |
| lo_med_en | Debugging<br>parameters | Internal low-frequency sub-module switch, 1 on, 0 off. It is<br>turned on by default. |
| lo_gsbay_en | Debugging<br>parameters | Internal low-frequency sub-module switch, 1 on, 0 off. It is<br>turned on by default. |
| lo_gslum_en | Debugging<br>parameters | Internal low-frequency sub-module switch, 1 on, 0 off. It is<br>turned on by default. |
| hi_med_en | Debugging<br>parameters | Internal high-frequency submodule switch, 1 on, 0 off. It is<br>turned on by default. |
| hi_gslum_en | Debugging<br>parameters | Internal high-frequency submodule switch, 1 on, 0 off. It is<br>turned on by default. |
| global_pk_en | Debugging<br>parameters | Whether to use global PK for time domain denoising, 1 is<br>used, 0 is not used.<br>At present, only 0. |
| global_pksq | Debugging<br>parameters | The square value of the global pk, which is used when the<br>global_pk_en is 1.<br>The default value is 1024, and the value range is [0,<br>268435455] |

<!-- Source EN PDF p.232; unit 2741 -->

| Member Name | Parameter<br>Type | Description |
|---|---|---|
| lo_filter_strength | Debugging<br>parameters | High-frequency exercise determines strength. Ultimately, it<br>affects Hi Sigma, which in turn affects the denoising intensity<br>in the time domain.<br>Default value 1, value range[0.0, 16.0] |
| hi_filter_strength | Debugging<br>parameters | High-frequency exercise determines strength. Ultimately, it<br>affects Hi Sigma, which in turn affects the denoising intensity<br>in the time domain.<br>Default value 1, value range[0.0, 16.0] |
| soft_threshold_ratio | Debugging<br>parameters | Soft threshold weights. The higher the value, the more noise<br>is retained, and the value range is [0.0<br>1.0], and the default value is 0. |
| hi_wgt_comp | Debugging<br>parameters | The proportional coefficient value of the superposition weight<br>compensation is only useful when the high frequency is<br>turned on;<br>The default value is 0.16, and the value range is [0.0, 1.0]. |
| clipwgt | Debugging<br>parameters | The weight limit value of the image overlay.<br>The default value is 0.03215, and the value range is 0.0, 1.0. |
| hidif_th | Debugging<br>parameters | High-frequency difference threshold.<br>The default value is 32767, and the value range is 0, 65535. |

<!-- Source EN PDF p.232; unit 2742 -->

9.4.4.15  RK_Bayertnr_Params_V23_Select_t

<!-- Source EN PDF p.232; unit 2743 -->

【Description】 Define the algorithm attribute structure in manual mode for the denoising module

<!-- Source EN PDF p.232; unit 2744 -->

【Definition】

<!-- Source EN PDF p.232; unit 2745 -->

```text
 typedef struct RK_Bayertnr_Params_V23_Select_s
 {
     int enable;
     //calib
     int lumapoint[16];
     int sigma[16];
     int lumapoint2[16];
     int lo_sigma[16];
     int hi_sigma[16];
     //tuning
     int thumbds_w;
     int thumbds_h;
     int lo_enable;
     int hi_enable;
     int lo_med_en;
     int lo_gsbay_en;
     int lo_gslum_en;
     int hi_med_en;
     int hi_gslum_en;
     int trans_en;
     int wgt_use_mode;
     int wgt_mge_mode;
     int hi_guass;
     int kl_guass;
     bool global_pk_en;
     int global_pksq;
     float lo_filter_strength;
     float hi_filter_strength;
     float soft_threshold_ratio;
     float lo_clipwgt;
     float hi_wgt_comp;
     int   hidif_th;
     float lo_filter_rat0;
     int   lo_filter_thed0;
     int hi_filter_abs_ctrl;
     int hi_filter_filt_bay;
     int hi_filter_filt_avg;
     int hi_filter_filt_mode;
     float hi_filter_rat0;
     int   hi_filter_thed0;
     float hi_filter_rat1;
     int   hi_filter_thed1;
```

<!-- Source EN PDF p.233; unit 2746 -->

```text
     int   guass_guide_coeff0;
     int   guass_guide_coeff1;
     int   guass_guide_coeff2;
     int   guass_guide_coeff3;
 } RK_Bayertnr_Params_V23_Select_t;
```

<!-- Source EN PDF p.233; unit 2747 -->

【Members】

<!-- Source EN PDF p.234; unit 2748 -->

| Member Name | Parameter<br>Type | Description |
|---|---|---|
| Enable | Debug<br>parameters | Module Enable Switch |
| lumapoint / sigma | Calibration<br>parameters | Noise curve values for different brightnesses. A total of 16<br>points.<br>LumaPoint corresponds to Pixel brightness, and Sigma<br>corresponds to the noise curve value |
| lumapoint2 /<br>lo_sigma | Calibration<br>parameters | Noise curve values for different brightnesses. A total of 16<br>points.<br>lumapoint2 corresponds to pixel brightness, and lo_sigma<br>corresponds to noise curve value |
| lumapoint2 /<br>hi_sigma | Calibration<br>parameters | Noise curve values for different brightnesses. A total of 16<br>points.<br>lumapoint2 corresponds to pixel brightness, and hi_sigma<br>corresponds to noise curve value |
| thumbds_w<br>thumbds_h | Debug<br>parameters | The downsampling ratio currently only supports three modes:<br>4x4, 8x4, and 8x8. Default 8x4 mode. |
| lo_enable | Debug<br>parameters | The low-frequency motion determines whether it is on, 1 on,<br>0 off. Open by default. |
| hi_enable | Debug<br>parameters | High-frequency motion determines whether it is on, 1 on, 0<br>off. Open by default. |
| lo_med_en | Debug<br>parameters | Internal low-frequency submodule switch, 1 on, 0 off. Open<br>by default. |
| lo_gsbay_en | Debug<br>parameters | Internal low-frequency submodule switch, 1 on, 0 off. Open<br>by default. |
| lo_gslum_en | Debug<br>parameters | Internal low-frequency submodule switch, 1 on, 0 off. Open<br>by default. |
| hi_med_en | Debug<br>parameters | Internal high-frequency submodule switch, 1 on, 0 off. Open<br>by default. |
| hi_gslum_en | Debug<br>parameters | Internal high-frequency submodule switch, 1 on, 0 off. Open<br>by default. |
| global_pk_en | Debug<br>parameters | Whether global PK is used for time domain noise reduction, 1<br>is used and 0 is not.<br>Currently only 0. |
| global_pksq | Debug<br>parameters | The squared value of the global pk, which is used only when<br>the global_pk_en is 1.<br>The default value is 1024, and the value range is [0,<br>268435455] |

<!-- Source EN PDF p.235; unit 2749 -->

| Member Name | Parameter<br>Type | Description |
|---|---|---|
| lo_filter_strength | Debug<br>parameters | High-frequency motion judgment force. Finally, it affects HI<br>Sigma, which in turn affects the time-domain denoising force.<br>Default value 1, value range [0.0, 16.0] |
| hi_filter_strength | Debug<br>parameters | High-frequency motion judgment force. Finally, it affects HI<br>Sigma, which in turn affects the time-domain denoising force.<br>Default value 1, value range [0.0, 16.0] |
| soft_threshold_ratio | Debug<br>parameters | Soft threshold weights. The larger the value, the more noise is<br>retained,<br>and the value range [0.0 1.0], the default value is 0. |
| hi_wgt_comp | Debug<br>parameters | The scale coefficient value of superimposed weight<br>complement is only useful when the high frequency is turned<br>on;<br>The default value is 0.16, and the value range is [0.0, 1.0]. |
| lo_clipwgt | Debug<br>parameters | The weight limit value for the image overlay.<br>The default value is 0.03215, and the value range is [0.0, 1.0]. |
| hidif_th | Debug<br>parameters | High-frequency difference threshold.<br>The default value is 32767, and the value range is [0, 65535]. |
| trans_en | Debug<br>parameters | Whether bandwidth saving is enabled. 0: Do not enable, 1:<br>Enable.<br>linear mode can be set. HDR mode is recommended to<br>configure 0. |
| wgt_use_mode | Debug<br>parameters | Whether to turn on the optimization function when weight<br>fusion. 0: Do not enable, 1: Enable. |
| wgt_mge_mode | Debug<br>parameters | The high-frequency weight calculation turns on the<br>optimization function. 0: Do not enable, 1: Enable. |
| hi_guass | Debug<br>parameters | High-frequency SIGMA uses filtered data, or raw unfiltered<br>data.<br>0: Use raw data, 1: Use filtered data. |
| kl_guass | Debug<br>parameters | PK sigma looks for filtered data or raw unfiltered data.<br>0: Use raw data, 1: Use filtered data. |
| lo_filter_rat0 | Debug<br>parameters | When calculating the weight of low-frequency motion<br>judgment, the difference value should be subtracted from the<br>data proportion parameter.<br>range [0.0, 16.0], default value 1. |
| lo_filter_thed0 | Debug<br>parameters | When calculating the weight of low-frequency motion<br>judgment, the data offset parameter to be subtracted from the<br>difference value.<br>value range [0, 4095], default value 0. |

<!-- Source EN PDF p.236; unit 2750 -->

| Member Name | Parameter<br>Type | Description |
|---|---|---|
| hi_filter_rat0 | Debug<br>parameters | The proportion of data to be subtracted when calculating the<br>first weight of high-frequency motion.<br>range of values [0.0, 16.0], default value 1. |
| hi_filter_thed0 | Debug<br>parameters | When the first weight is calculated for high-frequency motion<br>judgment, the data offset value to be subtracted from the<br>difference value.<br>value range [0, 4095], default value 256. |
| hi_filter_rat1 | Debug<br>parameters | When calculating the second weight of high-frequency<br>motion judgment, the proportion of data to be subtracted from<br>the difference value.<br>value range [0.0, 16.0], default value 1. |
| hi_filter_thed1 | Debug<br>parameters | When calculating the second weight of high-frequency<br>motion judgment, the data offset value to be subtracted from<br>the difference value is .<br>value range [0, 4095], and the default value is 1024. |
| hi_filter_abs_ctrl | Debug<br>parameters | Absolute value position selection for high-frequency weight<br>calculation.<br>0: Difference-&gt;median-&gt;Gaussian-&gt;abs<br>1: Difference-&gt;median-&gt;abs-&gt;Gaussian<br>default 0. |
| hi_filter_filt_bay | Debug<br>parameters | When calculating the high-frequency weights, Gaussian<br>filters whether the 4 channels of Bayer data are calculated<br>separately.<br>1: Separate calculation, 4 channels do 3x3 Gaussian<br>0: 4 channels are not calculated separately, do 5x7 Gaussian.<br>default value 0. |
| hi_filter_filt_avg | Debug<br>parameters | Whether the 5x5 filtering function is enabled when<br>calculating the high-frequency weight.<br>0: not on, 1: on. The default value is 0. |
| hi_filter_filt_mode | Debug<br>parameters | Filter mode selection when calculating high-frequency<br>weights.<br>range [0, 4]. The default value is 4. |
| guass_guide_coeff0 | Debug<br>parameters | Gaussian filter operators.<br>range [0, 64]. The default values are 16,8,16,8. |

<!-- Source EN PDF p.236; unit 2751 -->

9.4.4.16  RK_Bayertnr_Fix_V2_t

<!-- Source EN PDF p.236; unit 2752 -->

【Description】 Define the manual mode register configuration for the denoising module

<!-- Source EN PDF p.236; unit 2753 -->

【Definition】

<!-- Source EN PDF p.237; unit 2754 -->

```text
 typedef struct RK_Bayertnr_Fix_V2_s {
     // BAY3D_BAY3D_CTRL 0x2c00
     uint8_t bay3d_exp_sel;
     uint8_t bay3d_soft_st;
     uint8_t bay3d_soft_mode;
     uint8_t bay3d_bwsaving_en;
     uint8_t bay3d_loswitch_protect;
     uint8_t bay3d_glbpk_en;
     uint8_t bay3d_logaus3_bypass_en;
     uint8_t bay3d_logaus5_bypass_en;
     uint8_t bay3d_lomed_bypass_en;
     uint8_t bay3d_hichnsplit_en;
     uint8_t bay3d_hiabs_pssel;
     uint8_t bay3d_higaus_bypass_en;
     uint8_t bay3d_himed_bypass_en;
     uint8_t bay3d_lobypass_en;
     uint8_t bay3d_hibypass_en;
     uint8_t bay3d_bypass_en;
     uint8_t bay3d_en_i;
     // BAY3D_BAY3D_KALRATIO 0x2c04
     uint16_t bay3d_softwgt;
     uint16_t bay3d_hidif_th;
     // BAY3D_BAY3D_GLBPK2 0x2c08
     uint32_t bay3d_glbpk2;
     // BAY3D_BAY3D_WGTLMT 0x2c10
     uint16_t bay3d_wgtlmt;
     uint16_t bay3d_wgtratio;
     // BAY3D_BAY3D_SIG_X0  0x2c14 - 0x2c30
     uint16_t bay3d_sig0_x[16];
     // BAY3D_BAY3D_SIG0_Y0 0x2c34 - 0x2c50
     uint16_t bay3d_sig0_y[16];
     // BAY3D_BAY3D_SIG_X0  0x2c54 - 0x2c70
     uint16_t bay3d_sig1_x[16];
     // BAY3D_BAY3D_SIG1_Y0 0x2c74 - 0x2c90
     uint16_t bay3d_sig1_y[16];
     // BAY3D_BAY3D_SIG2_Y0 0x2c94 - 0x2cb0
     uint16_t bay3d_sig2_y[16];
     //BAY3D_BAY3D_LODIF_STAT0 0x2cb4 -0x2cb8
     uint64_t ro_sum_lodif;
     //BAY3D_BAY3D_LODIF_STAT0 0x2cbc -0x2cc0
     uint64_t ro_sum_hidif0;
     //BAY3D_BAY3D_MI_ST 0x2CC8
     uint8_t sw_bay3dmi_st_linemode;
     uint8_t sw_bay3d_mi2cur_linecnt;
 } RK_Bayertnr_Fix_V2_t;
```

<!-- Source EN PDF p.238; unit 2755 -->

【Member】

<!-- Source EN PDF p.239; unit 2756 -->

| Parameter | Bit<br>width | Parameter description |
|---|---|---|
| bay3d_soft_st | 1 | The start pulse bit of the software mode, written when turned on<br>1. |
| bay3d_soft_mode | 1 | Enabling bits for software mode.<br>1: Turn on software mode;<br>0: Turn off software mode;<br>Default configuration value 0x0; |
| bay3d_bwsaving_en | 1 | Bandwidth optimization enables bits, non-HDR is effective.<br>1: Turn on optimization;<br>0: Turn off optimization;<br>The default configuration value 0x0; |
| bay3d_loswitch_protect | 1 | Not supported at this time. |
| bay3d_glbpk_en | 1 | whether Bayer time-domain noise reduction uses global pk;<br>1: Use global pk values;<br>0: Use a local pk value;<br>The default configuration value is 1; |
| bay3d_logaus3_bypass_en | 1 | whether the low frequency is Gaussian filtered in the post-stage<br>brightness domain;<br>1: Do not do;<br>0: Do;<br>The default configuration value 0x0; |
| bay3d_logaus5_bypass_en | 1 | whether the low frequencies are Gaussian filtered on the pre-<br>bayer domain;<br>1: Do not do;<br>0: Do;<br>The default configuration value 0x0; |
| bay3d_lomed_bypass_en | 1 | whether the low frequency is filtered for median;<br>1: Do not do;<br>0: Do;<br>The default configuration value 0x0; |
| bay3d_hichnsplit_en | 1 | The Gaussian filter that selects it when high-frequency judgment<br>is done on the bayer domain or brightness domain, and this<br>enabling bit is turned on when only the high-frequency motion<br>judgment is opened;<br>1: Gaussian filtering in the bayer domain;<br>0: Gaussian filtering in the brightness domain;<br>The default configuration value 0x0; |

<!-- Source EN PDF p.240; unit 2757 -->

| Parameter | Bit<br>width | Parameter description |
|---|---|---|
| bay3d_hiabs_pssel | 1 | Whether to make an absolute value before Gaussian filtering<br>when judging high frequencies, and open this enabling level<br>when only opening high-frequency motion judgment;<br>1: Do;<br>0: Do not do;<br>The default configuration value 0x0; |
| bay3d_higaus_bypass_en | 1 | whether Gaussian filtering is done at high frequencies;<br>1: Do not do;<br>0: Do;<br>The default configuration value 0x0; |
| bay3d_himed_bypass_en | 1 | whether the high frequency is filtered at the median value;<br>1: Do not do;<br>0: Do;<br>The default configuration value 0x0; |
| bay3d_lobypass_en | 1 | High-frequency movement determines whether it is open;<br>1: Close;<br>0: Open;<br>Default configuration value 0x0; At present, this bit does not<br>support dynamic changes, and the default value is always 0. |
| bay3d_hibypass_en | 1 | High-frequency movement determines whether it is open;<br>1: Close;<br>0: Open;<br>The default configuration value 0x0; |
| bay3d_bypass_en | 1 | Bayer's bypass enable bit for time-domain noise reduction;<br>1: Open bypass, equivalent to bayer3d do nothing.<br>0: Close bypass;<br>The default configuration value is 0; |
| bay3d_en_i | 1 | Switching enable bit for Bayer time-domain noise reduction;<br>1: Turn on time domain noise reduction;<br>0: Turn off time-domain noise reduction;<br>The default configuration value is 0; |
| bay3d_softwgt | 10 | The weight value of the soft threshold, the larger the value, the<br>larger the threshold, the more noise is retained.<br>Decimal places 10bit, default configuration value 0x100; |
| bay3d_hidif_th | 16 | Count the threshold for the number of high-frequency difference<br>values. Default configuration value 0xffff |
| bay3d_glbpk2 | 28 | The squared value of the global pk, which is used only when the<br>pk_en is 0. Default configuration value 0x800; |
| bay3d_wgtlmt | 10 | Weight limit value for image overlays.<br>Decimal places are 10 digits, default configuration value 0x380; |

<!-- Source EN PDF p.241; unit 2758 -->

| Parameter | Bit<br>width | Parameter description |
|---|---|---|
| bay3d_wgtratio | 10 | The scale coefficient value of superimposed weight complement<br>is only useful when the high frequency is turned on;<br>Decimal places are 10 digits, default configuration value 0x0; |
| bay3d_sig0_x0-15 | 16 | The 16 brightness levels of the noise curve should be configured<br>to ensure that the difference between the two values is to the<br>power of 2; |
| bay3d_sig0_y0-15 | 14 | 16 noise sigma levels for the noise curve; The configuration<br>parameters are calibrated. |
| bay3d_sig1_x0-15 | 16 | The 16 brightness levels of the high and low frequency noise<br>curves should be configured to ensure that the difference<br>between the two values is a power of 2; |
| bay3d_sig1_y0-15 | 14 | 16 noise SIGMA levels for high-frequency noise curves; The<br>configuration parameters are calibrated. |
| bay3d_sig2_y0-15 | 14 | 16 noise sigma levels for low-frequency noise curves; The<br>configuration parameters are calibrated. |

<!-- Source EN PDF p.241; unit 2759 -->

9.4.4.17  rk_aiq_bayertnr_strength_v2_t

<!-- Source EN PDF p.241; unit 2760 -->

【Description】 Define the denoising intensity configuration structure of the denoising module

<!-- Source EN PDF p.241; unit 2761 -->

【Definition】

<!-- Source EN PDF p.241; unit 2762 -->

```text
 typedef struct rk_aiq_bayertnr_strength_v2_s {
     rk_aiq_uapi_sync_t sync;
     float percent;
 } rk_aiq_bayertnr_strength_v2_t;
```

<!-- Source EN PDF p.241; unit 2763 -->

【Member】

<!-- Source EN PDF p.241; unit 2764 -->

| Member Name | Description |
|---|---|
| sync | For synchronous asynchronous mode selection, see Overview/API Description section |
| percent | Denoising intensity, the value range is 0.0-1.0. |

<!-- Source EN PDF p.241; unit 2765 -->

9.4.4.18  rk_aiq_ynr_attrib_v3_t

<!-- Source EN PDF p.241; unit 2766 -->

【Description】 Define the parameters of the denoising module

<!-- Source EN PDF p.241; unit 2767 -->

【Definition】

<!-- Source EN PDF p.242; unit 2768 -->

```text
 typedef struct rk_aiq_ynr_attrib_v3_s {
     rk_aiq_uapi_sync_t sync;
     Aynr_OPMode_V3_t eMode;
     Aynr_Auto_Attr_V3_t stAuto;
     Aynr_Manual_Attr_V3_t stManual;
 } rk_aiq_ynr_attrib_v3_t;
```

<!-- Source EN PDF p.242; unit 2769 -->

【Member】

<!-- Source EN PDF p.242; unit 2770 -->

| Member Name | Description |
|---|---|
| sync | For synchronous asynchronous mode selection, see Overview/API Description section |
| eMode | Ynr Denoising Module Mode |
| stAuto | YNR Denoising Module Auto Mode Parameters |
| stManual | Ynr Denoising Module Manual Mode Parameters |

<!-- Source EN PDF p.242; unit 2771 -->

9.4.4.19  Aynr_OPMode_V3_t

<!-- Source EN PDF p.242; unit 2772 -->

【Description】 Define the mode of the denoising module

<!-- Source EN PDF p.242; unit 2773 -->

【Definition】

<!-- Source EN PDF p.242; unit 2774 -->

```text
 typedef enum Aynr_OPMode_V3_e {
     AYNRV3_OP_MODE_INVALID           = 0,
     AYNRV3_OP_MODE_AUTO              = 1,
     AYNRV3_OP_MODE_MANUAL            = 2,
     AYNRV3_OP_MODE_REG_MANUAL        = 3,
     AYNRV3_OP_MODE_MAX
 } Aynr_OPMode_V3_t;
```

<!-- Source EN PDF p.242; unit 2775 -->

【Member】

<!-- Source EN PDF p.242; unit 2776 -->

| Member Name | Description |
|---|---|
| AYNRV3_OP_MODE_INVALID | Y-domain ynr denoising module invalid mode |
| AYNRV3_OP_MODE_AUTO | Y-Domain YNR Denoising Module Auto Mode |
| AYNRV3_OP_MODE_MANUAL | Y-domain Algorithm settings for the manual mode of the ynr<br>denoising module |
| AYNRV3_OP_MODE_REG_MANUAL | Y-domain Register settings for the manual mode of the ynr<br>denoising module |
| AYNRV3_OP_MODE_MAX | Y-domain ynr denoising module mode maximum, is an invalid<br>mode |

<!-- Source EN PDF p.243; unit 2777 -->

9.4.4.20  Aynr_Auto_Attr_V3_t

<!-- Source EN PDF p.243; unit 2778 -->

【Description】 Define the automatic properties of the denoising module

<!-- Source EN PDF p.243; unit 2779 -->

【Definition】

<!-- Source EN PDF p.243; unit 2780 -->

```text
 typedef struct Aynr_Auto_Attr_V3_s
 {
     RK_YNR_Params_V3_t stParams;
     RK_YNR_Params_V3_Select_t stSelect;
 } Aynr_Auto_Attr_V3_t;
```

<!-- Source EN PDF p.243; unit 2781 -->

【Member】

<!-- Source EN PDF p.243; unit 2782 -->

| Member Name | Description |
|---|---|
| stParams | Each ISO of the ynr module corresponds to the algorithm attribute parameter |
| stSelect | The ynr module calculates the attribute parameter |

<!-- Source EN PDF p.243; unit 2783 -->

9.4.4.21  Aynr_Manual_Attr_V3_t

<!-- Source EN PDF p.243; unit 2784 -->

【Description】 Define manual properties for the denoising module

<!-- Source EN PDF p.243; unit 2785 -->

【Definition】

<!-- Source EN PDF p.243; unit 2786 -->

```text
 typedef struct Aynr_Manual_Attr_V3_s
 {
     RK_YNR_Params_V3_Select_t stSelect;
     RK_YNR_Fix_V3_t stFix;
 } Aynr_Manual_Attr_V3_t;
```

<!-- Source EN PDF p.243; unit 2787 -->

【Member】

<!-- Source EN PDF p.243; unit 2788 -->

| Member Name | Description |
|---|---|
| stSelect | Algorithm parameter value |
| stFix | YNNR register value |

<!-- Source EN PDF p.243; unit 2789 -->

9.4.4.22  RK_YNR_Params_V3_t

<!-- Source EN PDF p.243; unit 2790 -->

【Description】 Define the attribute parameters of each ISO corresponding algorithm in the automatic mode of the YNR denoising module

<!-- Source EN PDF p.243; unit 2791 -->

【Definition】

<!-- Source EN PDF p.244; unit 2792 -->

```text
 typedef struct RK_YNR_Params_V3_s
 {
     int enable;
     char version[64];
     float iso[RK_YNR_V3_MAX_ISO_NUM];
     RK_YNR_Params_V3_Select_t arYnrParamsISO[RK_YNR_V3_MAX_ISO_NUM];
 } RK_YNR_Params_V3_t;
```

<!-- Source EN PDF p.244; unit 2793 -->

【Member】

<!-- Source EN PDF p.244; unit 2794 -->

| Member Name | Description |
|---|---|
| enable | The ynr module enables the switch |
| version | ynr module version number |
| iso | Different ISO gears, corresponding to different debugging parameters.<br>Currently only supports 13 files |
| RK_YNR_Params_V3_Select_t | Algorithm parameters of the YYNR module |

<!-- Source EN PDF p.244; unit 2795 -->

9.4.4.23  RK_YNR_Params_V3_Select_t

<!-- Source EN PDF p.244; unit 2796 -->

【Description】 Define the manual mode algorithm properties of the denoising module

<!-- Source EN PDF p.244; unit 2797 -->

【Definition】

<!-- Source EN PDF p.244; unit 2798 -->

```text
 typedef struct RK_YNR_Params_V3_Select_s
 {
     int enable;
     float lci;
     float hci;
     float sigma[YNR_V3_ISO_CURVE_POINT_NUM];
     short lumaPoint[YNR_V3_ISO_CURVE_POINT_NUM];
     float lo_lumaPoint[6];
     float lo_ratio[6];
     float hi_lumaPoint[6];
     float hi_ratio[6];
     // low frequency
     float rnr_strength[17];
     int ynr_bft3x3_bypass;
     int ynr_lbft5x5_bypass;
     int ynr_lgft3x3_bypass;
     int ynr_flt1x1_bypass;
     int ynr_sft5x5_bypass;
     float low_bf1;
     float low_bf2;
     float low_thred_adj;
     float low_peak_supress;
     float low_edge_adj_thresh;
     float low_lbf_weight_thresh;
     float low_center_weight;
     float low_dist_adj;
     float low_weight;
     float low_filt1_strength;
     float low_filt2_strength;
     float low_bi_weight;
```

<!-- Source EN PDF p.245; unit 2799 -->

```text
     // high frequency
     float base_filter_weight1;
     float base_filter_weight2;
     float base_filter_weight3;
     float high_thred_adj;
     float high_weight;
     float high_direction_weight[8];
     float hi_min_adj;
     float hi_edge_thed;
     //local gain control
     float ynr_global_gain_alpha;
     float ynr_global_gain;
     float ynr_adjust_thresh;
     float ynr_adjust_scale;
 } RK_YNR_Params_V3_Select_t;
```

<!-- Source EN PDF p.245; unit 2800 -->

【Members】

<!-- Source EN PDF p.246; unit 2801 -->

| Member Name | Parameter<br>Type | Description |
|---|---|---|
| enable | Debug<br>parameters | The ynr module enables the switch, 1: the module is on, 0: the<br>module is off. |
| lci | Calibration<br>data | Affects the low-frequency noise sigma influence factor.<br>The larger the value, the greater the noise sigma and the<br>stronger the denoising force. |
| hci | Calibration<br>data | Affects the high-frequency noise sigma influence factor.<br>The larger the value, the greater the noise sigma and the<br>stronger the denoising force. |
| sigma | Calibration<br>data | Noise sigma curve. |
| lumaPoint | Calibration<br>data | Different Pixel brightness corresponds to different noise<br>SIGMA curve points. A total of 16 points. |
| rnr_strength | Debug<br>parameters | In the center of the image, different denoising forces are set in<br>the direction of the radius r of the circle.<br>It is mainly configured for LSC noise. The value range is [0,<br>16.0], and the default value is 1. |
| ynr_bft3x3_bypass | Debug<br>parameters | Module internal submodule bypass function<br>0: function enable<br>1: function bypass<br>In general, all submodules are turned on enabled, and these<br>values are set to 0. |
| ynr_lbft5x5_bypass | Debug<br>parameters | Module internal submodule bypass function<br>0: function enable<br>1: function bypass<br>In general, all submodules are turned on enabled, and these<br>values are set to 0. |
| ynr_lgft3x3_bypass | Debug<br>parameters | Module internal submodule bypass function<br>0: function enable<br>1: function bypass<br>In general, all submodules are turned on enabled, and these<br>values are set to 0. |
| ynr_flt1x1_bypass | Debug<br>parameters | Module internal submodule bypass function<br>0: function enable<br>1: function bypass<br>In general, all submodules are turned on enabled, and these<br>values are set to 0. |

<!-- Source EN PDF p.247; unit 2802 -->

| Member Name | Parameter<br>Type | Description |
|---|---|---|
| ynr_sft5x5_bypass | Debug<br>parameters | Module internal submodule bypass function<br>0: function enable<br>1: function bypass<br>In general, all submodules are turned on enabled, and these<br>values are set to 0. |
| low_bf1 | Debug<br>parameters | Original figure 3x3 bilateral filtering force, the larger the<br>value, the stronger the denoising.<br>Value range [0.01, 32], default value 1. |
| low_bf2 | Debug<br>parameters | The 5x5 bilateral filtering force of the small picture in the<br>previous frame, the larger the value, the stronger the<br>denoising.<br>Value range [0.01, 32], default value 1. |
| low_thred_adj | Debug<br>parameters | The higher the value of the low-frequency soft threshold, the<br>greater the low-frequency noise reduction force.<br>The value range is [0, 31], and the default value is 0.5. |
| low_peak_supress | Debug<br>parameters | Controls the force with which isolated noise is removed, the<br>smaller the value, the greater the denoising force.<br>The value range is [0, 1], and the default value is 0.5. |
| low_edge_adj_thresh | Debug<br>parameters | The threshold of the adjustment factor for edge detection of<br>the small plot,<br>is used to limit the maximum value that can be taken for the<br>adjustment factor.<br>The smaller the value, the greater the denoising force and the<br>blurrier the image.<br>integer in the range [0, 1023], default value 7. |
| low_lbf_weight_thresh | Debug<br>parameters | Used to limit the weight of 5x5 bilateral filtering.<br>The higher the value, the weaker the low-frequency noise<br>reduction.<br>The value range is [0.0, 1.0]. Default value 0.25. |
| low_center_weight | Debug<br>parameters | The weight of the center point during 5x5 bilateral filtering,<br>the smaller the value, the stronger the noise reduction.<br>The value range is [0,1], and the default value is 0.5. |
| low_dist_adj | Debug<br>parameters | Bilateral filter distance weight adjustment factor. The smaller<br>the value, the stronger the denoising.<br>The value range is [0, 127.0], and the default value is 8.0. |
| low_weight | Debug<br>parameters | The weight of the low-frequency denoising result, the larger<br>the value, the greater the low-frequency noise reduction force.<br>The value range is [0, 1], and the default value is 0.5. |

<!-- Source EN PDF p.248; unit 2803 -->

| Member Name | Parameter<br>Type | Description |
|---|---|---|
| low_filt1_strength | Debug<br>parameters | The weight of the filter kernel for Gaussian filtering of the<br>original graph.<br>The value range is [0,1.0], and the default value is 0.7. |
| low_filt2_strength | Debug<br>parameters | Filter kernel weights for Gaussian filtering of the results of<br>bilateral filtering.<br>The value range is [0,1.0], and the default value is 0.85. |
| low_bi_weight | Debug<br>parameters | The first bilateral filter weights used in soft threshold<br>processing.<br>The higher the value, the greater the noise reduction.<br>The value range is [0, 1], and the default value is 0.3. |
| base_filter_weight1 | Debug<br>parameter | The coefficient of the directional filter. In general, there is<br>little need for adjustment |
| high_thred_adj | Debug<br>parameter | The higher the value, the greater the intensity of high-<br>frequency noise reduction.<br>The value range is 0, 31.0, and the default value is 1.0 |
| high_weight | Debug<br>parameter | High-frequency denoising weight, note that this value<br>represents the proportion of the retained high-frequency<br>components, and the smaller the value, the stronger the noise<br>reduction.<br>The value range is 0, 1, and the default value is 0.78. |
| high_direction_weight | Debug<br>parameter | The higher the value in a certain direction, the stronger the<br>noise reduction along that direction. |
| hi_min_adj | Debug<br>parameter | The ratio of all variance values minus the smallest variance<br>value, the larger the value, the sharper the edges.<br>The value range is 0.0, 1.0, and the default value is 0.9 |
| hi_edge_thed | Debug<br>parameter | The smaller the threshold, the greater the high-frequency<br>noise reduction.<br>An integer in the range of 0, 255, with the default value of<br>100. |
| ynr_global_gain_alpha | Debug<br>parameters | Ynr denoising local mode and global mode interpolate force<br>configuration.<br>Generally, the default value is used, no configuration, and all<br>use the local gain method.<br>The value range is [0.0 1.0], and the default value is 0 |
| ynr_global_gain | Debug<br>parameters | Ynr denoising local mode and global mode interpolate force<br>configuration.<br>Generally, the default value is used, no configuration, and all<br>use the local gain method.<br>The gain value range is [0.0 64.0]. Default value 1. |

<!-- Source EN PDF p.249; unit 2804 -->

| Member Name | Parameter<br>Type | Description |
|---|---|---|
| ynr_adjust_thresh | Debug<br>parameters | Denoise force control for noise greater than the threshold<br>ynr_adjust_thresh. The noise in the moving area<br>is large, and the appropriate threshold &lt; BR/&gt; is set to<br>increase the intensity of YNR denoising in the moving area.<br>Value range [0.0,<br>1.0], default value 1. |
| ynr_adjust_scale | Debug<br>parameters | Denoise force control for noise greater than the threshold<br>ynr_adjust_thresh. The noise in the moving area<br>is large, and the appropriate threshold &lt; BR/&gt; is set to<br>increase the intensity of YNR denoising in the moving area.<br>Value range [0, 16.0], default value 1 |
| lo_lumaPoint / lo_ratio | Debug<br>parameters | Different Pixel brightness, fine-tuning the low-frequency<br>Sigma |
| hi_lumaPoint / hi_ratio | Debug<br>parameters | Different Pixel brightness, fine-tuning of high-frequency<br>Sigma |

<!-- Source EN PDF p.249; unit 2805 -->

9.4.4.24  RK_YNR_Fix_V3_t

<!-- Source EN PDF p.249; unit 2806 -->

【Description】 Define the manual mode register configuration for the denoising module

<!-- Source EN PDF p.249; unit 2807 -->

【Definition】

<!-- Source EN PDF p.249; unit 2808 -->

```text
 typedef struct RK_YNR_Fix_V3_s {
     // YNR_2700_GLOBAL_CTRL (0x0000)
     uint8_t ynr_rnr_en;
     uint8_t ynr_gate_dis;
     uint8_t ynr_thumb_mix_cur_en;
     uint8_t ynr_global_gain_alpha;
     uint16_t ynr_global_gain;
     uint8_t ynr_flt1x1_bypass_sel;
     uint8_t ynr_sft5x5_bypass;
     uint8_t ynr_flt1x1_bypass;
     uint8_t ynr_lgft3x3_bypass;
     uint8_t ynr_lbft5x5_bypass;
     uint8_t ynr_bft3x3_bypass;
     uint8_t ynr_en;
```

<!-- Source EN PDF p.249; unit 2809 -->

```text
     // YNR_2700_RNR_MAX_R  (0x0004)
     uint8_t ynr_local_gainscale;
     uint16_t ynr_rnr_max_r;
     // YNR_2700_RNR_MAX_R  (0x0008)
     uint16_t ynr_rnr_center_coorv;
     uint16_t ynr_rnr_center_coorh;
     // YNR_2700_RNR_MAX_R  (0x000c)
     uint8_t ynr_localgain_adj;
     uint16_t ynr_localgain_adj_thresh;
     // YNR_2700_LOWNR_CTRL0 (0x0010)
     uint16_t ynr_low_bf_inv[2];
     // YNR_2700_LOWNR_CTRL1  (0x0014)
     uint8_t ynr_low_peak_supress;
     uint16_t ynr_low_thred_adj;
     // YNR_2700_LOWNR_CTRL2 (0x0018)
     uint16_t ynr_low_dist_adj;
     uint16_t ynr_low_edge_adj_thresh;
     // YNR_2700_LOWNR_CTRL3 (0x001c)
     uint8_t ynr_low_bi_weight;
     uint8_t ynr_low_weight;
     uint16_t ynr_low_center_weight;
     // YNR_2700_HIGHNR_CTRL0 (0x0020)
     uint8_t ynr_hi_min_adj;
     uint16_t ynr_high_thred_adj;
     // YNR_2700_HIGHNR_CTRL1  (0x0024)
     uint8_t ynr_high_retain_weight;
     uint8_t ynr_hi_edge_thed;
     // YNR_2700_HIGHNR_BASE_FILTER_WEIGHT  (0x0028)
     uint8_t ynr_base_filter_weight[3];
     // YNR_2700_HIGHNR_BASE_FILTER_WEIGHT  (0x002c)
     uint32_t ynr_frame_full_size;
     uint16_t ynr_lbf_weight_thres;
     // YNR_2700_GAUSS1_COEFF  (0x0030)
     uint16_t ynr_low_gauss1_coeff[3];
     // YNR_2700_GAUSS2_COEFF  (0x0034)
     uint16_t ynr_low_gauss2_coeff[3];
     // YNR_2700_DIRECTION_W_0_3  (0x0038 - 0x003c)
     uint8_t ynr_direction_weight[8];
     // YNR_2700_SGM_DX_0_1 (0x0040 - 0x0060)
     uint16_t ynr_luma_points_x[17];
     // YNR_2700_LSGM_Y_0_1 (0x0070- 0x0090)
     uint16_t ynr_lsgm_y[17];
     // YNR_2700_HSGM_Y_0_1 (0x00a0- 0x00c0)
     uint16_t ynr_hsgm_y[17];
     // YNR_2700_RNR_STRENGTH03 (0x00d0- 0x00e0)
     uint16_t ynr_rnr_strength[17];
 } RK_YNR_Fix_V3_t;
```

<!-- Source EN PDF p.251; unit 2810 -->

【Members】

<!-- Source EN PDF p.252; unit 2811 -->

| Member Name | Bit width<br>(integer.<br>Decimal) | Description |
|---|---|---|
| ynr_low_bf_inv[0] | 5.9 | Used to control the denoising force, note the reciprocal of<br>the value of this register configuration, so the smaller the<br>value, the greater the denoising force.<br>A value of 512 represents 1x the denoising force and 256<br>means 2x the denoising force.<br>Value range:[1, 16383] |
| ynr_low_bf[1] | 5.9 | To control the denoising intensity, note the reciprocal of<br>the value velocity configured for this register, so the lower<br>the value, the greater the denoising intensity.<br>A value of 512 represents 1x the denoising and 256 means<br>2x the denoising effort |
| ynr_low_thred_adj | 5.6 | The adjustment force of the low-frequency soft threshold,<br>the greater the low-frequency noise reduction force.<br>Value range:[0, 2047] |
| ynr_low_peak_supress | 1.7 | Controls the force with which large isolated noises are<br>removed, the higher the value, the stronger the force.<br>Value range: [0, 128] |
| ynr_low_edge_adj_thresh | 11.0 | The threshold of the adjustment factor for edge detection<br>of the small plot, which is used to limit the maximum<br>value that can be taken by the adjustment factor.<br>Value range:[1, 1024] |
| ynr_low_center_weight | 1.10 | The weight of the center point during 5x5 bilateral<br>filtering, the smaller the value, the stronger the noise<br>reduction.<br>Value range:[1, 1024] |
| sw_ynr_lbf_weight_thres | 10.0 | The weight used to limit the 5x5 bilateral filtering value,<br>the higher the value that makes the low-frequency noise<br>reduction weaker.<br>Value range: [0, 1023] |
| ynr_low_dist_adj | 7.2 | Bilateral filter distance weight adjustment factor<br>Value range:[1, 511] |
| ynr_low_weight | 1.7 | The weight of the low-frequency denoising result, the<br>higher the value that the more powerful the low-frequency<br>noise reduction.<br>Value range: [0, 128] |
| ynr_low_gauss1_coeff[3] | 1.8 | The weight range of the filter kernel for Gaussian filtering<br>of the original graph is [0, 256] |
| ynr_low_gauss2_coeff[3] | 1.8 | Gaussian filter kernel weights range for Gaussian filtering<br>results of bilateral filtering [0, 256] |

<!-- Source EN PDF p.253; unit 2812 -->

| Member Name | Bit width<br>(integer.<br>Decimal) | Description |
|---|---|---|
| ynr_low_bi_weight | 1.7 | The first bilateral filter weight used in soft threshold<br>processing, the higher the value, the greater the noise<br>reduction.<br>Value range: [0, 128] |
| ynr_base_filter_weight[3] | 1.6 | The coefficient of the directional filter<br>Value range:[0, 64] |
| ynr_high_thred_adj | 5.6 | The higher the value, the greater the intensity of high-<br>frequency noise reduction.<br>Value range [0, 2047] |
| ynr_high_retain_weight | 1.7 | High-frequency denoising weight, note that this value<br>represents the proportion of the high-frequency<br>component that is retained, so the higher the value, the<br>weaker the noise reduction.<br>Value range [0, 128] |
| ynr_direction_weight[8] | 1.4 | The greater the value in a certain direction, the stronger<br>the noise reduction along that direction.<br>Value range [0,16] |
| ynr_hi_min_adj | 0.6 | The ratio of all variance values minus the smallest<br>variance value, the larger the value, the sharper the edges.<br>Value range [6,60] |
| ynr_hi_edge_thed | 10.0 | The smaller the threshold, the greater the high-frequency<br>noise reduction.<br>Value range [0,1023] |
| ynr_rnr_max_r | 14.0 | It is used to adjust the radial noise reduction strength, and<br>is used to store the value of 1/((rows/2)^2+(cols/2)^2),<br>where the first 9 bits are the mantissa M and the last 5 bits<br>are the exponential E<br>Value range [1, 16383] |
| ynr_rnr_strength[17] | 4.4 | Used to control the radial noise reduction force, there are<br>a total of 17 data points, divided into 16 segments,<br>representing the denoising intensity from the center point<br>of the image to the four corners of the image.<br>Value range [0, 15] |
| ynr_global_gain | 6.4 | The externally configured global gain controls the overall<br>noise reduction intensity of the YNR, and the higher the<br>value, the stronger the noise reduction force.<br>Value range [0, 1023] |

<!-- Source EN PDF p.254; unit 2813 -->

| Member Name | Bit width<br>(integer.<br>Decimal) | Description |
|---|---|---|
| ynr_global_gain_alpha | 1.3 | Controls the proportion of the gain value passed by the<br>gain module and the externally configured gain value, the<br>larger the value that uses the external global gain.<br>Value range [0, 8] |
| ynr_bft3x3_bypass | 1 | Turn off 3x3 bilateral filtering when set to 1<br>Value range 0 or 1 |
| ynr_lbft5x5_bypass | 1 | Turn off 5x5 bilateral filtering when set to 1<br>Value range 0 or 1 |
| ynr_lgft3x3_bypass | 1 | When 1, turn off the 3x3 Gaussian filter |
| ynr_flt1x1_bypass | 1 | When 1, turn off the low-frequency soft threshold<br>processing<br>value range 0 or 1 |
| ynr_sft5x5_bypass | 1 | Turn off the high-frequency noise cancellation of 1x5<br>when it is 5<br>value range 0 or 1 |

<!-- Source EN PDF p.254; unit 2814 -->

9.4.4.25  rk_aiq_ynr_strength_v3_t

<!-- Source EN PDF p.254; unit 2815 -->

【Description】 Define the denoising intensity configuration structure of the denoising module

<!-- Source EN PDF p.254; unit 2816 -->

【Definition】

<!-- Source EN PDF p.254; unit 2817 -->

```text
 typedef struct rk_aiq_ynr_strength_v3_s {
     rk_aiq_uapi_sync_t sync;
     float percent;
     bool strength_enable;
 } rk_aiq_ynr_strength_v3_t;
```

<!-- Source EN PDF p.254; unit 2818 -->

【Member】

<!-- Source EN PDF p.254; unit 2819 -->

| Member Name | Description |
|---|---|
| sync | For synchronous asynchronous mode selection, see Overview/API Description section |
| percent | Denoising intensity, the value range is 0.0-1.0. |

<!-- Source EN PDF p.254; unit 2820 -->

9.4.4.26  rk_aiq_cnr_attrib_v2_t

<!-- Source EN PDF p.254; unit 2821 -->

【Description】 Define the denoising module parameters

<!-- Source EN PDF p.254; unit 2822 -->

【Definition】

<!-- Source EN PDF p.255; unit 2823 -->

```text
 typedef struct rk_aiq_cnr_attrib_v2_s {
     rk_aiq_uapi_sync_t sync;
     AcnrV2_OPMode_t eMode;
     Acnr_Auto_Attr_V2_t stAuto;
     Acnr_Manual_Attr_V2_t stManual;
 } rk_aiq_cnr_attrib_v2_t;
```

<!-- Source EN PDF p.255; unit 2824 -->

【Member】

<!-- Source EN PDF p.255; unit 2825 -->

| Member Name | Description |
|---|---|
| sync | For synchronous asynchronous mode selection, see Overview/API Description section |
| eMode | CNR Denoising Module Mode |
| stAuto | CNR Denoising Module Auto Mode Parameters |
| stManual | CNR Denoising Module Manual Mode Parameters |

<!-- Source EN PDF p.255; unit 2826 -->

9.4.4.27  AcnrV2_OPMode_t

<!-- Source EN PDF p.255; unit 2827 -->

【Description】 Define the mode properties of the denoising module

<!-- Source EN PDF p.255; unit 2828 -->

【Definition】

<!-- Source EN PDF p.255; unit 2829 -->

```text
 typedef enum AcnrV2_OPMode_e {
     ACNRV2_OP_MODE_INVALID           = 0,
     ACNRV2_OP_MODE_AUTO              = 1,
     ACNRV2_OP_MODE_MANUAL            = 2,
     ACNRV2_OP_MODE_REG_MANUAL        = 3,
     ACNRV2_OP_MODE_MAX
 } AcnrV2_OPMode_t;
```

<!-- Source EN PDF p.255; unit 2830 -->

【Member】

<!-- Source EN PDF p.255; unit 2831 -->

| Member Name | Description |
|---|---|
| ACNRV2_OP_MODE_INVALID | UV domain CNR denoising module invalid mode |
| ACNRV2_OP_MODE_AUTO | UV domain CNR denoising module auto mode |
| ACNRV2_OP_MODE_MANUAL | UV domain Algorithm settings for manual mode of the CNR<br>denoising module |
| ACNRV2_OP_MODE_REG_MANUAL | UV domain register settings for manual mode of the CNR<br>denoising module |
| ACNRV2_OP_MODE_MAX | UV domain CNR denoising module mode maximum, is an<br>invalid mode |

<!-- Source EN PDF p.256; unit 2832 -->

9.4.4.28  Acnr_Auto_Attr_V2_t

<!-- Source EN PDF p.256; unit 2833 -->

【Description】 Define the automatic properties of the denoising module

<!-- Source EN PDF p.256; unit 2834 -->

【Definition】

<!-- Source EN PDF p.256; unit 2835 -->

```text
 typedef struct Acnr_Auto_Attr_V2_s
 {
     all ISO params and select param
 RK_CNR_Params_V2_t stParams;
     RK_CNR_Params_V2_Select_t stSelect;
 } Acnr_Auto_Attr_V2_t;
```

<!-- Source EN PDF p.256; unit 2836 -->

【Member】

<!-- Source EN PDF p.256; unit 2837 -->

| Member Name | Description |
|---|---|
| stParams | Each ISO of the CNR module corresponds to the algorithm attribute parameter |
| stSelect | The CNR module calculates the attribute parameter |

<!-- Source EN PDF p.256; unit 2838 -->

9.4.4.29  Acnr_Manual_Attr_V2_t

<!-- Source EN PDF p.256; unit 2839 -->

【Description】 Define manual properties for the denoising module

<!-- Source EN PDF p.256; unit 2840 -->

【Definition】

<!-- Source EN PDF p.256; unit 2841 -->

```text
 typedef struct Acnr_Manual_Attr_V2_s
 {
     RK_CNR_Params_V2_Select_t stSelect;
 RK_CNR_Fix_V2_t stFix;
 } Acnr_Manual_Attr_V2_t;
```

<!-- Source EN PDF p.256; unit 2842 -->

【Member】

<!-- Source EN PDF p.256; unit 2843 -->

| Member Name | Description |
|---|---|
| stSelect | Algorithm parameter values |
| stSelect | Register value |

<!-- Source EN PDF p.257; unit 2844 -->

9.4.4.30  RK_CNR_Params_V2_t

<!-- Source EN PDF p.257; unit 2845 -->

【Description】 Define the automatic mode of the denoising module, and the corresponding ISO algorithm attribute parameters

<!-- Source EN PDF p.257; unit 2846 -->

【Definition】

<!-- Source EN PDF p.257; unit 2847 -->

```text
 typedef struct RK_CNR_Params_V2_s
 {
     int enable;
     float iso[RK_CNR_V2_MAX_ISO_NUM];
     int hf_bypass[RK_CNR_V2_MAX_ISO_NUM];
     int lf_bypass[RK_CNR_V2_MAX_ISO_NUM];
     // gain
     float global_gain[RK_CNR_V2_MAX_ISO_NUM];
     float global_gain_alpha[RK_CNR_V2_MAX_ISO_NUM];
     float local_gain_scale[RK_CNR_V2_MAX_ISO_NUM];
     // strength adj by gain
     int gain_adj_strength_ratio[RK_CNR_V2_MAX_ISO_NUM]
 [RKCNR_V2_SGM_ADJ_TABLE_LEN];
     //
     float color_sat_adj[RK_CNR_V2_MAX_ISO_NUM];
     float color_sat_adj_alpha[RK_CNR_V2_MAX_ISO_NUM];
     // step1
     // median filter
     float hf_spikes_reducion_strength[RK_CNR_V2_MAX_ISO_NUM];
     // bilateral filter
     float hf_denoise_strength[RK_CNR_V2_MAX_ISO_NUM];
     float hf_color_sat[RK_CNR_V2_MAX_ISO_NUM];
     float hf_denoise_alpha[RK_CNR_V2_MAX_ISO_NUM];
     int  hf_bf_wgt_clip[RK_CNR_V2_MAX_ISO_NUM];
```

<!-- Source EN PDF p.257; unit 2848 -->

```text
     // step2
     // median filter
     float thumb_spikes_reducion_strength[RK_CNR_V2_MAX_ISO_NUM];
     // bilateral filter
     float thumb_denoise_strength[RK_CNR_V2_MAX_ISO_NUM];
     float thumb_color_sat[RK_CNR_V2_MAX_ISO_NUM];
     // step3
     // bilateral filter
     float lf_denoise_strength[RK_CNR_V2_MAX_ISO_NUM];
     float lf_color_sat[RK_CNR_V2_MAX_ISO_NUM];
     float lf_denoise_alpha[RK_CNR_V2_MAX_ISO_NUM];
     // bilateral filter kernels
     float kernel_5x5[5];
 } RK_CNR_Params_V2_t;
```

<!-- Source EN PDF p.258; unit 2849 -->

【Member】

<!-- Source EN PDF p.259; unit 2850 -->

| Parameter Name | Parameter<br>Type | Parameter Description |
|---|---|---|
| Enable | Debugging<br>parameters | The module switch is enabled. 1: The module is<br>on, 0: The module is closed. |
| iso | Debugging<br>parameters | Different ISO gears, corresponding to different<br>debugging parameters. Currently, only 13 gears are<br>supported. |
| hf_bypass | Debugging<br>parameters | High-frequency noise reduction bypass. 0: No<br>bypass, 1: bypass. |
| lf_bypass | Debugging<br>parameters | Low-frequency noise reduction bypass.0:No<br>bypass, 1:bypass. |
| global_gain | Debugging<br>parameters | CNR denoising local mode and global mode<br>interpolation strength configuration. Generally, the<br>default value is used, and the local gain method is<br>used without configuration.<br>The value range is 0.0 to 64.0, and the default<br>value is 1. |
| global_gain_alpha | Debugging<br>parameters | CNR denoising local mode and global mode<br>interpolation strength configuration. Generally, the<br>default value is used, and the local gain method is<br>used without configuration.<br>The value range is 0.0 1.0, and the default value is<br>0. |
| global_gain_scale | Debugging<br>parameters | To amplify the CNR denoising strength, the default<br>value is generally used, and it is not easy to adjust.<br>The value range is 0, 128, and the default value is<br>1. |
| gain_adj_strength_ratio | Debugging<br>parameters | Adjust the filter intensity based on the local gain<br>value. The lower the value, the stronger the noise<br>removal.<br>The value range is [1, 255], the default value is<br>255. |
| color_sat_adj | Debugging<br>parameters | The UV ratio of bilateral filtering based on<br>gradient adjustment, 1~255. The smaller the value,<br>the better the color noise removal.<br>Valid values: [1, 255]. The default value is 40. |
| color_sat_adj_alpha | Debugging<br>parameters | color_sat_adj Adjusted ratio. The higher the value,<br>the better the color noise removal.<br>The value range is 0, 1.0. The default value is 0.8. |
| hf_spikes_reducion_strength | Debugging<br>parameters | High frequency median filter intensity. The higher<br>the value, the stronger the median filtering.<br>The value range is 0, 1.0. The default value is 0.5. |

<!-- Source EN PDF p.260; unit 2851 -->

| Parameter Name | Parameter<br>Type | Parameter Description |
|---|---|---|
| hf_denoise_strength | Debugging<br>parameters | High-frequency bilateral filter intensity. The higher<br>the value, the better the color noise removal.<br>The value range is [1, 1023]. The default value is<br>10. |
| hf_color_sat | Debugging<br>parameters | UV scale factor for high-frequency bilateral<br>filtering. The lower the value, the more the color<br>saturation drops.<br>The value range is 0.0, 7.9. The default value is<br>1.5. |
| hf_denoise_alpha | Debugging<br>parameters | The weight of the center point of the high-<br>frequency bilateral filter.<br>Valid values: 0.0, 1.0. The default value is 0. |
| hf_bf_wgt_clip | Debugging<br>parameters | Minimum denoising at high frequencies. The<br>higher the value, the stronger the denoising.<br>The value range is 0, 255. The default value is 0. |
| thumb_spikes_reducion_strength | Debugging<br>parameters | Thumbnail median filter intensity. The higher the<br>value, the stronger the median filtering.<br>Valid values: 0.0, 1.0. The default value is 0.5. |
| thumb_denoise_strength | Debugging<br>parameters | Thumbnail bilateral filter intensity. The higher the<br>value, the better the color noise removal.<br>The value range is [1, 1023]. The default value is<br>8. |
| thumb_color_sat | Debugging<br>parameters | The UV scale factor of thumbnail double-sided<br>filtering, the more color saturation drops.<br>The value range is 0.0, 7.9. Default value is 4. |
| lf_denoise_strength | Debugging<br>parameters | Low-frequency bilateral filtering intensity. The<br>higher the value, the better the color noise removal.<br>The value range is [1, 1023]. The default value is<br>8. |
| lf_color_sat | Debugging<br>parameters | The UV ratio of low-frequency bilateral filtering is<br>due to. The lower the value, the more the color<br>saturation drops.<br>The value range is 0.0, 7.9. Default value is 4. |
| lf_denoise_alpha | Debugging<br>parameters | The weight of the center point of the low-<br>frequency bilateral filter.<br>Valid values: 0.0, 1.0. The default value is 0.5. |
| kernel_5x5 | Debugging<br>parameters | 5x5 bilateral filter core. |

<!-- Source EN PDF p.261; unit 2852 -->

9.4.4.31  RK_CNR_Params_V2_Select_t

<!-- Source EN PDF p.261; unit 2853 -->

【Description】 Define the manual mode algorithm properties of the denoising module

<!-- Source EN PDF p.261; unit 2854 -->

【Definition】

<!-- Source EN PDF p.261; unit 2855 -->

```text
 typedef struct RK_CNR_Params_V2_Select_s
 {
     int enable;
     // bypass
     int hf_bypass;
     int lf_bypass;
     // gain
     // gain
     float global_gain;
     float global_gain_alpha;
     float local_gain_scale;
     // strength adj by gain
     int gain_adj_strength_ratio[RKCNR_V2_SGM_ADJ_TABLE_LEN];
     //
     float color_sat_adj;
     float color_sat_adj_alpha;
     // step1
     // median filter
     float hf_spikes_reducion_strength;
     // bilateral filter
     float hf_denoise_strength;
     float hf_color_sat;
     float hf_denoise_alpha;
     int hf_bf_wgt_clip;
     // step2
     // median filter
     float thumb_spikes_reducion_strength;
     // bilateral filter
     float thumb_denoise_strength;
     float thumb_color_sat;
     // step3
     // bilateral filter
     float lf_denoise_strength;
     float lf_color_sat;
     float lf_denoise_alpha;
     // bilateral filter kernels
     float kernel_5x5[5];
 } RK_CNR_Params_V2_Select_t;
```

<!-- Source EN PDF p.262; unit 2856 -->

【Member】

<!-- Source EN PDF p.263; unit 2857 -->

| Parameter Name | Parameter<br>Type | Parameter Description |
|---|---|---|
| Enable | Debugging<br>parameters | The module switch is enabled. 1: The module is<br>on, 0: The module is closed. |
| iso | Debugging<br>parameters | Different ISO gears, corresponding to different<br>debugging parameters. Currently, only 13 gears are<br>supported. |
| hf_bypass | Debugging<br>parameters | High-frequency noise reduction bypass. 0: No<br>bypass, 1: bypass. |
| lf_bypass | Debugging<br>parameters | Low-frequency noise reduction bypass.0:No<br>bypass, 1:bypass. |
| global_gain | Debugging<br>parameters | CNR denoising local mode and global mode<br>interpolation strength configuration. Generally, the<br>default value is used, and the local gain method is<br>used without configuration.<br>The value range is 0.0 to 64.0, and the default<br>value is 1. |
| global_gain_alpha | Debugging<br>parameters | CNR denoising local mode and global mode<br>interpolation strength configuration. Generally, the<br>default value is used, and the local gain method is<br>used without configuration.<br>The value range is 0.0 1.0, and the default value is<br>0. |
| global_gain_scale | Debugging<br>parameters | To amplify the CNR denoising strength, the default<br>value is generally used, and it is not easy to adjust.<br>The value range is 0, 128, and the default value is<br>1. |
| gain_adj_strength_ratio | Debugging<br>parameters | Adjust the filter intensity based on the local gain<br>value. The lower the value, the stronger the noise<br>removal.<br>The value range is [1, 255], the default value is<br>255. |
| color_sat_adj | Debugging<br>parameters | The UV ratio of bilateral filtering based on<br>gradient adjustment, 1~255. The smaller the value,<br>the better the color noise removal.<br>Valid values: [1, 255]. The default value is 40. |
| color_sat_adj_alpha | Debugging<br>parameters | color_sat_adj Adjusted ratio. The higher the value,<br>the better the color noise removal.<br>The value range is 0, 1.0. The default value is 0.8. |
| hf_spikes_reducion_strength | Debugging<br>parameters | High frequency median filter intensity. The higher<br>the value, the stronger the median filtering.<br>The value range is 0, 1.0. The default value is 0.5. |

<!-- Source EN PDF p.264; unit 2858 -->

| Parameter Name | Parameter<br>Type | Parameter Description |
|---|---|---|
| hf_denoise_strength | Debugging<br>parameters | High-frequency bilateral filter intensity. The higher<br>the value, the better the color noise removal.<br>The value range is [1, 1023]. The default value is<br>10. |
| hf_color_sat | Debugging<br>parameters | UV scale factor for high-frequency bilateral<br>filtering. The lower the value, the more the color<br>saturation drops.<br>The value range is 0.0, 7.9. The default value is<br>1.5. |
| hf_denoise_alpha | Debugging<br>parameters | The weight of the center point of the high-<br>frequency bilateral filter.<br>Valid values: 0.0, 1.0. The default value is 0. |
| hf_bf_wgt_clip | Debugging<br>parameters | Minimum denoising at high frequencies. The<br>higher the value, the stronger the denoising.<br>The value range is 0, 255. The default value is 0. |
| thumb_spikes_reducion_strength | Debugging<br>parameters | Thumbnail median filter intensity. The higher the<br>value, the stronger the median filtering.<br>Valid values: 0.0, 1.0. The default value is 0.5. |
| thumb_denoise_strength | Debugging<br>parameters | Thumbnail bilateral filter intensity. The higher the<br>value, the better the color noise removal.<br>The value range is [1, 1023]. The default value is<br>8. |
| thumb_color_sat | Debugging<br>parameters | The UV scale factor of thumbnail double-sided<br>filtering, the more color saturation drops.<br>The value range is 0.0, 7.9. Default value is 4. |
| lf_denoise_strength | Debugging<br>parameters | Low-frequency bilateral filtering intensity. The<br>higher the value, the better the color noise removal.<br>The value range is [1, 1023]. The default value is<br>8. |
| lf_color_sat | Debugging<br>parameters | The UV ratio of low-frequency bilateral filtering is<br>due to. The lower the value, the more the color<br>saturation drops.<br>The value range is 0.0, 7.9. Default value is 4. |
| lf_denoise_alpha | Debugging<br>parameters | The weight of the center point of the low-<br>frequency bilateral filter.<br>Valid values: 0.0, 1.0. The default value is 0.5. |
| kernel_5x5 | Debugging<br>parameters | 5x5 bilateral filter core. |

<!-- Source EN PDF p.265; unit 2859 -->

9.4.4.32  RK_CNR_Fix_V2_t

<!-- Source EN PDF p.265; unit 2860 -->

【Description】 Define the manual mode register configuration for the denoising module

<!-- Source EN PDF p.265; unit 2861 -->

【Definition】

<!-- Source EN PDF p.265; unit 2862 -->

```text
 typedef struct RK_CNR_Fix_V2_s {
     //ISP_CNR_2800_CTRL
     uint8_t cnr_thumb_mix_cur_en;
     uint8_t cnr_lq_bila_bypass;
     uint8_t cnr_hq_bila_bypass;
     uint8_t cnr_exgain_bypass;
     uint8_t cnr_en_i;
     // ISP_CNR_2800_EXGAIN
     uint8_t cnr_global_gain_alpha;
     uint16_t cnr_global_gain;
     // ISP_CNR_2800_GAIN_PARA
     uint8_t cnr_gain_iso;
     uint8_t cnr_gain_offset;
     uint8_t cnr_gain_1sigma;
     // ISP_CNR_2800_GAIN_UV_PARA
     uint8_t cnr_gain_uvgain1;
     uint8_t cnr_gain_uvgain0;
     // ISP_CNR_2800_LMED3
     uint8_t cnr_lmed3_alpha;
     // ISP_CNR_2800_LBF5_GAIN
     uint8_t cnr_lbf5_gain_y;
     uint8_t cnr_lbf5_gain_c;
     // ISP_CNR_2800_LBF5_WEITD0_4
     uint8_t cnr_lbf5_weit_d[5];
     // ISP_CNR_2800_HMED3
     uint8_t cnr_hmed3_alpha;
     // ISP_CNR_2800_HBF5
     uint8_t cnr_hbf5_weit_src;
     uint8_t cnr_hbf5_min_wgt;
     uint16_t cnr_hbf5_sigma;
     // ISP_CNR_2800_LBF3
     uint8_t cnr_lbf5_weit_src;
     uint16_t cnr_lbf3_sigma;
     //ISP_CNR_2800_SIGMA0-SIGMA3
     uint8_t cnr_sigma_y[13];
 } RK_CNR_Fix_V2_t;
```

<!-- Source EN PDF p.266; unit 2863 -->

【Members】

<!-- Source EN PDF p.267; unit 2864 -->

| Parameter Name | Parameter Description |
|---|---|
| cnr_thumb_mix_cur_en | The thumbnail of the current frame is mixed with the enabling signal of the<br>previous image:<br>1'b1: mix enabled<br>1'b0:mix is disabled<br>It is the display registers that are read back. |
| cnr_lq_bila_bypass | Low-frequency bilateral 3x3 filter bypass enable signal<br>1'b1: bypass is enable, out_data equals in_data in this 3x3 filter.<br>1'b0: Bypass is disabled.<br>It is the display registers that are read back. |
| cnr_hq_bila_bypass | High-frequency 5x5 bilateral filter bypass signal<br>1: bypass is enable, out_data equals in_data in this 5x5 filter.<br>0: Bypass is disabled.<br>It is the display registers that are read back. |
| cnr_exgain_bypass | sw_cnr_exgain_bypass<br>External gain bypass enable signal<br>1: Bypass is enabled, and the external gain value is fixed at sw_cnr_egain_mux<br>0: bypass is disabled, and the external gain is used.<br>The current version does not support bypassing the disable.<br>It is the display registers that are read back. |
| cnr_en_i | CNR module enable signal 1: enabled; 0: disabled |
| cnr_global_gain | CNR denoising local mode and global mode interpolation strength<br>configuration. Generally, the default value is used, and the local gain method is<br>used without configuration.<br>The value range is 0.0 to 64.0, and the default value is 1. |
| cnr_global_gain_alpha | CNR denoising local mode and global mode interpolation strength<br>configuration. Generally, the default value is used, and the local gain method is<br>used without configuration.<br>The value range is 0.0 1.0, and the default value is 0. |
| cnr_gain_iso | Amplify the external gain, the range is 0~128 |
| cnr_gain_offset | The gain offset of the low-pass filter in the gain calibration, in the range of<br>0~16 |
| cnr_gain_1sigma | Amplify the output data of the high-pass filter in the gain calibration |
| cnr_gain_uvgain1 | uvgain parameter 1 |
| cnr_gain_uvgain0 | uvgain parameter 0 |
| cnr_lmed3_alpha | in_data weight in the low-frequency median filter, ranging from 0~16 |
| cnr_lbf5_gain_y; | Y gain of the lbf5x5 bilateral filter |
| cnr_lbf5_gain_c; | UV gain of lbf5x5 bilateral filter |
| cnr_lbf5_weit_d[0] | The spatial weight of pix12, the range is 1~128 |

<!-- Source EN PDF p.268; unit 2865 -->

| Parameter Name | Parameter Description |
|---|---|
| cnr_lbf5_weit_d[1] | The spatial weight of pix7,11,13,17, the range is 0~128 |
| cnr_lbf5_weit_d[2] | The spatial weight of pix6,8,16,18, the range is 0~128 |
| cnr_lbf5_weit_d[3] | Spatial weight of distance 4 or 5, range 0~128 |
| cnr_lbf5_weit_d[4] | pix0,4,20,24 spatial weight, range 0~128 |
| cnr_hmed3_alpha | in_data weight in the high-frequency median filter, ranging from 0~16 |
| cnr_hbf5_weit_src | The in_data weight of hbf5x5 ranges from 0~128 |
| cnr_hbf5_min_wgt | hbf5x5 weit_r lower limit |
| cnr_hbf5_sigma | Sigma value of hbf5x5 |
| cnr_lbf5_weit_src | The in_data weight of lbf3x3 ranges from 0~128 |
| cnr_lbf3_sigma | sigma value of lbf3x3 |

<!-- Source EN PDF p.268; unit 2866 -->

9.4.4.33  rk_aiq_cnr_strength_v2_t

<!-- Source EN PDF p.268; unit 2867 -->

【Description】 Define the denoising intensity configuration structure of the denoising module

<!-- Source EN PDF p.268; unit 2868 -->

【Definition】

<!-- Source EN PDF p.268; unit 2869 -->

```text
 typedef struct rk_aiq_cnr_strength_v2_s {
     rk_aiq_uapi_sync_t sync;
     float percent;
 } rk_aiq_cnr_strength_v2_t;
```

<!-- Source EN PDF p.268; unit 2870 -->

【Member】

<!-- Source EN PDF p.268; unit 2871 -->

| Member Name | Description |
|---|---|
| sync | For synchronous asynchronous mode selection, see Overview/API Description section |
| percent | Denoising intensity, the value range is 0.0-1.0. |

<!-- Source EN PDF p.268; unit 2872 -->

### 9.5   BLC

<!-- Source EN PDF p.268; unit 2873 -->

#### 9.5.1  Description of the feature

<!-- Source EN PDF p.268; unit 2874 -->

#### 9.5.2  Functional level API reference

<!-- Source EN PDF p.268; unit 2875 -->

9.5.2.1  rk_aiq_user_api2_ablc_SetAttrib

<!-- Source EN PDF p.269; unit 2876 -->

【Description】 Set the blc parameter property

<!-- Source EN PDF p.269; unit 2877 -->

【Grammar】

<!-- Source EN PDF p.269; unit 2878 -->

```text
 XCamReturn
 rk_aiq_user_api2_ablc_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_blc_attrib_t *attr);
```

<!-- Source EN PDF p.269; unit 2879 -->

【Parameters】

<!-- Source EN PDF p.269; unit 2880 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | blc parameter attribute | Input |

<!-- Source EN PDF p.269; unit 2881 -->

【Return Value】

<!-- Source EN PDF p.269; unit 2882 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.269; unit 2883 -->

【Requirements】

<!-- Source EN PDF p.269; unit 2884 -->

Header files: rk_aiq_user_api2_ablc.h, RkAiqHandleInt.h, rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.269; unit 2885 -->

Library file: librkaiq.so

<!-- Source EN PDF p.269; unit 2886 -->

9.5.2.2  rk_aiq_user_api2_ablc_GetAttrib

<!-- Source EN PDF p.269; unit 2887 -->

【Description】 Gets the BLC parameter properties

<!-- Source EN PDF p.269; unit 2888 -->

【Grammar】

<!-- Source EN PDF p.269; unit 2889 -->

```text
 XCamReturn
 rk_aiq_user_api2_ablc_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_blc_attrib_t *attr);
```

<!-- Source EN PDF p.269; unit 2890 -->

【Parameters】

<!-- Source EN PDF p.269; unit 2891 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | blc parameter attribute | Input |

<!-- Source EN PDF p.270; unit 2892 -->

【Return Value】

<!-- Source EN PDF p.270; unit 2893 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.270; unit 2894 -->

【Requirements】

<!-- Source EN PDF p.270; unit 2895 -->

Header files: rk_aiq_user_api2_ablc.h, RkAiqHandleInt.h, rk_aiq_user_api2_sysctl.h

<!-- Source EN PDF p.270; unit 2896 -->

Library file: librkaiq.so

<!-- Source EN PDF p.270; unit 2897 -->

#### 9.5.3  Module-level API data types

<!-- Source EN PDF p.270; unit 2898 -->

9.5.3.1  rk_aiq_blc_attrib_t

<!-- Source EN PDF p.270; unit 2899 -->

【Description】 BLC module parameters

<!-- Source EN PDF p.270; unit 2900 -->

【Definition】

<!-- Source EN PDF p.270; unit 2901 -->

```text
 typedef struct rk_aiq_blc_attrib_s {
     rk_aiq_uapi_sync_t sync;
     AblcOPMode_t eMode;
     AblcParams_t stBlc0Auto;
     AblcParams_t stBlc1Auto;
     AblcManualAttr_t stBlc0Manual;
     AblcManualAttr_t stBlc1Manual;
 } rk_aiq_blc_attrib_t;
```

<!-- Source EN PDF p.270; unit 2902 -->

【Member】

<!-- Source EN PDF p.270; unit 2903 -->

| Member Name | Description |
|---|---|
| sync | For synchronous asynchronous mode selection, see Overview/API Description section |
| eMode | BLC Module Mode |
| stBlc0Auto | blc0 automatic mode parameter |
| stBlc0Manual | blc0 manual mode parameter |
| stBlc1Auto | blc1 Auto Mode Parameter |
| stBlc1Manual | blc1 manual mode parameter |

<!-- Source EN PDF p.271; unit 2904 -->

9.5.3.2  AblcOPMode_t

<!-- Source EN PDF p.271; unit 2905 -->

【Description】 Define the mode properties of the denoising module

<!-- Source EN PDF p.271; unit 2906 -->

【Definition】

<!-- Source EN PDF p.271; unit 2907 -->

```text
 typedef enum AblcOPMode_e {
     ABLC_OP_MODE_OFF         = 0,
     ABLC_OP_MODE_AUTO             = 1,
     ABLC_OP_MODE_MANUAL           = 2,
     ABLC_OP_MODE_MAX
 } AblcOPMode_t;
```

<!-- Source EN PDF p.271; unit 2908 -->

【Member】

<!-- Source EN PDF p.271; unit 2909 -->

| Member Name | Description |
|---|---|
| ABLC_OP_MODE_OFF | BLC module invalid mode |
| ABLC_OP_MODE_AUTO | BLC Module Auto Mode |
| ABLC_OP_MODE_MANUAL | Algorithm settings for manual mode of the BLC module |
| ABLC_OP_MODE_MAX | BLC module mode maximum, which is an invalid mode |

<!-- Source EN PDF p.271; unit 2910 -->

9.5.3.3  AblcParams_t

<!-- Source EN PDF p.271; unit 2911 -->

【Description】 BLC module automatic mode parameters

<!-- Source EN PDF p.271; unit 2912 -->

【Definition】

<!-- Source EN PDF p.271; unit 2913 -->

```text
 typedef struct AblcParams_s {
     bool enable;
     int len;
     float* iso;
     float* blc_r;
     float* blc_gr;
     float* blc_gb;
     float* blc_b;
 } AblcParams_t;
```

<!-- Source EN PDF p.271; unit 2914 -->

【Member】

<!-- Source EN PDF p.272; unit 2915 -->

| Member Name | Description |
|---|---|
| enable | Module enable switch 1: enable; 0: Disability; |
| len | iso corresponds to array length |
| iso | ISO rating |
| blc_r | Different ISO correspondence, BLC value. Array pointer |
| blc_gr | Different ISO correspondence, BLC value. Array pointer |
| blc_gb | Different ISO correspondence, BLC value. Array pointer |
| blc_b | Different ISO correspondence, BLC value. Array pointer |

<!-- Source EN PDF p.272; unit 2916 -->

9.5.3.4  AblcManualAttr_t

<!-- Source EN PDF p.272; unit 2917 -->

【Description】 BLC module manual mode parameters

<!-- Source EN PDF p.272; unit 2918 -->

【Definition】

<!-- Source EN PDF p.272; unit 2919 -->

```text
 typedef struct AblcSelect_s {
     bool enable;
     short int blc_r;
     short int blc_gr;
     short int blc_gb;
     short int blc_b;
 } AblcSelect_t;
 typedef AblcSelect_t AblcManualAttr_t;
```

<!-- Source EN PDF p.272; unit 2920 -->

【Member】

<!-- Source EN PDF p.272; unit 2921 -->

| Member Name | Description |
|---|---|
| enable | Module enable switch 1: enable; 0: Disability; |
| blc_r | BLC module R channel properties |
| blc_gr | blc module gr channel properties |
| blc_gb | BLC module GB channel properties |
| blc_b | BLC module B channel properties |

<!-- Source EN PDF p.273; unit 2922 -->

### 9.6   Dehaze&Enhance

<!-- Source EN PDF p.273; unit 2923 -->

#### 9.6.1  Description of the feature

<!-- Source EN PDF p.273; unit 2924 -->

Dehaze &amp; Enhanced contains 2 modes:

<!-- Source EN PDF p.273; unit 2925 -->

Dehaze is enhanced by dynamically changing the contrast and brightness of the image.

<!-- Source EN PDF p.273; unit 2926 -->

Enhance the contrast of local areas of the image.

<!-- Source EN PDF p.273; unit 2927 -->

Dehaze and Enhanced are mutually exclusive.

<!-- Source EN PDF p.273; unit 2928 -->

#### 9.6.2  Functional level API reference

<!-- Source EN PDF p.273; unit 2929 -->

9.6.2.1  rk_aiq_uapi2_setDehazeModuleEnable

<!-- Source EN PDF p.273; unit 2930 -->

【Description】

<!-- Source EN PDF p.273; unit 2931 -->

Set the dehaze module switch to control stAuto.DehazeTuningPara.Enable or stManual.Enable (automatically modified according to the current api mode).

<!-- Source EN PDF p.273; unit 2932 -->

【Grammar】

<!-- Source EN PDF p.273; unit 2933 -->

```text
 XCamReturn rk_aiq_uapi2_setDehazeModuleEnable(const rk_aiq_sys_ctx_t* ctx, bool
 on);
```

<!-- Source EN PDF p.273; unit 2934 -->

【Parameter】

<!-- Source EN PDF p.273; unit 2935 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| on | Switch function. | Input |

<!-- Source EN PDF p.273; unit 2936 -->

【Return value】

<!-- Source EN PDF p.273; unit 2937 -->

| Return value | Description |
|---|---|
| 0 | succeed |
| Non-0 | Failed, see the error code table for details |

<!-- Source EN PDF p.273; unit 2938 -->

【Demand】

<!-- Source EN PDF p.273; unit 2939 -->

Header Files:rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.273; unit 2940 -->

Library files:librkaiq.so

<!-- Source EN PDF p.274; unit 2941 -->

9.6.2.2  rk_aiq_uapi2_setDehazeEnable

<!-- Source EN PDF p.274; unit 2942 -->

【Description】

<!-- Source EN PDF p.274; unit 2943 -->

Set the Dehaze function switch to control stAuto.DehazeTuningPara.dehaze_setting.en or stManual.dehaze_setting.en (automatically modified according to the current API mode).

<!-- Source EN PDF p.274; unit 2944 -->

【Grammar】

<!-- Source EN PDF p.274; unit 2945 -->

```text
 XCamReturn rk_aiq_uapi2_setDehazeEnable(const rk_aiq_sys_ctx_t* ctx, bool on);
```

<!-- Source EN PDF p.274; unit 2946 -->

【Parameter】

<!-- Source EN PDF p.274; unit 2947 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| on | Switch function. | Input |

<!-- Source EN PDF p.274; unit 2948 -->

【Return value】

<!-- Source EN PDF p.274; unit 2949 -->

| Return value | Description |
|---|---|
| 0 | succeed |
| Non-0 | Failed, see the error code table for details |

<!-- Source EN PDF p.274; unit 2950 -->

【Demand】

<!-- Source EN PDF p.274; unit 2951 -->

Header Files:rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.274; unit 2952 -->

Library files:librkaiq.so

<!-- Source EN PDF p.274; unit 2953 -->

9.6.2.3  rk_aiq_uapi2_setMDehazeStrth

<!-- Source EN PDF p.274; unit 2954 -->

【Description】

<!-- Source EN PDF p.274; unit 2955 -->

Set the manual dehazing strength, based on 50, greater than 50 will increase the dehazing strength, less than 50 will reduce the dehazing intensity.

<!-- Source EN PDF p.274; unit 2956 -->

Both DEHAZE_API_AUTO and DEHAZE_API_MANUAL are set to API mode.

<!-- Source EN PDF p.274; unit 2957 -->

Before using this API, you need to ensure that the Dehaze function takes effect, or call the rk_aiq_uapi2_setDehazeModuleEnable and rk_aiq_uapi2_setDehazeEnable before using this API (see Case 6 in sample_adehaze_module.cpp for the process).

<!-- Source EN PDF p.274; unit 2958 -->

【Grammar】

<!-- Source EN PDF p.274; unit 2959 -->

```text
 XCamReturn rk_aiq_uapi2_setMDehazeStrth(const rk_aiq_sys_ctx_t* ctx, unsigned int
 level);
```

<!-- Source EN PDF p.274; unit 2960 -->

【Parameters】

<!-- Source EN PDF p.275; unit 2961 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| level | Grade, value range [1,100], default value is 50, precision 1. | Input |

<!-- Source EN PDF p.275; unit 2962 -->

【Return Value】

<!-- Source EN PDF p.275; unit 2963 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.275; unit 2964 -->

【Requirements】

<!-- Source EN PDF p.275; unit 2965 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.275; unit 2966 -->

Library file: librkaiq.so

<!-- Source EN PDF p.275; unit 2967 -->

9.6.2.4  rk_aiq_uapi2_getMDehazeStrth

<!-- Source EN PDF p.275; unit 2968 -->

【Description】

<!-- Source EN PDF p.275; unit 2969 -->

Get the manual dehazing force.

<!-- Source EN PDF p.275; unit 2970 -->

【Grammar】

<!-- Source EN PDF p.275; unit 2971 -->

```text
 XCamReturn rk_aiq_uapi2_getMDehazeStrth(const rk_aiq_sys_ctx_t* ctx, unsigned
 int* level);
```

<!-- Source EN PDF p.275; unit 2972 -->

【Parameters】

<!-- Source EN PDF p.275; unit 2973 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| level | Grade, value range [1,100], default value is 50, precision 1. | Output |

<!-- Source EN PDF p.275; unit 2974 -->

【Return Value】

<!-- Source EN PDF p.275; unit 2975 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.275; unit 2976 -->

【Requirements】

<!-- Source EN PDF p.275; unit 2977 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.275; unit 2978 -->

Library file: librkaiq.so

<!-- Source EN PDF p.276; unit 2979 -->

9.6.2.5  rk_aiq_uapi2_setEnhanceEnable

<!-- Source EN PDF p.276; unit 2980 -->

【Description】

<!-- Source EN PDF p.276; unit 2981 -->

Set the Dehaze function switch to control stAuto.DehazeTuningPara.enhance_setting.en or stManual.enhance_setting.en (automatically modified according to the current API mode).

<!-- Source EN PDF p.276; unit 2982 -->

【Grammar】

<!-- Source EN PDF p.276; unit 2983 -->

```text
 XCamReturn rk_aiq_uapi2_setEnhanceEnable(const rk_aiq_sys_ctx_t* ctx, bool on);
```

<!-- Source EN PDF p.276; unit 2984 -->

【Parameters】

<!-- Source EN PDF p.276; unit 2985 -->

| Return value | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| on | Switch function. | Input |

<!-- Source EN PDF p.276; unit 2986 -->

【Return Value】

<!-- Source EN PDF p.276; unit 2987 -->

| Return Value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.276; unit 2988 -->

【Demand】

<!-- Source EN PDF p.276; unit 2989 -->

Header Files:rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.276; unit 2990 -->

Library files:librkaiq.so

<!-- Source EN PDF p.276; unit 2991 -->

9.6.2.6  rk_aiq_uapi2_setMEnhanceStrth

<!-- Source EN PDF p.276; unit 2992 -->

【Description】

<!-- Source EN PDF p.276; unit 2993 -->

Set the manual contrast enhancement strength, based on 50, greater than 50 to enhance the contrast, less than 50 to decrease the contrast.

<!-- Source EN PDF p.276; unit 2994 -->

Both DEHAZE_API_AUTO and DEHAZE_API_MANUAL are set to API mode.

<!-- Source EN PDF p.276; unit 2995 -->

Before using this API, you need to ensure that the Enhance function takes effect, or call the rk_aiq_uapi2_setDehazeModuleEnable and rk_aiq_uapi2_setEnhanceEnable before using this API (see Case 9 in sample_adehaze_module.cpp for the process).

<!-- Source EN PDF p.276; unit 2996 -->

【Grammar】

<!-- Source EN PDF p.276; unit 2997 -->

```text
 XCamReturn rk_aiq_uapi2_setMEnhanceStrth(const rk_aiq_sys_ctx_t* ctx, unsigned
 int level);
```

<!-- Source EN PDF p.276; unit 2998 -->

【Parameters】

<!-- Source EN PDF p.277; unit 2999 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| level | Grade, value range [1,100], default value is 50, precision 1. | Input |

<!-- Source EN PDF p.277; unit 3000 -->

【Return Value】

<!-- Source EN PDF p.277; unit 3001 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.277; unit 3002 -->

【Requirements】

<!-- Source EN PDF p.277; unit 3003 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.277; unit 3004 -->

Library file: librkaiq.so

<!-- Source EN PDF p.277; unit 3005 -->

9.6.2.7  rk_aiq_uapi2_getMEnhanceStrth

<!-- Source EN PDF p.277; unit 3006 -->

【Description】

<!-- Source EN PDF p.277; unit 3007 -->

Get manual contrast enhancement.

<!-- Source EN PDF p.277; unit 3008 -->

【Grammar】

<!-- Source EN PDF p.277; unit 3009 -->

```text
 XCamReturn rk_aiq_uapi2_getMEnhanceStrth(const rk_aiq_sys_ctx_t* ctx, unsigned
 int *level);
```

<!-- Source EN PDF p.277; unit 3010 -->

【Parameters】

<!-- Source EN PDF p.277; unit 3011 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| level | Grade, value range [1,100], default value is 50, precision 1. | Output |

<!-- Source EN PDF p.277; unit 3012 -->

【Return Value】

<!-- Source EN PDF p.277; unit 3013 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.277; unit 3014 -->

【Requirements】

<!-- Source EN PDF p.277; unit 3015 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.277; unit 3016 -->

Library file: librkaiq.so

<!-- Source EN PDF p.278; unit 3017 -->

#### 9.6.3  Module-level API reference

<!-- Source EN PDF p.278; unit 3018 -->

9.6.3.1  rk_aiq_user_api2_adehaze_v12_setSwAttrib

<!-- Source EN PDF p.278; unit 3019 -->

【Description】

<!-- Source EN PDF p.278; unit 3020 -->

Set dehaze parameters.

<!-- Source EN PDF p.278; unit 3021 -->

【Grammar】

<!-- Source EN PDF p.278; unit 3022 -->

```text
 XCamReturn  rk_aiq_user_api2_adehaze_setSwAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 const adehaze_sw_v2_t* attr);
```

<!-- Source EN PDF p.278; unit 3023 -->

【Parameters】

<!-- Source EN PDF p.278; unit 3024 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | Dehazing parameters | Input |

<!-- Source EN PDF p.278; unit 3025 -->

【Return Value】

<!-- Source EN PDF p.278; unit 3026 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.278; unit 3027 -->

9.6.3.2  rk_aiq_user_api2_adehaze_getSwAttrib

<!-- Source EN PDF p.278; unit 3028 -->

【Description】

<!-- Source EN PDF p.278; unit 3029 -->

Gets the current dehazing parameters.

<!-- Source EN PDF p.278; unit 3030 -->

【Grammar】

<!-- Source EN PDF p.278; unit 3031 -->

```text
 XCamReturn  rk_aiq_user_api2_adehaze_getSwAttrib(const rk_aiq_sys_ctx_t*
 sys_ctx,adehaze_sw_v2_t* attr);
```

<!-- Source EN PDF p.278; unit 3032 -->

【Parameters】

<!-- Source EN PDF p.278; unit 3033 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | Dehazing parameters | Output |

<!-- Source EN PDF p.278; unit 3034 -->

【Return Value】

<!-- Source EN PDF p.279; unit 3035 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.279; unit 3036 -->

#### 9.6.4  Module-level API data types

<!-- Source EN PDF p.279; unit 3037 -->

9.6.4.1  dehaze_api_mode_t

<!-- Source EN PDF p.279; unit 3038 -->

【Description】 Define the dehaze module operating mode

<!-- Source EN PDF p.279; unit 3039 -->

【Definition】

<!-- Source EN PDF p.279; unit 3040 -->

```text
 typedef enum dehaze_api_mode_e {
     DEHAZE_API_AUTO   = 0,
     DEHAZE_API_MANUAL = 1,
 } dehaze_api_mode_t;
```

<!-- Source EN PDF p.279; unit 3041 -->

【Member】

<!-- Source EN PDF p.279; unit 3042 -->

| Member Name | Description |
|---|---|
| DEHAZE_API_AUTO | Auto Dehaze mode |
| DEHAZE_API_MANUAL | Manual dehaze mode |

<!-- Source EN PDF p.279; unit 3043 -->

9.6.4.2  DehazeDataV21_t

<!-- Source EN PDF p.279; unit 3044 -->

【Description】 Define the automatic dehaze debug parameter properties

<!-- Source EN PDF p.279; unit 3045 -->

【Definition】

<!-- Source EN PDF p.279; unit 3046 -->

```text
 typedef struct DehazeDataV21_s{
     float* EnvLv;
     int    EnvLv_len;
     float* dc_min_th;
     int    dc_min_th_len;
     float* dc_max_th;
     int    dc_max_th_len;
     float* yhist_th;
     int    yhist_th_len;
     float* yblk_th;
     int    yblk_th_len;
     float* dark_th;
     int    dark_th_len;
     float* bright_min;
     int    bright_min_len;
     float* bright_max;
     int    bright_max_len;
     float* wt_max;
     int    wt_max_len;
     float* air_min;
     int    air_min_len;
     float* air_max;
     int    air_max_len;
     float* tmax_base;
     int    tmax_base_len;
     float* tmax_off;
     int    tmax_off_len;
     float* tmax_max;
     int    tmax_max_len;
     float* cfg_wt;
     int    cfg_wt_len;
     float* cfg_air;
     int    cfg_air_len;
     float* cfg_tmax;
     int    cfg_tmax_len;
     float* dc_weitcur;
     int    dc_weitcur_len;
     float* bf_weight;
     int    bf_weight_len;
     float* range_sigma;
     int    range_sigma_len;
     float* space_sigma_pre;
     int    space_sigma_pre_len;
     float* space_sigma_cur;
     int    space_sigma_cur_len;
 } DehazeDataV21_t;
```

<!-- Source EN PDF p.280; unit 3047 -->

【Members】

<!-- Source EN PDF p.281; unit 3048 -->

| Member name | Description |
|---|---|
| EnvLv | Ambient brightness |
| EnvLv_len | EnvLv array length |
| dc_min_th | The statistical range of WT is adaptive, and the value range is [16, 120], and the<br>default value is 64. |
| dc_min_th_len | dc_min_th array length |
| dc_max_th | WT adaptive high exposure area statistical range, the value range is [170, 255],<br>and the default value is 192. |
| dc_max_th_len | dc_max_th array length |
| yhist_th | The statistical range of the high exposure area of the y component is [170, 255],<br>and the default value is 249. |
| yhist_th_len | yhist_th array length |
| yblk_th | The threshold of the proportion of the number of y component blocks is 0.002,<br>0.01, and the default value is 0.002. |
| yblk_th_len | yblk_th array length |
| dark_th | WT adapts to the minimum threshold of the Y component block, the value range<br>is [230, 250], and the default value is 250. |
| dark_th_len | dark_th array length |
| bright_min | The minimum value of the AIR adaptive threshold, which ranges from 160 to 200,<br>and the default value is 180. |
| bright_min_len | bright_min array length |
| bright_max | The maximum value of the air adaptive threshold ranges from 210 to 250, and the<br>default value is 240. |
| bright_max_len | bright_max array length |
| wt_max | The maximum value of WT is 0.75 and 0.9, and the default value is 0.9. |
| wt_max_len | wt_max array length |
| air_min | The minimum value of air adaptation ranges from 200 to 220, and the default<br>value is 200. |
| air_min_len | air_min array length |
| air_max | The maximum adaptive value of air is 230 and 250, and the default value is 250. |
| air_max_len | air_max array length |
| tmax_base | The default value of tmax is 125, and the corresponding configuration is as<br>follows: 200 (131), 210 (125), 220 (119), 230 (114), 240 (109), 250 (105), and<br>131-105 are recommended |

<!-- Source EN PDF p.282; unit 3049 -->

| Member name | Description |
|---|---|
| tmax_base_len | tmax_base array length |
| tmax_off | The fixed value of tmax is adaptive, the value range is [0.1, 0.5], and the default<br>value is 0.1. |
| tmax_off_len | tmax_off array length |
| tmax_max | The maximum value of tmax is 0.1, 0.5, and the default value is 0.5. |
| tmax_max_len | tmax_max array length |
| cfg_wt | The software is configured with wt, image dehazing strength, value range [0, 1],<br>default value 0.8. |
| cfg_wt_len | cfg_wt array length |
| cfg_air | The software configures air and atmospheric light coefficient, and the value range<br>is [0, 255], and the default value is 210. |
| cfg_air_len | cfg_air array length |
| cfg_tmax | The software configures tmax, the maximum value of dehazing, the value range is<br>[0, 1], and the default value is 0.2. |
| cfg_tmax_len | cfg_tmax array length |
| bf_weight | The composite weight of the two bilateral filters can be in the range of [0, 1], and<br>the default value is 0.5. |
| bf_weight_len | bf_weight array length |
| dc_weitcur | The weight of the dark channel part, the value range is [0, 1], and the default<br>value. |
| dc_weitcur_len | dc_weitcur array length |
| range_sigma | The sigma value of the bilateral filter range, the value range is [0, 1], and the<br>default value is 0.4. |
| range_sigma_len | range_sigma array length |
| space_sigma_pre | When the IIR data is used as a reference, the sigma value of the double-sided<br>filtered airspace can be in the range of [0, 1], and the default value is 0.4. |
| space_sigma_pre_len | space_sigma_pre array length |
| space_sigma_cur | When the current data is used as a reference, the sigma value of the bilateral<br>filtered airspace can be in the range [0, 1], and the default value is 0.8. |
| space_sigma_cur_len | space_sigma_cur array length |

<!-- Source EN PDF p.283; unit 3050 -->

9.6.4.3  Dehaze_Setting_V21_t

<!-- Source EN PDF p.283; unit 3051 -->

【Description】 Define the parameters of the automatic dehaze function

<!-- Source EN PDF p.283; unit 3052 -->

【Definition】

<!-- Source EN PDF p.283; unit 3053 -->

```text
 typedef struct Dehaze_Setting_V21_s{
     bool            en;
     bool            air_lc_en;
     float           stab_fnum;
     float           sigma;
     float           wt_sigma;
     float           air_sigma;
     float           tmax_sigma;
     float           pre_wet;
     DehazeDataV21_t DehazeData;
 } Dehaze_Setting_V21_t;
```

<!-- Source EN PDF p.283; unit 3054 -->

【Member】

<!-- Source EN PDF p.283; unit 3055 -->

| Member Name | Description |
|---|---|
| en | Switch function |
| air_lc_en | Whether to use Airlight Base to switch the minimum value off on Airlight |
| stab_fnum | The maximum value for frame stabilization |
| sigma | IIR controlled sigma |
| wt_sigma | Inter-frame WT filter coefficient |
| air_sigma | Inter-frame AIR filtering coefficient |
| tmax_sigma | Tmax filtering coefficient between frames |
| pre_wet | Reference data IIR filter factor |
| DehazeData | dehaze debug parameters |

<!-- Source EN PDF p.283; unit 3056 -->

9.6.4.4  EnhanceDataV21_t

<!-- Source EN PDF p.283; unit 3057 -->

【Description】 Define the Auto-Enhance debug parameter properties

<!-- Source EN PDF p.283; unit 3058 -->

【Definition】

<!-- Source EN PDF p.284; unit 3059 -->

```text
 typedef struct EnhanceDataV21_s{
     float* EnvLv;
     int    EnvLv_len;
     float* enhance_value;
     int    enhance_value_len;
     float* enhance_chroma;
     int    enhance_chroma_len;
 } EnhanceDataV21_t;
```

<!-- Source EN PDF p.284; unit 3060 -->

【Member】

<!-- Source EN PDF p.284; unit 3061 -->

| Member Name | Description |
|---|---|
| EnvLv | Ambient brightness |
| EnvLv_len | The length of the ambient brightness array |
| enhance_value | Universal contrast dynamics, value range [0,16], recommended range [1, 2] |
| enhance_value_len | enhance_value array length |
| enhance_chroma | Enhanced adjustment parameters for chromaticity, value range [0, 16],<br>recommended range [1, 2] |
| enhance_chroma_len | enhance_chroma array length |

<!-- Source EN PDF p.284; unit 3062 -->

9.6.4.5  Enhance_Setting_V21_t

<!-- Source EN PDF p.284; unit 3063 -->

【Description】 Define the attributes of the automatic enhance function parameters

<!-- Source EN PDF p.284; unit 3064 -->

【Definition】

<!-- Source EN PDF p.284; unit 3065 -->

```text
 typedef struct Enhance_Setting_V21_s{
     bool             en;
     float            enhance_curve[CALIBDB_ADEHAZE_ENHANCE_CURVE_KNOTS_NUM];
     EnhanceDataV21_t EnhanceData;
 } Enhance_Setting_V21_t;
```

<!-- Source EN PDF p.284; unit 3066 -->

【Member】

<!-- Source EN PDF p.284; unit 3067 -->

| Member Name | Description |
|---|---|
| en | Enhance function switch. 0: Off, 1: On. |
| enhance_curve | Low frequency curve. |
| EnhanceData | enhance debug parameters. |

<!-- Source EN PDF p.285; unit 3068 -->

9.6.4.6  Hist_setting_V21_t

<!-- Source EN PDF p.285; unit 3069 -->

【Description】 Define automatic hist debugging parameter properties

<!-- Source EN PDF p.285; unit 3070 -->

【Definition】

<!-- Source EN PDF p.285; unit 3071 -->

```text
 typedef struct HistDataV21_s{
     float* EnvLv;
     int    EnvLv_len;
     float* hist_gratio;
     int    hist_gratio_len;
     float* hist_th_off;
     int    hist_th_off_len;
     float* hist_k;
     int    hist_k_len;
     float* hist_min;
     int    hist_min_len;
     float* hist_scale;
     int    hist_scale_len;
     float* cfg_gratio;
     int    cfg_gratio_len;
 } HistDataV21_t;
```

<!-- Source EN PDF p.285; unit 3072 -->

【Member】

<!-- Source EN PDF p.286; unit 3073 -->

| Member<br>Name | Description |
|---|---|
| EnvLv | Ambient brightness |
| EnvLv_len | EnvLv array length |
| hist_gratio | Histogram stretch multiple, histogram equalization control coefficient, value range [0,<br>32] |
| hist_gratio_len | hist_gratio array length |
| hist_th_off | The statistical threshold of the histogram ranges from 0 to 255 and the default value is<br>64 |
| hist_th_off_len | hist_th_off array length |
| hist_k | The histogram adaptive threshold magnification ranges from 0 to 7 and is 2 |
| hist_k_len | hist_k array length |
| hist_min | The minimum value of the statistical threshold of the histogram ranges from 0,2 to<br>0.016 |
| hist_min_len | hist_min array length |
| hist_scale | Histogram equalization control coefficients, value range [0, 32] |
| hist_scale_len | hist_scale array length |
| cfg_gratio | The software configures the histogram stretch multiple, the histogram equalization<br>control coefficient, and the value range [0, 32] |
| cfg_gratio_len | cfg_gratio array length |

<!-- Source EN PDF p.286; unit 3074 -->

9.6.4.7  Hist_setting_V21_t

<!-- Source EN PDF p.286; unit 3075 -->

【Description】 Define the automatic hist function parameter attributes

<!-- Source EN PDF p.286; unit 3076 -->

【Definition】

<!-- Source EN PDF p.286; unit 3077 -->

```text
 typedef struct Hist_setting_V21_s{
     bool          en;
     bool          hist_para_en;
     HistDataV21_t HistData;
 } Hist_setting_V21_t;
```

<!-- Source EN PDF p.286; unit 3078 -->

【Member】

<!-- Source EN PDF p.287; unit 3079 -->

| Member Name | Description |
|---|---|
| en | Hist function switch |
| hist_para_en | Histogram stretch control switch |
| HistData | hist debug parameters |

<!-- Source EN PDF p.287; unit 3080 -->

9.6.4.8  CalibDbDehazeV21_t

<!-- Source EN PDF p.287; unit 3081 -->

【Description】 Define the debugging parameter properties of the automatic dehaze module

<!-- Source EN PDF p.287; unit 3082 -->

【Definition】

<!-- Source EN PDF p.287; unit 3083 -->

```text
 typedef struct CalibDbDehazeV21_s{
     bool                  Enable;
     float                 cfg_alpha;
     float                 ByPassThr;
     Dehaze_Setting_V21_t  dehaze_setting;
     Enhance_Setting_V21_t enhance_setting;
     Hist_setting_V21_t    hist_setting;
 } CalibDbDehazeV21_t;
```

<!-- Source EN PDF p.287; unit 3084 -->

【Member】

<!-- Source EN PDF p.287; unit 3085 -->

| Member Name | Description |
|---|---|
| Enable | Switch function |
| cfg_alpha | Proportion of manual software configuration, the value range is 0, 1, the default value<br>is 1, and the accuracy is 0.01 |
| dehaze_setting | Auto Dehaze Function Parameter |
| enhance_setting | Automatic Enhance Function Parameter |
| hist_setting | Auto hist function parameter |

<!-- Source EN PDF p.287; unit 3086 -->

9.6.4.9  CalibDbV2_dehaze_v21_t

<!-- Source EN PDF p.287; unit 3087 -->

【Description】 Define automatic dehaze module properties

<!-- Source EN PDF p.287; unit 3088 -->

【Definition】

<!-- Source EN PDF p.287; unit 3089 -->

```text
 typedef struct CalibDbV2_dehaze_V21_s{
     CalibDbDehazeV21_t DehazeTuningPara;
 } CalibDbV2_dehaze_V21_t;
```

<!-- Source EN PDF p.287; unit 3090 -->

【Member】

<!-- Source EN PDF p.288; unit 3091 -->

| Member Name | Description |
|---|---|
| DehazeTuningPara | Automatic dehaze module debugging parameters |

<!-- Source EN PDF p.288; unit 3092 -->

9.6.4.10  mDehazeDataV21_t

<!-- Source EN PDF p.288; unit 3093 -->

【Description】 Define manual DehazeData properties

<!-- Source EN PDF p.288; unit 3094 -->

【Definition】

<!-- Source EN PDF p.288; unit 3095 -->

```text
 typedef struct mDehazeDataV21_s {
     float dc_min_th;
     float dc_max_th;
     float yhist_th;
     float yblk_th;
     float dark_th;
     float bright_min;
     float bright_max;
     float wt_max;
     float air_min;
     float air_max;
     float tmax_base;
     float tmax_off;
     float tmax_max;
     float cfg_wt;
     float cfg_air;
     float cfg_tmax;
     float dc_weitcur;
     float bf_weight;
     float range_sigma;
     float space_sigma_pre;
     float space_sigma_cur;
 } mDehazeDataV21_t;
```

<!-- Source EN PDF p.288; unit 3096 -->

【Member】

<!-- Source EN PDF p.289; unit 3097 -->

| Member name | Description |
|---|---|
| dc_min_th | WT adaptive statistical range, value range [16, 120], default value 64, accuracy 0.1. |
| dc_max_th | WT adaptive high exposure area statistical range, value range [170, 255], default value<br>192, accuracy 0.1. |
| yhist_th | Statistical range of high exposure area of y component, value range [170, 255], default<br>value 249, accuracy 0.1 |
| yblk_th | Y component block number proportional threshold, value range [0.002, 0.01], default<br>value 0.002, precision 0.1. |
| dark_th | WT adaptive Y component block minimum threshold, value range [230, 250], default<br>value 250, accuracy 0.1 |
| bright_min | The minimum value of the AIR adaptive threshold, the value range [160, 200], the<br>default value is 180, and the accuracy is 0.1. |
| bright_max | The maximum value of the AIR adaptive threshold, the value range [210, 250], the<br>default value is 240, and the accuracy is 0.1. |
| wt_max | The maximum value limit of wt adaptation, the value range is [0.75, 0.9], the default<br>value is 0.9, and the accuracy is 0.001. |
| air_min | The minimum value limit of air adaptation, the value range [200, 220], the default<br>value is 200, and the accuracy is 0.001. |
| air_max | The maximum value limit of AIR adaptation, the value range [230, 250], the default<br>value is 250, and the accuracy is 0.001. |
| tmax_base | tmax adaptive base value, default 125, corresponding configuration as follows, 200<br>(131), 210 (125), 220 (119), 230 (114), 240 (109), 250 (105), recommended 131-105 |
| tmax_off | Tmax adaptive fixed value, value range [0.1, 0.5], default value 0.1, accuracy 0.1. |
| tmax_max | The maximum value of tmax adaptation, the value range is [0.1, 0.5], the default value<br>is 0.5, and the accuracy is 0.1. |
| cfg_wt | Software configuration wt, image dehazing force, value range [0, 1], default value 0.8,<br>accuracy 0.001. |
| cfg_air | Software configuration air, atmospheric light coefficient, value range [0, 255], default<br>value 210, accuracy 0.001 |
| cfg_tmax | Software configuration tmax, maximum value of dehazing, value range [0, 1], default<br>value 0.2, accuracy 0.001. |
| bf_weight | The combined weights of the two bilateral filters have a value range of [0, 1], a default<br>value of 0.5 and an accuracy of 0.1. |
| dc_weitcur | The bilateral weight of the dark channel part, the value range [0, 1], the default value<br>is 1, and the precision is 0.1. |
| range_sigma | Bilateral filter range sigma value, value range [0, 1], default value 0.4, accuracy 0.1. |

<!-- Source EN PDF p.290; unit 3098 -->

| Member name | Description |
|---|---|
| space_sigma_pre | When using IIR data as a reference, the bilateral filtered airspace sigma value is in the<br>range of [0, 1], the default value is 0.4, and the accuracy is 0.1. |
| space_sigma_cur | When the current data is used as a reference, the bilateral filter airspace sigma value is<br>in the value range [0, 1], the default value is 0.8, and the accuracy is 0.1. |

<!-- Source EN PDF p.290; unit 3099 -->

9.6.4.11  mDehaze_setting_v21_t

<!-- Source EN PDF p.290; unit 3100 -->

【Description】 Define manual dehaze function properties

<!-- Source EN PDF p.290; unit 3101 -->

【Definition】

<!-- Source EN PDF p.290; unit 3102 -->

```text
 typedef struct mDehaze_setting_v21_s {
     bool             en;
     bool             air_lc_en;
     float            stab_fnum;
     float            sigma;
     float            wt_sigma;
     float            air_sigma;
     float            tmax_sigma;
     float            pre_wet;
     mDehazeDataV21_t DehazeData;
 } mDehaze_setting_V21_t;
```

<!-- Source EN PDF p.290; unit 3103 -->

【Member】

<!-- Source EN PDF p.291; unit 3104 -->

| Member<br>Name | Description |
|---|---|
| en | Switch function |
| air_lc_en | Whether to use Airlight Base to make a minimum cutoff toggle |
| stab_fnum | The maximum value of frame stabilization, the value range is [0,31], the default value is<br>8, and the accuracy is 0.01 |
| sigma | IIR-controlled sigma, the value range is 0,255, the default value is 6, and the accuracy is<br>1. |
| wt_sigma | The wt filter coefficient between frames, the value range is [0,255], the default value is<br>8, and the accuracy is 1. |
| air_sigma | The inter-frame air filtering coefficient can be 0,255, the default value is 12, and the<br>accuracy is 1 |
| tmax_sigma | Tmax filtering coefficient between frames, the value range is [0,1], the default value is<br>0.01, and the accuracy is 0.0001 |
| pre_wet | Reference data IIR filter coefficient, value range [0,1], default value 0.01, accuracy<br>0.0001. |
| DehazeData | dehaze debug parameter |

<!-- Source EN PDF p.291; unit 3105 -->

9.6.4.12  mEnhanceDataV21_t

<!-- Source EN PDF p.291; unit 3106 -->

【Description】 Define a manual EnhanceData property

<!-- Source EN PDF p.291; unit 3107 -->

【Definition】

<!-- Source EN PDF p.291; unit 3108 -->

```text
 typedef struct mEnhanceDataV21_s {
     float enhance_value;
     float enhance_chroma;
 } mEnhanceDataV21_t;
```

<!-- Source EN PDF p.291; unit 3109 -->

【Member】

<!-- Source EN PDF p.291; unit 3110 -->

| Member Name | Description |
|---|---|
| enhance_value | General contrast force, value range [0,16], default value 1.0, accuracy 0.001. |
| enhance_chroma | Enhanced adjustment parameters for chromaticity, value range [0,16], default value<br>1.0, accuracy 0.001. |

<!-- Source EN PDF p.292; unit 3111 -->

9.6.4.13  mEnhance_setting_v21_t

<!-- Source EN PDF p.292; unit 3112 -->

【Description】 Define the manual enhance feature property

<!-- Source EN PDF p.292; unit 3113 -->

【Definition】

<!-- Source EN PDF p.292; unit 3114 -->

```text
 typedef struct mEnhance_Setting_V21_s {
     bool              en;
     float             enhance_curve[CALIBDB_ADEHAZE_ENHANCE_CURVE_KNOTS_NUM];
     mEnhanceDataV21_t EnhanceData;
 } mEnhance_Setting_V21_t;
```

<!-- Source EN PDF p.292; unit 3115 -->

【Member】

<!-- Source EN PDF p.292; unit 3116 -->

| Member Name | Description |
|---|---|
| en | Enhance function switch |
| enhance_curve | Low frequency curve |
| EnhanceData | enhance debug parameters |

<!-- Source EN PDF p.292; unit 3117 -->

9.6.4.14  mHistDataV21_t

<!-- Source EN PDF p.292; unit 3118 -->

【Description】 Define the manual HistData property

<!-- Source EN PDF p.292; unit 3119 -->

【Definition】

<!-- Source EN PDF p.292; unit 3120 -->

```text
 typedef struct mHistDataV21_s {
     float hist_gratio;
     float hist_th_off;
     float hist_k;
     float hist_min;
     float hist_scale;
     float cfg_gratio;
 } mHistDataV21_t;
```

<!-- Source EN PDF p.292; unit 3121 -->

【Member】

<!-- Source EN PDF p.293; unit 3122 -->

| Member<br>Name | Description |
|---|---|
| hist_gratio | Histogram stretch multiplier, histogram equilibrium control coefficient, value range [0,<br>32], default value, precision 0.01. |
| hist_th_off | Histogram statistical threshold, value range [0, 255], default value 64, accuracy 0.01. |
| hist_k | Histogram adaptive threshold magnification, value range [0, 7), default value 2, accuracy<br>0.01. |
| hist_min | The minimum value of the histogram statistical threshold, the value range [0,2), the<br>default value is 0.016, and the accuracy is 0.01. |
| hist_scale | Histogram equilibrium control coefficient, value range [0, 32], default value 0.9, accuracy<br>0.01. |
| cfg_gratio | The software configures the histogram stretch multiplier, histogram equalization control<br>coefficient, value range [0, 32), default value 1, accuracy 0.01. |

<!-- Source EN PDF p.293; unit 3123 -->

9.6.4.15  mHist_setting_v21_t

<!-- Source EN PDF p.293; unit 3124 -->

【Description】 Define manual Hist function attributes

<!-- Source EN PDF p.293; unit 3125 -->

【Definition】

<!-- Source EN PDF p.293; unit 3126 -->

```text
 typedef struct mHist_setting_V21_s {
     bool           en;
     bool           hist_para_en;
     mHistDataV21_t HistData;
 } mHist_setting_V21_t;
```

<!-- Source EN PDF p.293; unit 3127 -->

【Member】

<!-- Source EN PDF p.293; unit 3128 -->

| Member Name | Description |
|---|---|
| en | Hist function switch. |
| hist_para_en | Histogram stretch control switch. |
| HistData | Hist debug parameters. |

<!-- Source EN PDF p.293; unit 3129 -->

9.6.4.16  mDehazeAttr_t

<!-- Source EN PDF p.293; unit 3130 -->

【Description】 Define manual dehaze module properties

<!-- Source EN PDF p.293; unit 3131 -->

【Definition】

<!-- Source EN PDF p.294; unit 3132 -->

```text
 typedef struct mDehazeAttr_s {
     bool                   Enable;
     float                  cfg_alpha;
     mDehaze_Setting_V21_t  dehaze_setting;
     mEnhance_Setting_V21_t enhance_setting;
     mHist_setting_V21_t    hist_setting;
 } mDehazeAttr_t;
```

<!-- Source EN PDF p.294; unit 3133 -->

【Member】

<!-- Source EN PDF p.294; unit 3134 -->

| Member Name | Description |
|---|---|
| Enable | Switch function. |
| cfg_alpha | Manual software configuration ratio, value range [0,1], default value 1, accuracy 0.01. |
| dehaze_setting | Manual dehaze function parameters |
| enhance_setting | Manual enhance function parameter |
| hist_setting | Manual Hist function parameters |

<!-- Source EN PDF p.294; unit 3135 -->

9.6.4.17  adehaze_sw_v2_t

<!-- Source EN PDF p.294; unit 3136 -->

【Description】 Define the dehaze attribute

<!-- Source EN PDF p.294; unit 3137 -->

【Definition】

<!-- Source EN PDF p.294; unit 3138 -->

```text
 typedef struct adehaze_sw_V2_s {
     rk_aiq_uapi_sync_t     sync;
     dehaze_api_mode_t      mode;
     CalibDbV2_dehaze_V21_t stAuto;
     mDehazeAttr_t          stManual;
     DehazeManuAttr_t       stDehazeManu;
     EnhanceManuAttr_t      stEnhanceManu;
 } adehaze_sw_V2_t;
```

<!-- Source EN PDF p.294; unit 3139 -->

【Member】

<!-- Source EN PDF p.294; unit 3140 -->

| Member Name | Description |
|---|---|
| sync | For rk_aiq_uapi_sync_t definitions, see Overview/API Description. |
| mode | API schema. |
| stAuto | Automatic dehaze module parameters. |
| stManual | Manual dehaze module parameters. |
| stDehazeManu | Dehazing level parameter, do not use. |
| stEnhanceManu | Contrast level parameter, do not use. |

<!-- Source EN PDF p.295; unit 3141 -->

### 9.7   CPROC

<!-- Source EN PDF p.295; unit 3142 -->

#### 9.7.1  Description of the feature

<!-- Source EN PDF p.295; unit 3143 -->

CPRO (Color Processing) provides a basic color adjustment function by brightening within a certain range The adjustment of degree, contrast, saturation, and chromaticity to achieve the adjustment of the preferred color, this module acts on the YUV domain image.

<!-- Source EN PDF p.295; unit 3144 -->

#### 9.7.2  Functional level API reference

<!-- Source EN PDF p.295; unit 3145 -->

#### 9.7.3  Module-level API reference

<!-- Source EN PDF p.295; unit 3146 -->

9.7.3.1  rk_aiq_user_api2_acp_SetAttrib

<!-- Source EN PDF p.295; unit 3147 -->

【Description】

<!-- Source EN PDF p.295; unit 3148 -->

Set the cpro module properties

<!-- Source EN PDF p.295; unit 3149 -->

【Grammar】

<!-- Source EN PDF p.295; unit 3150 -->

```text
 XCamReturn rk_aiq_user_api2_acp_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
```

<!-- Source EN PDF p.295; unit 3151 -->

【Parameters】

<!-- Source EN PDF p.295; unit 3152 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | cproc module properties | Input |

<!-- Source EN PDF p.295; unit 3153 -->

【Return Value】

<!-- Source EN PDF p.295; unit 3154 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.295; unit 3155 -->

【Requirements】

<!-- Source EN PDF p.295; unit 3156 -->

Header file: rk_aiq_user_api2_acp.h

<!-- Source EN PDF p.295; unit 3157 -->

Library file: librkaiq.so

<!-- Source EN PDF p.295; unit 3158 -->

9.7.3.2  rk_aiq_user_api2_acp_GetAttrib

<!-- Source EN PDF p.295; unit 3159 -->

【Description】

<!-- Source EN PDF p.295; unit 3160 -->

Gets the current properties of the CPRO module

<!-- Source EN PDF p.296; unit 3161 -->

【Grammar】

<!-- Source EN PDF p.296; unit 3162 -->

```text
 XCamReturn rk_aiq_user_api2_acp_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
                                         acp_attrib_t* attr);
```

<!-- Source EN PDF p.296; unit 3163 -->

【Parameters】

<!-- Source EN PDF p.296; unit 3164 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | cproc module properties | Output |

<!-- Source EN PDF p.296; unit 3165 -->

【Return Value】

<!-- Source EN PDF p.296; unit 3166 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.296; unit 3167 -->

【Requirements】

<!-- Source EN PDF p.296; unit 3168 -->

Header file: rk_aiq_user_api2_acp.h

<!-- Source EN PDF p.296; unit 3169 -->

Library file: librkaiq.so

<!-- Source EN PDF p.296; unit 3170 -->

#### 9.7.4  Module-level API data types

<!-- Source EN PDF p.296; unit 3171 -->

9.7.4.1  acp_attrib_t

<!-- Source EN PDF p.296; unit 3172 -->

【Description】 Define the parameters of the CPROC module

<!-- Source EN PDF p.296; unit 3173 -->

【Definition】

<!-- Source EN PDF p.296; unit 3174 -->

```text
    typedef struct acp_attrib_s {
        uint8_t brightness; /* 0 ~ 255 */
        uint8_t contrast; /* 0 ~ 255 */
        uint8_t saturation; /* 0 ~ 255 */
        uint8_t hue; /* 0 ~ 255 */
    } acp_attrib_t;
```

<!-- Source EN PDF p.296; unit 3175 -->

【Member】

<!-- Source EN PDF p.297; unit 3176 -->

| Member Name | Description |
|---|---|
| brightness | Brightness, range: [0,255], corresponding range: [-128,127], default value 128 |
| contrast | Contrast, range: [0,255], corresponding multiplier: [0, 1.992], default value is 128 |
| saturation | Saturation, range: [0,255], corresponding multiplier: [0, 1.992], default value is 128 |
| hue | Chromaticity, range: [0,255], corresponding degree [-90,87.188], default value 128 |

<!-- Source EN PDF p.297; unit 3177 -->

### 9.8   IE

<!-- Source EN PDF p.297; unit 3178 -->

#### 9.8.1  Description of the feature

<!-- Source EN PDF p.297; unit 3179 -->

IE (Image Effect) provides special effect settings for images, such as black and white effects. This module acts on YUV domain images.

<!-- Source EN PDF p.297; unit 3180 -->

#### 9.8.2  Functional level API reference

<!-- Source EN PDF p.297; unit 3181 -->

#### 9.8.3  Module-level API reference

<!-- Source EN PDF p.297; unit 3182 -->

9.8.3.1  rk_aiq_user_api2_aie_SetAttrib

<!-- Source EN PDF p.297; unit 3183 -->

【Description】

<!-- Source EN PDF p.297; unit 3184 -->

Set IE module properties

<!-- Source EN PDF p.297; unit 3185 -->

【Grammar】

<!-- Source EN PDF p.297; unit 3186 -->

```text
 XCamReturn rk_aiq_user_api2_aie_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
                                         aie_attrib_t attr);
```

<!-- Source EN PDF p.297; unit 3187 -->

【Parameters】

<!-- Source EN PDF p.297; unit 3188 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | IE Module Properties | Input |

<!-- Source EN PDF p.297; unit 3189 -->

【Return Value】

<!-- Source EN PDF p.297; unit 3190 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.297; unit 3191 -->

【Requirements】

<!-- Source EN PDF p.298; unit 3192 -->

Header file: rk_aiq_user_api2_aie.h

<!-- Source EN PDF p.298; unit 3193 -->

Library file: librkaiq.so

<!-- Source EN PDF p.298; unit 3194 -->

9.8.3.2  rk_aiq_user_api2_aie_GetAttrib

<!-- Source EN PDF p.298; unit 3195 -->

【Description】

<!-- Source EN PDF p.298; unit 3196 -->

Gets the current properties of the IE module

<!-- Source EN PDF p.298; unit 3197 -->

【Grammar】

<!-- Source EN PDF p.298; unit 3198 -->

```text
 XCamReturn rk_aiq_user_api2_aie_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
                                         aie_attrib_t* attr);
```

<!-- Source EN PDF p.298; unit 3199 -->

【Parameters】

<!-- Source EN PDF p.298; unit 3200 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | IE Module Properties | Output |

<!-- Source EN PDF p.298; unit 3201 -->

【Return Value】

<!-- Source EN PDF p.298; unit 3202 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.298; unit 3203 -->

【Requirements】

<!-- Source EN PDF p.298; unit 3204 -->

Header file: rk_aiq_user_api2_aie.h

<!-- Source EN PDF p.298; unit 3205 -->

Library file: librkaiq.so

<!-- Source EN PDF p.298; unit 3206 -->

#### 9.8.4  Module-level API data types

<!-- Source EN PDF p.298; unit 3207 -->

9.8.4.1  aie_attrib_t

<!-- Source EN PDF p.298; unit 3208 -->

【Description】 Define the parameters of the IE module

<!-- Source EN PDF p.298; unit 3209 -->

【Definition】

<!-- Source EN PDF p.298; unit 3210 -->

```text
   typedef struct aie_attrib_s {
        rk_aiq_ie_effect_t mode;
   } aie_attrib_t;
```

<!-- Source EN PDF p.298; unit 3211 -->

【Member】

<!-- Source EN PDF p.299; unit 3212 -->

| Member Name | Description |
|---|---|
| mode | Effect type |

<!-- Source EN PDF p.299; unit 3213 -->

9.8.4.2  rk_aiq_ie_effect_t

<!-- Source EN PDF p.299; unit 3214 -->

【Description】 Define the IE effect type

<!-- Source EN PDF p.299; unit 3215 -->

【Definition】

<!-- Source EN PDF p.299; unit 3216 -->

```text
    typedef enum rk_aiq_ie_effect_e {
        RK_AIQ_IE_EFFECT_NONE,
        RK_AIQ_IE_EFFECT_BW,
        RK_AIQ_IE_EFFECT_NEGATIVE,
        RK_AIQ_IE_EFFECT_SEPIA,
        RK_AIQ_IE_EFFECT_EMBOSS,
       RK_AIQ_IE_EFFECT_SKETCH,
        RK_AIQ_IE_EFFECT_SHARPEN, /*!< deprecated */
   } rk_aiq_ie_effect_t;
```

<!-- Source EN PDF p.299; unit 3217 -->

【Member】

<!-- Source EN PDF p.299; unit 3218 -->

| Member Name | Description |
|---|---|
| RK_AIQ_IE_EFFECT_NONE | No special effects |
| RK_AIQ_IE_EFFECT_BW | Black and white effect |
| RK_AIQ_IE_EFFECT_NEGATIVE | Negative effect, not supported |
| RK_AIQ_IE_EFFECT_SEPIA | Dark brown effect |
| RK_AIQ_IE_EFFECT_EMBOSS | Embossed effect |
| RK_AIQ_IE_EFFECT_SKETCH | Sketch effect |
| RK_AIQ_IE_EFFECT_SHARPEN | not supported |

<!-- Source EN PDF p.299; unit 3219 -->

### 9.9   CSM

<!-- Source EN PDF p.299; unit 3220 -->

#### 9.9.1  Description of the feature

<!-- Source EN PDF p.299; unit 3221 -->

CSM (Color Space Matrix) can set the parameters during RGB to YUV conversion.

<!-- Source EN PDF p.300; unit 3222 -->

#### 9.9.2  Functional level API reference

<!-- Source EN PDF p.300; unit 3223 -->

#### 9.9.3  Module-level API reference

<!-- Source EN PDF p.300; unit 3224 -->

9.9.3.1  rk_aiq_user_api2_acsm_SetAttrib

<!-- Source EN PDF p.300; unit 3225 -->

【Description】

<!-- Source EN PDF p.300; unit 3226 -->

Set the CSM module properties

<!-- Source EN PDF p.300; unit 3227 -->

【Grammar】

<!-- Source EN PDF p.300; unit 3228 -->

```text
 XCamReturn rk_aiq_user_api2_acsm_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapi_acsm_attrib_t attr);
```

<!-- Source EN PDF p.300; unit 3229 -->

【Parameters】

<!-- Source EN PDF p.300; unit 3230 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | CSM module property | Input |

<!-- Source EN PDF p.300; unit 3231 -->

【Return Value】

<!-- Source EN PDF p.300; unit 3232 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.300; unit 3233 -->

【Requirements】

<!-- Source EN PDF p.300; unit 3234 -->

Header file: rk_aiq_user_api2_acsm.h

<!-- Source EN PDF p.300; unit 3235 -->

Library file: librkaiq.so

<!-- Source EN PDF p.300; unit 3236 -->

【Precautions】

<!-- Source EN PDF p.300; unit 3237 -->

When attr.param.op_mode = RK_AIQ_OP_MODE_AUTO, use AIQ's built-in CSM default parameters, and when attr.param.op_mode = RK_AIQ_OP_MODE_MANUAL, you can configure CSM parameters.

<!-- Source EN PDF p.300; unit 3238 -->

attr.param.full_range can only be configured to TRUE, and the limit range can be configured in the CGC module.

<!-- Source EN PDF p.300; unit 3239 -->

9.9.3.2  rk_aiq_user_api2_acsm_GetAttrib

<!-- Source EN PDF p.300; unit 3240 -->

【Description】

<!-- Source EN PDF p.300; unit 3241 -->

Gets the current properties of the CSM module

<!-- Source EN PDF p.300; unit 3242 -->

【Grammar】

<!-- Source EN PDF p.301; unit 3243 -->

```text
 XCamReturn rk_aiq_user_api2_acsm_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapi_acsm_attrib_t* attr);
```

<!-- Source EN PDF p.301; unit 3244 -->

【Parameters】

<!-- Source EN PDF p.301; unit 3245 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | CSM module property | Output |

<!-- Source EN PDF p.301; unit 3246 -->

【Return Value】

<!-- Source EN PDF p.301; unit 3247 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.301; unit 3248 -->

【Requirements】

<!-- Source EN PDF p.301; unit 3249 -->

Header file: rk_aiq_user_api2_acsm.h

<!-- Source EN PDF p.301; unit 3250 -->

Library file: librkaiq.so

<!-- Source EN PDF p.301; unit 3251 -->

#### 9.9.4  Module-level API data types

<!-- Source EN PDF p.301; unit 3252 -->

9.9.4.1  rk_aiq_uapi_acsm_attrib_t

<!-- Source EN PDF p.301; unit 3253 -->

【Description】 Define the parameters of the CSM module

<!-- Source EN PDF p.301; unit 3254 -->

【Definition】

<!-- Source EN PDF p.301; unit 3255 -->

```text
   typedef struct rk_aiq_uapi_acsm_attrib_s {
       rk_aiq_uapi_sync_t sync;
       rk_aiq_acsm_params_t param;
   } rk_aiq_uapi_acsm_attrib_t;
```

<!-- Source EN PDF p.301; unit 3256 -->

【Member】

<!-- Source EN PDF p.301; unit 3257 -->

| Member Name | Description |
|---|---|
| sync | For rk_aiq_uapi_sync_t definitions, see Overview/API Description section |
| rk_aiq_acsm_params_t | csm parameter |

<!-- Source EN PDF p.302; unit 3258 -->

9.9.4.2  rk_aiq_acsm_params_t

<!-- Source EN PDF p.302; unit 3259 -->

【Description】 Define CSM module parameters

<!-- Source EN PDF p.302; unit 3260 -->

【Definition】

<!-- Source EN PDF p.302; unit 3261 -->

```text
 typedef struct __csm_param {
     RKAiqOPMode_t op_mode;
     bool full_range;
     uint8_t y_offset;
     uint8_t c_offset;
     float coeff[RK_AIQ_CSM_COEFF_NUM];
 } Csm_Param_t;
```

<!-- Source EN PDF p.302; unit 3262 -->

【Member】

<!-- Source EN PDF p.302; unit 3263 -->

| Member<br>Name | Description |
|---|---|
| op_mode | mode, RK_AIQ_OP_MODE_AUTO or RK_AIQ_OP_MODE_MANUAL |
| full_range | Whether to output full range, default value: TRUE.<br>Note: ISP30 This attribute can only be TRUE. Limit range is recommended to be<br>configured by the CGC module API. |
| y_offset | Luminance offset value, range: [0,63], default value: 0 |
| c_offset | Chroma offset value, range: [0,255], default value: 0 |
| coeff | RGB to YUV 3x3 conversion matrix, range: [-2, 1.992], default values:<br>[ 0.299, 0.587, 0.114, -<br>0.169, -0.331, 0.5,<br>0.5, -0.419, -0.081] |

<!-- Source EN PDF p.302; unit 3264 -->

### 9.10   Sharpen

<!-- Source EN PDF p.302; unit 3265 -->

#### 9.10.1  Description of the feature

<!-- Source EN PDF p.302; unit 3266 -->

The Sharpen module is used to enhance the clarity of an image, including adjusting the sharpening properties of the edges of the image and enhancing the detail of the image and textures.

<!-- Source EN PDF p.303; unit 3267 -->

#### 9.10.2  Functional level API reference

<!-- Source EN PDF p.303; unit 3268 -->

9.10.2.1  rk_aiq_uapi2_setSharpness

<!-- Source EN PDF p.303; unit 3269 -->

【Description】

<!-- Source EN PDF p.303; unit 3270 -->

Set the sharpening level.

<!-- Source EN PDF p.303; unit 3271 -->

【Grammar】

<!-- Source EN PDF p.303; unit 3272 -->

```text
 XCamReturn rk_aiq_uapi2_setSharpness(const rk_aiq_sys_ctx_t* ctx, unsigned int
 level);
```

<!-- Source EN PDF p.303; unit 3273 -->

【Parameters】

<!-- Source EN PDF p.303; unit 3274 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| level | Sharpening level value range: [0,100] The default value is 50 | Input |

<!-- Source EN PDF p.303; unit 3275 -->

【Return Value】

<!-- Source EN PDF p.303; unit 3276 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.303; unit 3277 -->

【Requirements】

<!-- Source EN PDF p.303; unit 3278 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.303; unit 3279 -->

Library file: librkaiq.so

<!-- Source EN PDF p.303; unit 3280 -->

9.10.2.2  rk_aiq_uapi2_getSharpness

<!-- Source EN PDF p.303; unit 3281 -->

【Description】

<!-- Source EN PDF p.303; unit 3282 -->

Get the sharpening level.

<!-- Source EN PDF p.303; unit 3283 -->

【Grammar】

<!-- Source EN PDF p.303; unit 3284 -->

```text
 XCamReturn rk_aiq_uapi2_getSharpness(const rk_aiq_sys_ctx_t* ctx, unsigned int*
 level);
```

<!-- Source EN PDF p.303; unit 3285 -->

【Parameters】

<!-- Source EN PDF p.303; unit 3286 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| level | Sharpening level | Output |

<!-- Source EN PDF p.304; unit 3287 -->

【Return Value】

<!-- Source EN PDF p.304; unit 3288 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.304; unit 3289 -->

【Requirements】

<!-- Source EN PDF p.304; unit 3290 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.304; unit 3291 -->

Library file: librkaiq.so

<!-- Source EN PDF p.304; unit 3292 -->

#### 9.10.3  Module-level API reference

<!-- Source EN PDF p.304; unit 3293 -->

9.10.3.1  rk_aiq_user_api2_asharpV4_SetAttrib

<!-- Source EN PDF p.304; unit 3294 -->

【Description】 Set the sharpening algorithm properties.

<!-- Source EN PDF p.304; unit 3295 -->

【Grammar】

<!-- Source EN PDF p.304; unit 3296 -->

```text
 XCamReturn
 rk_aiq_user_api2_asharpV4_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_sharp_attrib_v4_t* attr);
```

<!-- Source EN PDF p.304; unit 3297 -->

【Parameters】

<!-- Source EN PDF p.304; unit 3298 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | Parameter properties for denoising | Input |

<!-- Source EN PDF p.304; unit 3299 -->

【Return Value】

<!-- Source EN PDF p.304; unit 3300 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.304; unit 3301 -->

【Requirements】

<!-- Source EN PDF p.304; unit 3302 -->

Header files: rk_aiq_user_api2_asharp_v4.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.304; unit 3303 -->

Library file: librkaiq.so

<!-- Source EN PDF p.305; unit 3304 -->

9.10.3.2  rk_aiq_user_api2_asharpV4_GetAttrib

<!-- Source EN PDF p.305; unit 3305 -->

【Description】 Gets the sharpening algorithm properties.

<!-- Source EN PDF p.305; unit 3306 -->

【Grammar】

<!-- Source EN PDF p.305; unit 3307 -->

```text
 XCamReturn
 rk_aiq_user_api2_asharpV4_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_sharp_attrib_v4_t* attr);
```

<!-- Source EN PDF p.305; unit 3308 -->

【Parameters】

<!-- Source EN PDF p.305; unit 3309 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | Parameter properties for denoising | Input |

<!-- Source EN PDF p.305; unit 3310 -->

【Return Value】

<!-- Source EN PDF p.305; unit 3311 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.305; unit 3312 -->

【Requirements】

<!-- Source EN PDF p.305; unit 3313 -->

Header files: rk_aiq_user_api2_asharp_v4.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.305; unit 3314 -->

Library file: librkaiq.so

<!-- Source EN PDF p.305; unit 3315 -->

9.10.3.3  rk_aiq_user_api2_asharpV4_SetStrength

<!-- Source EN PDF p.305; unit 3316 -->

【Description】 Set the sharpening force.

<!-- Source EN PDF p.305; unit 3317 -->

【Grammar】

<!-- Source EN PDF p.305; unit 3318 -->

```text
 XCamReturn
 rk_aiq_user_api2_asharpV4_SetStrength(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_sharp_strength_v4_t *pStrength);
```

<!-- Source EN PDF p.305; unit 3319 -->

【Parameters】

<!-- Source EN PDF p.305; unit 3320 -->

| Parameter<br>Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| pStrength | Sharpening strength structure pointer, the percentage value range in<br>the structure is 0.0-1.0 | Input |

<!-- Source EN PDF p.306; unit 3321 -->

【Return Value】

<!-- Source EN PDF p.306; unit 3322 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.306; unit 3323 -->

【Requirements】

<!-- Source EN PDF p.306; unit 3324 -->

Header files: rk_aiq_user_api2_asharp_v4.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.306; unit 3325 -->

Library file: librkaiq.so

<!-- Source EN PDF p.306; unit 3326 -->

9.10.3.4  rk_aiq_user_api2_asharpV4_GetStrength

<!-- Source EN PDF p.306; unit 3327 -->

【Description】 Get sharpening power.

<!-- Source EN PDF p.306; unit 3328 -->

【Grammar】

<!-- Source EN PDF p.306; unit 3329 -->

```text
 XCamReturn
 rk_aiq_user_api2_asharpV4_GetStrength(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_sharp_strength_v4_t *pStrength);
```

<!-- Source EN PDF p.306; unit 3330 -->

【Parameters】

<!-- Source EN PDF p.306; unit 3331 -->

| Parameter<br>Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| pStrength | Sharpening strength structure pointer, the percentage value range in<br>the structure is 0.0-1.0 | Input |

<!-- Source EN PDF p.306; unit 3332 -->

【Return Value】

<!-- Source EN PDF p.306; unit 3333 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.306; unit 3334 -->

【Requirements】

<!-- Source EN PDF p.306; unit 3335 -->

Header files: rk_aiq_user_api2_asharp_v4.h, RkAiqHandleIntV3x.h

<!-- Source EN PDF p.306; unit 3336 -->

Library file: librkaiq.so

<!-- Source EN PDF p.307; unit 3337 -->

#### 9.10.4  Module-level API data types

<!-- Source EN PDF p.307; unit 3338 -->

9.10.4.1  rk_aiq_sharp_attrib_v4_t

<!-- Source EN PDF p.307; unit 3339 -->

【Description】 Define the parameters for the sharpening module

<!-- Source EN PDF p.307; unit 3340 -->

【Definition】

<!-- Source EN PDF p.307; unit 3341 -->

```text
 typedef struct rk_aiq_sharp_attrib_v4_s {
     rk_aiq_uapi_sync_t sync;
     Asharp4_OPMode_t eMode;
     Asharp_Auto_Attr_V4_t stAuto;
     Asharp_Manual_Attr_V4_t stManual;
 } rk_aiq_sharp_attrib_v4_t;
```

<!-- Source EN PDF p.307; unit 3342 -->

【Member】

<!-- Source EN PDF p.307; unit 3343 -->

| Member Name | Description |
|---|---|
| sync | For synchronous asynchronous mode selection, see Overview/API Description section |
| eMode | Sharpen module properties |
| stAuto | Sharpen module auto mode parameter |

<!-- Source EN PDF p.307; unit 3344 -->

9.10.4.2  Asharp4_OPMode_t

<!-- Source EN PDF p.307; unit 3345 -->

【Description】

<!-- Source EN PDF p.307; unit 3346 -->

【Definition】

<!-- Source EN PDF p.307; unit 3347 -->

```text
 typedef enum Asharp4_OPMode_e {
     ASHARP4_OP_MODE_INVALID           = 0,
     ASHARP4_OP_MODE_AUTO              = 1,
     ASHARP4_OP_MODE_MANUAL            = 2,
     ASHARP4_OP_MODE_REG_MANUAL        = 3,
     ASHARP4_OP_MODE_MAX
 } Asharp4_OPMode_t;
```

<!-- Source EN PDF p.307; unit 3348 -->

【Member】

<!-- Source EN PDF p.308; unit 3349 -->

| Member Name | Description |
|---|---|
| ASHARP4_OP_MODE_INVALID | Sharpen module invalid mode |
| ASHARP4_OP_MODE_AUTO | Sharpen module auto mode |
| ASHARP4_OP_MODE_MANUAL | Algorithm settings for the manual mode of the sharpening<br>module |
| ASHARP4_OP_MODE_REG_MANUAL | Register settings |
| ASHARP4_OP_MODE_MAX | The sharpen module mode maximum, which is an invalid<br>mode |

<!-- Source EN PDF p.308; unit 3350 -->

9.10.4.3  Asharp_Auto_Attr_V4_t

<!-- Source EN PDF p.308; unit 3351 -->

【Description】 Define the automatic mode of the sharpening module, and each ISO corresponding algorithm attribute parameter

<!-- Source EN PDF p.308; unit 3352 -->

【Definition】

<!-- Source EN PDF p.308; unit 3353 -->

```text
 typedef struct Asharp_Auto_Attr_V4_s
 {
     RK_SHARP_Params_V4_t stParams;
     RK_SHARP_Params_V4_Select_t stSelect;
 } Asharp_Auto_Attr_V4_t;
```

<!-- Source EN PDF p.308; unit 3354 -->

【Member】

<!-- Source EN PDF p.308; unit 3355 -->

| Member Name | Description |
|---|---|
| stParams | Each ISO in the SHARP module corresponds to the algorithm attribute parameter |
| stSelect | The Sharp module calculates the attribute parameter |

<!-- Source EN PDF p.308; unit 3356 -->

9.10.4.4  Asharp_Manual_Attr_V4_t

<!-- Source EN PDF p.308; unit 3357 -->

【Description】 Define manual properties for the sharpening module

<!-- Source EN PDF p.308; unit 3358 -->

【Definition】

<!-- Source EN PDF p.309; unit 3359 -->

```text
 typedef struct Asharp_Manual_Attr_V4_s
 {
     RK_SHARP_Params_V4_Select_t stSelect;
     RK_SHARP_Fix_V4_t stFix;
 } Asharp_Manual_Attr_V4_t;
```

<!-- Source EN PDF p.309; unit 3360 -->

【Member】

<!-- Source EN PDF p.309; unit 3361 -->

| Member Name | Description |
|---|---|
| stSelect | SharpManually set the algorithm parameters |
| stFix | Sharp register value |

<!-- Source EN PDF p.309; unit 3362 -->

9.10.4.5  RK_SHARP_Params_V4_t

<!-- Source EN PDF p.309; unit 3363 -->

【Description】 Define manual properties for the sharpening module

<!-- Source EN PDF p.309; unit 3364 -->

【Definition】

<!-- Source EN PDF p.309; unit 3365 -->

```text
 typedef struct RK_SHARP_Params_V4_s
 {
     int enable;
     int iso[RK_SHARP_V4_MAX_ISO_NUM];
     short luma_point        [RK_SHARP_V4_LUMA_POINT_NUM];
     short luma_sigma        [RK_SHARP_V4_MAX_ISO_NUM]
 [RK_SHARP_V4_LUMA_POINT_NUM];
     float pbf_gain          [RK_SHARP_V4_MAX_ISO_NUM];
     float pbf_add           [RK_SHARP_V4_MAX_ISO_NUM];
     float pbf_ratio         [RK_SHARP_V4_MAX_ISO_NUM];
     float gaus_ratio        [RK_SHARP_V4_MAX_ISO_NUM];
     float sharp_ratio       [RK_SHARP_V4_MAX_ISO_NUM];
     short hf_clip        [RK_SHARP_V4_MAX_ISO_NUM][RK_SHARP_V4_LUMA_POINT_NUM];
     float bf_gain           [RK_SHARP_V4_MAX_ISO_NUM];
     float bf_add            [RK_SHARP_V4_MAX_ISO_NUM];
     float bf_ratio          [RK_SHARP_V4_MAX_ISO_NUM];
     short local_sharp_strength  [RK_SHARP_V4_MAX_ISO_NUM]
 [RK_SHARP_V4_LUMA_POINT_NUM];
     float prefilter_coeff[RK_SHARP_V4_MAX_ISO_NUM][RK_SHARP_V4_PBF_DIAM *
 RK_SHARP_V4_PBF_DIAM];
     float GaussianFilter_coeff   [RK_SHARP_V4_MAX_ISO_NUM][RK_SHARP_V4_RF_DIAM *
 RK_SHARP_V4_RF_DIAM];
     float hfBilateralFilter_coeff    [RK_SHARP_V4_MAX_ISO_NUM]
 [RK_SHARP_V4_BF_DIAM * RK_SHARP_V4_BF_DIAM];
 } RK_SHARP_Params_V4_t;
```

<!-- Source EN PDF p.310; unit 3366 -->

【Member】

<!-- Source EN PDF p.311; unit 3367 -->

| Parameter Name | Parameter<br>Type | Brief description |
|---|---|---|
| Enable | Debug<br>parameters | The Sharp module enables the switch. 1: Module<br>open, 0: Module off. |
| iso | Debug<br>parameters | Different ISO gears, corresponding to different debugging<br>parameters. Currently only 13 gears are supported. |
| pbf_gain | Debug<br>parameters | The pre-filtered sigma is multiplied by the ratio, the larger<br>the value, the stronger the filtering, the less noise and less<br>detail.<br>Value range [0.0, 2.0], default value 1.0. |
| pbf_add | Debug<br>parameters | The offset of the pre-filtered sigma superposition, the<br>larger the value, the stronger the filtering, the less noise,<br>and less detail.<br>Value range [0, 1023], default value 0. |
| pbf_ratio | Debug<br>parameters | Pre-filter fusion weights, the larger the value, the stronger<br>the filtering, the smaller the noise, and less detail. The<br>value range is [0.0,<br>1.0], and the default value is 0.5. |
| gaus_ratio | Debug<br>parameters | The guided image of high-frequency bilateral filtering is<br>the result of the fusion of Gaussian filtering and the<br>original image.<br>The larger the value, the greater the guiding weight of the<br>Gaussian bilateral filter.<br>Value range [0.0, 1.0], default value 0. |
| sharp_ratio | Debug<br>parameters | Sharpening strength, the higher the value, the stronger the<br>sharpening.<br>Value range [0.0, 16], default value 6. |
| bf_gain | Debug<br>parameters | The proportion of high-frequency bilateral filtering sigma<br>multiplied, the larger the value, the stronger the filtering,<br>the smaller the noise, and the less detail.<br>Value range [0.0, 2.0], default value 1.0. |
| bf_add | Debug<br>parameters | Offset of high-frequency bilateral filtering sigma<br>superposition. The larger the value, the stronger the<br>filtering, the smaller the noise, and the less detail.<br>Value range [0, 1023], default value 0. |
| bf_add | Debug<br>parameters | High-frequency bilateral filter fusion weights. The larger<br>the value, the stronger the filtering, the smaller the noise,<br>and the less detail. The value range is [0.0,<br>1.0], and the default value is 0.5. |

<!-- Source EN PDF p.312; unit 3368 -->

| Parameter Name | Parameter<br>Type | Brief description |
|---|---|---|
| luma_point / luma_sigma | Debug<br>parameters | Different pixel brightness corresponds to different noise<br>SIGMA curves.<br>luma_point is the curve brightness value in the range [0,<br>1023].<br>luma_sigma is the noise intensity value in the range [0,<br>1023]. |
| luma_point / hf_clip | Debug<br>parameters | Range of different pixel brightness high-frequency values<br>clips.<br>The higher the value, the stronger the maximum allowable<br>sharpening strength.<br>The value range is [0, 1023]. Default value 256. |
| luma_point /<br>local_sharp_strength | Debug<br>parameters | Calculate the proportion of different pixel brightness,<br>high-frequency superposition weights.<br>The higher the value, the greater the high frequencies<br>allowed to be superimposed and the sharper the image.<br>The value range is [0, 1023]. Default value 512. |
| prefilter_coeff | Debug<br>parameters | Prefilter operators. |
| GaussianFilter_coeff | Debug<br>parameters | Gaussian filter operators. |
| hfBilateralFilter_coeff | Debug<br>parameters | High-frequency bilateral filtering operators. |

<!-- Source EN PDF p.312; unit 3369 -->

9.10.4.6  RK_SHARP_Params_V4_Select_t

<!-- Source EN PDF p.312; unit 3370 -->

【Description】 Defines the manual mode algorithm properties of the sharpening module

<!-- Source EN PDF p.312; unit 3371 -->

【Definition】

<!-- Source EN PDF p.312; unit 3372 -->

```text
 typedef struct RK_SHARP_Params_V4_Select_s
 {
     int enable;
     short luma_point    [RK_SHARP_V4_LUMA_POINT_NUM];
     short luma_sigma    [RK_SHARP_V4_LUMA_POINT_NUM];
     float pbf_gain      ;
     float pbf_add       ;
     float pbf_ratio     ;
     float gaus_ratio    ;
     float sharp_ratio   ;
     short hf_clip       [RK_SHARP_V4_LUMA_POINT_NUM];
     float bf_gain       ;
     float bf_add        ;
     float bf_ratio      ;
     short local_sharp_strength        [RK_SHARP_V4_LUMA_POINT_NUM];
     float prefilter_coeff[RK_SHARP_V4_PBF_DIAM * RK_SHARP_V4_PBF_DIAM];
     float GaussianFilter_coeff   [RK_SHARP_V4_RF_DIAM * RK_SHARP_V4_RF_DIAM];
     float hfBilateralFilter_coeff    [RK_SHARP_V4_BF_DIAM * RK_SHARP_V4_BF_DIAM];
```

<!-- Source EN PDF p.313; unit 3373 -->

```text
 } RK_SHARP_Params_V4_Select_t;
```

<!-- Source EN PDF p.313; unit 3374 -->

【Member】

<!-- Source EN PDF p.314; unit 3375 -->

| Parameter Name | Parameter<br>Type | Brief description |
|---|---|---|
| Enable | Debug<br>parameters | The Sharp module enables the switch. 1: Module<br>open, 0: Module off. |
| iso | Debug<br>parameters | Different ISO gears, corresponding to different debugging<br>parameters. Currently only 13 gears are supported. |
| pbf_gain | Debug<br>parameters | The pre-filtered sigma is multiplied by the ratio, the larger<br>the value, the stronger the filtering, the less noise and less<br>detail.<br>Value range [0.0, 2.0], default value 1.0. |
| pbf_add | Debug<br>parameters | The offset of the pre-filtered sigma superposition, the<br>larger the value, the stronger the filtering, the less noise,<br>and less detail.<br>Value range [0, 1023], default value 0. |
| pbf_ratio | Debug<br>parameters | Pre-filter fusion weights, the larger the value, the stronger<br>the filtering, the smaller the noise, and less detail. The<br>value range is [0.0,<br>1.0], and the default value is 0.5. |
| gaus_ratio | Debug<br>parameters | The guided image of high-frequency bilateral filtering is<br>the result of the fusion of Gaussian filtering and the<br>original image.<br>The larger the value, the greater the guiding weight of the<br>Gaussian bilateral filter.<br>Value range [0.0, 1.0], default value 0. |
| sharp_ratio | Debug<br>parameters | Sharpening strength, the higher the value, the stronger the<br>sharpening.<br>Value range [0.0, 16], default value 6. |
| bf_gain | Debug<br>parameters | The proportion of high-frequency bilateral filtering sigma<br>multiplied, the larger the value, the stronger the filtering,<br>the smaller the noise, and the less detail.<br>Value range [0.0, 2.0], default value 1.0. |
| bf_add | Debug<br>parameters | Offset of high-frequency bilateral filtering sigma<br>superposition. The larger the value, the stronger the<br>filtering, the smaller the noise, and the less detail.<br>Value range [0, 1023], default value 0. |
| bf_add | Debug<br>parameters | High-frequency bilateral filter fusion weights. The larger<br>the value, the stronger the filtering, the smaller the noise,<br>and the less detail. The value range is [0.0,<br>1.0], and the default value is 0.5. |

<!-- Source EN PDF p.315; unit 3376 -->

| Parameter Name | Parameter<br>Type | Brief description |
|---|---|---|
| luma_point / luma_sigma | Debug<br>parameters | Different pixel brightness corresponds to different noise<br>SIGMA curves.<br>luma_point is the curve brightness value in the range [0,<br>1023].<br>luma_sigma is the noise intensity value in the range [0,<br>1023]. |
| luma_point / hf_clip | Debug<br>parameters | Range of different pixel brightness high-frequency values<br>clips.<br>The higher the value, the stronger the maximum allowable<br>sharpening strength.<br>The value range is [0, 1023]. Default value 256. |
| luma_point /<br>local_sharp_strength | Debug<br>parameters | Calculate the proportion of different pixel brightness,<br>high-frequency superposition weights.<br>The higher the value, the greater the high frequencies<br>allowed to be superimposed and the sharper the image.<br>The value range is [0, 1023]. Default value 512. |
| prefilter_coeff | Debug<br>parameters | Prefilter operators. |
| GaussianFilter_coeff | Debug<br>parameters | Gaussian filter operators. |
| hfBilateralFilter_coeff | Debug<br>parameters | High-frequency bilateral filtering operators. |

<!-- Source EN PDF p.315; unit 3377 -->

9.10.4.7  RK_SHARP_Fix_V4_t

<!-- Source EN PDF p.315; unit 3378 -->

【Description】 Defines the manual mode register configuration for the sharpening module

<!-- Source EN PDF p.315; unit 3379 -->

【Definition】

<!-- Source EN PDF p.315; unit 3380 -->

```text
 typedef struct RK_SHARP_Fix_V4_s
 {
     // SHARP_SHARP_EN (0x0000)
     uint8_t sharp_clk_dis;
     uint8_t sharp_exgain_bypass;
     uint8_t sharp_center_mode;
     uint8_t sharp_bypass;
     uint8_t sharp_en;
     // SHARP_SHARP_RATIO  (0x0004)
     uint8_t sharp_sharp_ratio;
     uint8_t sharp_bf_ratio;
     uint8_t sharp_gaus_ratio;
     uint8_t sharp_pbf_ratio;
     // SHARP_SHARP_LUMA_DX (0x0008)
     uint8_t sharp_luma_dx[7];
     // SHARP_SHARP_PBF_SIGMA_INV_0 (0x000c - 0x0014)
     uint16_t sharp_pbf_sigma_inv[8];
     // SHARP_SHARP_BF_SIGMA_INV_0 (0x0018 -  0x0020)
     uint16_t sharp_bf_sigma_inv[8];
     // SHARP_SHARP_SIGMA_SHIFT (0x00024)
     uint8_t sharp_bf_sigma_shift;
     uint8_t sharp_pbf_sigma_shift;
     // SHARP_SHARP_EHF_TH_0 (0x0028 -  0x0030)
     uint16_t sharp_ehf_th[8];
     // SHARP_SHARP_CLIP_HF_0 (0x0034 -  0x003c)
     uint16_t sharp_clip_hf[8];
     // SHARP_SHARP_PBF_COEF (0x00040)
     uint8_t sharp_pbf_coef[3];
     // SHARP_SHARP_BF_COEF (0x00044)
     uint8_t sharp_bf_coef[3];
     // SHARP_SHARP_GAUS_COEF (0x00048 - 0x0004c)
     uint8_t sharp_gaus_coef[6];
 } RK_SHARP_Fix_V4_t;
```

<!-- Source EN PDF p.316; unit 3381 -->

【Member】

<!-- Source EN PDF p.317; unit 3382 -->

| Parameter Name | Parameter description |
|---|---|
| sharp_clk_dis | The sharp module clk gate setting, which is not supported at the moment, is 0 by<br>default. |
| sharp_exgain_bypass | Whether the external local gain module is bypass, this setting is not supported at<br>the moment, and the default is 0. |
| sharp_center_mode | Whether to sharpen with the image center point as the coordinates. Configuration<br>is not supported at the moment, the default is 0. |
| sharp_bypass | Sharpening module bypass 1 : bypass ; 0 :not bypass |
| sharp_en | Sharpen module enable 1: enable; 0 :disable |
| sharp_sharp_ratio | sharp_ratio: Sharpening strength, 0~15.9 |
| sharp_bf_ratio | Bilateral filter fusion weight, 0~1.0 |
| sharp_gaus_ratio | gaus_ratio: Gaussian filter fusion weight, value range [0.0, 1.0] |
| sharp_pbf_ratio | Bilateral prefiltered fusion weights The value range is [0.0, 1.0], and the default<br>value is 0.5 |
| sharp_luma_dx7 | The distance between point 6 and point 7. The actual distance is equal to<br>2^sw_sharp_luma_dx7. |
| sharp_luma_dx6 | The distance between points 5 and 6. The actual distance is equal to<br>2^sw_sharp_luma_dx6. |
| sharp_luma_dx5 | The distance between points 4 and 5. The actual distance is equal to<br>2^sw_sharp_luma_dx5. |
| sharp_luma_dx4 | The distance between point 3 and point 4. The actual distance is equal to<br>2^sw_sharp_luma_dx4. |
| sharp_luma_dx3 | The distance between point 2 and point 3. The actual distance is equal to<br>2^sw_sharp_luma_dx3. |
| sharp_luma_dx2 | The distance between point 1 and point 2. The actual distance is equal to<br>2^sw_sharp_luma_dx2. |
| sharp_luma_dx1 | The distance between 0 and 1 point. The actual distance is equal to<br>2^sw_sharp_luma_dx1.<br>Note: The total distance must be equal to 1024. |
| sharp_pbf_sigma_inv | Sharp pbf sigma inverse |
| sharp_bf_sigma_inv | Sharp bf sigma inverse |
| sharp_pbf_coef | Sharpening module bilateral with filter filter core |
| sharp_bf_coef | Bilateral filter nuclei |
| sharp_gaus_coef | Gaussian filter kernel |

<!-- Source EN PDF p.318; unit 3383 -->

9.10.4.8  rk_aiq_sharp_strength_v4_t

<!-- Source EN PDF p.318; unit 3384 -->

【Description】 Define the denoising intensity configuration structure for the sharpening module

<!-- Source EN PDF p.318; unit 3385 -->

【Definition】

<!-- Source EN PDF p.318; unit 3386 -->

```text
 typedef struct rk_aiq_sharp_strength_v4_s {
     rk_aiq_uapi_sync_t sync;
     float percent;
 } rk_aiq_sharp_strength_v4_t;
```

<!-- Source EN PDF p.318; unit 3387 -->

【Member】

<!-- Source EN PDF p.318; unit 3388 -->

| Member Name | Description |
|---|---|
| sync | For synchronous asynchronous mode selection, see Overview/API Description section |
| percent | Sharpening strength, the value range is 0.0-1.0. |

<!-- Source EN PDF p.318; unit 3389 -->

### 9.11   Gamma

<!-- Source EN PDF p.318; unit 3390 -->

#### 9.11.1  Description of the feature

<!-- Source EN PDF p.318; unit 3391 -->

The gamma module performs luminance-space nonlinear conversion of images to fit the output device. RK3588 supports 49-point log domain gamma curve with abscissa as follows:

<!-- Source EN PDF p.318; unit 3392 -->

```text
 int X_isp30[49] = { 0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 20, 24, 28, 32,
 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384, 448, 512, 640,
 768, 896, 1024, 1280, 1536, 1792, 2048, 2304, 2560, 2816, 3072, 3328, 3584, 3840,
 4095};
```

<!-- Source EN PDF p.318; unit 3393 -->

#### 9.11.2  Feature-level API reference

<!-- Source EN PDF p.318; unit 3394 -->

9.11.2.1  rk_aiq_uapi2_setGammaCoef

<!-- Source EN PDF p.318; unit 3395 -->

【Description】

<!-- Source EN PDF p.318; unit 3396 -->

Quickly set gamma curves with GammaCoef and SlopeAtZero. The gamma curve is generated as follows:

<!-- Source EN PDF p.318; unit 3397 -->

```text
 for(int i = 0; i < 49; i++) {
     Y_isp30[i] = 4095 * pow(X_isp30[i] / 4095, 1 / GammaCoef + SlopeAtZero);
     Y_isp30[i] = LIMIT_VALUE(Y_isp30[i], 4095, 0);
  }
```

<!-- Source EN PDF p.318; unit 3398 -->

【Grammar】

<!-- Source EN PDF p.319; unit 3399 -->

```text
 XCamReturn rk_aiq_uapi2_setGammaCoef(const rk_aiq_sys_ctx_t* ctx, float
 GammaCoef, float SlopeAtZero);
```

<!-- Source EN PDF p.319; unit 3400 -->

【Parameters】

<!-- Source EN PDF p.319; unit 3401 -->

| Parameter<br>Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| GammaCoef | Gamma coefficient, value range [0,100], default value 2.2,<br>accuracy 0.01 | Input |
| SlopeAtZero | Dark area slope, value range [-0.05,0.05], default value 0,<br>precision 0.001 | Input |

<!-- Source EN PDF p.319; unit 3402 -->

【Return Value】

<!-- Source EN PDF p.319; unit 3403 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.319; unit 3404 -->

【Requirements】

<!-- Source EN PDF p.319; unit 3405 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.319; unit 3406 -->

Library file: librkaiq.so

<!-- Source EN PDF p.319; unit 3407 -->

【Description】

<!-- Source EN PDF p.319; unit 3408 -->

If the Gamma curve in the API is not switched according to the scene, if the scene changes, set the gamma curve again through the API.

<!-- Source EN PDF p.319; unit 3409 -->

#### 9.11.3  Feature-level API data types

<!-- Source EN PDF p.319; unit 3410 -->

#### 9.11.4  Module-level API reference

<!-- Source EN PDF p.319; unit 3411 -->

9.11.4.1  rk_aiq_user_api2_agamma_SetAttrib

<!-- Source EN PDF p.319; unit 3412 -->

【Description】 Set gamma software properties.

<!-- Source EN PDF p.319; unit 3413 -->

【Grammar】

<!-- Source EN PDF p.319; unit 3414 -->

```text
 XCamReturn
 rk_aiq_user_api2_agamma_v11_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx, const
 rk_aiq_gamma_v11_attrib_t* attr);
```

<!-- Source EN PDF p.319; unit 3415 -->

【Parameters】

<!-- Source EN PDF p.320; unit 3416 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | Gamma Software Property Struct | Input |

<!-- Source EN PDF p.320; unit 3417 -->

【Return Value】

<!-- Source EN PDF p.320; unit 3418 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.320; unit 3419 -->

【Requirements】

<!-- Source EN PDF p.320; unit 3420 -->

Header file: rk_aiq_user_api2_agamma.h

<!-- Source EN PDF p.320; unit 3421 -->

Library file: librkaiq.so

<!-- Source EN PDF p.320; unit 3422 -->

【Description】

<!-- Source EN PDF p.320; unit 3423 -->

If the Gamma curve in the API is not switched according to the scene, if the scene changes, set the gamma curve again through the API.

<!-- Source EN PDF p.320; unit 3424 -->

9.11.4.2  rk_aiq_user_api2_agamma_GetAttrib

<!-- Source EN PDF p.320; unit 3425 -->

【Description】 Gets the gamma software properties.

<!-- Source EN PDF p.320; unit 3426 -->

【Grammar】

<!-- Source EN PDF p.320; unit 3427 -->

```text
 XCamReturn
 rk_aiq_user_api2_agamma_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_gamma_attrib_t* attr);
```

<!-- Source EN PDF p.320; unit 3428 -->

【Parameters】

<!-- Source EN PDF p.320; unit 3429 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | Gamma Software Property Struct | Output |

<!-- Source EN PDF p.320; unit 3430 -->

【Return Value】

<!-- Source EN PDF p.320; unit 3431 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.320; unit 3432 -->

【Requirements】

<!-- Source EN PDF p.320; unit 3433 -->

Header file: rk_aiq_user_api2_agamma.h

<!-- Source EN PDF p.321; unit 3434 -->

Library file: librkaiq.so

<!-- Source EN PDF p.321; unit 3435 -->

【Description】

<!-- Source EN PDF p.321; unit 3436 -->

#### 9.11.5  Module-level API data types

<!-- Source EN PDF p.321; unit 3437 -->

9.11.5.1  rk_aiq_gamma_op_mode_t

<!-- Source EN PDF p.321; unit 3438 -->

【Description】 Define the Gamma operating mode

<!-- Source EN PDF p.321; unit 3439 -->

【Definition】

<!-- Source EN PDF p.321; unit 3440 -->

```text
 typedef enum rk_aiq_gamma_op_mode_s {
     RK_AIQ_GAMMA_MODE_OFF             = 0,
     RK_AIQ_GAMMA_MODE_MANUAL          = 1,
     RK_AIQ_GAMMA_MODE_FAST            = 2,
 } rk_aiq_gamma_op_mode_t;
```

<!-- Source EN PDF p.321; unit 3441 -->

【Member】

<!-- Source EN PDF p.321; unit 3442 -->

| Member Name | Description |
|---|---|
| RK_AIQ_GAMMA_MODE_OFF | API Off Mode |
| RK_AIQ_GAMMA_MODE_MANUAL | API Manual Mode |
| RK_AIQ_GAMMA_MODE_FAST | API Quick Mode |

<!-- Source EN PDF p.321; unit 3443 -->

9.11.5.2  Agamma_api_Fast_t

<!-- Source EN PDF p.321; unit 3444 -->

【Description】 Define the Gamma property in fast mode

<!-- Source EN PDF p.321; unit 3445 -->

Quickly set gamma curves with GammaBeef and SlopeAtZero. The gamma curve is generated as follows:

<!-- Source EN PDF p.321; unit 3446 -->

```text
 for(int i = 0; i < 49; i++) {
     Y_isp30[i] = 4095 * pow(X_isp30[i] / 4095, 1 / GammaCoef + SlopeAtZero);
     Y_isp30[i] = LIMIT_VALUE(Y_isp30[i], 4095, 0);
  }
```

<!-- Source EN PDF p.321; unit 3447 -->

【Definition】

<!-- Source EN PDF p.321; unit 3448 -->

```text
 typedef struct Agamma_api_Fast_s {
     bool  en;
     float GammaCoef;
     float SlopeAtZero;
 } Agamma_api_Fast_t;
```

<!-- Source EN PDF p.321; unit 3449 -->

【Member】

<!-- Source EN PDF p.322; unit 3450 -->

| Member<br>Name | Description |
|---|---|
| en | Switch function |
| GammaCoef | gamma coefficient, the value range is 0, 100, the default value is 2.2, and the accuracy<br>is 0.01 |
| SlopeAtZero | The slope of the dark area can be 0.05 and 0.05, the default value is 0, and the accuracy<br>is 0.001 |

<!-- Source EN PDF p.322; unit 3451 -->

9.11.5.3  GammaType_t

<!-- Source EN PDF p.322; unit 3452 -->

【Description】 Define the Gamma curve X-axis spacing type property

<!-- Source EN PDF p.322; unit 3453 -->

【definition】

<!-- Source EN PDF p.322; unit 3454 -->

```text
 typedef enum GammaType_e {
    GAMMATYPE_LOG = 0,
    GAMMATYPE_EQU = 1,
 } GammaType_t;
```

<!-- Source EN PDF p.322; unit 3455 -->

【Member】

<!-- Source EN PDF p.322; unit 3456 -->

| Member Name | Description |
|---|---|
| GAMMATYPE_LOG | Non-evenly spaced |
| GAMMATYPE_EQU | Evenly spaced |

<!-- Source EN PDF p.322; unit 3457 -->

9.11.5.4  Agamma_api_manualV21_t

<!-- Source EN PDF p.322; unit 3458 -->

【Description】 Define the manual gamma attribute under RK356x

<!-- Source EN PDF p.322; unit 3459 -->

【Definition】

<!-- Source EN PDF p.322; unit 3460 -->

```text
 typedef struct Agamma_api_manualV21_s {
    bool        Gamma_en;
    GammaType_t Gamma_out_segnum;
    uint16_t    Gamma_out_offset;
    uint16_t    Gamma_curve[CALIBDB_AGAMMA_KNOTS_NUM];
 } Agamma_api_manualV21_t;
```

<!-- Source EN PDF p.322; unit 3461 -->

【Member】

<!-- Source EN PDF p.323; unit 3462 -->

| Member Name | Description |
|---|---|
| Gamma_en | Switch function |
| Gamma_out_segnum | Manual Gamma Curve X-axis spacing type, default value GAMMATYPE_LOG |
| Gamma_out_offset | Manual Gamma curve correction coefficient, value range [-2048, 2048], default<br>value 0, accuracy 1. |
| Gamma_curve | Manual Gamma curve, value range [0,4095], accuracy 1 |

<!-- Source EN PDF p.323; unit 3463 -->

9.11.5.5  Agamma_api_manualV30_t

<!-- Source EN PDF p.323; unit 3464 -->

【Description】 Define the manual gamma attribute under RK3588

<!-- Source EN PDF p.323; unit 3465 -->

【Definition】

<!-- Source EN PDF p.323; unit 3466 -->

```text
 typedef struct Agamma_api_manualV30_s {
    bool     Gamma_en;
    uint16_t Gamma_out_offset;
    uint16_t Gamma_curve[CALIBDB_AGAMMA_KNOTS_NUM_V30];
 } Agamma_api_manualV30_t;
```

<!-- Source EN PDF p.323; unit 3467 -->

【Member】

<!-- Source EN PDF p.323; unit 3468 -->

| Member Name | Description |
|---|---|
| Gamma_en | Switch function |
| Gamma_out_offset | Manual Gamma curve correction coefficient, value range [-2048, 2048], default<br>value 0, accuracy 1. |
| Gamma_curve | Manual Gamma curve, value range [0,4095], accuracy 1 |

<!-- Source EN PDF p.323; unit 3469 -->

9.11.5.6  rk_aiq_gamma_attrV21_t

<!-- Source EN PDF p.323; unit 3470 -->

【Description】 Define the Gamma attribute on the RK356x

<!-- Source EN PDF p.323; unit 3471 -->

【Definition】

<!-- Source EN PDF p.323; unit 3472 -->

```text
 typedef struct rk_aiq_gamma_attrV21_s {
    rk_aiq_gamma_op_mode_t mode;
    Agamma_api_manualV21_t stManual;
    Agamma_api_Fast_t      stFast;
 } rk_aiq_gamma_attrV21_t;
```

<!-- Source EN PDF p.323; unit 3473 -->

【Member】

<!-- Source EN PDF p.324; unit 3474 -->

| Member Name | Description |
|---|---|
| mode | API Pattern |
| stManual | Manual Gamma parameter |
| stFast | Quick Mode Parameter |

<!-- Source EN PDF p.324; unit 3475 -->

9.11.5.7  rk_aiq_gamma_attrV30_t

<!-- Source EN PDF p.324; unit 3476 -->

【Description】 Define the Gamma attribute under RK3588

<!-- Source EN PDF p.324; unit 3477 -->

【Definition】

<!-- Source EN PDF p.324; unit 3478 -->

```text
 typedef struct rk_aiq_gamma_attrV30_s {
    rk_aiq_gamma_op_mode_t mode;
    Agamma_api_manualV30_t stManual;
    Agamma_api_Fast_t      stFast;
 } rk_aiq_gamma_attrV30_t;
```

<!-- Source EN PDF p.324; unit 3479 -->

【Member】

<!-- Source EN PDF p.324; unit 3480 -->

| Member Name | Description |
|---|---|
| mode | API schema |
| stManual | Manual Gamma parameter |
| stFast | Quick mode parameters |

<!-- Source EN PDF p.324; unit 3481 -->

9.11.5.8  rk_aiq_gamma_attr_t

<!-- Source EN PDF p.324; unit 3482 -->

【Description】 Define the Gamma property

<!-- Source EN PDF p.324; unit 3483 -->

【Definition】

<!-- Source EN PDF p.324; unit 3484 -->

```text
 typedef struct rk_aiq_gamma_attr_s {
     rk_aiq_uapi_sync_t     sync;
     rk_aiq_gamma_attrV21_t atrrV21;
     rk_aiq_gamma_attrV30_t atrrV30;
 } rk_aiq_gamma_attr_t;
```

<!-- Source EN PDF p.324; unit 3485 -->

【Member】

<!-- Source EN PDF p.325; unit 3486 -->

| Member Name | Description |
|---|---|
| sync | For rk_aiq_uapi_sync_t definitions, see Overview/API Description section |
| atrrV21 | RK356x chip under manual gamma attribute |
| atrrV30 | RK3588 chip under manual gamma attribute |

<!-- Source EN PDF p.325; unit 3487 -->

### 9.12   CCM

<!-- Source EN PDF p.325; unit 3488 -->

#### 9.12.1  Description of the feature

<!-- Source EN PDF p.325; unit 3489 -->

The CCM (Color Correction Matrix) module performs color correction processing on images.

<!-- Source EN PDF p.325; unit 3490 -->

#### 9.12.2  Feature-level API reference

<!-- Source EN PDF p.325; unit 3491 -->

9.12.2.1  rk_aiq_uapi2_setCCMMode

<!-- Source EN PDF p.325; unit 3492 -->

【Description】 Set the CCM operating mode.

<!-- Source EN PDF p.325; unit 3493 -->

【Grammar】

<!-- Source EN PDF p.325; unit 3494 -->

```text
 XCamReturn rk_aiq_uapi2_setCCMMode(const rk_aiq_sys_ctx_t* ctx, opMode_t mode);
```

<!-- Source EN PDF p.325; unit 3495 -->

【Parameters】

<!-- Source EN PDF p.325; unit 3496 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| mode | mode of operation;<br>value range: {OP_AUTO, OP_MANUAL} | Input |

<!-- Source EN PDF p.325; unit 3497 -->

【Return Value】

<!-- Source EN PDF p.325; unit 3498 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.325; unit 3499 -->

【Requirements】

<!-- Source EN PDF p.325; unit 3500 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.325; unit 3501 -->

Library file: librkaiq.so

<!-- Source EN PDF p.325; unit 3502 -->

【Example】

<!-- Source EN PDF p.326; unit 3503 -->

Refer to "sample_set_ccm_manual" / "sample_set_ccm_auto" in sample_accm_module.cpp to set manual/automatic mode.

<!-- Source EN PDF p.326; unit 3504 -->

9.12.2.2  rk_aiq_uapi2_getCCMMode

<!-- Source EN PDF p.326; unit 3505 -->

【Description】 Gets the CCM operating mode.

<!-- Source EN PDF p.326; unit 3506 -->

【Grammar】

<!-- Source EN PDF p.326; unit 3507 -->

```text
 XCamReturn rk_aiq_uapi2_getCCMMode(const rk_aiq_sys_ctx_t* ctx, opMode_t *mode);
```

<!-- Source EN PDF p.326; unit 3508 -->

【Parameters】

<!-- Source EN PDF p.326; unit 3509 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| mode | mode of operation;<br>value range: {OP_AUTO, OP_MANUAL} | Output |

<!-- Source EN PDF p.326; unit 3510 -->

【Return Value】

<!-- Source EN PDF p.326; unit 3511 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.326; unit 3512 -->

【Requirements】

<!-- Source EN PDF p.326; unit 3513 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.326; unit 3514 -->

Library file: librkaiq.so

<!-- Source EN PDF p.326; unit 3515 -->

【Example】

<!-- Source EN PDF p.326; unit 3516 -->

Refer to "sample_get_ccm_mode" in sample_accm_module.cpp for working mode.

<!-- Source EN PDF p.326; unit 3517 -->

9.12.2.3  rk_aiq_uapi2_setMCcCoef

<!-- Source EN PDF p.326; unit 3518 -->

【Description】 Set the CCM matrix in Manual mode, including the color correction matrix and R/G/B channel offset.

<!-- Source EN PDF p.326; unit 3519 -->

【Grammar】

<!-- Source EN PDF p.326; unit 3520 -->

```text
 XCamReturn rk_aiq_uapi2_setMCcCoef(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_ccm_matrix_t *mccm);
```

<!-- Source EN PDF p.326; unit 3521 -->

【Parameters】

<!-- Source EN PDF p.327; unit 3522 -->

| Parameter<br>Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| mccm | CCM matrix in Manual mode, including color correction matrix<br>and R/G/B channel offset | Input |

<!-- Source EN PDF p.327; unit 3523 -->

【Return Value】

<!-- Source EN PDF p.327; unit 3524 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.327; unit 3525 -->

【Requirements】

<!-- Source EN PDF p.327; unit 3526 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.327; unit 3527 -->

Library file: librkaiq.so

<!-- Source EN PDF p.327; unit 3528 -->

【Example】

<!-- Source EN PDF p.327; unit 3529 -->

Refer to "sample_set_ccm_manual_matrix" in sample_accm_module.cpp to set up a manual CCM matrix.

<!-- Source EN PDF p.327; unit 3530 -->

9.12.2.4  rk_aiq_uapi2_getMCcCoef

<!-- Source EN PDF p.327; unit 3531 -->

【Description】 Acquire the CCM matrix, including the color correction matrix and the R/G/B channel offset.

<!-- Source EN PDF p.327; unit 3532 -->

【Grammar】

<!-- Source EN PDF p.327; unit 3533 -->

```text
 XCamReturn rk_aiq_uapi2_getMCcCoef(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_ccm_matrix_t *mccm);
```

<!-- Source EN PDF p.327; unit 3534 -->

【Parameters】

<!-- Source EN PDF p.327; unit 3535 -->

| Parameter<br>Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| mccm | CCM matrix, including color correction matrix and R/G/B channel<br>offset | Output |

<!-- Source EN PDF p.327; unit 3536 -->

【Return Value】

<!-- Source EN PDF p.327; unit 3537 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.328; unit 3538 -->

【Requirements】

<!-- Source EN PDF p.328; unit 3539 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.328; unit 3540 -->

Library file: librkaiq.so

<!-- Source EN PDF p.328; unit 3541 -->

【Example】

<!-- Source EN PDF p.328; unit 3542 -->

Refer to "sample_get_ccm_manual_matrix" in sample_accm_module.cpp to get the CCM matrix.

<!-- Source EN PDF p.328; unit 3543 -->

9.12.2.5  rk_aiq_uapi2_getACcmSat

<!-- Source EN PDF p.328; unit 3544 -->

【Description】 Obtain CCM saturation in automatic mode.

<!-- Source EN PDF p.328; unit 3545 -->

【Grammar】

<!-- Source EN PDF p.328; unit 3546 -->

```text
 XCamReturn rk_aiq_uapi2_getACcmSat(const rk_aiq_sys_ctx_t* ctx,  float
 *finalsat);
```

<!-- Source EN PDF p.328; unit 3547 -->

【Parameters】

<!-- Source EN PDF p.328; unit 3548 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| finalsat | Saturation, manual mode is 0 | Output |

<!-- Source EN PDF p.328; unit 3549 -->

【Return Value】

<!-- Source EN PDF p.328; unit 3550 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.328; unit 3551 -->

【Requirements】

<!-- Source EN PDF p.328; unit 3552 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.328; unit 3553 -->

Library file: librkaiq.so

<!-- Source EN PDF p.328; unit 3554 -->

【Example】

<!-- Source EN PDF p.328; unit 3555 -->

Refer to "sample_get_accm_sat" in sample_accm_module.cpp for CCM saturation in auto mode.

<!-- Source EN PDF p.328; unit 3556 -->

9.12.2.6  rk_aiq_uapi2_getACcmMatrixName

<!-- Source EN PDF p.328; unit 3557 -->

【Description】 Gets the CCM matrix name in auto mode.

<!-- Source EN PDF p.328; unit 3558 -->

【Grammar】

<!-- Source EN PDF p.328; unit 3559 -->

```text
 XCamReturn rk_aiq_uapi2_getACcmMatrixName(const rk_aiq_sys_ctx_t* ctx, char
 **ccm_name);
```

<!-- Source EN PDF p.329; unit 3560 -->

【Parameters】

<!-- Source EN PDF p.329; unit 3561 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| ccm_name | CCM matrix name | Output |

<!-- Source EN PDF p.329; unit 3562 -->

【Return Value】

<!-- Source EN PDF p.329; unit 3563 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.329; unit 3564 -->

【Requirements】

<!-- Source EN PDF p.329; unit 3565 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.329; unit 3566 -->

Library file: librkaiq.so

<!-- Source EN PDF p.329; unit 3567 -->

【Example】

<!-- Source EN PDF p.329; unit 3568 -->

Refer to "sample_get_accm_matrix_name" in sample_accm_module.cpp to get CCM saturation in auto mode.

<!-- Source EN PDF p.329; unit 3569 -->

#### 9.12.3  Functional-level API data types

<!-- Source EN PDF p.329; unit 3570 -->

9.12.3.1  opMode_t

<!-- Source EN PDF p.329; unit 3571 -->

【Description】 Define the CCM operating mode.

<!-- Source EN PDF p.329; unit 3572 -->

【Definition】

<!-- Source EN PDF p.329; unit 3573 -->

```text
 typedef enum opMode_e {
     OP_AUTO = 0,
     OP_MANUAL = 1,
     OP_INVAL
 } opMode_t;
```

<!-- Source EN PDF p.329; unit 3574 -->

【Member】

<!-- Source EN PDF p.329; unit 3575 -->

| Member Name | Description |
|---|---|
| OP_AUTO | Automatic mode |
| OP_MANUAL | Manual mode |
| OP_INVAL | Invalid value |

<!-- Source EN PDF p.330; unit 3576 -->

9.12.3.2  rk_aiq_ccm_matrix_t

<!-- Source EN PDF p.330; unit 3577 -->

【Description】 Define the CCM matrix.

<!-- Source EN PDF p.330; unit 3578 -->

【Definition】

<!-- Source EN PDF p.330; unit 3579 -->

```text
 typedef struct rk_aiq_ccm_matrix_s {
     float  ccMatrix[9];
     float  ccOffsets[3];
 } rk_aiq_ccm_matrix_t;
```

<!-- Source EN PDF p.330; unit 3580 -->

【Member】

<!-- Source EN PDF p.330; unit 3581 -->

| Member Name | Description |
|---|---|
| ccMatrix | color correction matrix in manual mode;<br>value range: [-8, 7.992] |
| ccOffsets | RGB component offset in manual mode;<br>value range: [-4096, 4095] |

<!-- Source EN PDF p.330; unit 3582 -->

#### 9.12.4  Module-level API reference

<!-- Source EN PDF p.330; unit 3583 -->

9.12.4.1  rk_aiq_user_api2_accm_v2_SetAttrib

<!-- Source EN PDF p.330; unit 3584 -->

【Description】 Set the CCM properties.

<!-- Source EN PDF p.330; unit 3585 -->

【Grammar】

<!-- Source EN PDF p.330; unit 3586 -->

```text
 XCamReturn
 rk_aiq_user_api2_accm_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_ccm_attrib_t attr);
```

<!-- Source EN PDF p.330; unit 3587 -->

【Parameters】

<!-- Source EN PDF p.330; unit 3588 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | The property parameters of CCM | Input |

<!-- Source EN PDF p.330; unit 3589 -->

【Return Value】

<!-- Source EN PDF p.330; unit 3590 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.331; unit 3591 -->

【Requirements】

<!-- Source EN PDF p.331; unit 3592 -->

Header files: rk_aiq_user_api2_accm.h, rk_aiq_uapi_accm_int.h

<!-- Source EN PDF p.331; unit 3593 -->

Library file: librkaiq.so

<!-- Source EN PDF p.331; unit 3594 -->

【Example】

<!-- Source EN PDF p.331; unit 3595 -->

Refer to "sample_ccm_setCcmAttr" in sample_accm_module.cpp to set CCM properties.

<!-- Source EN PDF p.331; unit 3596 -->

9.12.4.2  rk_aiq_user_api2_accm_GetAttrib

<!-- Source EN PDF p.331; unit 3597 -->

【Description】 Gets the CCM properties.

<!-- Source EN PDF p.331; unit 3598 -->

【Grammar】

<!-- Source EN PDF p.331; unit 3599 -->

```text
 XCamReturn
 rk_aiq_user_api2_accm_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_ccm_attrib_t *attr);
```

<!-- Source EN PDF p.331; unit 3600 -->

【Parameters】

<!-- Source EN PDF p.331; unit 3601 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | Parameter properties of CCM | Output |

<!-- Source EN PDF p.331; unit 3602 -->

【Return Value】

<!-- Source EN PDF p.331; unit 3603 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.331; unit 3604 -->

【Requirements】

<!-- Source EN PDF p.331; unit 3605 -->

Header files: rk_aiq_user_api2_accm.h, rk_aiq_uapi_accm_int.h

<!-- Source EN PDF p.331; unit 3606 -->

Library file: librkaiq.so

<!-- Source EN PDF p.331; unit 3607 -->

【Example】

<!-- Source EN PDF p.331; unit 3608 -->

Refer to "sample_ccm_getCcmAttr" in sample_accm_module.cpp to obtain CCM attributes.

<!-- Source EN PDF p.331; unit 3609 -->

9.12.4.3  rk_aiq_user_api2_accm_QueryCcmInfo

<!-- Source EN PDF p.331; unit 3610 -->

【Description】 Query CCM information.

<!-- Source EN PDF p.331; unit 3611 -->

【Grammar】

<!-- Source EN PDF p.332; unit 3612 -->

```text
 XCamReturn
 rk_aiq_user_api2_accm_QueryCcmInfo(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_ccm_querry_info_t *ccm_querry_info);
```

<!-- Source EN PDF p.332; unit 3613 -->

【Parameters】

<!-- Source EN PDF p.332; unit 3614 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| ccm_querry_info | CCM query content | Output |

<!-- Source EN PDF p.332; unit 3615 -->

【Return Value】

<!-- Source EN PDF p.332; unit 3616 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.332; unit 3617 -->

【Requirements】

<!-- Source EN PDF p.332; unit 3618 -->

Header files: rk_aiq_user_api2_accm.h, rk_aiq_uapi_accm_int.h

<!-- Source EN PDF p.332; unit 3619 -->

Library file: librkaiq.so

<!-- Source EN PDF p.332; unit 3620 -->

【Example】

<!-- Source EN PDF p.332; unit 3621 -->

Refer to "sample_query_ccm_info" in sample_accm_module.cpp to query CCM information.

<!-- Source EN PDF p.332; unit 3622 -->

#### 9.12.5  Module-level API data types

<!-- Source EN PDF p.332; unit 3623 -->

9.12.5.1  rk_aiq_ccm_op_mode_t

<!-- Source EN PDF p.332; unit 3624 -->

【Description】 Define the CCM operating mode.

<!-- Source EN PDF p.332; unit 3625 -->

【Definition】

<!-- Source EN PDF p.332; unit 3626 -->

```text
 typedef enum rk_aiq_ccm_op_mode_s {
     RK_AIQ_CCM_MODE_INVALID                     = 0,
     RK_AIQ_CCM_MODE_MANUAL                      = 1,
     RK_AIQ_CCM_MODE_AUTO                        = 2,
     RK_AIQ_CCM_MODE_MAX
 } rk_aiq_ccm_op_mode_t;
```

<!-- Source EN PDF p.332; unit 3627 -->

【Member】

<!-- Source EN PDF p.333; unit 3628 -->

| Member Name | Description |
|---|---|
| RK_AIQ_CCM_MODE_INVALID | CCM invalid mode |
| RK_AIQ_CCM_MODE_MANUAL | CCM Manual Mode |
| RK_AIQ_CCM_MODE_AUTO | CCM Auto Mode |

<!-- Source EN PDF p.333; unit 3629 -->

9.12.5.2  rk_aiq_ccm_mccm_attrib_t

<!-- Source EN PDF p.333; unit 3630 -->

【Description】 Define manual CCM properties.

<!-- Source EN PDF p.333; unit 3631 -->

【Definition】

<!-- Source EN PDF p.333; unit 3632 -->

```text
 typedef struct rk_aiq_ccm_mccm_attrib_s {
     float  ccMatrix[9];
     float  ccOffsets[3];
     float  y_alpha_curve[17];
     float low_bound_pos_bit;
 } rk_aiq_ccm_mccm_attrib_t;
```

<!-- Source EN PDF p.333; unit 3633 -->

【Member】

<!-- Source EN PDF p.333; unit 3634 -->

| Member Name | Description |
|---|---|
| ccMatrix | color correction matrix;<br>value range: [-8, 7.992] |
| ccOffsets | RGB component offset;<br>value range: [-4096, 4095] |
| y_alpha_curve | Intensity configuration of the color correction intensity adjustment curve related to<br>pixel brightness (12bit).<br>Valid values: [0x0, 0x400], 0x400 indicates 1 times the intensity, 0x0 indicates no<br>correction |
| low_bound_pos_bit | The brightness range of the inflection point of the pixel brightness (12bit)<br>adjustment curve is [0, 2^low_bound_pos_bit] and [4095-2^low_bound_pos_bit,<br>4095].<br>Valid values: [0,10] |

<!-- Source EN PDF p.333; unit 3635 -->

9.12.5.3  rk_aiq_ccm_color_inhibition_t

<!-- Source EN PDF p.333; unit 3636 -->

【Description】 Define the CCM color suppression level.

<!-- Source EN PDF p.333; unit 3637 -->

【Definition】

<!-- Source EN PDF p.334; unit 3638 -->

```text
 typedef struct rk_aiq_ccm_color_inhibition_s {
     float sensorGain[RK_AIQ_ACCM_COLOR_GAIN_NUM];
     float level[RK_AIQ_ACCM_COLOR_GAIN_NUM];
 } rk_aiq_ccm_color_inhibition_t;
```

<!-- Source EN PDF p.334; unit 3639 -->

【Member】

<!-- Source EN PDF p.334; unit 3640 -->

| Member Name | Description |
|---|---|
| sensorGain | Exposure gain component |
| level | color suppression level;<br>value range: [0,100];<br>default value is 0 |

<!-- Source EN PDF p.334; unit 3641 -->

9.12.5.4  rk_aiq_ccm_color_saturation_t

<!-- Source EN PDF p.334; unit 3642 -->

【Description】 Define the auto CCM color saturation level.

<!-- Source EN PDF p.334; unit 3643 -->

【Definition】

<!-- Source EN PDF p.334; unit 3644 -->

```text
 typedef struct rk_aiq_ccm_color_saturation_s {
     float sensorGain[RK_AIQ_ACCM_COLOR_GAIN_NUM];
     float level[RK_AIQ_ACCM_COLOR_GAIN_NUM];
 } rk_aiq_ccm_color_saturation_t;
```

<!-- Source EN PDF p.334; unit 3645 -->

【Member】

<!-- Source EN PDF p.334; unit 3646 -->

| Member Name | Description |
|---|---|
| sensorGain | Exposure gain component |
| level | color saturation level;<br>value range: [0,100];<br>default value is 100 |

<!-- Source EN PDF p.334; unit 3647 -->

9.12.5.5  rk_aiq_ccm_accm_attrib_t

<!-- Source EN PDF p.334; unit 3648 -->

【Description】 Define automatic CCM properties.

<!-- Source EN PDF p.334; unit 3649 -->

【Definition】

<!-- Source EN PDF p.334; unit 3650 -->

```text
 typedef struct rk_aiq_ccm_accm_attrib_s {
     rk_aiq_ccm_color_inhibition_t color_inhibition;
     rk_aiq_ccm_color_saturation_t color_saturation;
 } rk_aiq_ccm_accm_attrib_t;
```

<!-- Source EN PDF p.334; unit 3651 -->

【Member】

<!-- Source EN PDF p.335; unit 3652 -->

| Member Name | Description |
|---|---|
| color_inhibition | CCM color suppression level |
| color_saturation | CCM color saturation level |

<!-- Source EN PDF p.335; unit 3653 -->

9.12.5.6  rk_aiq_ccm_attrib_t

<!-- Source EN PDF p.335; unit 3654 -->

【Description】 Define CCM properties.

<!-- Source EN PDF p.335; unit 3655 -->

【Definition】

<!-- Source EN PDF p.335; unit 3656 -->

```text
 typedef struct rk_aiq_ccm_attrib_s {
     rk_aiq_uapi_sync_t sync;
     bool byPass;
     rk_aiq_ccm_op_mode_t mode;
     rk_aiq_ccm_mccm_attrib_t stManual;
     rk_aiq_ccm_accm_attrib_t stAuto;
     CalibDbV2_Ccm_Para_V2_t stTool;
 } rk_aiq_ccm_attrib_t;
```

<!-- Source EN PDF p.335; unit 3657 -->

【Member】

<!-- Source EN PDF p.335; unit 3658 -->

| Member<br>Name | Description |
|---|---|
| sync | Synchronous/asynchronous signals, refer to rk_aiq_uapi_sync_t definition description, see<br>**Overview/API Description" section |
| byPass | Skip module processing;<br>true skip CCM, false CCM enable |
| mode | working mode selection;<br>value range: {RK_AIQ_CCM_MODE_MANUAL, RK_AIQ_CCM_MODE_AUTO},<br>which indicates manual and automatic mode |
| stManual | Manual mode property parameter configuration |
| stAuto | Automatic mode property parameter configuration |
| stTool | Parameter configuration in tool mode, no need to configure |

<!-- Source EN PDF p.335; unit 3659 -->

9.12.5.7  rk_aiq_ccm_querry_info_t

<!-- Source EN PDF p.335; unit 3660 -->

【Description】 Define CCM query information

<!-- Source EN PDF p.335; unit 3661 -->

【Definition】

<!-- Source EN PDF p.336; unit 3662 -->

```text
 typedef struct rk_aiq_ccm_querry_info_s {
     bool ccm_en;
     float  ccMatrix[9];
     float  ccOffsets[3];
     float  y_alpha_curve[CCM_CURVE_DOT_NUM];
     float low_bound_pos_bit;
     float color_inhibition_level;
     float color_saturation_level;
     float finalSat;
     char  ccmname1[25];
     char  ccmname2[25];
 } rk_aiq_ccm_querry_info_t;
```

<!-- Source EN PDF p.336; unit 3663 -->

【Member】

<!-- Source EN PDF p.336; unit 3664 -->

| Member Name | Description |
|---|---|
| ccm_en | CCM enabled<br>true enabled, false not enabled |
| ccMatrix | CCM effective correction matrix;<br>value range: [-8,7.992] |
| ccOffsets | Effective RGB component offset;<br>value range: [-4096,4095] |
| y_alpha_curve | Intensity configuration of the color correction intensity adjustment curve related<br>to pixel brightness (12bit).<br>Value range: [0x0, 0x400].<br>0x400 indicates 1 times the intensity, and 0x0 indicates no correction |
| low_bound_pos_bit | The brightness range of the inflection point of the pixel brightness (12bit)<br>adjustment curve is [0, 2^low_bound_pos_bit] and [4095-2^low_bound_pos_bit,<br>4095].<br>Valid values: [0,10] |
| color_inhibition_level | CCM color suppression level (auto mode only) |
| color_saturation_level | CCM color saturation level (auto mode only) |
| finalSat | Saturation value corresponding to the current matrix (only auto mode is<br>supported) |
| ccmname1 | Name of the calibration matrix used to interpolate the calculation of the current<br>matrix (automatic mode only) |
| ccmname2 | Name of the calibration matrix used to interpolate the calculation of the current<br>matrix (automatic mode only) |

<!-- Source EN PDF p.337; unit 3665 -->

### 9.13   3DLUT

<!-- Source EN PDF p.337; unit 3666 -->

#### 9.13.1  Description of the feature

<!-- Source EN PDF p.337; unit 3667 -->

The 3DLUT (3D look up table) module performs color mapping of images in RGB space.

<!-- Source EN PDF p.337; unit 3668 -->

#### 9.13.2  Functional level API reference

<!-- Source EN PDF p.337; unit 3669 -->

9.13.2.1  rk_aiq_uapi2_setLut3dMode

<!-- Source EN PDF p.337; unit 3670 -->

【Description】 Set the 3DLUT operating mode.

<!-- Source EN PDF p.337; unit 3671 -->

【Grammar】

<!-- Source EN PDF p.337; unit 3672 -->

```text
 XCamReturn rk_aiq_uapi2_setLut3dMode(const rk_aiq_sys_ctx_t* ctx, opMode_t mode);
```

<!-- Source EN PDF p.337; unit 3673 -->

【Parameters】

<!-- Source EN PDF p.337; unit 3674 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| mode | mode of operation;<br>value range: {OP_AUTO, OP_MANUAL} | Input |

<!-- Source EN PDF p.337; unit 3675 -->

【Return Value】

<!-- Source EN PDF p.337; unit 3676 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.337; unit 3677 -->

【Requirements】

<!-- Source EN PDF p.337; unit 3678 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.337; unit 3679 -->

Library file: librkaiq.so

<!-- Source EN PDF p.337; unit 3680 -->

【Example】

<!-- Source EN PDF p.337; unit 3681 -->

Refer to "sample_set_a3dlut_manual" / "sample_set_a3dlut_auto" in sample_a3dlut_module.cpp to set manual/automatic mode.

<!-- Source EN PDF p.337; unit 3682 -->

9.13.2.2  rk_aiq_uapi2_getLut3dMode

<!-- Source EN PDF p.337; unit 3683 -->

【Description】 Get the 3DLUT working mode.

<!-- Source EN PDF p.337; unit 3684 -->

【Grammar】

<!-- Source EN PDF p.338; unit 3685 -->

```text
 XCamReturn rk_aiq_uapi2_getLut3dMode(const rk_aiq_sys_ctx_t* ctx, opMode_t
 *mode);
```

<!-- Source EN PDF p.338; unit 3686 -->

【Parameters】

<!-- Source EN PDF p.338; unit 3687 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| mode | Working mode | Output |

<!-- Source EN PDF p.338; unit 3688 -->

【Return Value】

<!-- Source EN PDF p.338; unit 3689 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.338; unit 3690 -->

【Requirements】

<!-- Source EN PDF p.338; unit 3691 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.338; unit 3692 -->

Library file: librkaiq.so

<!-- Source EN PDF p.338; unit 3693 -->

【Example】

<!-- Source EN PDF p.338; unit 3694 -->

Refer to "sample_get_a3dlut_mode" in sample_a3dlut_module.cpp to set manual/automatic mode.

<!-- Source EN PDF p.338; unit 3695 -->

9.13.2.3  rk_aiq_uapi2_setM3dLut

<!-- Source EN PDF p.338; unit 3696 -->

【Description】 Set up a 3DLUT manual 3D lookup table.

<!-- Source EN PDF p.338; unit 3697 -->

【Grammar】

<!-- Source EN PDF p.338; unit 3698 -->

```text
 XCamReturn rk_aiq_uapi2_setM3dLut(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_lut3d_table_t *mlut);
```

<!-- Source EN PDF p.338; unit 3699 -->

【Parameters】

<!-- Source EN PDF p.338; unit 3700 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| mlut | 3D lookup table | Input |

<!-- Source EN PDF p.338; unit 3701 -->

【Return Value】

<!-- Source EN PDF p.338; unit 3702 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.339; unit 3703 -->

【Requirements】

<!-- Source EN PDF p.339; unit 3704 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.339; unit 3705 -->

Library file: librkaiq.so

<!-- Source EN PDF p.339; unit 3706 -->

【Example】

<!-- Source EN PDF p.339; unit 3707 -->

Refer to the "sample_set_a3dlut_manual_lut" in sample_a3dlut_module.cpp to set up the 3DLUT manual 3D lookup table.

<!-- Source EN PDF p.339; unit 3708 -->

9.13.2.4  rk_aiq_uapi2_getM3dLut

<!-- Source EN PDF p.339; unit 3709 -->

【Description】 Get the 3DLUT 3D lookup table.

<!-- Source EN PDF p.339; unit 3710 -->

【Grammar】

<!-- Source EN PDF p.339; unit 3711 -->

```text
 XCamReturn rk_aiq_uapi2_getM3dLut(const rk_aiq_sys_ctx_t* ctx,
  rk_aiq_lut3d_table_t *mlut);
```

<!-- Source EN PDF p.339; unit 3712 -->

【Parameters】

<!-- Source EN PDF p.339; unit 3713 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| mlut | 3D lookup table | Output |

<!-- Source EN PDF p.339; unit 3714 -->

【Return Value】

<!-- Source EN PDF p.339; unit 3715 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.339; unit 3716 -->

【Requirements】

<!-- Source EN PDF p.339; unit 3717 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.339; unit 3718 -->

Library file: librkaiq.so

<!-- Source EN PDF p.339; unit 3719 -->

【Example】

<!-- Source EN PDF p.339; unit 3720 -->

Refer to "sample_get_a3dlut_lut" in sample_a3dlut_module.cpp for 3DLUT 3D lookup tables.

<!-- Source EN PDF p.339; unit 3721 -->

9.13.2.5  rk_aiq_uapi2_getA3dLutStrth

<!-- Source EN PDF p.339; unit 3722 -->

【Description】 Get 3DLUT to adjust the intensity.

<!-- Source EN PDF p.339; unit 3723 -->

【Grammar】

<!-- Source EN PDF p.339; unit 3724 -->

```text
 XCamReturn rk_aiq_uapi2_getA3dLutStrth(const rk_aiq_sys_ctx_t* ctx, float alpha);
```

<!-- Source EN PDF p.340; unit 3725 -->

【Parameters】

<!-- Source EN PDF p.340; unit 3726 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| alpha | 3DLUT Modulation Intensity | Output |

<!-- Source EN PDF p.340; unit 3727 -->

【Return Value】

<!-- Source EN PDF p.340; unit 3728 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.340; unit 3729 -->

【Requirements】

<!-- Source EN PDF p.340; unit 3730 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.340; unit 3731 -->

Library file: librkaiq.so

<!-- Source EN PDF p.340; unit 3732 -->

【Example】

<!-- Source EN PDF p.340; unit 3733 -->

Refer to "sample_get_a3dlut_strength" in sample_a3dlut_module.cpp for 3DLUT adjustment intensity.

<!-- Source EN PDF p.340; unit 3734 -->

9.13.2.6  rk_aiq_uapi2_getA3dLutName

<!-- Source EN PDF p.340; unit 3735 -->

【Description】 Obtain the 3DLUT table name in automatic mode.

<!-- Source EN PDF p.340; unit 3736 -->

【Grammar】

<!-- Source EN PDF p.340; unit 3737 -->

```text
 XCamReturn rk_aiq_uapi2_getA3dLutName(const rk_aiq_sys_ctx_t* ctx, char *name);
```

<!-- Source EN PDF p.340; unit 3738 -->

【Parameters】

<!-- Source EN PDF p.340; unit 3739 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| name | 3DLUT table name | Output |

<!-- Source EN PDF p.340; unit 3740 -->

【Return Value】

<!-- Source EN PDF p.340; unit 3741 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.340; unit 3742 -->

【Requirements】

<!-- Source EN PDF p.340; unit 3743 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.341; unit 3744 -->

Library file: librkaiq.so

<!-- Source EN PDF p.341; unit 3745 -->

【Example】

<!-- Source EN PDF p.341; unit 3746 -->

Refer to "sample_get_a3dlut_lutname" in sample_a3dlut_module.cpp to get the 3DLUT table name in automatic mode.

<!-- Source EN PDF p.341; unit 3747 -->

#### 9.13.3  Functional-level API data types

<!-- Source EN PDF p.341; unit 3748 -->

9.13.3.1  opMode_t

<!-- Source EN PDF p.341; unit 3749 -->

【Description】 Define the 3DLUT operating mode.

<!-- Source EN PDF p.341; unit 3750 -->

【Definition】

<!-- Source EN PDF p.341; unit 3751 -->

```text
 typedef enum opMode_e {
     OP_AUTO = 0,
     OP_MANUALl = 1,
     OP_INVAL
 } opMode_t;
```

<!-- Source EN PDF p.341; unit 3752 -->

【Member】

<!-- Source EN PDF p.341; unit 3753 -->

| Member Name | Description |
|---|---|
| OP_AUTO | Automatic mode |
| OP_MANUALl | Manual mode |
| OP_INVAL | Invalid value |

<!-- Source EN PDF p.341; unit 3754 -->

9.13.3.2  rk_aiq_lut3d_table_t

<!-- Source EN PDF p.341; unit 3755 -->

【Description】 Define a 3DLUT 3D lookup table.

<!-- Source EN PDF p.341; unit 3756 -->

【Definition】

<!-- Source EN PDF p.341; unit 3757 -->

```text
 typedef struct rk_aiq_lut3d_table_s{
     unsigned short look_up_table_r[729];
     unsigned short look_up_table_g[729];
     unsigned short look_up_table_b[729];
 } rk_aiq_lut3d_table_t;
```

<!-- Source EN PDF p.341; unit 3758 -->

【Member】

<!-- Source EN PDF p.342; unit 3759 -->

| Member Name | Description |
|---|---|
| look_up_table_r | R channel lookup table in manual mode;<br>value range: [0x0, 0x3ff] |
| look_up_table_g | G channel lookup table in manual mode;<br>value range: [0x0, 0xfff] |
| look_up_table_b | B-channel lookup table in manual mode;<br>value range: [0x0, 0x3ff] |

<!-- Source EN PDF p.342; unit 3760 -->

#### 9.13.4  Module-level API reference

<!-- Source EN PDF p.342; unit 3761 -->

9.13.4.1  rk_aiq_user_api2_a3dlut_SetAttrib

<!-- Source EN PDF p.342; unit 3762 -->

【Description】 Set the 3DLUT property.

<!-- Source EN PDF p.342; unit 3763 -->

【Grammar】

<!-- Source EN PDF p.342; unit 3764 -->

```text
 XCamReturn rk_aiq_user_api2_a3dlut_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_lut3d_attrib_t attr);
```

<!-- Source EN PDF p.342; unit 3765 -->

【Parameters】

<!-- Source EN PDF p.342; unit 3766 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | 3DLUT parameter properties | Input |

<!-- Source EN PDF p.342; unit 3767 -->

【Return Value】

<!-- Source EN PDF p.342; unit 3768 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.342; unit 3769 -->

【Requirements】

<!-- Source EN PDF p.342; unit 3770 -->

Header files: rk_aiq_user_api2_a3dlut.h, rk_aiq_uapi_a3dlut_int.h

<!-- Source EN PDF p.342; unit 3771 -->

Library file: librkaiq.so

<!-- Source EN PDF p.342; unit 3772 -->

【Example】

<!-- Source EN PDF p.342; unit 3773 -->

Refer to "sample_3dlut_set3dlutAttr" in sample_a3dlut_module.cpp to set the 3DLUT attribute.

<!-- Source EN PDF p.343; unit 3774 -->

9.13.4.2  rk_aiq_user_api2_a3dlut_GetAttrib

<!-- Source EN PDF p.343; unit 3775 -->

【Description】 Get the 3DLUT attribute.

<!-- Source EN PDF p.343; unit 3776 -->

【Grammar】

<!-- Source EN PDF p.343; unit 3777 -->

```text
 XCamReturn
 rk_aiq_user_api2_a3dlut_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_lut3d_attrib_t *attr);
```

<!-- Source EN PDF p.343; unit 3778 -->

【Parameters】

<!-- Source EN PDF p.343; unit 3779 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | 3DLUT parameter properties | Output |

<!-- Source EN PDF p.343; unit 3780 -->

【Return Value】

<!-- Source EN PDF p.343; unit 3781 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.343; unit 3782 -->

【Requirements】

<!-- Source EN PDF p.343; unit 3783 -->

Header files: rk_aiq_user_api2_a3dlut.h, rk_aiq_uapi_a3dlut_int.h

<!-- Source EN PDF p.343; unit 3784 -->

Library file: librkaiq.so

<!-- Source EN PDF p.343; unit 3785 -->

【Example】

<!-- Source EN PDF p.343; unit 3786 -->

Refer to "sample_3dlut_get3dlutAttr" etc. in sample_a3dlut_module.cpp to get 3DLUT attributes.

<!-- Source EN PDF p.343; unit 3787 -->

9.13.4.3  rk_aiq_user_api2_a3dlut_Query3dlutInfo

<!-- Source EN PDF p.343; unit 3788 -->

【Description】 Query 3DLUT information.

<!-- Source EN PDF p.343; unit 3789 -->

【Grammar】

<!-- Source EN PDF p.343; unit 3790 -->

```text
 XCamReturn
 rk_aiq_user_api2_a3dlut_Query3dlutInfo(const RkAiqAlgoContext *ctx,
 rk_aiq_lut3d_querry_info_t *lut3d_querry_info );
```

<!-- Source EN PDF p.343; unit 3791 -->

【Parameters】

<!-- Source EN PDF p.344; unit 3792 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| lut3d_querry_info | 3DLUT query content | Output |

<!-- Source EN PDF p.344; unit 3793 -->

【Return Value】

<!-- Source EN PDF p.344; unit 3794 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.344; unit 3795 -->

【Requirements】

<!-- Source EN PDF p.344; unit 3796 -->

Header files: rk_aiq_user_api2_a3dlut.h, rk_aiq_uapi_a3dlut_int.h

<!-- Source EN PDF p.344; unit 3797 -->

Library file: librkaiq.so

<!-- Source EN PDF p.344; unit 3798 -->

【Example】

<!-- Source EN PDF p.344; unit 3799 -->

Refer to "sample_query_a3dlut_info" in sample_a3dlut_module.cpp for 3DLUT information.

<!-- Source EN PDF p.344; unit 3800 -->

#### 9.13.5  Module-level API data types

<!-- Source EN PDF p.344; unit 3801 -->

9.13.5.1  rk_aiq_lut3d_op_mode_t

<!-- Source EN PDF p.344; unit 3802 -->

【Description】 Define the 3DLUT operating mode

<!-- Source EN PDF p.344; unit 3803 -->

【Definition】

<!-- Source EN PDF p.344; unit 3804 -->

```text
 typedef enum rk_aiq_lut3d_op_mode_s {
     RK_AIQ_LUT3D_MODE_INVALID                     = 0,
     RK_AIQ_LUT3D_MODE_MANUAL                      = 1,
     RK_AIQ_LUT3D_MODE_AUTO                        = 2,
     RK_AIQ_LUT3D_MODE_MAX
 } rk_aiq_lut3d_op_mode_t;
```

<!-- Source EN PDF p.344; unit 3805 -->

【Member】

<!-- Source EN PDF p.344; unit 3806 -->

| Member Name | Description |
|---|---|
| RK_AIQ_LUT3D_MODE_INVALID | 3DLUT invalid mode |
| RK_AIQ_LUT3D_MODE_MANUAL | 3DLUT Manual Mode |
| RK_AIQ_LUT3D_MODE_AUTO | 3DLUT Auto Mode |

<!-- Source EN PDF p.345; unit 3807 -->

9.13.5.2  rk_aiq_lut3d_mlut3d_attrib_t

<!-- Source EN PDF p.345; unit 3808 -->

【Description】 Define manual 3DLUT attributes

<!-- Source EN PDF p.345; unit 3809 -->

【Definition】

<!-- Source EN PDF p.345; unit 3810 -->

```text
 typedef struct rk_aiq_lut3d_mlut3d_attrib_s {
     unsigned short look_up_table_r[729];
     unsigned short look_up_table_g[729];
     unsigned short look_up_table_b[729];
 } rk_aiq_lut3d_mlut3d_attrib_t;
```

<!-- Source EN PDF p.345; unit 3811 -->

【Member】

<!-- Source EN PDF p.345; unit 3812 -->

| Member Name | Description |
|---|---|
| look_up_table_r | R channel lookup table in manual mode;<br>value range: [0x0, 0x3ff] |
| look_up_table_g | G channel lookup table in manual mode;<br>value range: [0x0, 0xfff] |
| look_up_table_b | B-channel lookup table in manual mode;<br>value range: [0x0, 0x3ff] |

<!-- Source EN PDF p.345; unit 3813 -->

9.13.5.3  rk_aiq_lut3d_attrib_t

<!-- Source EN PDF p.345; unit 3814 -->

【Description】 Define 3DLUT attributes

<!-- Source EN PDF p.345; unit 3815 -->

【Definition】

<!-- Source EN PDF p.345; unit 3816 -->

```text
 typedef struct rk_aiq_lut3d_attrib_s {
     rk_aiq_uapi_sync_t sync;
     bool byPass;
     rk_aiq_lut3d_op_mode_t mode;
     rk_aiq_lut3d_mlut3d_attrib_t stManual;
 } rk_aiq_lut3d_attrib_t;
```

<!-- Source EN PDF p.345; unit 3817 -->

【Member】

<!-- Source EN PDF p.346; unit 3818 -->

| Member<br>Name | Description |
|---|---|
| sync | Synchronous/asynchronous signals, refer to rk_aiq_uapi_sync_t definition description, see<br>**Overview/API Description" section |
| byPass | Skip module processing;<br>true skips 3DLUT, false 3DLUT enables |
| mode | working mode selection;<br>value range: {RK_AIQ_LUT3D_MODE_MANUAL,<br>RK_AIQ_LUT3D_MODE_AUTO}, indicating manual and automatic mode |
| stManual | Manual mode property parameter configuration |

<!-- Source EN PDF p.346; unit 3819 -->

9.13.5.4  rk_aiq_lut3d_querry_info_t

<!-- Source EN PDF p.346; unit 3820 -->

【Description】 Define 3DLUT query information

<!-- Source EN PDF p.346; unit 3821 -->

【Definition】

<!-- Source EN PDF p.346; unit 3822 -->

```text
 typedef struct rk_aiq_lut3d_querry_info_s {
     bool lut3d_en;
     float alpha;
     char name[25];
     unsigned short look_up_table_r[729];
     unsigned short look_up_table_g[729];
     unsigned short look_up_table_b[729];
 } rk_aiq_lut3d_querry_info_t;
```

<!-- Source EN PDF p.346; unit 3823 -->

【Member】

<!-- Source EN PDF p.346; unit 3824 -->

| Member Name | Description |
|---|---|
| lut3d_en | 3DLUT enabled;<br>true enabled, false not enabled |
| alpha | 3DLUT regulation intensity;<br>value range: [0, 1.0], the larger the value, the greater the intensity; 1.0 |
| name | 3DLUT table name, only automatic mode is supported |
| look_up_table_r | R channel lookup table;<br>value range: [0x0, 0x3ff] |
| look_up_table_g | G channel lookup table;<br>value range: [0x0, 0xfff] |
| look_up_table_b | B-channel lookup table;<br>value range: [0x0, 0x3ff] |

<!-- Source EN PDF p.347; unit 3825 -->

### 9.14   LDCH

<!-- Source EN PDF p.347; unit 3826 -->

#### 9.14.1  Description of the feature

<!-- Source EN PDF p.347; unit 3827 -->

LDCH performs a restorative treatment on images with distortion, and the module only corrects image distortion in the horizontal direction.

<!-- Source EN PDF p.347; unit 3828 -->

#### 9.14.2  Functional level API reference

<!-- Source EN PDF p.347; unit 3829 -->

9.14.2.1  rk_aiq_uapi_setLdchEn

<!-- Source EN PDF p.347; unit 3830 -->

【Description】 Horizontal distortion correction function switch.

<!-- Source EN PDF p.347; unit 3831 -->

【Grammar】

<!-- Source EN PDF p.347; unit 3832 -->

```text
 XCamReturn rk_aiq_uapi2_setLdchEn(const rk_aiq_sys_ctx_t* ctx, bool en);
```

<!-- Source EN PDF p.347; unit 3833 -->

【Parameters】

<!-- Source EN PDF p.347; unit 3834 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| en | Correction switch | Input |

<!-- Source EN PDF p.347; unit 3835 -->

【Return Value】

<!-- Source EN PDF p.347; unit 3836 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.347; unit 3837 -->

【Requirements】

<!-- Source EN PDF p.347; unit 3838 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.347; unit 3839 -->

Library file: librkaiq.so

<!-- Source EN PDF p.347; unit 3840 -->

9.14.2.2  rk_aiq_uapi2_setLdchCorrectLevel

<!-- Source EN PDF p.347; unit 3841 -->

【Description】 Set the level of horizontal distortion correction.

<!-- Source EN PDF p.347; unit 3842 -->

【Grammar】

<!-- Source EN PDF p.347; unit 3843 -->

```text
 XCamReturn rk_aiq_uapi2_setLdchCorrectLevel(const rk_aiq_sys_ctx_t* ctx, int
 correctLevel);
```

<!-- Source EN PDF p.347; unit 3844 -->

【Parameters】

<!-- Source EN PDF p.348; unit 3845 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| correctLevel | Correction level, value range: [0~255] | Input |

<!-- Source EN PDF p.348; unit 3846 -->

【Return Value】

<!-- Source EN PDF p.348; unit 3847 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.348; unit 3848 -->

【Requirements】

<!-- Source EN PDF p.348; unit 3849 -->

Header file: rk_aiq_user_api2_imgproc.h

<!-- Source EN PDF p.348; unit 3850 -->

Library file: librkaiq.so

<!-- Source EN PDF p.348; unit 3851 -->

#### 9.14.3  Module-level API reference

<!-- Source EN PDF p.348; unit 3852 -->

9.14.3.1  rk_aiq_user_api2_aldch_SetAttrib

<!-- Source EN PDF p.348; unit 3853 -->

【Description】 Set the FEC property.

<!-- Source EN PDF p.348; unit 3854 -->

【Grammar】

<!-- Source EN PDF p.348; unit 3855 -->

```text
 XCamReturn
 rk_aiq_user_api2_aldch_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_ldch_attrib_t attr);
```

<!-- Source EN PDF p.348; unit 3856 -->

【Parameters】

<!-- Source EN PDF p.348; unit 3857 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | ldch's parameter attribute | Input |

<!-- Source EN PDF p.348; unit 3858 -->

【Return Value】

<!-- Source EN PDF p.348; unit 3859 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.348; unit 3860 -->

【Requirements】

<!-- Source EN PDF p.348; unit 3861 -->

Header file: rk_aiq_user_api2_aldch.h

<!-- Source EN PDF p.348; unit 3862 -->

Library file: librkaiq.so

<!-- Source EN PDF p.349; unit 3863 -->

9.14.3.2  rk_aiq_user_api2_aldch_GetAttrib

<!-- Source EN PDF p.349; unit 3864 -->

【Description】 Gets the FEC attribute.

<!-- Source EN PDF p.349; unit 3865 -->

【Grammar】

<!-- Source EN PDF p.349; unit 3866 -->

```text
 XCamReturn
 rk_aiq_user_api2_aldch_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_ldch_attrib_t attr);
```

<!-- Source EN PDF p.349; unit 3867 -->

【Parameters】

<!-- Source EN PDF p.349; unit 3868 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | ldch's parameter attribute | Input |

<!-- Source EN PDF p.349; unit 3869 -->

【Return Value】

<!-- Source EN PDF p.349; unit 3870 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.349; unit 3871 -->

【Requirements】

<!-- Source EN PDF p.349; unit 3872 -->

Header file: rk_aiq_user_api2_aldch.h

<!-- Source EN PDF p.349; unit 3873 -->

Library file: librkaiq.so

<!-- Source EN PDF p.349; unit 3874 -->

#### 9.14.4  Module-level API data types

<!-- Source EN PDF p.349; unit 3875 -->

9.14.4.1  rk_aiq_ldch_attrib_t

<!-- Source EN PDF p.349; unit 3876 -->

【Description】 ldch attribute configuration

<!-- Source EN PDF p.349; unit 3877 -->

【Definition】

<!-- Source EN PDF p.349; unit 3878 -->

```text
 typedef struct rk_aiq_ldch_cfg_s {
     rk_aiq_uapi_sync_t sync;
     unsigned int en;
     int correct_level;
 } rk_aiq_ldch_cfg_t;
```

<!-- Source EN PDF p.349; unit 3879 -->

【Member】

<!-- Source EN PDF p.350; unit 3880 -->

| Member<br>Name | Description |
|---|---|
| sync | Interface synchronous/asynchronous functionality, refer to rk_aiq_uapi_sync_t definition<br>description, see **Overview/API Description" section |
| en | Enable/disable ldch |
| correct_level | Set the LDCH correction level: [0~255] |

<!-- Source EN PDF p.350; unit 3881 -->

### 9.15   DeBayer

<!-- Source EN PDF p.350; unit 3882 -->

#### 9.15.1  Description of the feature

<!-- Source EN PDF p.350; unit 3883 -->

DeBayer completes the image with CFA attributes collected by the sensor to be restored into an RGB image with full pixel information through an interpolation algorithm.

<!-- Source EN PDF p.350; unit 3884 -->

The module supports Bayer raw data and includes four pattern modes: RGGB, BGGR, GRBG, and gbrg. Other CFA data, such as CCCB, RGB-IR and other CFAs, are not supported at the moment.

<!-- Source EN PDF p.350; unit 3885 -->

#### 9.15.2  Module-level API reference

<!-- Source EN PDF p.350; unit 3886 -->

9.15.2.1  rk_aiq_user_api_adebayer_SetAttrib

<!-- Source EN PDF p.350; unit 3887 -->

【Description】 Set the demosaic property.

<!-- Source EN PDF p.350; unit 3888 -->

【Grammar】

<!-- Source EN PDF p.350; unit 3889 -->

```text
 XCamReturn
 rk_aiq_user_api2_adebayer_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 adebayer_attrib_t attr);
```

<!-- Source EN PDF p.350; unit 3890 -->

【Parameters】

<!-- Source EN PDF p.350; unit 3891 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | Go to the mosaic properties | Input |

<!-- Source EN PDF p.350; unit 3892 -->

【Return Value】

<!-- Source EN PDF p.350; unit 3893 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.350; unit 3894 -->

【Requirements】

<!-- Source EN PDF p.351; unit 3895 -->

Header file: rk_aiq_user_api2_adebayer.h

<!-- Source EN PDF p.351; unit 3896 -->

Library file: librkaiq.so

<!-- Source EN PDF p.351; unit 3897 -->

9.15.2.2  rk_aiq_user_api_adebayer_GetAttrib

<!-- Source EN PDF p.351; unit 3898 -->

【Description】 Get the demosaic property.

<!-- Source EN PDF p.351; unit 3899 -->

【Grammar】

<!-- Source EN PDF p.351; unit 3900 -->

```text
 XCamReturn
 rk_aiq_user_api2_adebayer_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 adebayer_attrib_t *attr);
```

<!-- Source EN PDF p.351; unit 3901 -->

【Parameters】

<!-- Source EN PDF p.351; unit 3902 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | Go to the mosaic properties | Output |

<!-- Source EN PDF p.351; unit 3903 -->

【Return Value】

<!-- Source EN PDF p.351; unit 3904 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.351; unit 3905 -->

【Requirements】

<!-- Source EN PDF p.351; unit 3906 -->

Header file: rk_aiq_uapi2_adebayer_int.h

<!-- Source EN PDF p.351; unit 3907 -->

Library file: librkaiq.so

<!-- Source EN PDF p.351; unit 3908 -->

#### 9.15.3  Data type

<!-- Source EN PDF p.351; unit 3909 -->

9.15.3.1  rk_aiq_debayer_op_mode_t

<!-- Source EN PDF p.351; unit 3910 -->

【Description】 Define the debayer mode of operation.

<!-- Source EN PDF p.351; unit 3911 -->

【Definition】

<!-- Source EN PDF p.352; unit 3912 -->

```text
 typedef enum rk_aiq_debayer_op_mode_s {
     RK_AIQ_DEBAYER_MODE_INVALID                     = 0,        /**<
 initialization value */
     RK_AIQ_DEBAYER_MODE_MANUAL                      = 1,        /**< run manual
 lens shading correction */
     RK_AIQ_DEBAYER_MODE_AUTO                        = 2,        /**< run auto
 lens shading correction */
     RK_AIQ_DEBAYER_MODE_MAX
 } rk_aiq_debayer_op_mode_t;
```

<!-- Source EN PDF p.352; unit 3913 -->

【Member】

<!-- Source EN PDF p.352; unit 3914 -->

| Member Name | Description |
|---|---|
| RK_AIQ_DEBAYER_MODE_INVALID | Debayer invalid mode |
| RK_AIQ_DEBAYER_MODE_MANUAL | Debayer manual mode |
| RK_AIQ_DEBAYER_MODE_AUTO | Debayer automatic mode |

<!-- Source EN PDF p.352; unit 3915 -->

9.15.3.2  adebayer_attrib_manual_t

<!-- Source EN PDF p.352; unit 3916 -->

【Description】 Define configurable properties in debayer manual mode.

<!-- Source EN PDF p.352; unit 3917 -->

【Definition】

<!-- Source EN PDF p.352; unit 3918 -->

```text
 typedef struct adebayer_attrib_manual_s {
     int8_t      filter1[5];
     int8_t      filter2[5];
     uint8_t     gain_offset;
     uint8_t     sharp_strength;
     uint8_t     hf_offset;
     uint8_t     offset;
     uint8_t     clip_en;
     uint8_t     filter_g_en;
     uint8_t     filter_c_en;
     uint8_t     thed0;
     uint8_t     thed1;
     uint8_t     dist_scale;
     uint8_t     cnr_strength;
     uint8_t     shift_num;
 } adebayer_attrib_manual_t;
```

<!-- Source EN PDF p.352; unit 3919 -->

【Member】

<!-- Source EN PDF p.353; unit 3920 -->

| Member<br>Name | Description |
|---|---|
| filter1 | Low-frequency gradient filter.<br>Value range: [-8,7] |
| filter2 | High-frequency gradient filters.<br>Value range: [-8,7] |
| gain_offset | Calculate the offset of the gradient when sharpening the weights in the G-channel<br>interpolation coefficient.<br>Value range: [0,15] |
| sharp_strength | The G-channel interpolates the sharpening force, and the higher the value, the greater<br>the sharpening force.<br>Valid values: [0,4] |
| hf_offset | Interpolation directivity control: Flat areas are prone to pseudo-textures with smaller<br>values, and larger values are more likely to be aliased at edges.<br>Value range: [0,4095] |
| offset | Offset of the G-channel clip. The higher the value, the larger the clip range. Value range:<br>[0,65535] |
| clip_en | G-channel interpolation clip switch, 0: off, 1: on; |
| filter_g_en | G-channel scatter removal switch, 0: off, 1: on; |
| filter_c_en | False color removal switch, 0: off, 1: on; |
| thed0 | The higher the value, the smaller the probability of selecting the high-frequency weight.<br>Value range: [0,16] |
| thed1 | Control the selection of high and low frequency weights, the higher the value, the<br>smaller the probability of selecting low frequency weights. Value range: [0,16] |
| dist_scale | The higher the value, the smaller the probability of selecting the high-frequency weight.<br>Value range: [0,16] |
| cnr_strength | The higher the value, the greater the force. Valid values: [0,9] |
| shift_num | The smaller the value, the larger the range of the chromatic aberration clip. The value<br>range is [0,4] |

<!-- Source EN PDF p.353; unit 3921 -->

9.15.3.3  adebayer_attrib_auto_t

<!-- Source EN PDF p.353; unit 3922 -->

【Description】 Define configurable properties in debayer automatic mode.

<!-- Source EN PDF p.353; unit 3923 -->

【Definition】

<!-- Source EN PDF p.354; unit 3924 -->

```text
 typedef struct adebayer_attrib_auto_s {
     uint8_t     sharp_strength[9];
     uint8_t     low_freq_thresh;
     uint8_t     high_freq_thresh;
 } adebayer_attrib_auto_t;
```

<!-- Source EN PDF p.354; unit 3925 -->

【Member】

<!-- Source EN PDF p.354; unit 3926 -->

| Member Name | Description |
|---|---|
| enhance_strength[9] | Detail texture enhancement at different ISOs<br>index 0 - ISO 50<br>index 1 - ISO 100<br>index 2 - ISO 200<br>index 3 - ISO 400<br>index 4 - ISO 800<br>index 5 - ISO 1600<br>index 6 - ISO 3200<br>index 7 - ISO 6400<br>index 8 - ISO 12800<br>The higher the value, the better the detail and clarity, and the more pseudo-detail<br>will be enhanced<br>Value range: [0~7] |
| low_freq_thresh | Low-frequency weight selection threshold.<br>The higher the value, the smaller the probability of selecting a low-frequency<br>weight.<br>Value range: [0~15] |
| high_freq_thresh | High-frequency weight selection threshold.<br>The higher the value, the smaller the probability of selecting a high-frequency<br>weight.<br>Value range: [0~15] |

<!-- Source EN PDF p.354; unit 3927 -->

9.15.3.4  adebayer_attrib_t

<!-- Source EN PDF p.354; unit 3928 -->

【Description】 Define debayer configurable attributes.

<!-- Source EN PDF p.354; unit 3929 -->

【Definition】

<!-- Source EN PDF p.354; unit 3930 -->

```text
 typedef struct adebayer_attrib_s {
     rk_aiq_uapi_sync_t          sync;
     uint8_t                     enable;
     rk_aiq_debayer_op_mode_t    mode;
     adebayer_attrib_manual_t    stManual;
     adebayer_attrib_auto_t      stAuto;
 } adebayer_attrib_t;
```

<!-- Source EN PDF p.354; unit 3931 -->

【Member】

<!-- Source EN PDF p.355; unit 3932 -->

| Member<br>Name | Description |
|---|---|
| sync | For details about the synchronous/asynchronous interface mode, rk_aiq_uapi_sync_t see<br>Overview/API Description |
| enable | The debayer module enables the switch, 0: bypass, 1: on; |
| mode | Debayer working mode |
| stManual | Debaye configuration properties in manual control mode |
| stAuto | Configuration properties in debayer auto-control mode |

<!-- Source EN PDF p.355; unit 3933 -->

### 9.16   DPCC

<!-- Source EN PDF p.355; unit 3934 -->

#### 9.16.1  Description of the feature

<!-- Source EN PDF p.355; unit 3935 -->

Detect and eliminate dead pixels in images. For details, please refer to the "Function Description" in Section 4.6 "DPCC" of the Rockchip_Tuning_Guide_ISP30 document.

<!-- Source EN PDF p.355; unit 3936 -->

#### 9.16.2  Module-level API reference

<!-- Source EN PDF p.355; unit 3937 -->

9.16.2.1  rk_aiq_user_api2_adpcc_SetAttrib

<!-- Source EN PDF p.355; unit 3938 -->

【Description】 Set DPCC software properties.

<!-- Source EN PDF p.355; unit 3939 -->

【Grammar】

<!-- Source EN PDF p.355; unit 3940 -->

```text
 XCamReturn
 rk_aiq_user_api2_adpcc_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_dpcc_attrib_V20_t *attr);
```

<!-- Source EN PDF p.355; unit 3941 -->

【Parameters】

<!-- Source EN PDF p.355; unit 3942 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | DPCC Software Properties Structure | Input |

<!-- Source EN PDF p.355; unit 3943 -->

【Return Value】

<!-- Source EN PDF p.355; unit 3944 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.356; unit 3945 -->

【Requirements】

<!-- Source EN PDF p.356; unit 3946 -->

Header file: rk_aiq_user_api2_adpcc.h

<!-- Source EN PDF p.356; unit 3947 -->

Library file: librkaiq.so

<!-- Source EN PDF p.356; unit 3948 -->

【Description】

<!-- Source EN PDF p.356; unit 3949 -->

9.16.2.2  rk_aiq_user_api2_adpcc_GetAttrib

<!-- Source EN PDF p.356; unit 3950 -->

【Description】 Gets the DPCC software properties.

<!-- Source EN PDF p.356; unit 3951 -->

【Grammar】

<!-- Source EN PDF p.356; unit 3952 -->

```text
 XCamReturn
 rk_aiq_user_api2_adpcc_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_dpcc_attrib_V20_t *attr);
```

<!-- Source EN PDF p.356; unit 3953 -->

【Parameters】

<!-- Source EN PDF p.356; unit 3954 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | DPCC Software Properties Structure | Output |

<!-- Source EN PDF p.356; unit 3955 -->

【Return Value】

<!-- Source EN PDF p.356; unit 3956 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.356; unit 3957 -->

【Requirements】

<!-- Source EN PDF p.356; unit 3958 -->

Header file: rk_aiq_user_api2_adpcc.h

<!-- Source EN PDF p.356; unit 3959 -->

Library file: librkaiq.so

<!-- Source EN PDF p.356; unit 3960 -->

【Description】

<!-- Source EN PDF p.356; unit 3961 -->

#### 9.16.3  Data type

<!-- Source EN PDF p.356; unit 3962 -->

9.16.3.1  rk_aiq_dpcc_attrib_V20_t

<!-- Source EN PDF p.356; unit 3963 -->

【Description】 Define the dead pixel elimination attribute.

<!-- Source EN PDF p.356; unit 3964 -->

【Definition】

<!-- Source EN PDF p.357; unit 3965 -->

```text
 typedef struct rk_aiq_dpcc_attrib_V20_s {
     AdpccOPMode_t eMode;
     Adpcc_Auto_Attr_t stAuto;
     Adpcc_Manual_Attr_t stManual;
     rk_aiq_uapi_sync_t sync;
 } rk_aiq_dpcc_attrib_V20_t;
```

<!-- Source EN PDF p.357; unit 3966 -->

【Member】

<!-- Source EN PDF p.357; unit 3967 -->

| Member<br>Name | Description |
|---|---|
| eMode | Define the DPCC operating mode, see AdpccOPMode_t for details |
| stAuto | Parameter setting for automatic mode |
| stManual | Parameter setting for manual mode |
| sync | Interface synchronous/asynchronous functionality, refer to rk_aiq_uapi_sync_t definition<br>description, see Overview/API Description section |

<!-- Source EN PDF p.357; unit 3968 -->

9.16.3.2  AdpccOPMode_t

<!-- Source EN PDF p.357; unit 3969 -->

【Description】 Define the DPCC operating mode

<!-- Source EN PDF p.357; unit 3970 -->

【Definition】

<!-- Source EN PDF p.357; unit 3971 -->

```text
 typedef enum AdpccOPMode_e {
     ADPCC_OP_MODE_INVALID        = 0,
     ADPCC_OP_MODE_AUTO           = 1,
     ADPCC_OP_MODE_MANUAL         = 2,
     ADPCC_OP_MODE_TOOL           = 3,
     ADPCC_OP_MODE_MAX
 } AdpccOPMode_t;
```

<!-- Source EN PDF p.357; unit 3972 -->

【Member】

<!-- Source EN PDF p.357; unit 3973 -->

| Member Name | Description |
|---|---|
| ADPCC_OP_MODE_INVALID | Invalid API pattern |
| ADPCC_OP_MODE_AUTO | API Auto Mode |
| ADPCC_OP_MODE_MANUAL | API Manual Mode |
| ADPCC_OP_MODE_TOOL | API Tool Mode |
| ADPCC_OP_MODE_MAX |  |

<!-- Source EN PDF p.358; unit 3974 -->

9.16.3.3  Adpcc_basic_params_select_t

<!-- Source EN PDF p.358; unit 3975 -->

【Description】 Define DPCC basic parameter properties

<!-- Source EN PDF p.358; unit 3976 -->

【Definition】

<!-- Source EN PDF p.358; unit 3977 -->

```text
 typedef struct Adpcc_basic_params_select_s
 {
     int           iso;
     unsigned char stage1_enable;
     unsigned char grayscale_mode;
     unsigned char enable;
     unsigned char sw_rk_out_sel;
     unsigned char sw_dpcc_output_sel;
     unsigned char stage1_rb_3x3;
     unsigned char stage1_g_3x3;
     unsigned char stage1_incl_rb_center;
     unsigned char stage1_incl_green_center;
     unsigned char stage1_use_fix_set;
     unsigned char stage1_use_set_3;
     unsigned char stage1_use_set_2;
     unsigned char stage1_use_set_1;
     unsigned char sw_rk_red_blue1_en;
     unsigned char rg_red_blue1_enable;
     unsigned char rnd_red_blue1_enable;
     unsigned char ro_red_blue1_enable;
     unsigned char lc_red_blue1_enable;
     unsigned char pg_red_blue1_enable;
     unsigned char sw_rk_green1_en;
     unsigned char rg_green1_enable;
     unsigned char rnd_green1_enable;
     unsigned char ro_green1_enable;
     unsigned char lc_green1_enable;
     unsigned char pg_green1_enable;
     unsigned char sw_rk_red_blue2_en;
     unsigned char rg_red_blue2_enable;
     unsigned char rnd_red_blue2_enable;
     unsigned char ro_red_blue2_enable;
     unsigned char lc_red_blue2_enable;
     unsigned char pg_red_blue2_enable;
     unsigned char sw_rk_green2_en;
     unsigned char rg_green2_enable;
     unsigned char rnd_green2_enable;
     unsigned char ro_green2_enable;
     unsigned char lc_green2_enable;
     unsigned char pg_green2_enable;
     unsigned char sw_rk_red_blue3_en;
     unsigned char rg_red_blue3_enable;
     unsigned char rnd_red_blue3_enable;
     unsigned char ro_red_blue3_enable;
     unsigned char lc_red_blue3_enable;
     unsigned char pg_red_blue3_enable;
     unsigned char sw_rk_green3_en;
     unsigned char rg_green3_enable;
     unsigned char rnd_green3_enable;
     unsigned char ro_green3_enable;
     unsigned char lc_green3_enable;
     unsigned char pg_green3_enable;
     unsigned char sw_mindis1_rb;
     unsigned char sw_mindis1_g;
     unsigned char line_thr_1_rb;
     unsigned char line_thr_1_g;
     unsigned char sw_dis_scale_min1;
     unsigned char sw_dis_scale_max1;
     unsigned char line_mad_fac_1_rb;
     unsigned char line_mad_fac_1_g;
     unsigned char pg_fac_1_rb;
     unsigned char pg_fac_1_g;
     unsigned char rnd_thr_1_rb;
     unsigned char rnd_thr_1_g;
     unsigned char rg_fac_1_rb;
     unsigned char rg_fac_1_g;
     unsigned char sw_mindis2_rb;
     unsigned char sw_mindis2_g;
     unsigned char line_thr_2_rb;
     unsigned char line_thr_2_g;
     unsigned char sw_dis_scale_min2;
     unsigned char sw_dis_scale_max2;
     unsigned char line_mad_fac_2_rb;
     unsigned char line_mad_fac_2_g;
     unsigned char pg_fac_2_rb;
     unsigned char pg_fac_2_g;
     unsigned char rnd_thr_2_rb;
     unsigned char rnd_thr_2_g;
     unsigned char rg_fac_2_rb;
     unsigned char rg_fac_2_g;
     unsigned char sw_mindis3_rb;
     unsigned char sw_mindis3_g;
     unsigned char line_thr_3_rb;
     unsigned char line_thr_3_g;
     unsigned char sw_dis_scale_min3;
     unsigned char sw_dis_scale_max3;
     unsigned char line_mad_fac_3_rb;
     unsigned char line_mad_fac_3_g;
     unsigned char pg_fac_3_rb;
     unsigned char pg_fac_3_g;
     unsigned char rnd_thr_3_rb;
     unsigned char rnd_thr_3_g;
     unsigned char rg_fac_3_rb;
     unsigned char rg_fac_3_g;
     unsigned char ro_lim_3_rb;
     unsigned char ro_lim_3_g;
     unsigned char ro_lim_2_rb;
     unsigned char ro_lim_2_g;
     unsigned char ro_lim_1_rb;
     unsigned char ro_lim_1_g;
     unsigned char rnd_offs_3_rb;
     unsigned char rnd_offs_3_g;
     unsigned char rnd_offs_2_rb;
     unsigned char rnd_offs_2_g;
     unsigned char rnd_offs_1_rb;
     unsigned char rnd_offs_1_g;
 } Adpcc_basic_params_select_t;
```

<!-- Source EN PDF p.360; unit 3978 -->

9.16.3.4  Adpcc_basic_params_t

<!-- Source EN PDF p.360; unit 3979 -->

【Description】 Define DPCC basic parameter properties

<!-- Source EN PDF p.360; unit 3980 -->

【Definition】

<!-- Source EN PDF p.360; unit 3981 -->

```text
 typedef struct Adpcc_basic_params_s
 {
     Adpcc_basic_params_select_t arBasic[DPCC_MAX_ISO_LEVEL];
 } Adpcc_basic_params_t;
```

<!-- Source EN PDF p.360; unit 3982 -->

【Member】

<!-- Source EN PDF p.360; unit 3983 -->

| Member Name | Description |
|---|---|
| arBasic | The basic parameters of DPCC are |

<!-- Source EN PDF p.360; unit 3984 -->

9.16.3.5  Adpcc_bpt_params_t

<!-- Source EN PDF p.360; unit 3985 -->

【Description】 Define automatic DPCC properties

<!-- Source EN PDF p.360; unit 3986 -->

【Definition】

<!-- Source EN PDF p.360; unit 3987 -->

```text
 typedef struct Adpcc_bpt_params_s
 {
     unsigned char      bpt_rb_3x3;
     unsigned char      bpt_g_3x3;
     unsigned char      bpt_incl_rb_center;
     unsigned char      bpt_incl_green_center;
     unsigned char      bpt_use_fix_set;
     unsigned char      bpt_use_set_3;
     unsigned char      bpt_use_set_2;
     unsigned char      bpt_use_set_1;
     unsigned char      bpt_cor_en;
     unsigned char      bpt_det_en;
     unsigned short int bp_number;
     unsigned short int bp_table_addr;
     unsigned short int bpt_v_addr;
     unsigned short int bpt_h_addr;
     unsigned int       bp_cnt;
 } Adpcc_bpt_params_t;
```

<!-- Source EN PDF p.361; unit 3988 -->

9.16.3.6  dpcc_pdaf_point_t

<!-- Source EN PDF p.361; unit 3989 -->

【Description】

<!-- Source EN PDF p.361; unit 3990 -->

【Definition】

<!-- Source EN PDF p.361; unit 3991 -->

```text
 typedef struct dpcc_pdaf_point_s
 {
     unsigned char y;
     unsigned char x;
 } dpcc_pdaf_point_t;
```

<!-- Source EN PDF p.361; unit 3992 -->

The module is not yet implemented

<!-- Source EN PDF p.361; unit 3993 -->

9.16.3.7  Adpcc_pdaf_params_t

<!-- Source EN PDF p.361; unit 3994 -->

【Description】 Define PDAF mode properties in automatic mode

<!-- Source EN PDF p.361; unit 3995 -->

【Definition】

<!-- Source EN PDF p.361; unit 3996 -->

```text
 typedef struct Adpcc_pdaf_params_s
 {
     unsigned char      sw_pdaf_en;
     unsigned char      pdaf_point_en[DPCC_PDAF_POINT_NUM];
     unsigned short int pdaf_offsety;
     unsigned short int pdaf_offsetx;
     unsigned char      pdaf_wrapy;
     unsigned char      pdaf_wrapx;
     unsigned short int pdaf_wrapy_num;
     unsigned short int pdaf_wrapx_num;
     dpcc_pdaf_point_t  point[DPCC_PDAF_POINT_NUM];
     unsigned char      pdaf_forward_med;
 } Adpcc_pdaf_params_t;
```

<!-- Source EN PDF p.361; unit 3997 -->

The module is not yet implemented.

<!-- Source EN PDF p.361; unit 3998 -->

9.16.3.8  CalibDb_Dpcc_Fast_Mode_t

<!-- Source EN PDF p.361; unit 3999 -->

【Description】 Defines the Fast mode property in automatic mode

<!-- Source EN PDF p.361; unit 4000 -->

【Definition】

<!-- Source EN PDF p.362; unit 4001 -->

```text
 typedef struct CalibDb_Dpcc_Fast_Mode_s
 {
     int fast_mode_en;
     int ISO[CALIBDB_DPCC_MAX_ISO_LEVEL];
     int fast_mode_single_en;
     int fast_mode_single_level[CALIBDB_DPCC_MAX_ISO_LEVEL];
     int fast_mode_double_en;
     int fast_mode_double_level[CALIBDB_DPCC_MAX_ISO_LEVEL];
     int fast_mode_triple_en;
     int fast_mode_triple_level[CALIBDB_DPCC_MAX_ISO_LEVEL];
 } CalibDb_Dpcc_Fast_Mode_t;
```

<!-- Source EN PDF p.362; unit 4002 -->

【Member】

<!-- Source EN PDF p.362; unit 4003 -->

| Member name | Description |
|---|---|
| Fast_mode_enable | Fast_mode switch function, 0: off, 1: on |
| ISO | Environmental ISO |
| fast_mode_single_en | Single dead pixel removal switch, 0: off, 1: on |
| fast_mode_single_level | Single dead pixel removal force, value range [0, 10] |
| fast_mode_double_en | Double dead pixel removal switch, 0: off, 1: on |
| fast_mode_double_level | Double dead pixel removal force, value range [0, 10] |
| fast_mode_triple_en | Multi-dead pixel removal switch, 0: off, 1: on |
| fast_mode_triple_level | Multiple dead pixel removal force, value range [0, 10] |

<!-- Source EN PDF p.362; unit 4004 -->

9.16.3.9  CalibDb_Dpcc_Sensor_t

<!-- Source EN PDF p.362; unit 4005 -->

【Description】 Defines the Fast mode property in automatic mode

<!-- Source EN PDF p.362; unit 4006 -->

【Definition】

<!-- Source EN PDF p.362; unit 4007 -->

```text
 typedef struct CalibDb_Dpcc_Sensor_s
 {
     float en;
     float max_level;
     float iso[CALIBDB_DPCC_MAX_ISO_LEVEL];
     float level_single[CALIBDB_DPCC_MAX_ISO_LEVEL];
     float level_multiple[CALIBDB_DPCC_MAX_ISO_LEVEL];
 } CalibDb_Dpcc_Sensor_t;
```

<!-- Source EN PDF p.362; unit 4008 -->

【Member】

<!-- Source EN PDF p.363; unit 4009 -->

| Member name | Description |
|---|---|
| en | Sensor DPCC switch function, 0: off, 1: on |
| max_level | Maximum force to remove dead pixels |
| iso | Environmental ISO |
| level_single | Remove individual dead pixel force |
| level_multiple | Remove multiple dead pixel forces |

<!-- Source EN PDF p.363; unit 4010 -->

9.16.3.10  Adpcc_bpt_params_select_t

<!-- Source EN PDF p.363; unit 4011 -->

【Description】 Defines the Fast mode property selected in automatic mode

<!-- Source EN PDF p.363; unit 4012 -->

【Definition】

<!-- Source EN PDF p.363; unit 4013 -->

```text
 typedef Adpcc_bpt_params_t Adpcc_bpt_params_select_t;
```

<!-- Source EN PDF p.363; unit 4014 -->

9.16.3.11  Adpcc_pdaf_params_select_t

<!-- Source EN PDF p.363; unit 4015 -->

【Description】 Defines the PDAF mode properties selected in automatic mode

<!-- Source EN PDF p.363; unit 4016 -->

【Definition】

<!-- Source EN PDF p.363; unit 4017 -->

```text
 typedef Adpcc_pdaf_params_t Adpcc_pdaf_params_select_t
```

<!-- Source EN PDF p.363; unit 4018 -->

9.16.3.12  Adpcc_Auto_Attr_t

<!-- Source EN PDF p.363; unit 4019 -->

【Description】 Define automatic DPCC properties

<!-- Source EN PDF p.363; unit 4020 -->

【Definition】

<!-- Source EN PDF p.363; unit 4021 -->

```text
 typedef struct Adpcc_Auto_Attr_s
 {
     Adpcc_basic_params_t        stBasicParams;
     Adpcc_bpt_params_t          stBptParams;
     Adpcc_pdaf_params_t         stPdafParams;
     CalibDb_Dpcc_Fast_Mode_t    stFastMode;
     CalibDb_Dpcc_Sensor_t       stSensorDpcc;
     Adpcc_basic_params_select_t stBasicSelect;
     Adpcc_bpt_params_select_t   stBptSelect;
     Adpcc_pdaf_params_select_t  stPdafSelect;
 } Adpcc_Auto_Attr_t;
```

<!-- Source EN PDF p.363; unit 4022 -->

【Member】

<!-- Source EN PDF p.364; unit 4023 -->

| Member Name | Description |
|---|---|
| stBasicParams | Basic parameters in automatic mode |
| stBptParams | Dead pixel parameter in automatic mode |
| stPdafParams | Automatic mode PDAF mode parameters |
| stFastMode | Automatic mode quick mode parameter |
| stSensorDpcc | Sensor dead pixel function parameters in automatic mode |
| stBasicSelect | Basic parameters selected in automatic mode |
| stBptSelect | Dead pixel parameter selected in automatic mode |
| stPdafSelect | The PDAF mode parameter selected in automatic mode |

<!-- Source EN PDF p.364; unit 4024 -->

9.16.3.13  Adpcc_fast_mode_attr_t

<!-- Source EN PDF p.364; unit 4025 -->

【Description】 Defines the Quick Mode property in manual mode

<!-- Source EN PDF p.364; unit 4026 -->

【Definition】

<!-- Source EN PDF p.364; unit 4027 -->

```text
 typedef struct Adpcc_fast_mode_attr_s
 {
     bool fast_mode_en;
     bool fast_mode_single_en;
     int  fast_mode_single_level;
     bool fast_mode_double_en;
     int  fast_mode_double_level;
     bool fast_mode_triple_en;
     int  fast_mode_triple_level;
 } Adpcc_fast_mode_attr_t;
```

<!-- Source EN PDF p.364; unit 4028 -->

【Member】

<!-- Source EN PDF p.364; unit 4029 -->

| Member name | Description |
|---|---|
| Fast_mode_en | Fast_mode switch function |
| fast_mode_single_en | Single dead pixel removal switch |
| fast_mode_single_level | Single dead pixel removal force, value range [0, 10] |
| fast_mode_double_en | Double dead pixel removal switch |
| fast_mode_double_level | Double dead pixel removal force, value range [0, 10] |
| fast_mode_triple_en | Multi-dead pixel removal switch |
| fast_mode_triple_level | Multiple dead pixel removal force, value range [0, 10] |

<!-- Source EN PDF p.365; unit 4030 -->

9.16.3.14  Adpcc_sensor_dpcc_attr_t

<!-- Source EN PDF p.365; unit 4031 -->

【Description】 Defines the Sensor dead pixel feature properties in manual mode

<!-- Source EN PDF p.365; unit 4032 -->

【Definition】

<!-- Source EN PDF p.365; unit 4033 -->

```text
 typedef struct Adpcc_sensor_dpcc_attr_s
 {
     bool en;
     int  max_level;
     int  single_level;
     int  double_level;
 } Adpcc_sensor_dpcc_attr_t;
```

<!-- Source EN PDF p.365; unit 4034 -->

【Member】

<!-- Source EN PDF p.365; unit 4035 -->

| Member name | Description |
|---|---|
| en | Sensor dpcc switch function |
| max_level | Maximum force to remove dead pixels |
| single_level | Remove individual dead pixel force |
| double_level | Remove multiple dead pixel forces |

<!-- Source EN PDF p.365; unit 4036 -->

9.16.3.15  Adpcc_Manual_Attr_t

<!-- Source EN PDF p.365; unit 4037 -->

【Description】 Define manual DPCC properties

<!-- Source EN PDF p.365; unit 4038 -->

【Definition】

<!-- Source EN PDF p.365; unit 4039 -->

```text
 typedef struct Adpcc_Manual_Attr_s
 {
     unsigned char enable;
     Adpcc_onfly_cfg_t stOnfly;
     Adpcc_bpt_params_select_t   stBpt;
     Adpcc_pdaf_params_select_t  stPdaf;
     Adpcc_sensor_dpcc_attr_t    stSensorDpcc;
 } Adpcc_Manual_Attr_t;
```

<!-- Source EN PDF p.365; unit 4040 -->

【Member】

<!-- Source EN PDF p.366; unit 4041 -->

| Member<br>Name | Description |
|---|---|
| enable | Manual mode DPCC switch |
| stOnfly | ISP DPCC module in manual mode Dynamic dead pixel detection and correction<br>function parameters |
| stBptParams | ISP DPCC module static dead pixel correction function parameters in manual mode |
| stPdafParams | ISP DPCC module PDAF SPC functional parameters in manual mode |
| stSensorDpcc | Dead pixel correction function parameters of the DPCC module on the sensor side in<br>manual mode |

<!-- Source EN PDF p.366; unit 4042 -->

9.16.3.16  Adpcc_onfly_cfg_t

<!-- Source EN PDF p.366; unit 4043 -->

【Description】 Define manual DPCC basic parameters

<!-- Source EN PDF p.366; unit 4044 -->

【Definition】

<!-- Source EN PDF p.366; unit 4045 -->

```text
 typedef struct Adpcc_onfly_cfg_s {
    Adpcc_onfly_mode_t mode;
    Adpcc_fast_mode_attr_t fast_mode;
    Adpcc_basic_cfg_params_t expert_mode;
 } Adpcc_onfly_cfg_t;
```

<!-- Source EN PDF p.366; unit 4046 -->

【Member】

<!-- Source EN PDF p.366; unit 4047 -->

| Member Name | Description |
|---|---|
| mode | Quick mode or expert mode |
| fastmode | Manual mode quick mode parameter settings |
| expert_mode | Expert mode parameter settings |

<!-- Source EN PDF p.366; unit 4048 -->

9.16.3.17  Adpcc_onfly_mode_t

<!-- Source EN PDF p.366; unit 4049 -->

【Description】 Define manual DPCC basic parameters

<!-- Source EN PDF p.366; unit 4050 -->

【Definition】

<!-- Source EN PDF p.366; unit 4051 -->

```text
 typedef enum Adpcc_onfly_mode_e {
     ADPCC_ONFLY_MODE_FAST        = 0,                   /**< dpcc manual fast
 mode */
     ADPCC_ONFLY_MODE_EXPERT      = 1,                   /**< dpcc manual expert
 mode */
     ADPCC_ONFLY_MODE_MAX                                /**< max */
 } Adpcc_onfly_mode_t;
```

<!-- Source EN PDF p.367; unit 4052 -->

【Member】

<!-- Source EN PDF p.367; unit 4053 -->

| Member Name | Description |
|---|---|
| ADPCC_ONFLY_MODE_FAST | Quick Mode |
| ADPCC_ONFLY_MODE_EXPERT | Expert Mode |
| ADPCC_ONFLY_MODE_MAX | Invalid parameter setting |

<!-- Source EN PDF p.367; unit 4054 -->

9.16.3.18  CalibDb_Dpcc_Pdaf_t

<!-- Source EN PDF p.367; unit 4055 -->

【Description】 Define the tool PDAF SPC functional attribute parameters

<!-- Source EN PDF p.367; unit 4056 -->

【Definition】

<!-- Source EN PDF p.367; unit 4057 -->

```text
 typedef struct CalibDb_Dpcc_Pdaf_s
 {
     unsigned char      en;
     unsigned char      point_en[16];
     unsigned short int offsetx;
     unsigned short int offsety;
     unsigned char      wrapx;
     unsigned char      wrapy;
     unsigned short int wrapx_num;
     unsigned short int wrapy_num;
     unsigned char      point_x[16];
     unsigned char      point_y[16];
     unsigned char      forward_med;
 } CalibDb_Dpcc_Pdaf_t;
```

<!-- Source EN PDF p.367; unit 4058 -->

9.16.3.19  CalibDb_Dpcc_set_RK_t

<!-- Source EN PDF p.367; unit 4059 -->

【Description】 Define the RK algorithm properties

<!-- Source EN PDF p.367; unit 4060 -->

【Definition】

<!-- Source EN PDF p.367; unit 4061 -->

```text
 typedef struct CalibDb_Dpcc_set_RK_s
 {
     unsigned char rb_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char rb_sw_mindis[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_sw_mindis[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char sw_dis_scale_min[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char sw_dis_scale_max[CALIBDB_DPCC_MAX_ISO_LEVEL];
 } CalibDb_Dpcc_set_RK_t;
```

<!-- Source EN PDF p.367; unit 4062 -->

【Member】

<!-- Source EN PDF p.368; unit 4063 -->

| Member Name | Description |
|---|---|
| rb_enable | Red and blue channel dead pixel detection switch |
| g_enable | Green channel dead pixel detection switch |
| rb_sw_mindis | Red and blue channel dead pixel threshold1 |
| g_sw_mindis | Green channel dead pixel threshold 1 |
| sw_dis_scale_min | Dead pixel threshold 2 |
| sw_dis_scale_max | Dead pixel threshold3 |

<!-- Source EN PDF p.368; unit 4064 -->

9.16.3.20  CalibDb_Dpcc_set_LC_t

<!-- Source EN PDF p.368; unit 4065 -->

【Description】 Define LC algorithm properties

<!-- Source EN PDF p.368; unit 4066 -->

【Definition】

<!-- Source EN PDF p.368; unit 4067 -->

```text
 typedef struct CalibDb_Dpcc_set_LC_s
 {
     unsigned char rb_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char rb_line_thr[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_line_thr[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char rb_line_mad_fac[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_line_mad_fac[CALIBDB_DPCC_MAX_ISO_LEVEL];
 } CalibDb_Dpcc_set_LC_t;
```

<!-- Source EN PDF p.368; unit 4068 -->

【Member】

<!-- Source EN PDF p.368; unit 4069 -->

| Member Name | Description |
|---|---|
| rb_enable | Red and blue channel dead pixel detection switch |
| g_enable | Green channel dead pixel detection switch |
| rb_line_thr | Red and blue channel dead pixel threshold1 |
| g_line_thr | Green channel dead pixel threshold 1 |
| rb_line_mad_fac | Red and blue channel dead pixel threshold2 |
| g_line_mad_fac | Green channel dead pixel threshold 2 |

<!-- Source EN PDF p.368; unit 4070 -->

9.16.3.21  CalibDb_Dpcc_set_PG_t

<!-- Source EN PDF p.368; unit 4071 -->

【Description】 Define PG algorithm properties

<!-- Source EN PDF p.368; unit 4072 -->

【Definition】

<!-- Source EN PDF p.369; unit 4073 -->

```text
 typedef struct CalibDb_Dpcc_set_PG_s
 {
     unsigned char rb_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char rb_pg_fac[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_pg_fac[CALIBDB_DPCC_MAX_ISO_LEVEL];
 } CalibDb_Dpcc_set_PG_t;
```

<!-- Source EN PDF p.369; unit 4074 -->

【Member】

<!-- Source EN PDF p.369; unit 4075 -->

| Member Name | Description |
|---|---|
| rb_enable | Red and blue channel dead pixel detection switch |
| g_enable | Green channel dead pixel detection switch |
| rb_pg_fac | Red and blue channel dead pixel thresholds |
| g_pg_fac | Green channel dead pixel threshold |

<!-- Source EN PDF p.369; unit 4076 -->

9.16.3.22  CalibDb_Dpcc_set_RND_t

<!-- Source EN PDF p.369; unit 4077 -->

【Description】 Define RND algorithm properties

<!-- Source EN PDF p.369; unit 4078 -->

【Definition】

<!-- Source EN PDF p.369; unit 4079 -->

```text
 typedef struct CalibDb_Dpcc_set_RND_s
 {
     unsigned char rb_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char rb_rnd_thr[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_rnd_thr[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char rb_rnd_offs[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_rnd_offs[CALIBDB_DPCC_MAX_ISO_LEVEL];
 } CalibDb_Dpcc_set_RND_t;
```

<!-- Source EN PDF p.369; unit 4080 -->

【Member】

<!-- Source EN PDF p.369; unit 4081 -->

| Member Name | Description |
|---|---|
| rb_enable | Red and blue channel dead pixel detection switch |
| g_enable | Green channel dead pixel detection switch |
| rb_rnd_thr | Red and blue channel dead pixel threshold1 |
| g_rnd_thr | Green channel dead pixel threshold 1 |
| rb_rnd_offs | Red and blue channel dead pixel threshold2 |
| g_rnd_offs | Green channel dead pixel threshold 2 |

<!-- Source EN PDF p.370; unit 4082 -->

9.16.3.23  CalibDb_Dpcc_set_RG_t

<!-- Source EN PDF p.370; unit 4083 -->

【Description】 Define the RK algorithm properties

<!-- Source EN PDF p.370; unit 4084 -->

【Definition】

<!-- Source EN PDF p.370; unit 4085 -->

```text
 typedef struct CalibDb_Dpcc_set_RG_s
 {
     unsigned char rb_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char rb_rg_fac[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_rg_fac[CALIBDB_DPCC_MAX_ISO_LEVEL];
 } CalibDb_Dpcc_set_RG_t;
```

<!-- Source EN PDF p.370; unit 4086 -->

【Member】

<!-- Source EN PDF p.370; unit 4087 -->

| Member Name | Description |
|---|---|
| rb_enable | Red and blue channel dead pixel detection switch |
| g_enable | Green channel dead pixel detection switch |
| rb_rg_fac | Red and blue channel dead pixel thresholds |
| g_rg_fac | Green channel dead pixel threshold |

<!-- Source EN PDF p.370; unit 4088 -->

9.16.3.24  CalibDb_Dpcc_set_RO_t

<!-- Source EN PDF p.370; unit 4089 -->

【Description】 Define RO algorithm properties

<!-- Source EN PDF p.370; unit 4090 -->

【Definition】

<!-- Source EN PDF p.370; unit 4091 -->

```text
 typedef struct CalibDb_Dpcc_set_RO_s
 {
     unsigned char rb_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char rb_ro_lim[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char g_ro_lim[CALIBDB_DPCC_MAX_ISO_LEVEL];
 } CalibDb_Dpcc_set_RO_t;
```

<!-- Source EN PDF p.370; unit 4092 -->

【Members】

<!-- Source EN PDF p.370; unit 4093 -->

| Member Name | Description |
|---|---|
| rb_enable | Red and blue channel dead pixel detection switch |
| g_enable | Green channel dead pixel detection switch |
| rb_ro_lim | Red and blue channel dead pixel thresholds |
| g_ro_lim | Green channel dead pixel threshold |

<!-- Source EN PDF p.371; unit 4094 -->

9.16.3.25  CalibDb_Dpcc_set_t

<!-- Source EN PDF p.371; unit 4095 -->

【Description】 Define dead pixel condition properties

<!-- Source EN PDF p.371; unit 4096 -->

【Definition】

<!-- Source EN PDF p.371; unit 4097 -->

```text
 typedef struct CalibDb_Dpcc_set_s
 {
     CalibDb_Dpcc_set_RK_t  rk;
     CalibDb_Dpcc_set_LC_t  lc;
     CalibDb_Dpcc_set_PG_t  pg;
     CalibDb_Dpcc_set_RND_t rnd;
     CalibDb_Dpcc_set_RG_t  rg;
     CalibDb_Dpcc_set_RO_t  ro;
 } CalibDb_Dpcc_set_t;
```

<!-- Source EN PDF p.371; unit 4098 -->

【Member】

<!-- Source EN PDF p.371; unit 4099 -->

| Member Name | Description |
|---|---|
| rk | RK algorithm |
| lc | LC algorithm |
| pg | PG algorithm |
| rnd | RND algorithm |
| rg | RG algorithm |
| ro | RO algorithm |

<!-- Source EN PDF p.371; unit 4100 -->

9.16.3.26  CalibDb_Dpcc_Expert_Mode_t

<!-- Source EN PDF p.371; unit 4101 -->

【Description】 Define the tool expert mode properties

<!-- Source EN PDF p.371; unit 4102 -->

【Definition】

<!-- Source EN PDF p.371; unit 4103 -->

```text
 typedef struct CalibDb_Dpcc_Expert_Mode_s
 {
     float              iso[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char      stage1_Enable[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char      grayscale_mode;
     unsigned char      rk_out_sel[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char      dpcc_out_sel[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char      stage1_rb_3x3[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char      stage1_g_3x3[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char      stage1_inc_rb_center[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char      stage1_inc_g_center[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char      stage1_use_fix_set[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char      stage1_use_set3[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char      stage1_use_set2[CALIBDB_DPCC_MAX_ISO_LEVEL];
     unsigned char      stage1_use_set1[CALIBDB_DPCC_MAX_ISO_LEVEL];
     CalibDb_Dpcc_set_t set[3];
 } CalibDb_Dpcc_Expert_Mode_t;
```

<!-- Source EN PDF p.372; unit 4104 -->

【Members】

<!-- Source EN PDF p.372; unit 4105 -->

| Member name | Description |
|---|---|
| iso | Environmental ISO |
| stage1_Enable | Default value 1 |
| grayscale_mode | Black and white mode switch, 0: off, 1: on |
| rk_out_sel | RK dead pixel judgment mode, 0: mode 1, 1: mode 2, 2: mode 3 |
| dpcc_out_sel | Dead pixel correction mode, 0: median, 1: RK mode |
| stage1_rb_3x3 | Default value: 0 |
| stage1_g_3x3 | Default value: 0 |
| stage1_inc_rb_center | Default value 1 |
| stage1_inc_g_center | Default value 1 |
| stage1_use_fix_set | Built-in dead pixel condition switch, 0: off, 1: on |
| stage1_use_set3 | The third dead pixel judgment condition switch in the set_cell, 0: off, 1: open |
| stage1_use_set2 | The second dead pixel judgment condition switch in the set_cell, 0: off, 1: on |
| stage1_use_set1 | The first dead pixel judgment condition switch in the set_cell, 0: off, 1: on |

<!-- Source EN PDF p.372; unit 4106 -->

9.16.3.27  CalibDb_Dpcc_t

<!-- Source EN PDF p.372; unit 4107 -->

【Description】 Define the tool DPCC properties

<!-- Source EN PDF p.372; unit 4108 -->

【Definition】

<!-- Source EN PDF p.372; unit 4109 -->

```text
 typedef struct CalibDb_Dpcc_s
 {
     int                        enable;
     char                       version[64];
     CalibDb_Dpcc_Fast_Mode_t   fast;
     CalibDb_Dpcc_Expert_Mode_t expert;
     CalibDb_Dpcc_Pdaf_t        pdaf;
     CalibDb_Dpcc_Sensor_t      sensor_dpcc;
 } CalibDb_Dpcc_t;
```

<!-- Source EN PDF p.372; unit 4110 -->

【Member】

<!-- Source EN PDF p.373; unit 4111 -->

| Member Name | Description |
|---|---|
| enable | Switch function |
| version | Version |
| fast | Quick Mode |
| expert | Expert Mode |
| pdaf | Dead pixel condition in PADF SPC function mode |
| sensor_dpcc | Sensor side DPCC module dead pixel correction parameters |

<!-- Source EN PDF p.373; unit 4112 -->

9.16.3.28  rk_aiq_dpcc_attrib_t

<!-- Source EN PDF p.373; unit 4113 -->

【Description】 Define DPCC properties

<!-- Source EN PDF p.373; unit 4114 -->

【Definition】

<!-- Source EN PDF p.373; unit 4115 -->

```text
 typedef struct rk_aiq_dpcc_attrib_s
 {
     AdpccOPMode_t       eMode;
     Adpcc_Auto_Attr_t   stAuto;
     Adpcc_Manual_Attr_t stManual;
     CalibDb_Dpcc_t      stTool;
 } rk_aiq_dpcc_attrib_t;
```

<!-- Source EN PDF p.373; unit 4116 -->

【Member】

<!-- Source EN PDF p.373; unit 4117 -->

| Member Name | Description |
|---|---|
| eMode | API pattern |
| stAuto | Auto DPCC mode |
| stManual | Manual DPCC mode |
| stTool | Tools DPCC Mode |

<!-- Source EN PDF p.373; unit 4118 -->

### 9.17   LSC

<!-- Source EN PDF p.373; unit 4119 -->

#### 9.17.1  Description of the feature

<!-- Source EN PDF p.373; unit 4120 -->

Lens Shading Correction is to solve the situation of shadows around the lens due to the optical characteristics of lens, due to the uneven optical refraction of the lens.

<!-- Source EN PDF p.374; unit 4121 -->

#### 9.17.2  Module-level API reference

<!-- Source EN PDF p.374; unit 4122 -->

9.17.2.1  rk_aiq_user_api2_alsc_SetAttrib

<!-- Source EN PDF p.374; unit 4123 -->

【Description】 Set lens shadow correction properties.

<!-- Source EN PDF p.374; unit 4124 -->

【Grammar】

<!-- Source EN PDF p.374; unit 4125 -->

```text
 XCamReturn
 rk_aiq_user_api2_alsc_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_lsc_attrib_t attr);
```

<!-- Source EN PDF p.374; unit 4126 -->

【Parameters】

<!-- Source EN PDF p.374; unit 4127 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | Lens shadow correction properties | Input |

<!-- Source EN PDF p.374; unit 4128 -->

【Return Value】

<!-- Source EN PDF p.374; unit 4129 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.374; unit 4130 -->

【Requirements】

<!-- Source EN PDF p.374; unit 4131 -->

Header file: rk_aiq_user_api2_alsc.h

<!-- Source EN PDF p.374; unit 4132 -->

Library file: librkaiq.so

<!-- Source EN PDF p.374; unit 4133 -->

9.17.2.2  rk_aiq_user_api2_alsc_GetAttrib

<!-- Source EN PDF p.374; unit 4134 -->

【Description】 Gets the lens shadow correction properties.

<!-- Source EN PDF p.374; unit 4135 -->

【Grammar】

<!-- Source EN PDF p.374; unit 4136 -->

```text
 XCamReturn
 rk_aiq_user_api2_adebayer_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_lsc_attrib_t *attr);
```

<!-- Source EN PDF p.374; unit 4137 -->

【Parameters】

<!-- Source EN PDF p.375; unit 4138 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | Lens shadow correction properties | Output |

<!-- Source EN PDF p.375; unit 4139 -->

【Return Value】

<!-- Source EN PDF p.375; unit 4140 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.375; unit 4141 -->

【Requirements】

<!-- Source EN PDF p.375; unit 4142 -->

Header file: rk_aiq_user_api2_alsc.h

<!-- Source EN PDF p.375; unit 4143 -->

Library file: librkaiq.so

<!-- Source EN PDF p.375; unit 4144 -->

#### 9.17.3  Data Type

<!-- Source EN PDF p.375; unit 4145 -->

9.17.3.1  rk_aiq_lsc_attrib_t

<!-- Source EN PDF p.375; unit 4146 -->

【Description】 Define ISP lens shadow correction properties.

<!-- Source EN PDF p.375; unit 4147 -->

【Definition】

<!-- Source EN PDF p.375; unit 4148 -->

```text
 typedef struct rk_aiq_lsc_attrib_s {
     bool byPass;
     rk_aiq_lsc_op_mode_t mode;
     rk_aiq_lsc_mlsc_attrib_t stManual;
     rk_aiq_uapi_sync_t sync;
 } rk_aiq_lsc_attrib_t;
```

<!-- Source EN PDF p.375; unit 4149 -->

【Member】

<!-- Source EN PDF p.375; unit 4150 -->

| Member<br>Name | Description |
|---|---|
| sync | Interface synchronous/asynchronous functionality, refer to rk_aiq_uapi_sync_t definition<br>description, see **Overview/API Description" section |
| bypass | LSC module enable<br>1: off<br>0: enable |
| mode | Mode settings |
| stManual | Parameter settings in manual mode |

<!-- Source EN PDF p.376; unit 4151 -->

9.17.3.2  rk_aiq_lsc_op_mode_t

<!-- Source EN PDF p.376; unit 4152 -->

【Description】 Define the ISP lens shadow correction operating mode.

<!-- Source EN PDF p.376; unit 4153 -->

【Definition】

<!-- Source EN PDF p.376; unit 4154 -->

```text
 typedef enum rk_aiq_lsc_op_mode_s {
     RK_AIQ_LSC_MODE_INVALID                     = 0,        /**< initialization
 value */
     RK_AIQ_LSC_MODE_MANUAL                      = 1,        /**< run manual lens
 shading correction */
     RK_AIQ_LSC_MODE_AUTO                        = 2,        /**< run auto lens
 shading correction */
     RK_AIQ_LSC_MODE_MAX
 } rk_aiq_lsc_op_mode_t;
```

<!-- Source EN PDF p.376; unit 4155 -->

【Member】

<!-- Source EN PDF p.376; unit 4156 -->

| Member Name | Description |
|---|---|
| RK_AIQ_LSC_MODE_INVALID | Invalid mode |
| RK_AIQ_LSC_MODE_MANUAL | Manual mode |
| RK_AIQ_LSC_MODE_AUTO | Automatic mode |

<!-- Source EN PDF p.376; unit 4157 -->

9.17.3.3  rk_aiq_lsc_table_t

<!-- Source EN PDF p.376; unit 4158 -->

【Description】 Define the ISP lens shadow correction table.

<!-- Source EN PDF p.376; unit 4159 -->

【Definition】

<!-- Source EN PDF p.376; unit 4160 -->

```text
 typedef struct rk_aiq_lsc_table_s {
     unsigned short r_data_tbl[LSC_DATA_TBL_SIZE];
     unsigned short gr_data_tbl[LSC_DATA_TBL_SIZE];
     unsigned short gb_data_tbl[LSC_DATA_TBL_SIZE];
     unsigned short b_data_tbl[LSC_DATA_TBL_SIZE];
 } rk_aiq_lsc_table_t;
```

<!-- Source EN PDF p.376; unit 4161 -->

【Member】

<!-- Source EN PDF p.377; unit 4162 -->

| Member Name | Description |
|---|---|
| r_data_tbl | R component correction table<br>The number of elements is [17x17]<br>value range [1~7.99]<br>3bit higher integer bits lower 8bit decimal places |
| gr_data_tbl | The number of elements in the GR component correction table<br>is [17x17]<br>value range [1~7.99]<br>3bit higher integer bits lower 8bit decimal places |
| gb_data_tbl | GB component correction table<br>The number of elements is [17x17]<br>value range [1~7.99]<br>3bit higher integer bit lower 8bit decimal places |
| b_data_tbl | The number of elements<br>in the B component correction table is [17x17]<br>value range [1~7.99]<br>3bit higher integer bit lower 8bit decimal places |

<!-- Source EN PDF p.379; unit 4163 -->

### 9.18   GIC

<!-- Source EN PDF p.379; unit 4164 -->

#### 9.18.1  Description of the feature

<!-- Source EN PDF p.379; unit 4165 -->

The GIC module is used to correct the imbalance between the two channels of Gr and Gb and improve the image quality of some scenes.

<!-- Source EN PDF p.379; unit 4166 -->

#### 9.18.2  Module-level API reference

<!-- Source EN PDF p.379; unit 4167 -->

9.18.2.1  rk_aiq_user_api2_agic_v2_SetAttrib

<!-- Source EN PDF p.379; unit 4168 -->

【Description】 Set GIC software properties.

<!-- Source EN PDF p.379; unit 4169 -->

【Grammar】

<!-- Source EN PDF p.379; unit 4170 -->

```text
 XCamReturn rk_aiq_user_api2_agic_v2_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 const rkaiq_gic_v2_api_attr_t* attr);
```

<!-- Source EN PDF p.379; unit 4171 -->

【Parameters】

<!-- Source EN PDF p.379; unit 4172 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | GIC Software Property Structure | Input |

<!-- Source EN PDF p.379; unit 4173 -->

【Return Value】

<!-- Source EN PDF p.379; unit 4174 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.379; unit 4175 -->

【Requirements】

<!-- Source EN PDF p.379; unit 4176 -->

Header file: rk_aiq_user_api2_agic.h

<!-- Source EN PDF p.379; unit 4177 -->

Library file: librkaiq.so

<!-- Source EN PDF p.379; unit 4178 -->

【Description】

<!-- Source EN PDF p.379; unit 4179 -->

Not.

<!-- Source EN PDF p.380; unit 4180 -->

9.18.2.2  rk_aiq_user_api2_agic_v2_GetAttrib

<!-- Source EN PDF p.380; unit 4181 -->

【Description】 Gets the gamma software properties.

<!-- Source EN PDF p.380; unit 4182 -->

【Grammar】

<!-- Source EN PDF p.380; unit 4183 -->

```text
 XCamReturn rk_aiq_user_api2_agic_v2_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rkaiq_gic_v2_api_attr_t* attr);
```

<!-- Source EN PDF p.380; unit 4184 -->

【Parameters】

<!-- Source EN PDF p.380; unit 4185 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | GIC Software Property Struct | Output |

<!-- Source EN PDF p.380; unit 4186 -->

【Return Value】

<!-- Source EN PDF p.380; unit 4187 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.380; unit 4188 -->

【Requirements】

<!-- Source EN PDF p.380; unit 4189 -->

Header file: rk_aiq_user_api2_agic.h

<!-- Source EN PDF p.380; unit 4190 -->

Library file: librkaiq.so

<!-- Source EN PDF p.380; unit 4191 -->

【Description】

<!-- Source EN PDF p.380; unit 4192 -->

#### 9.18.3  Module-level API data types

<!-- Source EN PDF p.380; unit 4193 -->

9.18.3.1  rkaiq_gic_api_op_mode_t

<!-- Source EN PDF p.380; unit 4194 -->

【Description】 Define the GIC operating mode

<!-- Source EN PDF p.380; unit 4195 -->

【Definition】

<!-- Source EN PDF p.380; unit 4196 -->

```text
   typedef enum rkaiq_gic_api_op_mode_e {
       RKAIQ_GIC_API_OPMODE_OFF    = 0,
       RKAIQ_GIC_API_OPMODE_AUTO   = 1,
       RKAIQ_GIC_API_OPMODE_MANUAL = 2,
   } rkaiq_gic_api_op_mode_t;
```

<!-- Source EN PDF p.380; unit 4197 -->

【Member】

<!-- Source EN PDF p.381; unit 4198 -->

| Member Name | Description |
|---|---|
| RKAIQ_GIC_API_OPMODE_OFF | GIC Off Mode |
| RKAIQ_GIC_API_OPMODE_AUTO | API Manual Mode |
| RKAIQ_GIC_API_OPMODE_MANUAL | Manual mode |

<!-- Source EN PDF p.381; unit 4199 -->

9.18.3.2  rkaiq_gic_v2_param_selected_t

<!-- Source EN PDF p.381; unit 4200 -->

【Description】 Define automatic/manual properties under RK3588

<!-- Source EN PDF p.381; unit 4201 -->

【Definition】

<!-- Source EN PDF p.381; unit 4202 -->

```text
   typedef struct rkaiq_gic_v2_param_selected_s {
       uint32_t iso;
       uint8_t bypass;
       uint8_t gr_ratio;
       uint16_t min_busy_thre;
       uint16_t min_grad_thr1;
       uint16_t min_grad_thr2;
       uint16_t k_grad1;
       uint16_t k_grad2;
       uint16_t gb_thre;
       uint16_t maxCorV;
       uint16_t maxCorVboth;
       uint16_t dark_thre;
       uint16_t dark_threHi;
       uint16_t k_grad1_dark;
       uint16_t k_grad2_dark;
       uint16_t min_grad_thr_dark1;
       uint16_t min_grad_thr_dark2;
       float NoiseScale;
       float NoiseBase;
       float noiseCurve_0;
       float noiseCurve_1;
       float globalStrength;
       uint16_t diff_clip;
   } rkaiq_gic_v2_param_selected_t;
```

<!-- Source EN PDF p.381; unit 4203 -->

【Member】

<!-- Source EN PDF p.382; unit 4204 -->

| Member Name | Description |
|---|---|
| iso | Environmental iso |
| bypass | Reserved, not using |
| gr_ratio | Reserved, not using |
| min_busy_thre | Busy area detection capability, value range [0, 1023], default value 160 |
| min_grad_thr1 | The number threshold of non-edge areas is 1, the GIC intensity control value, the<br>value range [0, 1023], and the default value is 32 |
| min_grad_thr2 | The number threshold of non-edge areas is 2, the GIC intensity control value, the<br>value range [0, 1023], and the default value is 32 |
| k_grad1 | The response threshold of the edge (horizontal and vertical gradient) is 1, the value<br>range is [0, 15], and the default value is 5 |
| k_grad2 | The response threshold of the edge (horizontal and vertical gradient) is 2, the value<br>range is [0, 15], and the default value is 1 |
| gb_thre | Scale factor for scale, value range [0, 15], default value 7 |
| maxCorV | Limit the maximum compensation value of GB in the edge area, the value range is<br>[0, 1023], and the default value is 40 |
| maxCorVboth | Limit the maximum compensation value of GB in flat (non-edge) areas, the value<br>range is [0, 1023], and the default value is 8 |
| dark_thre | Define the threshold value of the dark area 1, the value range [0, 2047], the default<br>value 120 |
| dark_threHi | Define the threshold value of the dark area 2, the value range [0, 2047], the default<br>value is 240 |
| k_grad1_dark | The threshold value of the edge (horizontal and vertical gradient) of the dark part<br>of the image is 1, the value range is [0, 15], and the default value is 6 |
| k_grad2_dark | The threshold of the response degree of the edge (horizontal and vertical gradient)<br>of the dark part of the image is 2, the value range is [0, 15], and the default value is<br>1 |
| min_grad_thr_dark1 | The threshold for the number of non-marginal areas in the dark part of the image is<br>1, the value range is [0, 1023], and the default value is 64 |
| min_grad_thr_dark2 | The number threshold of the number of non-marginal areas in the dark part of the<br>image is 2, the value range [0, 1023], and the default value is 32 |
| noiseCurve_0 | Noise curve parameter 1 |
| noiseCurve_1 | Noise profile parameter 2 |
| globalStrength | Global control adjusts the intensity of the GB compensation value, the value range<br>[0, 2], the default value 1 |

<!-- Source EN PDF p.383; unit 4205 -->

| Member Name | Description |
|---|---|
| NoiseScale | According to the noise curve, obtain the standard deviation of the current point<br>noise, and use noise_std *noise_scale to determine the maximum GB<br>compensation value |
| NoiseBase | Punish the image edge adjustment threshold, according to the first gradient and the<br>second gradient calculation result plus the noise_offset, and then compare as long<br>as one direction gradx&gt;2*grady is considered an edge, do not adjust |
| diff_clip | Limit the maximum compensation value of the maximum GB |

<!-- Source EN PDF p.383; unit 4206 -->

9.18.3.3  rkaiq_gic_v2_api_attr_t

<!-- Source EN PDF p.383; unit 4207 -->

【Description】 Define GIC attributes

<!-- Source EN PDF p.383; unit 4208 -->

【Definition】

<!-- Source EN PDF p.383; unit 4209 -->

```text
   typedef struct rkaiq_gic_v2_api_attr_s {
       rk_aiq_uapi_sync_t sync;
       uint8_t gic_en;
       rkaiq_gic_api_op_mode_t op_mode;
       uint32_t iso_cnt;
       rkaiq_gic_v2_param_selected_t auto_params[RKAIQ_GIC_MAX_ISO_CNT];
       rkaiq_gic_v2_param_selected_t manual_param;
   } rkaiq_gic_v2_api_attr_t;
```

<!-- Source EN PDF p.383; unit 4210 -->

【Member】

<!-- Source EN PDF p.383; unit 4211 -->

| Member<br>Name | Description |
|---|---|
| sync | For rk_aiq_uapi_sync_t definitions, see Overview/API Description section |
| gic_en | Switch |
| op_mode | Working mode |
| iso_cnt | Number of ISOs in the auto parameter |
| auto_params | Automatic parameters, one set per ISO, the software automatically calculates based on<br>ISO interpolation |
| manual_param | Manual parameters, fixed use of this group of parameters |

<!-- Source EN PDF p.384; unit 4212 -->

### 9.19   CGC

<!-- Source EN PDF p.384; unit 4213 -->

#### 9.19.1  Description of the feature

<!-- Source EN PDF p.384; unit 4214 -->

CGC (Color Gamut Compression) can set the color gamut compression parameters.

<!-- Source EN PDF p.384; unit 4215 -->

#### 9.19.2  Functional level API reference

<!-- Source EN PDF p.384; unit 4216 -->

#### 9.19.3  Module-level API reference

<!-- Source EN PDF p.384; unit 4217 -->

9.19.3.1  rk_aiq_user_api2_acgc_SetAttrib

<!-- Source EN PDF p.384; unit 4218 -->

【Description】

<!-- Source EN PDF p.384; unit 4219 -->

Set CGC module properties

<!-- Source EN PDF p.384; unit 4220 -->

【Grammar】

<!-- Source EN PDF p.384; unit 4221 -->

```text
 XCamReturn rk_aiq_user_api2_acgc_SetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapi_acgc_attrib_t attr);
```

<!-- Source EN PDF p.384; unit 4222 -->

【Parameters】

<!-- Source EN PDF p.384; unit 4223 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | CGC Module Properties | Input |

<!-- Source EN PDF p.384; unit 4224 -->

【Return Value】

<!-- Source EN PDF p.384; unit 4225 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.384; unit 4226 -->

【Requirements】

<!-- Source EN PDF p.384; unit 4227 -->

Header file: rk_aiq_user_api2_acgc.h

<!-- Source EN PDF p.384; unit 4228 -->

Library file: librkaiq.so

<!-- Source EN PDF p.384; unit 4229 -->

【Precautions】

<!-- Source EN PDF p.384; unit 4230 -->

attr.param.op_mode = RK_AIQ_OP_MODE_AUTO, AIQ's built-in CGC default parameters are used, and attr.param.op_mode = RK_AIQ_OP_MODE_MANUAL, CGC parameters can be configured.

<!-- Source EN PDF p.385; unit 4231 -->

9.19.3.2  rk_aiq_user_api2_acgc_GetAttrib

<!-- Source EN PDF p.385; unit 4232 -->

【Description】

<!-- Source EN PDF p.385; unit 4233 -->

Gets the current properties of the CGC module

<!-- Source EN PDF p.385; unit 4234 -->

【Grammar】

<!-- Source EN PDF p.385; unit 4235 -->

```text
 XCamReturn rk_aiq_user_api2_acgc_GetAttrib(const rk_aiq_sys_ctx_t* sys_ctx,
 rk_aiq_uapi_acgc_attrib_t* attr);
```

<!-- Source EN PDF p.385; unit 4236 -->

【Parameters】

<!-- Source EN PDF p.385; unit 4237 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| sys_ctx | AIQ context pointer | Input |
| attr | CGC module property | Output |

<!-- Source EN PDF p.385; unit 4238 -->

【Return Value】

<!-- Source EN PDF p.385; unit 4239 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.385; unit 4240 -->

【Requirements】

<!-- Source EN PDF p.385; unit 4241 -->

Header file: rk_aiq_user_api2_acgc.h

<!-- Source EN PDF p.385; unit 4242 -->

Library file: librkaiq.so

<!-- Source EN PDF p.385; unit 4243 -->

#### 9.19.4  Module-level API data types

<!-- Source EN PDF p.385; unit 4244 -->

9.19.4.1  rk_aiq_uapi_acgc_attrib_t

<!-- Source EN PDF p.385; unit 4245 -->

【Description】 Define CGC module API parameters

<!-- Source EN PDF p.385; unit 4246 -->

【Definition】

<!-- Source EN PDF p.385; unit 4247 -->

```text
 typedef struct rk_aiq_uapi_acgc_attrib_s {
     rk_aiq_uapi_sync_t sync;
     rk_aiq_acgc_params_t param;
 } rk_aiq_uapi_acgc_attrib_t;
```

<!-- Source EN PDF p.385; unit 4248 -->

【Member】

<!-- Source EN PDF p.386; unit 4249 -->

| Member Name | Description |
|---|---|
| sync | For rk_aiq_uapi_sync_t definitions, see Overview/API Description section |
| rk_aiq_acgc_params_t | cgc parameter |

<!-- Source EN PDF p.386; unit 4250 -->

9.19.4.2  rk_aiq_acgc_params_t

<!-- Source EN PDF p.386; unit 4251 -->

【Description】 Define CGC module parameters

<!-- Source EN PDF p.386; unit 4252 -->

【Definition】

<!-- Source EN PDF p.386; unit 4253 -->

```text
 typedef struct __cgc_param {
     RKAiqOPMode_t op_mode;
     bool cgc_ratio_en;
     bool cgc_yuv_limit;
 } Cgc_Param_t;
 typedef Cgc_Param_t rk_aiq_acgc_params_t;
```

<!-- Source EN PDF p.386; unit 4254 -->

【Member】

<!-- Source EN PDF p.386; unit 4255 -->

| Member<br>Name | Description |
|---|---|
| op_mode | mode, RK_AIQ_OP_MODE_AUTO (using AIQ built-in parameters) or<br>RK_AIQ_OP_MODE_MANUAL (using user-configurable parameters) |
| cgc_ratio_en | Whether to enable gamut compression mode, default value: FALSE |
| cgc_yuv_limit | Whether to output limit range, if cgc_yuv_limit = FALSE, bypass CGC, default value:<br>FALSE |

<!-- Source EN PDF p.386; unit 4256 -->

## 10.   Statistics

<!-- Source EN PDF p.386; unit 4257 -->

### 10.1   Overview

<!-- Source EN PDF p.386; unit 4258 -->

ISP30 supports image data processing to obtain the relevant statistical information required by the AWB/AE/AF 3A control algorithm, which is roughly as follows:

<!-- Source EN PDF p.387; unit 4259 -->

![Original technical figure — PDF p.387](/docs/rockchip-isp30-development/assets/en-p387-X2034.jpg)

<!-- Source EN PDF p.387; unit 4260 -->

### 10.2   Description of the feature

<!-- Source EN PDF p.387; unit 4261 -->

#### 10.2.1  AE statistics

<!-- Source EN PDF p.387; unit 4262 -->

AE hardware statistics mainly include the following parts:

<!-- Source EN PDF p.387; unit 4263 -->

256-segment weighted histogram statistics and chunked R/G/B/Y mean statistics based on RAW domain;

<!-- Source EN PDF p.387; unit 4264 -->

10.2.1.1  AE statistics based on raw graphs

<!-- Source EN PDF p.387; unit 4265 -->

The module statistics are divided into block brightness statistics and histogram statistics. According to the supported block size and whether there are independent subwindow statistics, the statistical mode can be divided into big mode and lite mode.

<!-- Source EN PDF p.387; unit 4266 -->

big mode: maximum support 15X15 non-independent sub-window blocking, minimum support 1X1 non- independent sub-window blocking, each block can output 10bit R/B channel luminance average and 12bit G channel average, default to 15X15 blocking; At the same time, 4 independent sub-windows can be set up, each independent sub-window can output the sum of 29-bit R/B channel brightness and 32-bit G channel sum, and the average brightness needs to be divided by the number of pixels of each independent sub- window in the software. In this mode, the weighted histogram statistics are based on the number of tiles and the corresponding assigned weights, and the effective number of pixels in each luminance segment is 28bit.

<!-- Source EN PDF p.387; unit 4267 -->

lite mode: maximum support 5X5 non-independent sub-window blocking, minimum support 1X1 non- independent sub-window blocking, each block can output 10bit R/B channel brightness average and 12bit G channel average, default to 5X5 blocking; Setting up stand-alone child windows is not supported. In this mode, the weighted histogram statistics are based on the number of tiles and the corresponding assigned weights, and the effective number of pixels in each luminance segment is 28bit.

<!-- Source EN PDF p.388; unit 4268 -->

3588 platform, default non-HDR exposure mode, BIG mode (15X15 non-independent sub-window), HDR 2-frame mode, BIG mode (15X15 non-independent sub-window), HDR 3-frame mode, BIG mode for short and long frames (15X15 non-independent sub-window), medium frame in LITE mode (5X5 non- independent sub-window)

<!-- Source EN PDF p.388; unit 4269 -->

#### 10.2.2  AWB statistics

<!-- Source EN PDF p.388; unit 4270 -->

AWB Hardware Statistics Source:

<!-- Source EN PDF p.388; unit 4271 -->

In HDR multi-frame mode, support to select 1 of the 3 channels of L/M/S.

<!-- Source EN PDF p.388; unit 4272 -->

In linear mode, there is only 1 channel of data.

<!-- Source EN PDF p.388; unit 4273 -->

Perform statistics on data after Raw-BLC-LSC

<!-- Source EN PDF p.388; unit 4274 -->

AWB hardware statistics include white point statistics and chunking statistics

<!-- Source EN PDF p.388; unit 4275 -->

White point statistics

<!-- Source EN PDF p.388; unit 4276 -->

Record the cumulative value and number of RGins and BGains in the white areas of 7 light sources and 2 sizes in the main window

<!-- Source EN PDF p.388; unit 4277 -->

Record the cumulative value and number of RGins and BGains in the white areas of 4 light sources and 2 sizes in the sub-window

<!-- Source EN PDF p.388; unit 4278 -->

The RGin and BGain in the 4 UV or XY fields are added to the box, and the number of RGins is added

<!-- Source EN PDF p.388; unit 4279 -->

Chunking statistics Image 15x15 tiles, R, G, B mean of all points or white points for each block

<!-- Source EN PDF p.388; unit 4280 -->

#### 10.2.3  AF statistics

<!-- Source EN PDF p.388; unit 4281 -->

AFHW Stats Hardware Statistics:

<!-- Source EN PDF p.388; unit 4282 -->

In HDR multi-frame mode, support to select 1 of the 3 channels of L/M/S. At the same time, the data after 3-channel synthesis is supported as input.

<!-- Source EN PDF p.388; unit 4283 -->

In linear mode, there is only 1 channel of data.

<!-- Source EN PDF p.388; unit 4284 -->

Support FV output of 2 configurable frequency bands horizontally and FV output of 2 configurable frequency bands in vertical direction

<!-- Source EN PDF p.388; unit 4285 -->

ISP30 AF Hardware Statistics Module Block Diagram

<!-- Source EN PDF p.388; unit 4286 -->

![Original technical figure — PDF p.388](/docs/rockchip-isp30-development/assets/en-p388-X2040.jpg)

<!-- Source EN PDF p.389; unit 4287 -->

### 10.3   API reference

<!-- Source EN PDF p.389; unit 4288 -->

#### 10.3.1  rk_aiq_uapi_sysctl_get3AStatsBlk

<!-- Source EN PDF p.389; unit 4289 -->

【Description】

<!-- Source EN PDF p.389; unit 4290 -->

Obtain 3A statistics synchronously.

<!-- Source EN PDF p.389; unit 4291 -->

【Grammar】

<!-- Source EN PDF p.389; unit 4292 -->

```text
 XCamReturn
 rk_aiq_uapi_sysctl_get3AStatsBlk(const rk_aiq_sys_ctx_t* ctx, rk_aiq_isp_stats_t
 **stats, int timeout_ms);
```

<!-- Source EN PDF p.389; unit 4293 -->

【Parameters】

<!-- Source EN PDF p.389; unit 4294 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| stats | Statistics structure pointer | Output |
| timeout_ms | Timeout, -1 means infinite wait until there is a statistic | Input |

<!-- Source EN PDF p.389; unit 4295 -->

【Return Value】

<!-- Source EN PDF p.389; unit 4296 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.389; unit 4297 -->

【Requirements】

<!-- Source EN PDF p.389; unit 4298 -->

Header file: rk_aiq_user_api_sysctl.h

<!-- Source EN PDF p.389; unit 4299 -->

Library file: librkaiq.so

<!-- Source EN PDF p.389; unit 4300 -->

#### 10.3.2  rk_aiq_uapi_sysctl_release3AStatsRef

<!-- Source EN PDF p.389; unit 4301 -->

【Description】

<!-- Source EN PDF p.389; unit 4302 -->

Release the acquired 3A statistical information and use it with the rk_aiq_uapi_sysctl_get3AStatsBlk.

<!-- Source EN PDF p.389; unit 4303 -->

【Grammar】

<!-- Source EN PDF p.389; unit 4304 -->

```text
 void
 rk_aiq_uapi_sysctl_release3AStatsRef(const rk_aiq_sys_ctx_t* ctx,
 rk_aiq_isp_stats_t *stats);
```

<!-- Source EN PDF p.390; unit 4305 -->

【Parameters】

<!-- Source EN PDF p.390; unit 4306 -->

| Parameter Name | Description | Input/Output |
|---|---|---|
| ctx | AIQ context pointer | Input |
| stats | Statistics structure pointer | Input |

<!-- Source EN PDF p.390; unit 4307 -->

【Return Value】

<!-- Source EN PDF p.390; unit 4308 -->

| Return value | Description |
|---|---|
| 0 | Success |
| Non-0 | Failure, see Error Code Table |

<!-- Source EN PDF p.390; unit 4309 -->

【Requirements】

<!-- Source EN PDF p.390; unit 4310 -->

Header file: rk_aiq_user_api_sysctl.h

<!-- Source EN PDF p.390; unit 4311 -->

Library file: librkaiq.so

<!-- Source EN PDF p.390; unit 4312 -->

Reference code

<!-- Source EN PDF p.390; unit 4313 -->

sdk: external/camera_engine_rkaiq/rkisp_demo/demo/af_algo_demo

<!-- Source EN PDF p.390; unit 4314 -->

### 10.4   Data type

<!-- Source EN PDF p.390; unit 4315 -->

#### 10.4.1  rk_aiq_isp_stats_t

<!-- Source EN PDF p.390; unit 4316 -->

【Description】 AIQ 3A statistics

<!-- Source EN PDF p.390; unit 4317 -->

【Definition】

<!-- Source EN PDF p.390; unit 4318 -->

```text
 typedef struct {
     rk_aiq_isp_aec_stats_t aec_stats;
     rk_aiq_isp_awb_stats2_v3x_t awb_stats_v3x;
     rk_aiq_isp_af_stats_t  af_stats;
 } rk_aiq_isp_stats_t;
```

<!-- Source EN PDF p.390; unit 4319 -->

【Member】

<!-- Source EN PDF p.390; unit 4320 -->

| Member Name | Description |
|---|---|
| aec_stats | ae statistics |
| rk_aiq_isp_awb_stats2_v3x_t | awb statistics |
| af_stats | af statistics |

<!-- Source EN PDF p.391; unit 4321 -->

#### 10.4.2  RKAiqAecStats_t

<!-- Source EN PDF p.391; unit 4322 -->

【Description】 Define AE data information, see the function description of AE section for details.

<!-- Source EN PDF p.391; unit 4323 -->

【Definition】

<!-- Source EN PDF p.391; unit 4324 -->

```text
 typedef struct RKAiqAecStats_s {
     RkAiqAecHwStatsRes_t ae_data;
     RKAiqAecExpInfo_t ae_exp;
 } RKAiqAecStats_t;
```

<!-- Source EN PDF p.391; unit 4325 -->

【Member】

<!-- Source EN PDF p.391; unit 4326 -->

| Member Name | Description |
|---|---|
| ae_data | AE Module Hardware Statistics |
| ae_exp | AE module sensor exposure information |

<!-- Source EN PDF p.391; unit 4327 -->

10.4.2.1  RKAiqAecExpInfo_t

<!-- Source EN PDF p.391; unit 4328 -->

【Description】 AE module exposure parameter information

<!-- Source EN PDF p.391; unit 4329 -->

【Definition】

<!-- Source EN PDF p.391; unit 4330 -->

```text
 typedef struct RKAiqAecExpInfo_s {
     RkAiqExpParamComb_t LinearExp;
     RkAiqExpParamComb_t HdrExp[3];
     RkAiqIrisParamComb_t Iris;
     uint16_t line_length_pixels;
     uint32_t frame_length_lines;
     float pixel_clock_freq_mhz;
     CISFeature_t CISFeature;
     RKAiqExpI2cParam_t exp_i2c_params;
 } RKAiqAecExpInfo_t;
```

<!-- Source EN PDF p.391; unit 4331 -->

【Member】

<!-- Source EN PDF p.392; unit 4332 -->

| Member Name | Description |
|---|---|
| LinearExp | Exposure parameter information for non-HDR modes, including exposure actual<br>values and register values in RK format |
| HdrExp | Exposure parameter information for HDR mode, including exposure actual<br>values and register values in RK format, supports up to 3 frame exposures |
| exp_i2c_params | The sensor register value of the exposure parameter, the exposure register value<br>parameter used by third-party AE schemes |
| line_length_pixels | hts, whose value is determined by the sensor's configuration sequence |
| frame_length_lines | vts, whose value is determined by the configuration sequence of the sensor |
| pixel_clock_freq_mhz | pclk, in MHz, the value of which is determined by the configuration sequence of<br>the sensor |

<!-- Source EN PDF p.392; unit 4333 -->

【Precautions】

<!-- Source EN PDF p.392; unit 4334 -->

HdrExp represents exposure parameter information in HDR mode and supports up to 3TO1. HDR 2TO1: Subscript 0 indicates short frame exposure parameters, subscript 1 indicates long frame exposure parameters, subscript 2 is invalid; HDR 3TO1: Subscript 0 indicates short frame exposure parameters, subscript 1 indicates medium frame exposure parameters, and subscript 2 indicates long frame exposure parameters.

<!-- Source EN PDF p.392; unit 4335 -->

10.4.2.1.1 RkAiqExpParamComb_t

<!-- Source EN PDF p.392; unit 4336 -->

【Description】 AE module exposure parameter information details

<!-- Source EN PDF p.392; unit 4337 -->

【Member】

<!-- Source EN PDF p.392; unit 4338 -->

```text
 typedef struct {
     RkAiqExpRealParam_t exp_real_params; real value
     RkAiqExpSensorParam_t exp_sensor_params;//RK reg value
 } RkAiqExpParamComb_t;
```

<!-- Source EN PDF p.392; unit 4339 -->

| Member Name | Description |
|---|---|
| exp_real_params | The actual physical value of the exposure component |
| exp_sensor_params | The sensor register value of the exposure component, following the RK exposure<br>setting |

<!-- Source EN PDF p.392; unit 4340 -->

```text
 typedef struct RkAiqExpRealParam_s {
     float integration_time;
     float analog_gain;
     float digital_gain;
     float isp_dgain;
     int   iso;
     int   dcg_mode;
 } RkAiqExpRealParam_t;
```

<!-- Source EN PDF p.393; unit 4341 -->

| Member Name | Description |
|---|---|
| integration_time | Exposure integration time in seconds (s) |
| analog_gain | The analog gain/Total gain of the sensor in multiples |
| digital_gain | The digital gain of the sensor, in multiples, is configured to 1x when the digital gain of<br>the sensor compensates for the accuracy of the analog gain, and the overall gain value<br>is written to the analog_gain |
| isp_dgain | ISP digital gain, in multiples, is currently invalid, and the default value is 1x |
| iso | The total gain value, ISO represents the system gain, in constant 50 times multiple,<br>ISO = Total gain * 50 |
| dcg_mode | Dual conversion gain |

<!-- Source EN PDF p.393; unit 4342 -->

```text
 typedef struct RkAiqExpSensorParam_s {
     unsigned short fine_integration_time;
     unsigned short coarse_integration_time;
     unsigned short analog_gain_code_global;
     unsigned short digital_gain_global;
     unsigned short isp_digital_gain;
 } RkAiqExpSensorParam_t;
```

<!-- Source EN PDF p.393; unit 4343 -->

| Member Name | Description |
|---|---|
| fine_integration_time | The fractional line register value of the sensor exposure integration time,<br>which is only required if the sensor supports decimal lines |
| coarse_integration_time | The register value corresponding to the sensor exposure integration time, in<br>the number of rows |
| analog_gain_code_global | Register values corresponding to the analog gain of the sensor |
| digital_gain_global | Register values corresponding to the digital gain of the sensor |
| isp_digital_gain | ISP digital gain register value, temporarily invalid |

<!-- Source EN PDF p.393; unit 4344 -->

【Precautions】

<!-- Source EN PDF p.393; unit 4345 -->

The digital gain of different sensors has different effects, some to increase the sensitivity range, and some to complement the accuracy of the analog gain. Therefore, the digital gain is not listed separately for this time, and its size and corresponding register values are all incorporated into the analog gain.

<!-- Source EN PDF p.393; unit 4346 -->

Dual conversion gain mode has three states, a value of -1 means that the sensor does not support DCG, a value of 0 indicates LCG, and a value of 1 indicates HCG

<!-- Source EN PDF p.393; unit 4347 -->

10.4.2.1.2 RKAiqExpI2cParam_t

<!-- Source EN PDF p.393; unit 4348 -->

【Description】 AE module I2c exposure parameters (generally used by third-party AEs)

<!-- Source EN PDF p.393; unit 4349 -->

【Definition】

<!-- Source EN PDF p.394; unit 4350 -->

```text
 #define MAX_I2CDATA_LEN 64
 typedef struct RKAiqExpI2cParam_s {
     bool           bValid;
     unsigned int   nNumRegs;
     unsigned int   RegAddr[MAX_I2CDATA_LEN];
     unsigned int   AddrByteNum[MAX_I2CDATA_LEN];
     unsigned int   RegValue[MAX_I2CDATA_LEN];
     unsigned int   ValueByteNum[MAX_I2CDATA_LEN];
     unsigned int   DelayFrames[MAX_I2CDATA_LEN];
 } RKAiqExpI2cParam_t;
```

<!-- Source EN PDF p.394; unit 4351 -->

【Member】

<!-- Source EN PDF p.394; unit 4352 -->

| Member Name | Description |
|---|---|
| bValid | I2c parameter effective enable bit<br>true: use RKAiqExpI2cParam_t to set register value (generally used by third-party AE);<br>false: Register value setting using register parameters in RK format |
| nNumRegs | The number of register values set |
| AddrByteNum | The bit length of the register address, the maximum number of elements is 64 |
| RegValue | An array of register values with a maximum number of elements of 64 |
| ValueByteNum | The bit length of the register value, the maximum number of elements is 64 |
| DelayFrames | Register value deferred array of frames with a maximum of 64 |

<!-- Source EN PDF p.394; unit 4353 -->

【Precautions】

<!-- Source EN PDF p.394; unit 4354 -->

This register parameter is only valid if the third-party AE application is true and bValid is true, otherwise the RK format register parameter in the RkAiqExpParamComb_t is used by default

<!-- Source EN PDF p.394; unit 4355 -->

The maximum number of register values that can be set is 64

<!-- Source EN PDF p.394; unit 4356 -->

10.4.2.1.3 RkAiqIrisParamComb_t

<!-- Source EN PDF p.394; unit 4357 -->

【Description】 AE module aperture parameters

<!-- Source EN PDF p.394; unit 4358 -->

【Definition】

<!-- Source EN PDF p.394; unit 4359 -->

```text
 typedef struct {
     RkAiqPIrisParam_t   PIris;
     RkAiqDCIrisParam_t  DCIris;
 } RkAiqIrisParamComb_t;
 typedef struct {
     int            step;
     int            gain;
     bool           update;
 } RkAiqPIrisParam_t;
 typedef struct {
     int        pwmDuty; //percent value,range = 0-100
     bool       update;
 } RkAiqDCIrisParam_t;
```

<!-- Source EN PDF p.395; unit 4360 -->

【Member】

<!-- Source EN PDF p.395; unit 4361 -->

| Member Name | Child members | Description |
|---|---|---|
| PIris | step<br>gain<br>update | P aperture parameters:<br>P aperture step register value P aperture step equivalent gain value<br>P aperture step update flag |
| DCIris | pwmDuty<br>update | DC aperture parameters: PWM duty cycle value, value range:<br>1~100<br>DC aperture parameter update flag |

<!-- Source EN PDF p.395; unit 4362 -->

10.4.2.2  RkAiqAecHwStatsRes_t

<!-- Source EN PDF p.395; unit 4363 -->

【Description】 AE module hardware statistics

<!-- Source EN PDF p.395; unit 4364 -->

【Definition】

<!-- Source EN PDF p.395; unit 4365 -->

```text
 typedef struct RkAiqAecHwStatsRes_s {
     Aec_Stat_Res_t chn[3];
     Aec_Stat_Res_t extra;
     struct yuvae_stat yuvae;
     struct sihist_stat sihist;
 } RkAiqAecHwStatsRes_t;
```

<!-- Source EN PDF p.395; unit 4366 -->

【Member】

<!-- Source EN PDF p.395; unit 4367 -->

| Member<br>Name | Description |
|---|---|
| chn[3] | The AE module is based on the statistics of the raw graph (after BLC and AWB),<br>compatible with HDR and non-HDR modes, and supports up to HDR 3TO1 S/M/L<br>statistics |
| extra | The AE module is based on the statistics of the raw graph (before Debayer), and in HDR<br>mode, it represents the statistics of the synthesized frame |
| yuvae | The AE module is based on the block information of the RGB diagram before gamma [not<br>supported by the 3588 platform]. |
| sihist | The AE module is based on the histogram information of the pre-gamma RGB diagram<br>[not supported by the 3588 platform] |

<!-- Source EN PDF p.395; unit 4368 -->

【Precautions】

<!-- Source EN PDF p.395; unit 4369 -->

Aec_Stat_Res_t chn[3]: Represents the statistics of the first 3 Raw data paths of the HDR Merge module. For non-HDR mode, the corresponding subscript is 0, and all other subscripts are invalid; HDR 2TO1 mode, when the subscript is 0, it means short frame data path statistics, subscript 1 indicates long frame data path statistics, and subscript 2 is invalid; In HDR 3TO1 mode, the subscript is 0 for short-frame data path statistics, subscript 1 for medium frame data path statistics, and subscript 2 for long-frame data path

<!-- Source EN PDF p.396; unit 4370 -->

statistics. The raw graph-based statistics module has a BLC AWB module before, so the raw-based statistics are affected by the gain value of BLC and AWB. Aec_Stat_Res_t extra: In HDR mode, extra represents the raw graph statistics after HDR compositing. The statistics module has BLC, AWB, HDRMERGE, TMO and other modules before, so the statistical information of this module is affected by the gain of BLC, AWB, HDRMERGE, TMO and other modules. In addition, when the AF module is turned on, this part of the statistics is invalid.

<!-- Source EN PDF p.396; unit 4371 -->

For the 3588 platform, block information and histogram information based on pre-gamma RGB plots are not supported

<!-- Source EN PDF p.396; unit 4372 -->

10.4.2.2.1 Aec_Stat_Res_t

<!-- Source EN PDF p.396; unit 4373 -->

【Description】 The AE module is based on the statistics of the raw graph

<!-- Source EN PDF p.396; unit 4374 -->

【Definition】

<!-- Source EN PDF p.396; unit 4375 -->

```text
 typedef struct Aec_Stat_Res_s {
     //rawae
     struct rawaebig_stat rawae_big;
     struct rawaelite_stat rawae_lite;
     //rawhist
     struct rawhist_stat rawhist_big;
     struct rawhist_stat rawhist_lite;
 } Aec_Stat_Res_t;
```

<!-- Source EN PDF p.396; unit 4376 -->

【Member】

<!-- Source EN PDF p.396; unit 4377 -->

| Member Name | Description |
|---|---|
| rawae_big | Big mode chunking statistics based on RAW graphs |
| rawae_lite | Lite mode chunking statistics based on RAW graphs |
| rawhist_big | BIG mode histogram statistics based on RAW graphs |
| rawhist_lite | Lite mode histogram statistics based on RAW graphs |

<!-- Source EN PDF p.396; unit 4378 -->

【Precautions】

<!-- Source EN PDF p.396; unit 4379 -->

For details about the difference between BIG and LITE modes based on RAW graph statistics, please refer to the function description module. It should be noted that the main difference between the big and lite modes is the number of blocks of block statistics of mean brightness and whether independent subwindow mean brightness statistics are supported. BIG and LITE mode histogram statistics based on RAW plots have the same data structure.

<!-- Source EN PDF p.396; unit 4380 -->

3588 platform, default non-HDR exposure mode, configuration BIG mode (15X15 non-standalone subwindow); HDR 2 frame mode, each frame is BIG mode (15X15 non-independent sub-window); HDR 3 frame mode, BIG mode for short and long frames (15X15 non-standalone sub-window), LITE mode for medium frame (5X5 non-standalone sub-window)

<!-- Source EN PDF p.397; unit 4381 -->

10.4.2.2.2 rawaebig_stat

<!-- Source EN PDF p.397; unit 4382 -->

【Description】 The big mode statistics based on the raw graph include the mean R/G/B brightness of 15X15 non-independent sub-windows and the sum of R/G/B brightness of 4 independent sub-windows

<!-- Source EN PDF p.397; unit 4383 -->

【Definition】

<!-- Source EN PDF p.397; unit 4384 -->

```text
 struct rawaebig_stat {
     unsigned short channelr_xy[RAWAEBIG_WIN_NUM];
     unsigned short channelg_xy[RAWAEBIG_WIN_NUM];
     unsigned short channelb_xy[RAWAEBIG_WIN_NUM];
     unsigned int   channely_xy[RAWAEBIG_WIN_NUM]; //not HW!
     unsigned long int wndx_sumr[RAWAEBIG_SUBWIN_NUM];
     unsigned long int wndx_sumg[RAWAEBIG_SUBWIN_NUM];
     unsigned long int wndx_sumb[RAWAEBIG_SUBWIN_NUM];
     unsigned short wndx_channelr[RAWAEBIG_SUBWIN_NUM]; //not HW!
     unsigned short wndx_channelg[RAWAEBIG_SUBWIN_NUM]; //not HW!
     unsigned short wndx_channelb[RAWAEBIG_SUBWIN_NUM]; //not HW!
     unsigned char wndx_channely[RAWAEBIG_SUBWIN_NUM]; //not HW!
 };
 #define RAWAEBIG_WIN_NUM    225
 #define RAWAEBIG_SUBWIN_NUM  4
```

<!-- Source EN PDF p.397; unit 4385 -->

【Member】

<!-- Source EN PDF p.397; unit 4386 -->

| Member<br>Name | Description |
|---|---|
| channelr_xy | The mean luminance information of the R channel of the BIG mode non-independent<br>subwindow tile. Number of valid bits: 10bit. |
| channelg_xy | G-channel mean luminance information for non-independent subwindow blocks in big<br>mode. Number of valid bits: 12bit. |
| channelb_xy | The average brightness information of the B-channel of the BIG mode non-independent<br>subwindow tile. Number of valid bits: 10bit. |
| wndx_sumr | R channel brightness and information for big mode independent subwindows. Number<br>of valid bits: 29bit. |
| wndx_sumg | G-channel brightness and information for BIG mode independent subwindows. Number<br>of valid bits: 32bit. |
| wndx_sumb | B-channel brightness and information for a separate subwindow in big mode. Number of<br>valid bits: 29bit. |

<!-- Source EN PDF p.397; unit 4387 -->

【Precautions】

<!-- Source EN PDF p.397; unit 4388 -->

Big mode statistics based on raw graph, only contains the statistics of R/G/B 3 channels, if you need Y channel statistics, you can add code in the software to calculate according to the R/G/B statistical values.

<!-- Source EN PDF p.397; unit 4389 -->

BIG mode statistics based on RAW graph, containing 15X15 non-independent subwindows, non- independent subwindows have a minimum size limit, and the minimum size required is 16X4.

<!-- Source EN PDF p.398; unit 4390 -->

BIG mode statistics based on RAW graph, containing 4 independent sub-windows, whose positions can overlap or not, with a maximum size requirement, which must not exceed 2k x 1k.

<!-- Source EN PDF p.398; unit 4391 -->

The channely_xy, wndx_channelr, wndx_channelg, wndx_channelb, and wndx_channely parameters in the structure are all software calculation parameters, which need to be calculated by adding code by software and calculated according to hardware statistical values.

<!-- Source EN PDF p.398; unit 4392 -->

10.4.2.2.3 rawaelite_stat

<!-- Source EN PDF p.398; unit 4393 -->

【Description】 The lite mode statistics based on the raw graph include 5X5 non-independent sub-window block R/G/B mean brightness

<!-- Source EN PDF p.398; unit 4394 -->

【Definition】

<!-- Source EN PDF p.398; unit 4395 -->

```text
 struct rawaelite_stat {
     unsigned short channelr_xy[RAWAELITE_WIN_NUM];
     unsigned short channelg_xy[RAWAELITE_WIN_NUM];
     unsigned short channelb_xy[RAWAELITE_WIN_NUM];
     unsigned int   channely_xy[RAWAELITE_WIN_NUM]; not HW!
 };
 #define RAWAELITE_WIN_NUM  25
```

<!-- Source EN PDF p.398; unit 4396 -->

【Member】

<!-- Source EN PDF p.398; unit 4397 -->

| Member<br>Name | Description |
|---|---|
| channelr_xy | Lite mode non-independent subwindow tile R channel mean luminance information.<br>Number of valid bits: 10bit. |
| channelg_xy | Lite mode non-independent subwindow tile g-channel mean luminance information.<br>Number of valid bits: 12bit. |
| channelb_xy | Lite mode non-independent subwindow tile B-channel mean luminance information.<br>Number of valid bits: 10bit. |

<!-- Source EN PDF p.398; unit 4398 -->

【Precautions】

<!-- Source EN PDF p.398; unit 4399 -->

lite mode statistics based on raw graph, only contains 5X5 non-independent subwindow R/G/B 3 channel statistics, if you need Y channel statistics, you can add code in the software to calculate according to the R/G/B statistical value. Non-standalone subwindows have a minimum size limit, which requires a minimum size of 16X4.

<!-- Source EN PDF p.398; unit 4400 -->

The channely_xy in the structure is a software calculation parameter, which needs to be added to calculate according to the hardware statistical value.

<!-- Source EN PDF p.398; unit 4401 -->

10.4.2.2.4 rawhist_stat

<!-- Source EN PDF p.398; unit 4402 -->

【Description】 Histogram statistics based on RAW plots

<!-- Source EN PDF p.398; unit 4403 -->

【Definition】

<!-- Source EN PDF p.399; unit 4404 -->

```text
 struct rawhist_stat {
     unsigned int bins[RAWHIST_BIN_N_MAX];
 };
 #define RAWHIST_BIN_N_MAX  256
```

<!-- Source EN PDF p.399; unit 4405 -->

【Member】

<!-- Source EN PDF p.399; unit 4406 -->

| Member<br>Name | Description |
|---|---|
| bins | The histogram is segmented, with a total of 256 segments, and the number of valid bits<br>in each segment: 28bit |

<!-- Source EN PDF p.399; unit 4407 -->

#### 10.4.3  rk_aiq_isp_awb_stats2_v3x_t

<!-- Source EN PDF p.399; unit 4408 -->

【Description】 Define white balance hardware statistics, mainly including white point statistics and chunking statistics

<!-- Source EN PDF p.399; unit 4409 -->

White point statistics

<!-- Source EN PDF p.399; unit 4410 -->

Record the cumulative value and number of RGins and BGain in the white areas of 7 light sources and 2 sizes in the main window;

<!-- Source EN PDF p.399; unit 4411 -->

Record the cumulative value and number of RGin and BGain in the white area of 4 light sources and 2 sizes in the sub-window;

<!-- Source EN PDF p.399; unit 4412 -->

4 UV or XY domain additional boxes in the RGin, BGain cumulative value and number;

<!-- Source EN PDF p.399; unit 4413 -->

white point brightness histogram;

<!-- Source EN PDF p.399; unit 4414 -->

Chunking statistics Image 15x15 blocks (as shown in AWB block schematic) with R, G, B means of all points or white points for each block

<!-- Source EN PDF p.399; unit 4415 -->

![Original technical figure — PDF p.399](/docs/rockchip-isp30-development/assets/en-p399-X2080.png)

<!-- Source EN PDF p.399; unit 4416 -->

Figure AWB block diagram

<!-- Source EN PDF p.399; unit 4417 -->

【Definition】

<!-- Source EN PDF p.400; unit 4418 -->

```text
 typedef struct rk_aiq_isp_awb_stats2_v3x_s {
     //method1
     rk_aiq_awb_stat_wp_res_light_v201_t light[RK_AIQ_AWB_MAX_WHITEREGIONS_NUM];
     int WpNo2[RK_AIQ_AWB_MAX_WHITEREGIONS_NUM];
     //method2
     rk_aiq_awb_stat_blk_res_v201_t   blockResult[RK_AIQ_AWB_GRID_NUM_TOTAL];
     //window in pixel domain
     rk_aiq_awb_stat_wp_res_light_v201_t
 multiwindowLightResult[RK_AIQ_AWB_MAX_WHITEREGIONS_NUM];
     //window in xy or uv domain
     rk_aiq_awb_stat_wp_res_v201_t
 excWpRangeResult[RK_AIQ_AWB_STAT_WP_RANGE_NUM_V201];
     //wpno histogram
     unsigned int WpNoHist[RK_AIQ_AWB_WP_HIST_BIN_NUM];
 } rk_aiq_isp_awb_stats2_v3x_t;
```

<!-- Source EN PDF p.400; unit 4419 -->

【Member】

<!-- Source EN PDF p.400; unit 4420 -->

| Member Name | Description |
|---|---|
| light | White point statistics results under different light sources in the main window,<br>up to RK_AIQ_AWB_MAX_WHITEREGIONS_NUM light sources; |
| WpNo2 | The number of white points at the intersection of the XY domain and the UV<br>domain under different light sources in the main window, without decimal<br>places. |
| blockResult | The RGB accumulation image of each block<br>is evenly chunked, with a total of 15x15<br>(RK_AIQ_AWB_GRID_NUM_TOTAL) blocks, as shown in the AWB block<br>diagram |
| multiwindowLightResult | White point statistics under different light sources in several sub-windows<br>(only the first 4 light sources are recorded, all light sources can be recorded by<br>time division multiplexing method), up to 4 sub-windows |
| excWpRangeResult | Statistics of points that fall in the excludeWpRange area (only the first four<br>regions of the excludeWpRange are recorded), up to 4 regions |
| WpNoHist | White dot histogram The number of white dots per bin, no decimal places.<br>Whether the white point of the XY large box or the box in XY is counted is<br>determined by the register xyRangeTypeForWpHist. |

<!-- Source EN PDF p.400; unit 4421 -->

【Precautions】

<!-- Source EN PDF p.400; unit 4422 -->

If the user wants to obtain the global white point statistics results of the main window, the white point statistics results under all light sources can be easily converted.

<!-- Source EN PDF p.401; unit 4423 -->

#### 10.4.4  rk_aiq_awb_stat_wp_res_light_v201_t

<!-- Source EN PDF p.401; unit 4424 -->

【Description】 Defines the white point statistics result under a light source

<!-- Source EN PDF p.401; unit 4425 -->

【Definition】

<!-- Source EN PDF p.401; unit 4426 -->

```text
 typedef struct rk_aiq_awb_stat_wp_res_light_v201_s {
     rk_aiq_awb_stat_wp_res_v201_t xYType[RK_AIQ_AWB_XY_TYPE_MAX_V201];
 } rk_aiq_awb_stat_wp_res_light_v201_t;
```

<!-- Source EN PDF p.401; unit 4427 -->

【Member】

<!-- Source EN PDF p.401; unit 4428 -->

| Member<br>Name | Description |
|---|---|
| XYType | The white point statistics of XY boxes of different sizes under a light source, up to<br>RK_AIQ_AWB_XY_TYPE_MAX_V201 boxes, that is, 2 boxes |

<!-- Source EN PDF p.401; unit 4429 -->

#### 10.4.5  rk_aiq_awb_stat_wp_res_v201_t

<!-- Source EN PDF p.401; unit 4430 -->

【Description】 Define the white point statistics result under the XY box of a certain size of a light source, and the non-white point statistical result in the non-white point area

<!-- Source EN PDF p.401; unit 4431 -->

【Definition】

<!-- Source EN PDF p.401; unit 4432 -->

```text
 typedef struct rk_aiq_awb_stat_wp_res_v201_s {
     long long WpNo;
     long long RgainValue;
     long long BgainValue;
 } rk_aiq_awb_stat_wp_res_v201_t;
```

<!-- Source EN PDF p.401; unit 4433 -->

【Member】

<!-- Source EN PDF p.401; unit 4434 -->

| Member<br>Name | Description |
|---|---|
| WpNo | Number of white points, 22-bit integer bits, 10ibit decimal places. where WpNo = ISP<br>hardware statistics white dot / 2^10. |
| RgainValue | Accumulation sum of white point R channels, 22-bit integer bits, 10ibit decimal places |
| BgainValue | Cumulative sum of white point G channel, 22-bit integer bits, 10ibit decimal places |

<!-- Source EN PDF p.402; unit 4435 -->

#### 10.4.6  rk_aiq_awb_stat_blk_res_v201_t

<!-- Source EN PDF p.402; unit 4436 -->

【Description】 Define the statistical results for each block.

<!-- Source EN PDF p.402; unit 4437 -->

If blkMeasureMode = =RK_AIQ_AWB_BLK_STAT_MODE_ALL_V201, the recorded result is the cumulative sum of all points in the block;

<!-- Source EN PDF p.402; unit 4438 -->

If blkMeasureMode = =RK_AIQ_AWB_BLK_STAT_MODE_REALWP_V201, the result of the record is the cumulative sum of all white points in the block;

<!-- Source EN PDF p.402; unit 4439 -->

where blkMeasureMode is the register that controls the statistical content of the block.

<!-- Source EN PDF p.402; unit 4440 -->

【Definition】

<!-- Source EN PDF p.402; unit 4441 -->

```text
 typedef struct rk_aiq_awb_stat_blk_res_v201_s {
     long long WpNo;
     long long Rvalue;
     long long Gvalue;
     long long Bvalue;
 } rk_aiq_awb_stat_blk_res_v201_t;
```

<!-- Source EN PDF p.402; unit 4442 -->

【Member】

<!-- Source EN PDF p.402; unit 4443 -->

| Member Name | Description |
|---|---|
| WpNo | The number of points within the block |
| Rvalue | The accumulation of all point R channels within the block |
| Gvalue | The accumulation of all point RG channels within the block |
| Bvalue | The accumulation of all point RB channels within the block and |

<!-- Source EN PDF p.402; unit 4444 -->

#### 10.4.7  rk_aiq_af_algo_stat_v30_t

<!-- Source EN PDF p.402; unit 4445 -->

【Description】 Define AF statistics

<!-- Source EN PDF p.402; unit 4446 -->

【Definition】

<!-- Source EN PDF p.402; unit 4447 -->

```text
 typedef struct {
     unsigned int wndb_luma;
     unsigned int wndb_sharpness;
     unsigned int winb_highlit_cnt;
     unsigned int wnda_luma[RKAIQ_RAWAF_SUMDATA_NUM];
     unsigned int wnda_fv_v1[RKAIQ_RAWAF_SUMDATA_NUM];
     unsigned int wnda_fv_v2[RKAIQ_RAWAF_SUMDATA_NUM];
     unsigned int wnda_fv_h1[RKAIQ_RAWAF_SUMDATA_NUM];
     unsigned int wnda_fv_h2[RKAIQ_RAWAF_SUMDATA_NUM];
     unsigned int wina_highlit_cnt[RKAIQ_RAWAF_SUMDATA_NUM];
     unsigned int int_state;
     struct timeval focus_starttim;
     struct timeval focus_endtim;
     struct timeval zoom_starttim;
     struct timeval zoom_endtim;
     int64_t sof_tim;
     int focusCode;
     int zoomCode;
     bool focusCorrection;
     bool zoomCorrection;
     float angleZ;
 } rk_aiq_af_algo_stat_v30_t;
```

<!-- Source EN PDF p.403; unit 4448 -->

【Member】

<!-- Source EN PDF p.403; unit 4449 -->

| Member Name | Description |
|---|---|
| wndb_luma | The brightness value of the standalone window, |
| wndb_sharpness | The clarity value of the stand-alone window |
| winb_highlit_cnt | The highlight count value of the standalone window |
| wnda_luma | The brightness value of the 15*15 subwindow under the main window |
| wnda_fv_v1 | V1 clarity value of 15*15 subwindow under the main window |
| wnda_fv_v2 | V2 sharpness value of 15*15 subwindow under the main window |
| wnda_fv_h1 | H1 clarity value of 15*15 subwindow under the main window |
| wnda_fv_h2 | H2 clarity value of 15*15 subwindow under the main window |
| wina_highlit_cnt | The highlight count value of the 15*15 subwindow under the main window |
| int_state | The RK AF algorithm is used, which can be ignored |
| focus_starttim | The RK AF algorithm is used, which can be ignored |
| focus_endtim | The RK AF algorithm is used, which can be ignored |
| zoom_starttim | The RK AF algorithm is used, which can be ignored |
| zoom_endtim | The RK AF algorithm is used, which can be ignored |
| sof_tim | The frame start time of this data frame in ns |
| focusCode | The RK AF algorithm is used, which can be ignored |
| zoomCode | The RK AF algorithm is used, which can be ignored |
| focusCorrection | The RK AF algorithm is used, which can be ignored |
| zoomCorrection | The RK AF algorithm is used, which can be ignored |
| angleZ | The RK AF algorithm is used, which can be ignored |

<!-- Source EN PDF p.404; unit 4450 -->

## 11.   Debug & FAQ

<!-- Source EN PDF p.404; unit 4451 -->

### 11.1   How to get the version number

<!-- Source EN PDF p.404; unit 4452 -->

AIQ provides version release date, AIQ version, IQ parser version, and version information of each algorithm module of ISP.

<!-- Source EN PDF p.404; unit 4453 -->

11.1.0.1  Get abbreviated version information

<!-- Source EN PDF p.404; unit 4454 -->

```text
 strings librkaiq.so | grep -w AIQ
 AIQ: v0.1.6
```

<!-- Source EN PDF p.404; unit 4455 -->

11.1.0.2  Get full version information

<!-- Source EN PDF p.404; unit 4456 -->

1\. The aiq library in the SDK is compiled to the Release version by default, and you need to change it to the Debug version, recompile the aiq library, and update it to the device.

<!-- Source EN PDF p.404; unit 4457 -->

```text
SDK/external/camera_engine_rkaiq/CMakeLists.txt:
```

<!-- Source EN PDF p.404; unit 4458 -->

```text
if(NOT CMAKE_BUILD_TYPE STREQUAL "Release")
add_definitions(-DBUILD_TYPE_DEBUG)
endif()
```

<!-- Source EN PDF p.404; unit 4459 -->

Changed to:

<!-- Source EN PDF p.404; unit 4460 -->

```text
#if(NOT CMAKE_BUILD_TYPE STREQUAL "Release")
add_definitions(-DBUILD_TYPE_DEBUG)
#endif()
```

<!-- Source EN PDF p.404; unit 4461 -->

2\. Under the default print level, the AIQ library loaded and running will not print, you can set the log level of the xcore module to print the AIQ version information:

<!-- Source EN PDF p.404; unit 4462 -->

```text
 export persist_camera_engine_log=0x1000000ff2
```

<!-- Source EN PDF p.404; unit 4463 -->

3\. The printed version information when AIQ is started is as follows:

<!-- Source EN PDF p.404; unit 4464 -->

```text
 ************************** VERSION INFOS **************************
 version release date: 2020-06-05
                  AIQ: v0.1.6
            IQ PARSER: v1.0.0
 RK INTEGRATED ALGO MODULES:
                  AWB: v0.0.9
                  AEC: v0.1.1
                   AF: v0.0.9
                 AHDR: v0.0.9
                  ANR: v0.0.9
               ASHARP: v0.0.9
              ADEHAZE: v0.0.9
               AGAMMA: v0.0.9
               A3DLUT: v0.0.9
                 ABLC: v0.0.9
                 ACCM: v0.0.9
                 ACGC: v0.0.9
                  ACP: v0.0.9
             ADEBAYER: v0.0.1
                ADPCC: v0.0.9
                 AGIC: v0.0.9
                  AIE: v0.0.1
                ALDCH: v0.0.9
                 ALSC: v0.0.9
                 AORB: v0.0.9
                 AR2Y: v0.0.9
                  ASD: v0.0.9
                 AWDR: v0.0.9
 ************************ VERSION INFOS END ************************
```

<!-- Source EN PDF p.405; unit 4465 -->

#### 11.1.1  Version number matching rule description

<!-- Source EN PDF p.405; unit 4466 -->

The matching rules between AIQ and IQ Tool and ISP Driver are as follows:

<!-- Source EN PDF p.405; unit 4467 -->

v A . B. C

<!-- Source EN PDF p.405; unit 4468 -->

where B is the base-16 representation, bit[0:3] identifies the matching version of AIQ and IQ Tool, and bit[4:7] identifies the matching version of AIQ and ISP driver, for example:

<!-- Source EN PDF p.405; unit 4469 -->

ISP driver：v 1. 0x3.0 matches AIQ:v1.0x30.0 and AIQ:v1.0x40.0.

<!-- Source EN PDF p.405; unit 4470 -->

IQ tool：v 1. 0x3.0 matches AIQ:v1.0x33.0 and AIQ:v1.0x30.0, where AIQ version number C is not 0, there may be a version mismatch, for IQ Tool matching, it is recommended to use the AIQ version with C version number 0 first.

<!-- Source EN PDF p.405; unit 4471 -->

### 11.2   AIQ Log

<!-- Source EN PDF p.405; unit 4472 -->

#### 11.2.1  Overview

<!-- Source EN PDF p.405; unit 4473 -->

AIQ uses 64bits to represent the log level of all modules, and the bitmaps and descriptions of each module are as follows:

<!-- Source EN PDF p.405; unit 4474 -->

```text
 bit: [63-39]   38      37       36    35   34     33    32    31
 mean:  [U]   [CAMHW][ANALYZER][XCORE][ASD][ACGC][AFEC][AORB][ASHARP]
 bit:  30   29   28     27     26       25      24   23       22
 mean:[AIE][ACP][ACSM][ALDCH][A3DLUT][ADEHAZE][AWDR][AGAMMA][ACCM]
 bit:      21     20    19   18    17    16     15   14  13   12
 mean:[ADEBAYER][AGIC][ALSC][ANR][AHDR][ADPCC][ABLC][AF][AWB][AEC]
 bit:    11-4        3-0
 mean:[sub modules][level]
     [U] means unused now.
     [level] : use 4 bits to define log levels.
     each module log has following ascending levels:
     0: error
     1: warning
     2: info
     3: debug
     4: verbose
     5: low1
     6-7: unused, now the same as debug
     [sub modules] : use bits 4-11 to define the sub modules of each module,
 thespecific meaning of each bit is decided by the module itself. These bitsis
 designed to implement the sub module's log switch.
     [modules] : AEC, AWB, AF ...
     set debug level example:
     eg. set module af log level to debug, and enable all sub modules of af:
     Android:
     setprop persist.vendor.rkisp.log 0x4ff4
     Linux:
     export persist_camera_engine_log=0x4ff4
     And if only want enable the sub module 1 log of af:
     Android:
     setprop persist.vendor.rkisp.log 0x4014
     Linux:
     export persist_camera_engine_log=0x4014
```

<!-- Source EN PDF p.406; unit 4475 -->

As explained above, the switch level of each module is controlled by setting the environment variable persist_camera_engine_log the Linux environment.

<!-- Source EN PDF p.407; unit 4476 -->

| Module | Debug log | Verbose log |
|---|---|---|
| AE | export persist_camera_engine_log=0x1ff3 | export persist_camera_engine_log=0x1ff4 |
| AWB | export persist_camera_engine_log=0x2ff3 | export persist_camera_engine_log=0x2ff4 |
| AF | export persist_camera_engine_log=0x4ff3 | export persist_camera_engine_log=0x4ff4 |
| HDR | export persist_camera_engine_log=0x20ff3 | export persist_camera_engine_log=0x20ff3 |
| NR | export persist_camera_engine_log=0x40ff3 | export persist_camera_engine_log=0x40ff4 |
| Dehaze | export persist_camera_engine_log=0x2000ff3 | export persist_camera_engine_log=0x2000ff3 |
| Sharp | export persist_camera_engine_log=0x80000ff3 | export persist_camera_engine_log=0x80000ff4 |
| CAMHW | export<br>persist_camera_engine_log=0x4000000ff3 | export<br>persist_camera_engine_log=0x4000000ff4 |
|  |  |  |
|  |  |  |
|  |  |  |

<!-- Source EN PDF p.407; unit 4477 -->

To view the current log level, run the following command:

<!-- Source EN PDF p.407; unit 4478 -->

```text
    [root@RV1126_RV1109:/]# echo $persist_camera_engine_log
    0x4014
```

<!-- Source EN PDF p.407; unit 4479 -->

#### 11.2.2  AE

<!-- Source EN PDF p.407; unit 4480 -->

11.2.2.1  Configuration guide

<!-- Source EN PDF p.407; unit 4481 -->

| Log<br>level | Description and enabling suggestions |
|---|---|
| Error | Enabled by default<br>Critical error |
| Warning | Not enabled by default<br>Warn error, the algorithm may have exception handling for the error, and the algorithm can<br>continue to run |
| Info | Not enabled by default<br>Basic debugging information:<br>Frame-by-frame output information: None<br>Event information: The running status information and frame rate information in the algorithm<br>are generally only printed when initializing, switching resolution, and modifying configuration<br>parameters<br>Suggestion:<br>It is used to know the running status and frame rate value of the algorithm |

<!-- Source EN PDF p.408; unit 4482 -->

| Log<br>level | Description and enabling suggestions |
|---|---|
| Debug | Not enabled by default<br>Basic debugging information (increased relative to Info level):<br>Frame-by-frame output information: frame number, frame-matched exposure, frame-matched<br>AE statistics (image brightness), and exposure result value<br>Event information:<br>Suggestion：<br>Debug problems such as image brightness flickering with continuous image brightness,<br>exposure, and other information |
| Verbose | Not enabled by default<br>Basic debugging information (relative to Debug level increase):<br>Frame-by-frame output information: algorithm related operation result information<br>Event information:<br>Suggestion:<br>Generally, it is not enabled, and it is enabled when the debug level cannot judge the problem |

<!-- Source EN PDF p.408; unit 4483 -->

| Sub<br>modules bit | Description and enabling recommendations |
|---|---|
| bit[4] | Log level related to AE parameter configuration<br>Suggestion:<br>When reading IQ or API setting parameters, you can check whether the configuration<br>parameters are correct according to the log. |
| bit[5] | The AE information processing module logs the switch, which calculates the environment<br>and image-related indicators according to AE statistics.<br>Suggestion:<br>Read luminance information related to statistical values. |
| bit[6] | AE exposure calculation module log switch.<br>Suggestion:<br>Read information related to exposure results |
| bit[7] | log level associated with the Airis aperture algorithm,<br>Suggestion:<br>Issues with variable aperture. |
| bit[8:11] | void |

<!-- Source EN PDF p.408; unit 4484 -->

11.2.2.2  Log interpretation

<!-- Source EN PDF p.408; unit 4485 -->

Due to space limitations, only the debug level (0x1ff3, corresponding to the debug level information of all submodules of AE) is interpreted here.

<!-- Source EN PDF p.408; unit 4486 -->

Linear mode AE LOG

<!-- Source EN PDF p.409; unit 4487 -->

![Original technical figure — PDF p.409](/docs/rockchip-isp30-development/assets/en-p409-X2117.png)

<!-- Source EN PDF p.409; unit 4488 -->

Figure 3-1 LINEAR MODE AE LOG

<!-- Source EN PDF p.409; unit 4489 -->

Figure 3-1 shows an example of AE LOG in linear mode. Line1：

<!-- Source EN PDF p.409; unit 4490 -->

```text
Cur-Exp: FrmId=270,gain=0x36a,time=0x576,envChange=0,dcg=-1,pirs=0
```

<!-- Source EN PDF p.409; unit 4491 -->

Exposure parameter information for the current frame.

<!-- Source EN PDF p.409; unit 4492 -->

| Member<br>name | Description |
|---|---|
| FrmId | The frame number of the current frame |
| gain | The sensor exposure gain register value for the current frame |
| time | The sensor exposure time register value for the current frame |
| envChange | Whether the ambient brightness has changed abruptly in the current frame. 0: No<br>sudden change in ambient brightness; 1: Ambient brightness mutation |
| dcg | DCG mode corresponding to the current frame. -1: The sensor does not support<br>DCG mode or switches DCG mode inside the sensor; 0: LCG mode; 1: HCG mode |
| pirs | The p-iris aperture stepper motor position corresponding to the current frame. If the<br>Airis function is disabled, this parameter is invalid and meaningless. |

<!-- Source EN PDF p.409; unit 4493 -->

Line2：

<!-- Source EN PDF p.409; unit 4494 -->

```text
Last-Res:FrmId=269,gain=0x356,time=0x576,pirs=0
```

<!-- Source EN PDF p.409; unit 4495 -->

The new exposure parameters set by the last run AE are some of the same as those in (1), and will not be repeated here. By comparing the exposure parameter LOG information of Line1 and Line2, we can know whether the current exposure is consistent with the new exposure, that is, whether the new exposure has taken effect. Line3：

<!-- Source EN PDF p.409; unit 4496 -->

```text
================================= Linear-AE (enter)===============================
```

<!-- Source EN PDF p.409; unit 4497 -->

Enter the AE control algorithm module, Linear-AE indicates that the current linear exposure mode is present.

<!-- Source EN PDF p.409; unit 4498 -->

Line4：

<!-- Source EN PDF p.409; unit 4499 -->

```text
Framenum=270
```

<!-- Source EN PDF p.409; unit 4500 -->

```text
Cur gain=6.826667,time=0.029987,pirisGain=0,RawMeanluma=29.564444,YuvMeanluma=34.875557,Is Converged=0
```

<!-- Source EN PDF p.410; unit 4501 -->

| Member<br>name | Description |
|---|---|
| Framenum | The frame number of the current frame |
| gain | The sensor exposure gain value corresponding to the current frame |
| time | The sensor exposure time value corresponding to the current frame |
| pirisGain | The equivalent gain value of the p-iris aperture corresponding to the current<br>frame. If the Airis function is turned off, this parameter is invalid and meaningless. |
| RawMeanluma | The brightness of the Debayer front RAW image corresponding to the current<br>frame has been subtracted from the black level and multiplied by AWB Gain. |
| YuvMeanluma | The brightness of the RGB figure before gamma corresponding to the current<br>frame is used to judge the influence of the module after debayer on the brightness. |
| IsConverged | Whether the exposure of the current frame has converged. 0: exposure does not<br>converge; 1: The exposure has converged |

<!-- Source EN PDF p.410; unit 4502 -->

Line 5：

<!-- Source EN PDF p.410; unit 4503 -->

```text
AecClmExecute: NewExposure(0.180993) SplitGain(6.033096) SplitIntegrationTime(0.030000) SplitPirisGain(0)
```

<!-- Source EN PDF p.410; unit 4504 -->

| Member name | Description |
|---|---|
| NewExposure | The new exposure value derived by the AE control algorithm |
| SplitGain | New sensor exposure gain |
| SplitIntegrationTime | New sensor exposure time |
| SplitPirisGain | New P-IRIS aperture equivalent gain value. If the Airis function is turned<br>off, this parameter is invalid and meaningless. |

<!-- Source EN PDF p.410; unit 4505 -->

Line6:

<!-- Source EN PDF p.410; unit 4506 -->

```text
calc result:SetPoint=22.000000,gain=6.023529,time=0.029987,piris=0,reggain=854,regtime=1398
```

<!-- Source EN PDF p.410; unit 4507 -->

The new exposure that is finally set

<!-- Source EN PDF p.411; unit 4508 -->

| Member<br>name | Description |
|---|---|
| SetPoint | Target brightness value |
| gain | The final new exposure gain value |
| time | The final new exposure time value |
| piris | The final new P-IRIS aperture equivalent gain value. If the Airis function is turned<br>off, this parameter is invalid and meaningless. |
| reggain | The register value corresponding to the final new exposure gain value |
| regtime | The register value corresponding to the final new exposure time value |

<!-- Source EN PDF p.411; unit 4509 -->

In summary, you can know the brightness of the current frame RawMeanLuma, and the corresponding target brightness setpoint. The new exposure is calculated by comparing the brightness of the picture with the target brightness. HDR Mode AE LOG:

<!-- Source EN PDF p.411; unit 4510 -->

![Original technical figure — PDF p.411](/docs/rockchip-isp30-development/assets/en-p411-X2122.png)

<!-- Source EN PDF p.411; unit 4511 -->

Figure 3-2 HDR mode AE LOG

<!-- Source EN PDF p.411; unit 4512 -->

Line1:

<!-- Source EN PDF p.411; unit 4513 -->

```text
Cur-Exp: FrmId=22,S-gain=0x0,S-time=0x2b6,M-gain=0xb,M-time=0x1a5e,L-gain=0x0,L- time=0x0,envChange=1,dcg=-1--1--1,Piris=0
```

<!-- Source EN PDF p.411; unit 4514 -->

Exposure parameter information for the current frame.

<!-- Source EN PDF p.412; unit 4515 -->

| Member<br>name | Description |
|---|---|
| FrmId | The frame number of the current frame |
| S/M/L-gain | The sensor exposure gain register value corresponding to each frame of the current<br>HDR. S/M is valid in HDR 2 frame mode; In HDR 3 frame mode, both S/M/L are<br>valid |
| S/M/L-time | The sensor exposure time register value for each frame of the current HDR. S/M is<br>valid in HDR 2 frame mode; In HDR 3 frame mode, both S/M/L are valid |
| envChange | Whether the ambient brightness has changed abruptly in the current frame. 0: No<br>sudden change in ambient brightness; 1: Ambient brightness mutation |
| dcg | The DCG mode corresponding to the current frame corresponds to 3 short, medium<br>and long frames. In HDR 2 frame mode, the first two values are valid, representing<br>the DCG mode of short and long frames, respectively; In HDR 3 frame mode, the<br>three values represent the short, medium, and long DCG mode. -1: The sensor does<br>not support DCG mode or switches DCG mode inside the sensor; 0: LCG mode; 1:<br>HCG mode |
| pirs | The p-iris aperture stepper motor position corresponding to the current frame. If the<br>Airis function is disabled, this parameter is invalid and meaningless. |

<!-- Source EN PDF p.412; unit 4516 -->

Line2:

<!-- Source EN PDF p.412; unit 4517 -->

```text
Last-Res:FrmId=20,S-gain=0x5,S-time=0x8ca,M-gain=0x11,M-time=0x1a5e,L-gain=0x0,L- time=0x0
```

<!-- Source EN PDF p.412; unit 4518 -->

The new exposure parameters set by the last run AE are some of the same as those in (1), and will not be repeated here. By comparing the exposure parameter LOG information of Line1 and Line2, we can know whether the current exposure is consistent with the new exposure, that is, whether the new exposure has taken effect.

<!-- Source EN PDF p.412; unit 4519 -->

Line3:

<!-- Source EN PDF p.412; unit 4520 -->

```text
================================= HDR-AE (enter)===============================
```

<!-- Source EN PDF p.412; unit 4521 -->

Enter the AE control algorithm module, HDR-AE indicates that the current HDR exposure mode is present.

<!-- Source EN PDF p.412; unit 4522 -->

Line4:

<!-- Source EN PDF p.412; unit 4523 -->

```text
AecRun: SMeanLuma=9.342692, MMeanLuma=37.698597,LMeanLuma=0.000000,TmoMeanluma=37.571430,Isconverged=0,Longfr m=0
```

<!-- Source EN PDF p.413; unit 4524 -->

| Member name | Description |
|---|---|
| S/M/LMeanLuma | The average luminance of each frame of the current HDR. S/M is valid in HDR<br>2 frame mode; In HDR 3 frame mode, both S/M/L are valid. |
| TmoMeanluma | The average luminance output of the TMO module in the current frame. |
| Isconverged | Whether the exposure of each frame of the current HDR converges. 0: exposure<br>does not converge; 1: Exposure has converged. |
| Longfrm | The long frame mode state of the current frame. 0: Long frame mode is off; 1:<br>Long frame mode is on. |

<!-- Source EN PDF p.413; unit 4525 -->

Line5：

<!-- Source EN PDF p.413; unit 4526 -->

```text
Framenum=22 Cur Piris=0, Sgain=1.000000,Stime=0.002570,mgain=1.462177,mtime=0.025000,lgain=1.000000,ltime=0.000000
```

<!-- Source EN PDF p.413; unit 4527 -->

| Member<br>name | Description |
|---|---|
| Framenum | The frame number of the current frame. |
| s/m/lgain | The sensor exposure gain value corresponding to the current frame. In HDR 2 frame<br>mode, s/m is valid; In HDR 3 frame mode, both s/m/l are valid. |
| s/m/ltime | The sensor exposure time value corresponding to the current frame. In HDR 2 frame<br>mode, s/m is valid; In HDR 3 frame mode, both s/m/l are valid. |
| piris | The equivalent gain value of the p-iris aperture corresponding to the current frame.<br>If the Airis function is disabled, this parameter is invalid and meaningless. |

<!-- Source EN PDF p.413; unit 4528 -->

Line6:

<!-- Source EN PDF p.413; unit 4529 -->

```text
S-HighLightLuma=197.250000,S-Target=100.000000,S-GlobalLuma=9.342692,S-Target=19.959433
```

<!-- Source EN PDF p.413; unit 4530 -->

Short frame control algorithm LOG

<!-- Source EN PDF p.413; unit 4531 -->

| Member name | Description |
|---|---|
| S-HighLightLuma | The brightness of the highlighted area of the current short frame. |
| S-Target | The target brightness of the highlighted area of the current short frame. |
| S-GlobalLuma | Average brightness of the current short frame global area. |
| S-Target | The target brightness of the current short frame global area. |

<!-- Source EN PDF p.413; unit 4532 -->

Line7:

<!-- Source EN PDF p.413; unit 4533 -->

```text
L-LowLightLuma=29.626642,L-Target=48.572094,L-GlobalLuma=37.698597,L-Target=77.620155
```

<!-- Source EN PDF p.413; unit 4534 -->

Long frame control algorithm LOG

<!-- Source EN PDF p.414; unit 4535 -->

| Member name | Description |
|---|---|
| L-LowLightLuma | Current long frame dark area brightness |
| L-Target | Target brightness for the current long frame dark area. |
| L-GlobalLuma | Average brightness of the global area of the current long frame. |
| L-Target | The target brightness of the current long frame global area. |

<!-- Source EN PDF p.414; unit 4536 -->

Line8:

<!-- Source EN PDF p.414; unit 4537 -->

```text
calc result:piris=0,sgain=1.000000,stime=0.005081,mgain=1.862087,mtime=0.025000,lgain=0.000000,lti me=0.000000
```

<!-- Source EN PDF p.414; unit 4538 -->

AE controls the exposure result output by the algorithm

<!-- Source EN PDF p.414; unit 4539 -->

| Member<br>name | Description |
|---|---|
| s/m/lgain | The final new sensor exposure gain value. In HDR 2 frame mode, s/m is valid; In<br>HDR 3 frame mode, both s/m/l are valid |
| s/m/ltime | The final new sensor exposure time value. In HDR 2 frame mode, s/m is valid; In<br>HDR 3 frame mode, both s/m/l are valid |
| piris | The final new P-IRIS aperture is equivalent to the gain value. If the Airis function is<br>disabled, this parameter is invalid and meaningless. |

<!-- Source EN PDF p.414; unit 4540 -->

#### 11.2.3  AWB

<!-- Source EN PDF p.414; unit 4541 -->

11.2.3.1  Configuration guide

<!-- Source EN PDF p.414; unit 4542 -->

| Log<br>level | Description and enabling recommendations |
|---|---|
| Error | Enabled by default<br>Critical error |
| Warning | Enabled by default<br>Warn error, for which there may be exception handling internally. |
| Info | Not enabled by default<br>Basic debugging information:<br>Frame-by-frame output information: wbgain results<br>Event Information:<br>Suggestion: |

<!-- Source EN PDF p.415; unit 4543 -->

| Log<br>level | Description and enabling recommendations |
|---|---|
| debug | Not enabled by default<br>Basic debug information (relative to Info level increase):<br>Frame by frame output information: white balance convergence state, ambient brightness,<br>number of white points, total color temperature information, probability of the first four light<br>sources with high probability, etc<br>Event information: The relevant attribute information is printed after the AWS API is called<br>Recommendation:When there is a limit on the output log size, this level can be used to obtain<br>key log information for debugging |
| Verbose | Not enabled by default<br>Basic debugging information (relative to Debug level increase):<br>Frame-by-frame output information: white point statistics (white balance gain, number of<br>white points) of each light source, and strategy-related intermediate results, etc<br>Event Information:<br>Suggestion:It is recommended to use this level to catch the complete log for debugs |

<!-- Source EN PDF p.415; unit 4544 -->

| Sub modules bit | Description and enabling recommendations |
|---|---|
| bit[4:11] | void |

<!-- Source EN PDF p.415; unit 4545 -->

11.2.3.2  Log interpretation

<!-- Source EN PDF p.415; unit 4546 -->

Refer to《Rockchip_Color_Optimization_Guide_ISP2x_CN》

<!-- Source EN PDF p.415; unit 4547 -->

#### 11.2.4  AF

<!-- Source EN PDF p.415; unit 4548 -->

11.2.4.1  Configuration guide

<!-- Source EN PDF p.415; unit 4549 -->

| Log<br>level | Description and enabling recommendations |
|---|---|
| Error | Enabled by default<br>Critical error |
| Warning | Not enabled by default<br>Warn error, for which there may be exception handling internally. |
| Info | Not enabled by default<br>Basic debugging information:<br>Frame-by-frame output information: The final result of the focus search algorithm<br>Event Information:<br>suggestion： |

<!-- Source EN PDF p.416; unit 4550 -->

| Log<br>level | Description and enabling recommendations |
|---|---|
| debug | Not enabled by default<br>Basic debugging information (increased relative to Info level):<br>Frame-by-frame output information: FV statistical value, motor movement position<br>information<br>Event information: Focus trigger, clear position search, zoom, focus following, focus<br>Suggestion:<br>It is recommended to use this level to catch the complete log for debugs |
| Verbose | Not enabled by default<br>Basic debugging information (relative to Debug level increase) : None<br>Frame-by-frame output information:<br>Event Information:<br>Recommendation:None |

<!-- Source EN PDF p.416; unit 4551 -->

| Sub modules bit | Description and enabling recommendations |
|---|---|
| bit[4:11] | void |

<!-- Source EN PDF p.416; unit 4552 -->

11.2.4.2  Log interpretation

<!-- Source EN PDF p.416; unit 4553 -->

#### 11.2.5  MERGE

<!-- Source EN PDF p.416; unit 4554 -->

11.2.5.1  Configuration guide

<!-- Source EN PDF p.416; unit 4555 -->

| Log<br>level | Description and enabling recommendations |
|---|---|
| Info | Not enabled by default<br>Basic debugging information:<br>Frame-by-frame output information: Not yet used<br>Event Information: Not yet used<br>suggestion：Shut down |
| debug | Not enabled by default<br>Basic debugging information:<br>Frame-by-frame output information: Merge debugging information<br>Event Information: Not yet used<br>suggestion：Turn on when the brightness of the screen does not meet expectations, or the<br>contrast ratio is not enough after TMO |
| Verbose | Not enabled by default<br>Basic debug information (increased relative to Verbose rating):<br>Frame-by-frame output information: Mrerge exposure related information<br>Event Information: Not yet used<br>Suggestion:When the screen flashes, confirm from the AE log that TMO is turned on when<br>flashing for RK personnel to use debugs |

<!-- Source EN PDF p.417; unit 4556 -->

| Sub modules bit | Description and enabling recommendations |
|---|---|
| bit[4:11] | void |

<!-- Source EN PDF p.417; unit 4557 -->

11.2.5.2  Log interpretation

<!-- Source EN PDF p.417; unit 4558 -->

When the mode is linear, the merge log level is as follows:

<!-- Source EN PDF p.417; unit 4559 -->

![Original technical figure — PDF p.417](/docs/rockchip-isp30-development/assets/en-p417-X2143.png)

<!-- Source EN PDF p.417; unit 4560 -->

When the mode is HDR and the base frame is long, the merge log level is 10000000ff3

<!-- Source EN PDF p.417; unit 4561 -->

![Original technical figure — PDF p.417](/docs/rockchip-isp30-development/assets/en-p417-X2144.png)

<!-- Source EN PDF p.418; unit 4562 -->

| Name | Description |
|---|---|
| FrameID | Frame number |
| HDRFrameNum | Number of HDR frames |
| LongFrmMode | Long frame mode switch, 0: off, 1: on |
| MergeApiMode | API pattern |
| EnvLv | Ambient brightness |
| MoveCoef | Motion variables |
| bypass | The current frame bypass switch, 0: off, 1: on |
| BaseFrm | Base frame mode, 0: long frame mode, 1: short frame mode |
| OECurve_smooth | The slope of the current frame overexposure curve, the value range [0,200], is<br>obtained by the inverse normalization of the parameters in JSON, with a<br>coefficient of 200. |
| OECurve_offset | The offset value of the current frame overexposure curve, in the range [108,280]. |
| MDCurveMS_smooth | The slope of the motion curve between the frame and the short frame in the<br>current frame, the value range is [0,200], which is obtained by the inverse<br>normalization of the parameters in JSON with a coefficient of 200. |
| MDCurveMS_offset | The offset value of the motion curve between the frame and the short frame in<br>the current frame is in the range of [0.26,100], which is obtained by the inverse<br>normalization of the parameters in JSON with a coefficient of 100. |
| MDCurveLM_smooth | The slope of the motion curve between the current frame length frame and the<br>middle frame, the value range is [0,200], which is obtained by the inverse<br>normalization of the parameters in JSON, with a coefficient of 200. |
| MDCurveLM_offset | The motion curve offset value between the current frame length frame and the<br>middle frame is in the range of [0.26,100], which is obtained by the inverse<br>normalization of parameters in JSON with a coefficient of 100. |

<!-- Source EN PDF p.418; unit 4563 -->

When the mode is HDR and the base frame is short, the merge log level is 10000000ff3

<!-- Source EN PDF p.418; unit 4564 -->

![Original technical figure — PDF p.418](/docs/rockchip-isp30-development/assets/en-p418-X2148.png)

<!-- Source EN PDF p.419; unit 4565 -->

| Name | Description |
|---|---|
| FrameID | Frame number |
| HDRFrameNum | Number of HDR frames |
| LongFrmMode | Long frame mode switch, 0: off, 1: on |
| MergeApiMode | API pattern |
| EnvLv | Ambient brightness |
| MoveCoef | Motion variables |
| bypass | The current frame bypass switch, 0: off, 1: on |
| BaseFrm | Base frame mode, 0: long frame mode, 1: short frame mode |
| OECurve_smooth | The slope of the current frame overexposure curve, the value range [0,200], is<br>obtained by the inverse normalization of the parameters in JSON, with a coefficient<br>of 200. |
| OECurve_offset | The offset value of the current frame overexposure curve, in the range [108,280]. |
| MDCurve_Coef | The current frame control coefficient, the value range [0,1], the default value is<br>0.05, and the accuracy is 0.0001. |
| MDCurve_ms_thd0 | The control coefficient of short frames in the current frame is in the range of [0,1],<br>and the default value is 0.0 and the accuracy is 0.1. |
| MDCurve_lm_thd0 | The frame control coefficient in the current frame length is in the range [0,1], and<br>the default value is 0.0 and the accuracy is 0.1. |

<!-- Source EN PDF p.419; unit 4566 -->

#### 11.2.6  DRC

<!-- Source EN PDF p.419; unit 4567 -->

11.2.6.1  Configuration guide

<!-- Source EN PDF p.419; unit 4568 -->

| Log<br>level | Description and enabling recommendations |
|---|---|
| Info | Not enabled by default<br>Basic debugging information:<br>Frame-by-frame output information: Not yet used<br>Event Information: Not yet used<br>suggestion：Shut down |
| debug | Not enabled by default<br>Basic debugging information:<br>Frame-by-frame output information: DRC debug information<br>Event Information: Not yet used<br>Recommendation: Turn on when the brightness of the picture does not meet expectations, or<br>the contrast ratio is not enough after TMO |

<!-- Source EN PDF p.420; unit 4569 -->

| Log<br>level | Description and enabling recommendations |
|---|---|
| Verbose | Not enabled by default<br>Basic debug information (increased relative to Verbose rating):<br>Frame-by-frame output information: DRC exposure-related information<br>Event Information: Not yet used<br>Suggestion: When the screen flashes, confirm from the AE log that TMO is turned on when<br>flashing for RK personnel to use debugs |

<!-- Source EN PDF p.420; unit 4570 -->

| Sub modules bit | Description and enabling recommendations |
|---|---|
| bit[4:11] | void |

<!-- Source EN PDF p.420; unit 4571 -->

11.2.6.2  log interpretation

<!-- Source EN PDF p.420; unit 4572 -->

When the DRC log level is 20ff3

<!-- Source EN PDF p.420; unit 4573 -->

![Original technical figure — PDF p.420](/docs/rockchip-isp30-development/assets/en-p420-X2155.png)

<!-- Source EN PDF p.421; unit 4574 -->

| Name | Description |
|---|---|
| FrameID | Frame number |
| HDRFrameNum | Number of HDR frames |
| LongFrmMode | Long frame mode switch, 0: off, 1: on |
| DRCApiMode | API pattern |
| EnvLv | Ambient brightness |
| bypass | The current frame bypass switch, 0: off, 1: on |
| Enable | DRC switch |
| DrcGain | The current frame DRC block gain, value range [1,8]. |
| Alpha | The current frame DrcGain Alpha value, the value range [0,1]. |
| Clip | The current frame DrcGain Clip value, value range [0,64]. |
| Strength | HiLight highlight area detail of the current frame, value range [0,1]. |
| CompressMode | The current frame CompressSetting mode. |
| LocalWeit | Local weight of the current frame, value range [0, 1], 0:Global, 1: All Local, default<br>value 0. |
| LocalAutoEnable | The current frame is automatically LocalWeit switch, the value range is [0,1], the<br>default value is 1, and the accuracy is 1. |
| LocalAutoWeit | The current frame automatically has a LocalWeit value, the value range is [0,1], the<br>default value is 0.4, and the accuracy is 0.01. |
| GlobalContrast | The global contrast ratio of the current frame, the value range [0,1], the default value<br>is 0, and the accuracy is 0.01. |
| LoLitContrast | The contrast ratio of the current frame in the low volume area, the value range is<br>[0,1], the default value is 0, and the accuracy is 0.01. |

<!-- Source EN PDF p.421; unit 4575 -->

#### 11.2.7  NR&Sharp

<!-- Source EN PDF p.421; unit 4576 -->

11.2.7.1  Configuration guide

<!-- Source EN PDF p.421; unit 4577 -->

| Log<br>level | Description and enabling recommendations |
|---|---|
| error | Enabled by default<br>Basic debugging information:<br>Frame by frame output information: Critical errors in prints that may cause the software to<br>crash<br>Event Information: Not yet used<br>Recommended:Turn on |

<!-- Source EN PDF p.422; unit 4578 -->

| Log<br>level | Description and enabling recommendations |
|---|---|
| Info | Not enabled by default<br>Basic debugging information:<br>Frame-by-frame output information: all function call information, no register values printed.<br>More information overall.<br>Event Information: Not yet used<br>Recommendation: It is not recommended to turn on this item when the effect is not abnormal<br>and there is no error. It is generally recommended to use the io command to print register<br>values. |
| debug | Not enabled by default<br>Basic debugging information (relative to Info level increase):<br>Frame-by-frame output information: All function call information, including register value<br>printing, register value printing information is more.<br>Event Information: Not yet used<br>Recommendation: When there is a serious error in the effect, it is recommended to turn this on<br>and provide it to rk debug use. |

<!-- Source EN PDF p.422; unit 4579 -->

| Sub modules bit | Description and enabling recommendations |
|---|---|
| bit[4:11] | void |

<!-- Source EN PDF p.422; unit 4580 -->

11.2.7.2  log interpretation

<!-- Source EN PDF p.422; unit 4581 -->

#### 11.2.8  Dhz&Ehz

<!-- Source EN PDF p.422; unit 4582 -->

11.2.8.1  Configuration Guide

<!-- Source EN PDF p.422; unit 4583 -->

| Log level | Description and enabling recommendations |
|---|---|
| Info | Not enabled by default<br>Basic debugging information:<br>Frame-by-frame output information: Not yet used<br>Event Information: Not yet used<br>suggestion： |
| debug | Not enabled by default<br>Basic debugging information (relative to Info level increase):<br>Frame-by-frame output information: DHZ &amp; Ehz debug information<br>Event Information:<br>suggestion： |

<!-- Source EN PDF p.423; unit 4584 -->

| Log level | Description and enabling recommendations |
|---|---|
| Verbose | Not enabled by default<br>Basic debug information (increased relative to Verbose rating):<br>Frame-by-frame output information: Not yet used<br>Event Information: Not yet used<br>Suggestion: |

<!-- Source EN PDF p.423; unit 4585 -->

| Sub modules bit | Description and enabling recommendations |
|---|---|
| bit[4:11] | void |

<!-- Source EN PDF p.423; unit 4586 -->

11.2.8.2  Log interpretation

<!-- Source EN PDF p.423; unit 4587 -->

When the Enhance feature is enabled, the Dehaze log level is 2000ff3

<!-- Source EN PDF p.423; unit 4588 -->

![Original technical figure — PDF p.423](/docs/rockchip-isp30-development/assets/en-p423-X2168.png)

<!-- Source EN PDF p.423; unit 4589 -->

| Name | Description |
|---|---|
| FrameID | Frame number |
| byPassProc | The current frame bypass switch, 0: off, 1: on |
| ISO | ISO |
| Dehaze module en | Dehaze module switch |
| Dehaze en | Dehaze function switch |
| Enhance en | Enhanced function switch |
| Hist en | Hist function switch |
| EnvLv | The ambient brightness of the current frame |
| enhance_value | The current frame has a general contrast force, the value range [0,16], and the<br>recommended range [1, 2]. |
| enhance_chroma | Enhanced adjustment parameters for the chromaticity of the current frame, value<br>range [0,16], recommended range [1, 2]. |
| enhance_value_reg | The current frame has a generic contrast force reg value. |
| enhance_chroma_reg | The REG value of the enhanced tuning parameter for the current frame<br>chromaticity. |

<!-- Source EN PDF p.423; unit 4590 -->

When the Dehaze function is enabled and cfg_alpha=0, the Dehaze log level is 2000ff3

<!-- Source EN PDF p.424; unit 4591 -->

![Original technical figure — PDF p.424](/docs/rockchip-isp30-development/assets/en-p424-X2172.png)

<!-- Source EN PDF p.424; unit 4592 -->

| Name | Description |
|---|---|
| FrameID | Frame number |
| byPassProc | The current frame bypass switch, 0: off, 1: on |
| ISO | ISO |
| Dehaze<br>module en | Dehaze module switch |
| Dehaze en | Dehaze function switch |
| Enhance en | Enhanced function switch |
| Hist en | Hist function switch |
| cfg_alpha | The proportion of software configuration, the value range [0,1], the default value is 1,<br>and the accuracy is 0.01. |
| EnvLv | The ambient brightness of the current frame |
| air_max | The maximum limit of the current frame AIR adaptation, the value range [230, 250], the<br>default value is 250. |
| air_min | The minimum value limit of the current frame AIR adaptation, the value range [230,<br>250], the default value is 200. |
| tmax_base | The current frame tmax adaptive base value, default 125, the corresponding<br>configuration is as follows, 200 (131), 210 (125), 220 (119), 230 (114), 240 (109), 250<br>(105), recommended 131-105 |
| wt_max | The maximum value limit of the current frame wt adaptation, the value range [0.75, 0.9],<br>the default value is 0.9. |

<!-- Source EN PDF p.424; unit 4593 -->

When the Dehaze function is enabled and cfg_alpha=1, the Dehaze log level is 2000ff3

<!-- Source EN PDF p.424; unit 4594 -->

![Original technical figure — PDF p.424](/docs/rockchip-isp30-development/assets/en-p424-X2173.png)

<!-- Source EN PDF p.425; unit 4595 -->

| Name | Description |
|---|---|
| FrameID | Frame number |
| byPassProc | The current frame bypass switch, 0: off, 1: on |
| ISO | ISO |
| Dehaze module<br>en | Dehaze module switch |
| Dehaze en | Dehaze function switch |
| Enhance en | Enhanced function switch |
| Hist en | Hist function switch |
| cfg_alpha | The proportion of software configuration, the value range [0,1], the default value is 1,<br>and the accuracy is 0.01. |
| EnvLv | The ambient brightness of the current frame |
| cfg_air | The current frame software configures air, atmospheric light coefficient, value range [0,<br>255], default value 210. |
| cfg_tmax | The current frame software configures tmax, the maximum value of dehazing, the value<br>range [0, 1], and the default value is 0.2. |
| cfg_wt | The current frame software configures wt, image dehazing force, value range [0, 1],<br>default value 0.8. |

<!-- Source EN PDF p.425; unit 4596 -->

When the Hist function is enabled, the Dehaze log level is 2000ff3

<!-- Source EN PDF p.425; unit 4597 -->

![Original technical figure — PDF p.425](/docs/rockchip-isp30-development/assets/en-p425-X2176.png)

<!-- Source EN PDF p.426; unit 4598 -->

| Name | Description |
|---|---|
| FrameID | Frame number |
| byPassProc | The current frame bypass switch, 0: off, 1: on |
| ISO | ISO |
| Dehaze module<br>en | Dehaze module switch |
| Dehaze en | Dehaze function switch |
| Enhance en | Enhanced function switch |
| Hist en | Hist function switch |
| cfg_alpha | The proportion of software configuration, the value range [0,1], the default value is 1,<br>and the accuracy is 0.01. |
| EnvLv | The ambient brightness of the current frame |
| hist_para_en | The current frame histogram stretch control switch. |
| hist_gratio | The current frame histogram stretch multiplier, histogram equalization control<br>coefficient, value range [0, 32]. |
| hist_th_off | The histogram statistical threshold of the current frame, the value range [0, 255], the<br>default value is 64. |
| hist_k | The current frame histogram adaptive threshold magnification, value range [0, 7),<br>default value 2. |
| hist_min | The minimum value of the histogram statistical threshold of the current frame, the<br>value range [0,2], and the default value is 0.016. |
| hist_scale | The current frame histogram equalization control coefficient, the value range [0, 32]. |
| cfg_gratio | The current frame software configures the histogram stretch multiplier and the<br>histogram equalization control coefficient, and the value range [0, 32]. |

<!-- Source EN PDF p.426; unit 4599 -->

#### 11.2.9  CamHW

<!-- Source EN PDF p.426; unit 4600 -->

11.2.9.1  Configuration guide

<!-- Source EN PDF p.426; unit 4601 -->

| Log level | Description and enabling recommendations |
|---|---|
| Error | Enabled by default<br>Critical error |
| Warning | Not enabled by default<br>Warning error, the algorithm may have exception handling for the error. |

<!-- Source EN PDF p.427; unit 4602 -->

| Log level | Description and enabling recommendations |
|---|---|
| Info | Not enabled by default<br>Basic debugging information:<br>Frame-by-frame output information:<br>Event Information:<br>Suggestion: |
| Debug | Not enabled by default<br>Basic debugging information (increased relative to Info level):<br>Frame-by-frame output information:<br>Event Information:<br>Suggestion: |
| Verbose | Not enabled by default<br>Basic debugging information (increased relative to Debug level):<br>Frame-by-frame output information:<br>Event Information:<br>Suggestion:存在单次大量信息输出，谨慎使用 |
| Low1 | Not enabled by default<br>Basic debugging information (increased relative to Debug level):<br>Frame-by-frame output information:<br>Event information: Function call path information<br>Suggestion: |

<!-- Source EN PDF p.428; unit 4603 -->

| Sub modules<br>bit | Description and enabling recommendations |
|---|---|
| bit[4] | 30 submodule log switch.<br>Responsible for the HWI process control part.<br>suggestion：<br>It is recommended to enable the following submodules together. |
| bit[5] | Isp30Params and Isp30PollThread submodule log switches.<br>Responsible for the processing of ISP parameters, data streams, events, etc.<br>suggestion：<br>Suspected parameters do not match the video frame, timing settings are abnormal, and<br>other issues<br>In readback offline mode, data flow disconnection and other issues |
| bit[6] | The SensorHw submodule log switch.<br>Responsible for the camera sensor related parts.<br>suggestion：<br>Suspected CIS exposure settings and other issues |
| bit[7] | FlashLight submodule log switch.<br>Responsible for the fill light control part.<br>suggestion：<br>Fill light control issues. |
| bit[8] | The LensHw submodule log switch.<br>Responsible for the lens motor control part.<br>suggestion：<br>Motor control and other issues |
| bit[9] | 30SpThread submodule switch.<br>Internal modules are reserved for use. |
| bit[10:11] | void |

<!-- Source EN PDF p.428; unit 4604 -->

11.2.9.2  log interpretation

<!-- Source EN PDF p.428; unit 4605 -->

CamHwIsp20 Submodule

<!-- Source EN PDF p.428; unit 4606 -->

![Original technical figure — PDF p.428](/docs/rockchip-isp30-development/assets/en-p428-X2185.png)

<!-- Source EN PDF p.428; unit 4607 -->

The above log is only printed once when the AIQ library is loaded, from which the link relationship between the camera sensor, ISP and ISPP can be obtained, and the information is obtained from the analysis of the media node topology, from which you can know whether the camera sensor is detected normally.

<!-- Source EN PDF p.428; unit 4608 -->

![Original technical figure — PDF p.428](/docs/rockchip-isp30-development/assets/en-p428-X2186.png)

<!-- Source EN PDF p.429; unit 4609 -->

The log above figure shows the new parameters configured by the HWI layer to the ISP driver, which is currently configured for basically every frame, and the specific meaning is shown in the following table:

<!-- Source EN PDF p.429; unit 4610 -->

| Member<br>name | Description |
|---|---|
| ispparam ens | Module enable bit, module bit definition refer to HWI/ISP20/rk_isp20_hw.H |
| en_up | Module enable update bit, corresponding to a bit of 1, indicates that the module enable bit<br>needs to be updated |
| cfg_up | Module parameter update bit, corresponding to 1 to indicate that the module parameter<br>needs to be updated |
| device | The video node corresponding to the ISP parameter module |

<!-- Source EN PDF p.429; unit 4611 -->

![Original technical figure — PDF p.429](/docs/rockchip-isp30-development/assets/en-p429-X2190.png)

<!-- Source EN PDF p.429; unit 4612 -->

The log above shows that the HWI layer configures new parameters to the ISPP driver, and basically every frame will be configured, specifically explaining the aforementioned ISP module.

<!-- Source EN PDF p.429; unit 4613 -->

The Isp20PollThread submodule

<!-- Source EN PDF p.429; unit 4614 -->

![Original technical figure — PDF p.429](/docs/rockchip-isp30-development/assets/en-p429-X2191.png)

<!-- Source EN PDF p.429; unit 4615 -->

The above figure log starts a frame readback when the readback mode is started, as long as it works in readback mode, each frame will be printed during normal operation, the specific meaning is as follows:

<!-- Source EN PDF p.429; unit 4616 -->

| Member name | Description |
|---|---|
| frame | Frame ID, which indicates the number of frames RAW, starting from 0. |
| sof_ts | The timestamp of the SOF for the frame |
| frame_ts | Collect the timestamp of the completion time of the DDR |
| readback | The number of ISP readbacks |

<!-- Source EN PDF p.429; unit 4617 -->

![Original technical figure — PDF p.429](/docs/rockchip-isp30-development/assets/en-p429-X2192.png)

<!-- Source EN PDF p.429; unit 4618 -->

The log above is the rotation process of RAW buf in readback mode, as long as it works in readback mode, the log will be printed every frame, the specific meaning is as follows:

<!-- Source EN PDF p.430; unit 4619 -->

| Members | Description |
|---|---|
| handle_rx_buf | After the ISP has processed a frame, it is returned to VICAP/isp_tx |
| dev_index | The index number of the long, medium, and short frame devices, when the dev_index in<br>the log of handle_tx_buf and handle_rx_buf is the same, indicates the same data |
| sequence | Frame number, starting at 0 |

<!-- Source EN PDF p.430; unit 4620 -->

SensorHw Submodule

<!-- Source EN PDF p.430; unit 4621 -->

![Original technical figure — PDF p.430](/docs/rockchip-isp30-development/assets/en-p430-X2195.png)

<!-- Source EN PDF p.430; unit 4622 -->

The log above is a linear mode when setting the new exposure to the sensor drive process, and it will be called when there is a new exposure, the specific meaning is as follows:

<!-- Source EN PDF p.430; unit 4623 -->

| Members | Description |
|---|---|
| frameid | sof event frame number |
| handle_sof | The sof event callback function, once per frame, where the exposure setting is handled |
| exp_list size | How many new exposure times in the exposure list are not set to Driver |
| gain_list size | How many new exposure gains in the exposure list are not set to Driver |
| working_mode | Current operating mode, 0 is normal |
| set_time | Whether there is a new exposure time in the SOF message needs to be set to the driver |
| set_gain | Whether there is a new exposure gain in the SOF message needs to be set to the driver |
| a-gain, time | New exposure time, gain register value |

<!-- Source EN PDF p.430; unit 4624 -->

### 11.3   How to acquire Raw/YUV images

<!-- Source EN PDF p.430; unit 4625 -->

Raw data refers specifically to the data output from CIS, which has not undergone any image processing. For Bayer raw sensors, Raw data is 8/12/14 bit bayer rgb data. In general, CIS Raw data needs to be obtained in the following situations:

<!-- Source EN PDF p.430; unit 4626 -->

1\. If the YUV data output after processing by the ISP is abnormal, you want
to dynamically intercept whether the Raw data analysis problem entered by the ISP
is a CIS problem
2\. Before debugging the image quality effect, CIS Raw data needs to be
collected for the calibration of module parameters

<!-- Source EN PDF p.431; unit 4627 -->

#### 11.3.1  Raw data storage format

<!-- Source EN PDF p.431; unit 4628 -->

11.3.1.1  Non-compact storage format

<!-- Source EN PDF p.431; unit 4629 -->

For the storage arrangement of raw12 data in memory, taking a 4-byte memory fragment as an example, the data is stored as follows:

<!-- Source EN PDF p.431; unit 4630 -->

![Original technical figure — PDF p.431](/docs/rockchip-isp30-development/assets/en-p431-X2199.png)

Editable transcription (the original figure already has Chinese labels):

| Memory-word bits | Pixel | Pixel bits |
|---|---|---|
| 31:20 | Pixel 0 | 11:0 |
| 19:16 | Pixel 0 | - - - - |
| 15:4 | Pixel 1 | 11:0 |
| 3:0 | Pixel 1 | - - - - |

<!-- Source EN PDF p.431; unit 4631 -->

11.3.1.2  Compact storage format

<!-- Source EN PDF p.431; unit 4632 -->

For the storage arrangement of raw12 data in memory, taking a 4-byte memory fragment as an example, the data is stored as follows:

<!-- Source EN PDF p.431; unit 4633 -->

![Original technical figure — PDF p.431](/docs/rockchip-isp30-development/assets/en-p431-X2200.png)

Editable transcription (the original figure already has Chinese labels):

| Memory-word bits | Pixel | Pixel bits |
|---|---|---|
| 31:24 | Pixel3 | 7:0 |
| 23:12 | Pixel2 | 11:0 |
| 11:0 | Pixel1 | 11:0 |

<!-- Source EN PDF p.431; unit 4634 -->

11.3.1.3  RK-RAW V1.0

<!-- Source EN PDF p.431; unit 4635 -->

![Original technical figure — PDF p.431](/docs/rockchip-isp30-development/assets/en-p431-X2201.png)

Editable transcription (the original figure already has Chinese labels):

| Parameter name | Type | Length (Byte) | Description |
|---|---|---|---|
| Identifier | unsigned short | 2 | Fixed 0x8080 |
| Header length | unsigned short | 2 | Fixed 128 |
| Frame index | unsigned int | 4 | Frame index |
| Width | unsigned short | 2 | Image width |
| Height | unsigned short | 2 | Image height |
| Bit depth | unsigned char | 1 | Image bit depth |
| Bayer format | unsigned char | 1 | 0: BGGR; 1: GBRG; 2: GRBG; 3: RGGB |
| Number of HDR Frame | unsigned char | 1 | 1: linear, short; 2: HDR2, long+short; 3: HDR3, long+medium+short |
| Current Frame type | unsigned char | 1 | 1 short; 2 medium; 3 long |
| Storage type | unsigned char | 1 | 0 packed; 1 unpacked |
| Line stride | unsigned short | 2 | Bytes |
| Effective line stride | unsigned short | 2 | Bytes |
| Reserved | unsigned char | 107 | Reserved |
| RAW DATA | RAW | W * H * BPP | RAW DATA |

<!-- Source EN PDF p.432; unit 4636 -->

11.3.1.4  RK-RAW V2.0

<!-- Source EN PDF p.432; unit 4637 -->

The RK-RAW V2.0 format consists of a start identifier, a data block, and an end identifier.

<!-- Source EN PDF p.432; unit 4638 -->

Format Block Definition

<!-- Source EN PDF p.432; unit 4639 -->

A data block consists of three parts: identifier ID, block length, and block data. Each identifier ID has a unique fixed value.

<!-- Source EN PDF p.432; unit 4640 -->

![Original technical figure — PDF p.432](/docs/rockchip-isp30-development/assets/en-p432-X2208.png)

Editable transcription (the original figure already has Chinese labels):

| Item | Type | Length (Byte) | Default | Description |
|---|---|---|---|---|
| Start identifier | u16 | 2 | 0xFF00 | File start |
| Block identifier | u16 | 2 | 0xFF01 | Raw information |
| Block length | u32 | 4 | - |  |
| Block data |  |  |  |  |
| Block identifier | u16 | 2 | 0xFF02 | Normal-mode Raw data |
| Block length | u32 | 4 | - |  |
| Block data |  |  |  |  |
| Block identifier | u16 | 2 | 0xFF03 | HDR2/HDR3 short-frame Raw |
| Block length | u32 | 4 | - |  |
| Block data |  |  |  |  |
| Block identifier | u16 | 2 | 0xFF04 | HDR2 long/HDR3 medium Raw |
| Block length | u32 | 4 | - |  |
| Block data |  |  |  |  |
| Block identifier | u16 | 2 | 0xFF05 | HDR3 long-frame Raw |
| Block length | u32 | 4 | - |  |
| Block data |  |  |  |  |
| Block identifier | u16 | 2 | 0xFF06 | Frame statistics |
| Block length | u32 | 4 | - |  |
| Block data |  |  |  |  |
| Block identifier | u16 | 2 | 0xFF07 | ISP register format |
| Block length | u32 | 4 | - |  |
| Block data |  |  |  |  |
| Block identifier | u16 | 2 | 0xFF08 | ISP registers |
| Block length | u32 | 4 | - |  |
| Block data |  |  |  |  |
| Block identifier | u16 | 2 | 0xFF09 | ISPP register format |
| Block length | u32 | 4 | - |  |
| Block data |  |  |  |  |
| Block identifier | u16 | 2 | 0xFF0a | ISPP registers |
| Block length | u32 | 4 | - |  |
| Block data |  |  |  |  |
| Block identifier | u16 | 2 | 0xFF0b | Platform information |
| Block length | u32 | 4 | - |  |
| Block data |  |  |  |  |
| ... |  |  |  |  |
| End identifier | u16 | 2 | 0x00FF | File end |

<!-- Source EN PDF p.432; unit 4641 -->

Not all blocks in the chart are required, and you can choose a combination of several of them. For example, a RKRawV2 file may contain only 'Raw Blocks', 'Raw Blocks', and 'Frame Statistics Blocks', and we recommend including at least these three blocks because such files are meaningful.

<!-- Source EN PDF p.432; unit 4642 -->

Raw Block Definition

<!-- Source EN PDF p.432; unit 4643 -->

![Original technical figure — PDF p.432](/docs/rockchip-isp30-development/assets/en-p432-X2209.png)

Editable transcription (the original figure already has Chinese labels):

| Item | Type | Length (Byte) | Default | Description |
|---|---|---|---|---|
| Version | u16 | 2 | 0x0200 | 0x0200=v2.0 |
| Sensor name | string | 32 | - | Sensor model |
| Scene/light | string | 32 | - | Capture scene/light source |
| Frame number | u32 | 4 | - | Frame number |
| Width | u16 | 2 | - | Image width, pixels |
| Height | u16 | 2 | - | Image height, pixels |
| Bit depth | u8 | 1 | - | Image bit depth |
| Bayer format | u8 | 1 | - | 0 BGGR; 1 GBRG; 2 GRBG; 3 RGGB |
| HDR frame count | u8 | 1 | - | 1 linear; 2 long+short; 3 long+medium+short |
| Storage format | u8 | 1 | - | 0 packed; 1 unpacked |
| Line stride | u16 | 2 | - | Bytes |
| Effective line stride | u16 | 2 | - | Bytes |
| Endianness | u8 | 1 | - | 0 big-endian; 1 little-endian |

<!-- Source EN PDF p.432; unit 4644 -->

RAW Block Definition

<!-- Source EN PDF p.433; unit 4645 -->

This data segment can store Raw image data, or buffer fd or virtual address pointing to Raw image data. When using the relevant API, you need to pass parameters to indicate the type of data stored in the data block, see rk_aiq_rawbuf_type_t for details.

<!-- Source EN PDF p.433; unit 4646 -->

![Original technical figure — PDF p.433](/docs/rockchip-isp30-development/assets/en-p433-X2213.png)

Editable transcription (the original figure already has Chinese labels):

| Item | Type | Length (Byte) | Description |
|---|---|---|---|
| Raw data | - | height*width*N; unpacked N=2; packed N=bpp/8 | Raw data, 0xFF02–0xFF05 |

<!-- Source EN PDF p.433; unit 4647 -->

Frame Statistics Block Definition

<!-- Source EN PDF p.433; unit 4648 -->

![Original technical figure — PDF p.433](/docs/rockchip-isp30-development/assets/en-p433-X2214.png)

Editable transcription (the original figure already has Chinese labels):

| Item | Type | Length (Byte) | Default | Description |
|---|---|---|---|---|
| Version | u16 | 2 | 0x0200 | Raw: 0x0200=v2.0 |
| Frame number | u32 | 4 | - | Frame number |
| Normal_Exp | float | 4 | - | Linear shutter time |
| Normal_Gain | float | 4 | - | Linear exposure gain |
| Normal_Exp_REG | u32 | 4 | - | Linear shutter SENSOR register |
| Normal_Gain_REG | u32 | 4 | - | Linear gain SENSOR register |
| HDR_Exp_L | float | 4 | - | HDR3 long shutter time |
| HDR_Gain_L | float | 4 | - | HDR3 long gain |
| HDR_Exp_L_REG | u32 | 4 | - | HDR3 long shutter SENSOR register |
| HDR_Gain_L_REG | u32 | 4 | - | HDR3 long gain SENSOR register |
| HDR_Exp_M | float | 4 | - | HDR3 medium/HDR2 long shutter time |
| HDR_Gain_M | float | 4 | - | HDR3 medium/HDR2 long gain |
| HDR_Exp_M_REG | u32 | 4 | - | HDR3 medium/HDR2 long shutter SENSOR register |
| HDR_Gain_M_REG | u32 | 4 | - | HDR3 medium/HDR2 long shutter SENSOR register (source wording; Gain field name conflicts, verify) |
| HDR_Exp_S | float | 4 | - | HDR3/HDR2 short shutter time |
| HDR_Gain_S | float | 4 | - | HDR3/HDR2 short gain |
| HDR_Exp_S_REG | u32 | 4 | - | HDR3/HDR2 short shutter SENSOR register |
| HDR_Gain_S_REG | u32 | 4 | - | HDR3/HDR2 short shutter SENSOR register (source wording; Gain field name conflicts, verify) |
| AWB_Rgain | float | 4 | - | White balance gain |
| AWB_Bgain | float | 4 | - | White balance gain |

<!-- Source EN PDF p.433; unit 4649 -->

Register format block definition

<!-- Source EN PDF p.433; unit 4650 -->

![Original technical figure — PDF p.433](/docs/rockchip-isp30-development/assets/en-p433-X2215.png)

Editable transcription (the original figure already has Chinese labels):

| Item | Type | Length (Byte) | Default | Description |
|---|---|---|---|---|
| Version | u16 | 2 | 0x0200 | 0x0200=v2.0 |
| Frame number | u32 | 4 | - | Register base address (as in figure) |
| Base address | u32 | 4 | - | Register base address |
| Offset address | u32 | 4 | - | Start offset address |
| Count | u32 | 4 | - | Register count |

<!-- Source EN PDF p.433; unit 4651 -->

Register Block Definition

<!-- Source EN PDF p.433; unit 4652 -->

![Original technical figure — PDF p.433](/docs/rockchip-isp30-development/assets/en-p433-X2216.png)

Editable transcription (the original figure already has Chinese labels):

| Item | Type | Length (Byte) | Description |
|---|---|---|---|
| Register data | - | - | Register data, 0xFF08/0xFF0a |

<!-- Source EN PDF p.433; unit 4653 -->

Platform Information Block Definition

<!-- Source EN PDF p.433; unit 4654 -->

![Original technical figure — PDF p.433](/docs/rockchip-isp30-development/assets/en-p433-X2217.png)

Editable transcription (the original figure already has Chinese labels):

| Item | Type | Length (Byte) | Description |
|---|---|---|---|
| Chip model | string | 32 |  |
| ISP version | string | 32 |  |
| AIQ version | string | 32 |  |

<!-- Source EN PDF p.434; unit 4655 -->

#### 11.3.2  Raw/YUV data acquisition method

<!-- Source EN PDF p.435; unit 4656 -->

## 12.   Error code

<!-- Source EN PDF p.435; unit 4657 -->

| Error Code | Description |
|---|---|
| 0 | Success |
| -1 | Failed |
| -2 | Invalid parameter |
| -3 | Out of memory |
| -4 | File operation failed |
| -5 | Error with analyzer module |
| -6 | The ISP module error |
| -7 | Error with sensor driver |
| -8 | Thread operation error |
| -9 | IOCTL operation error |
| -10 | Timing error |
| -20 | Timeout |
| -21 | Out of range |
| -255 | Unknown error |

<!-- Source EN PDF p.436; unit 4658 -->

## 13.   Abbreviations

<!-- Source EN PDF p.436; unit 4659 -->

| Abbreviation | Full name |
|---|---|
| CIS | Camera Image Sensor |
| RkAiq | Rockchip Automatical Image Quality |
| ISP | Image Signal Process |
| IQ Tuning | Image Quality Tuning |

{% endraw %}
