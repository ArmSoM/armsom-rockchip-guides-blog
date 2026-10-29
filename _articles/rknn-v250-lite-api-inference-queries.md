---
title: "RKNN Toolkit Lite2 V2.5.0, part 4: inference, device and version query APIs"
description: "RKNN Toolkit Lite2 V2.5.0, part 4: inference, device and version query APIs · RKNN2 V2.5.0"
excerpt: "RKNN Toolkit Lite2 V2.5.0, part 4: inference, device and version query APIs"
translation_key: "rknn-v250-lite-api-inference-queries"
slug: "rknn-v250-lite-api-inference-queries"
lang: "en"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "RK3588", "RK3576", "V2.5.0"]
---

Platform reference for RKNN Toolkit Lite2 V2.5.0, Debian 10/11/12 aarch64 and the SoCs listed in the source. For an ArmSoM board, verify SoC, architecture, Python wheel, BSP NPU driver and Runtime compatibility. No hardware tests were performed. The source encryption section lists more platforms than the Lite2 installation table; both are retained without extending Lite2 device support by inference.

Adapted from the local Chinese and English V2.5.0 sources, retaining section numbers. Chinese uses Chinese figures; English, Russian and German use English-source figures. PDF wraps, continued tables and code indentation are restored. Example outputs are not ArmSoM tests.

[Rockchip source](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

[RKNN Toolkit Lite2 V2.5.0, part 1: installation, ResNet18 and return conventions](/articles/rknn-v250-lite-api-installation/)

[RKNN Toolkit Lite2 V2.5.0, part 2: lifecycle, input layout and output reuse](/articles/rknn-v250-lite-api-programming-model/)

[RKNN Toolkit Lite2 V2.5.0, part 3: model loading, encryption and Runtime initialization](/articles/rknn-v250-lite-api-loading-runtime/)

**RKNN Toolkit Lite2 V2.5.0, part 4: inference, device and version query APIs**

[RKNN Toolkit Lite2 V2.5.0, part 5: error checks, Core Mask and logging](/articles/rknn-v250-lite-api-errors/)

{% raw %}

### 3.3 Model Inference

inference

| API | inference |
| --- | --- |
| Function | Run model inference on the specified inputs and return the output results. |
| Parameters | inputs: Input data. Type: list; each item is an ndarray. |
|  | data_type: Input data type. Default: None. The interface lists int8, uint8, int16,<br>float16, and float32. |
|  | data_format: Input data layout. Default: None. Currently supports "nhwc" and<br>"nchw". |
|  | inputs_pass_through: Pass Through flag list for the inputs. Each element uses 0 / 1 to<br>indicate disabled / enabled. Default: None. |
|  | get_frame_id: Whether to obtain the Frame ID. Default: False. Mainly used in<br>asynchronous mode. |
|  | reuse_outputs: Whether to reuse the internal output buffers. Default: False. When<br>True, the API returns views of the internal reusable buffers, suitable for long-running<br>inference loops; note that the next inference overwrites the returned results. |
| Return<br>Value | Normally returns a list of output ndarray objects. If get_frame_id=True, the Frame ID is<br>appended to the end of the list. Returns None if the Runtime is not initialized or an<br>exception occurs during inference. |

Example:

```text
outputs = rknn_lite.inference(inputs=[img])
if outputs is None:
    print('Inference failed')
else:
    show_top5(outputs)
```

To reduce memory allocation in a long-running inference loop, enable output reuse:

```text
for frame in frames:
    outputs = rknn_lite.inference(
        inputs=[frame],
        reuse_outputs=True
    )
    show_top5(outputs) # consume immediately; results are overwritten
                              # by the next inference
```

Reference output:

```text
-----TOP 5-----
[812]: 0.999442994594574
[404]: 0.0004096269840374589
[657]: 3.284541890025139e-05
[833]: 2.6112385967280716e-05
[895]: 1.8509887013351545e-05
```

Usage Notes:

init_runtime() must complete successfully before this API is called; otherwise, the API returns None .

inputs , data_type , data_format , and inputs_pass_through are passed to the Runtime input-setting logic.

The API returns None if an exception occurs while setting inputs, running the model, or retrieving outputs.

When get_frame_id=False , the API returns the normal output list. When get_frame_id=True , the Frame ID returned by the Runtime is appended to the end of the output list.

reuse_outputs defaults to False , and the returned arrays own their memory and stay valid across calls. Only enable reuse_outputs=True when explicitly reducing memory allocation; the returned arrays are then views of the internal reusable buffers and will be overwritten by the next inference, so copy the results first if they must be retained.

After inference succeeds, perform the required post-processing according to the model type.

### 3.4 Device, Version, and Platform Queries

list_devices

| API | list_devices |
| --- | --- |
| Function | Enumerate devices currently accessible through ADB and NTB and print the device lists. |
| Parameters | None |
| Return<br>Value | (adb_devices, ntb_devices): two list objects. Devices that also appear in the NTB<br>list are removed from the returned ADB list. |

Example:

```text
adb_devices, ntb_devices = rknn_lite.list_devices()
```

get_sdk_version

| API | get_sdk_version |
| --- | --- |
| Function | Get SDK version information. |
| Parameters | None |
| Return<br>Value | Normally returns an sdk_version string; returns None if the Runtime is not initialized or<br>the query fails. |

The Runtime must be initialized successfully before calling this API. Because init_runtime() requires a model to be loaded, the standard sequence is load_rknn() → init_runtime() → get_sdk_version() .

Example:

```text
sdk_version = rknn_lite.get_sdk_version()
if sdk_version is None:
    print('Get SDK version failed')
```

Reference return information:

```text
I RKNN: [10:47:23.097] RKNN Runtime Information:
librknnrt version: 1.2.0b1
(a47985372@2021-12-06T10:20:14)

I RKNN: [10:47:23.097] RKNN Driver Information:
version: 0.6.2

I RKNN: [10:47:23.098] RKNN Model Information:
version: 1,
toolkit version: 1.1.2
(compiler version: 1.1.2b13
(1e5726f57@2021-11-29T14:13:55)),
target: RKNPU v2,
target platform: rk3588,
framework name: PyTorch,
framework layout: NCHW
```

list_support_target_platform

| API | list_support_target_platform |
| --- | --- |
| Function | Query the chip platforms on which a given RKNN model can run, or list the currently<br>supported platforms. |
| Parameters | rknn_model: RKNN model path. Default: None. When it is None, the platform query<br>function is called directly to list the currently supported platforms. |
| Return<br>Value | Normally returns support_target, a dict. Returns None if an explicitly specified<br>model path does not exist. |

Example:

```text
support_target = rknn_lite.list_support_target_platform(
    rknn_model='mobilenet_v1.rknn'
)
if support_target is None:
    print('Query target platform failed')
```

Reference result:

```text
**************************************************
Target platforms filled in RKNN model: ['RK3588']
Target platforms supported by this RKNN model: ['RK3588']
**************************************************
```

Usage Notes:

When rknn_model=None , file-existence checking is not performed; the underlying platform query function is called directly.

When an explicitly specified model path does not exist, the API records an error and returns None .

{% endraw %}
