---
title: "RKNN Toolkit Lite2 V2.5.0, part 2: lifecycle, input layout and output reuse"
description: "RKNN Toolkit Lite2 V2.5.0, part 2: lifecycle, input layout and output reuse · RKNN2 V2.5.0"
excerpt: "RKNN Toolkit Lite2 V2.5.0, part 2: lifecycle, input layout and output reuse"
translation_key: "rknn-v250-lite-api-programming-model"
slug: "rknn-v250-lite-api-programming-model"
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

**RKNN Toolkit Lite2 V2.5.0, part 2: lifecycle, input layout and output reuse**

[RKNN Toolkit Lite2 V2.5.0, part 3: model loading, encryption and Runtime initialization](/articles/rknn-v250-lite-api-loading-runtime/)

[RKNN Toolkit Lite2 V2.5.0, part 4: inference, device and version query APIs](/articles/rknn-v250-lite-api-inference-queries/)

[RKNN Toolkit Lite2 V2.5.0, part 5: error checks, Core Mask and logging](/articles/rknn-v250-lite-api-errors/)

{% raw %}

## 2. RKNNLite Programming Model

RKNNLite is the main Python entry point of RKNN Toolkit Lite2. Applications use this object to load RKNN models, initialize the Runtime, run inference, query version information, and release resources.

RKNN Toolkit Lite2 is intended for device-side deployment. A deep learning framework model is first converted into an RKNN model with RKNN Toolkit2, then the device-side application runs it through RKNNLite() → load_rknn() → init_runtime() → inference() → release() .

Understanding the relationship among the RKNN model, Runtime, input data, and NPU Core configuration helps when using the APIs described in Chapter 3.

### 2.1 Object Lifecycle

The typical RKNN Toolkit Lite2 lifecycle is:

```text
Create RKNNLite object
    ↓
load_rknn()
    ↓
init_runtime()
    ↓
Prepare and preprocess input data
    ↓
inference()
    ↓
Post-process inference results
    ↓
release()
```

Where:

RKNNLite() creates an RKNNLite object and can enable detailed logging through verbose and verbose_file ;

load_rknn() loads the RKNN model from the specified path;

init_runtime() initializes the Runtime environment required for model execution;

inference() executes inference on prepared inputs and returns the outputs;

release() releases resources associated with the RKNNLite object.

init_runtime() checks whether a model has been loaded with load_rknn() , and inference() checks whether the Runtime has been initialized. Therefore, the normal call order is load_rknn() → init_runtime() → inference() .

A typical application structure is:

```text
rknn_lite = RKNNLite(verbose=True)

ret = rknn_lite.load_rknn('./model.rknn')
if ret != 0:
    print('Load RKNN model failed')
    exit(ret)

ret = rknn_lite.init_runtime(
    core_mask=RKNNLite.NPU_CORE_AUTO
)
if ret != 0:
    print('Init runtime environment failed')
    exit(ret)

outputs = rknn_lite.inference(inputs=[input_data])

# Post-process outputs according to the model type.
# ...

rknn_lite.release()
```

Input data should be preprocessed before inference() is called, and data_format should be configured according to the input dimensions and the actual data layout. After inference, the outputs normally require post-processing to implement the upper-layer application logic.

### 2.2 Relationship Between Model, Runtime, and Inference

The deployment process can be divided into the following stages:

Model conversion: use RKNN Toolkit2 to convert a deep learning framework model into an RKNN model;

Model loading: use load_rknn() to load the RKNN model into the RKNNLite object;

Runtime initialization: use init_runtime() to initialize the Runtime environment;

Inference execution: use inference() to obtain inference results.

RKNN Toolkit2 and RKNN Toolkit Lite2 serve different stages:

| Stage | Tool / API | Purpose |
| --- | --- | --- |
| Model conversion | RKNN Toolkit2 | Convert a deep learning framework model into an RKNN<br>model |
| Model loading | load_rknn() | Load an RKNN model for device-side execution |
| Runtime<br>initialization | init_runtime() | Initialize the Runtime environment |
| Model execution | inference() | Run inference and return outputs |
| Resource release | release() | Release RKNNLite object resources after use |

Besides the inference API, RKNN Toolkit Lite2 also provides version and platform query APIs:

```text
load_rknn()
    ↓
init_runtime()
    ↓
get_sdk_version()
```

get_sdk_version() can only be called after the Runtime has been initialized successfully. If the Runtime has not been initialized, the API returns None . Because init_runtime() itself requires a model to have been loaded, the normal flow is still to call load_rknn() first, then init_runtime() , and finally get_sdk_version() .

list_support_target_platform() queries which chip platforms a specified RKNN model can run on. It receives an RKNN model path through the rknn_model parameter. If no model path is specified, the API prints the chip platforms currently supported by RKNN Toolkit Lite2 by category.

### 2.3 Input Data, Data Layout, and Output

The current inference() interface signature is:

```text
inference(
    inputs,
    data_type=None,
    data_format=None,
    inputs_pass_through=None,
    get_frame_id=False,
    reuse_outputs=False
)
```

inputs is the model input list. The other parameters provide the input data type, data layout, Pass Through settings, Frame ID behavior for asynchronous mode, and output memory reuse configuration.

#### 2.3.1 inputs

inputs is used to pass model input data. Its type is list , and each list item is an ndarray . Typical usage:

```text
outputs = rknn_lite.inference(inputs=[img])
```

For a multi-input model:

```text
outputs = rknn_lite.inference(
    inputs=[input0, input1]
)
```

Applications should complete the required preprocessing before calling the inference API.

#### 2.3.2 data_type and data_format

data_type specifies the input data type. The types listed by the current interface include int8 , uint8 , int16 , float16 , and float32 . The default value is None .

data_format specifies the input data layout. The currently supported values are "nhwc" and "nchw" . The default value is None . This parameter is passed directly to the Runtime input- setting logic, so the application must ensure that the value matches the actual input buffer layout.

#### 2.3.3 inputs_pass_through

inputs_pass_through sets the Pass Through flag for each input. The interface uses 0 / 1 to indicate disabled / enabled, and the values are provided as a list corresponding to the model inputs. The default value is None .

#### 2.3.4 get_frame_id

get_frame_id defaults to False . When it is False , the API returns the output ndarray list directly. When it is True , the Runtime Frame ID is appended to the end of the output list. This is mainly used in asynchronous mode when input and output frames need to be associated.

#### 2.3.5 reuse_outputs

reuse_outputs controls how output array memory is reused. The default value is False , and this parameter is an optional optimization that does not change the default behavior.

When it is False (default), each output ndarray returned by inference() owns its own memory and remains valid across multiple calls, conforming to the historical API contract. Applications may safely hold the returned results.

When it is True , the API directly returns views of the internal reusable staging buffers, so no large memory allocation occurs per call. This is suitable for long-running inference loops where the outputs are fully consumed before the next inference. Note: the returned arrays will be overwritten by the next inference() or get_outputs() call. If the results must be retained, copy them before the next call (e.g., np.array(output) ).

#### 2.3.6 Inference Output and Failure Return

Normally, inference() returns a list of output ndarray objects:

```text
Input ndarray list
        ↓
    inference()
        ↓
Output ndarray list
        ↓
Application post-processing
```

If the Runtime has not been initialized, or if an exception occurs while setting inputs, running the model, or retrieving outputs, the API returns None . Therefore, application code should check the return value before post-processing.

### 2.4 NPU Core Configuration

init_runtime() uses the core_mask parameter to configure the NPU Core working mode. The default value is RKNNLite.NPU_CORE_AUTO .

RKNNLite currently defines the following Core Mask constants:

| core_mask | Value | Description |
| --- | --- | --- |
| RKNNLite.NPU_CORE_AUTO | 0 | Automatic mode. Default value. |
| RKNNLite.NPU_CORE_0 | 1 | Core 0 mode. |
| RKNNLite.NPU_CORE_1 | 2 | Core 1 mode. |
| RKNNLite.NPU_CORE_2 | 4 | Core 2 mode. |
| RKNNLite.NPU_CORE_0_1 | 3 | Core 0/1 combined mode. |
| RKNNLite.NPU_CORE_0_1_2 | 7 | Core 0/1/2 combined mode. The current interface description marks<br>this as supported only on RK3588. |
| RKNNLite.NPU_CORE_ALL | 0xffff | All NPU Cores. |

The source code notes that core_mask is valid only for RK3576 / RK3588. The Core combinations actually supported may vary by chip and should follow Runtime validation. If manual Core selection is not required, use the default RKNNLite.NPU_CORE_AUTO .

Typical initialization:

```text
ret = rknn_lite.init_runtime(
    core_mask=RKNNLite.NPU_CORE_AUTO
)
if ret != 0:
    print('Init runtime environment failed')
    exit(ret)
```

### 2.5 Query APIs and Resource Release

In addition to model inference, RKNN Toolkit Lite2 provides device enumeration, SDK version query, model supported-platform query, and resource release APIs. Different APIs have different prerequisites.

SDK Version Query

get_sdk_version() is used to obtain:

Runtime version;

driver version;

RKNN model version information.

The call sequence is:

```text
load_rknn()
    ↓
init_runtime()
    ↓
get_sdk_version()
```

Example:

```text
sdk_version = rknn_lite.get_sdk_version()
```

The Runtime must be initialized successfully before calling this API; otherwise, the API returns None .

Model Supported-Platform Query

list_support_target_platform() queries the chip platforms on which a given RKNN model can run:

```text
rknn_lite.list_support_target_platform(
    rknn_model='mobilenet_v1.rknn'
)
```

If rknn_model=None , the argument is passed directly to the platform query function, which lists the platforms currently supported by RKNN Toolkit Lite2. If an explicitly specified model path does not exist, including an empty-string path, the API returns None .

Resource Release

After finishing operations on an RKNNLite object, call:

```text
rknn_lite.release()
```

In the complete deployment flow, resource release comes after model inference and related query operations:

```text
RKNNLite()
    ↓
load_rknn()
    ↓
init_runtime()
    ↓
inference() / get_sdk_version()
    ↓
release()
```

release() is the final step in the RKNNLite object lifecycle. Release the related resources promptly after model execution on the object is complete.

{% endraw %}
