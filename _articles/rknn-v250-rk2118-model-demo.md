---
title: "RK2118 NPU quickstart, part 4: model conversion, USB inputs and inference results"
description: "RK2118 NPU quickstart, part 4: model conversion, USB inputs and inference results · RKNN2 V2.5.0"
excerpt: "RK2118 NPU quickstart, part 4: model conversion, USB inputs and inference results"
translation_key: "rknn-v250-rk2118-model-demo"
slug: "rknn-v250-rk2118-model-demo"
lang: "en"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RK2118", "RKNN", "Toolkit2", "RT-Thread"]
---

Platform reference for RK_EVB1_RK2118G_V20 (RK2118) and its matching RT-Thread SDK. No corresponding ArmSoM board has been confirmed; do not transfer these instructions directly to another SoC. No validated BSP or Linux kernel is specified and no ArmSoM hardware testing was performed.

Source: local Chinese and English RKNN2 RK2118 QuickStart V2.5.0; original section numbers are retained. Chinese follows its source; English, Russian and German follow the English source. PDF-wrapped filenames, URLs, comments and commands are rejoined. Section 5.3 points to 3.1 for the RT-Thread download, but the download steps are in 3.3.1. The Docker command mounts /rt-thread, while the subsequent command uses the relative path rt-thread/...; check the container working directory. This discrepancy was not silently rewritten. Sample logs, 45ms and reference outputs belong to the source, not ArmSoM tests. Unpinned/latest installation commands do not guarantee V2.5.0; check the actual SDK.

[Rockchip source](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

<!-- rk2118-series:start -->

**RK2118 quickstart series · 4/5**

[RK2118 NPU quickstart, part 1: hardware, connections and serial console](/articles/rknn-v250-rk2118-hardware/)

[RK2118 NPU quickstart, part 2: host environment and Toolkit2 installation](/articles/rknn-v250-rk2118-host-environment/)

[RK2118 NPU quickstart, part 3: RT-Thread and DSP firmware](/articles/rknn-v250-rk2118-firmware/)

**RK2118 NPU quickstart, part 4: model conversion, USB inputs and inference results**

[RK2118 NPU quickstart, part 5: Docker, FAQ and references](/articles/rknn-v250-rk2118-docker-faq/)

<!-- rk2118-series:end -->

{% raw %}

## 4. Run Example Programs

This chapter introduces how to quickly run an example program on the development board. It is divided into three parts:

- Introduction to the RKNN SDK

- RKNN model conversion

- How to use the NPU Demo

### 4.1 Introduction to the RKNN SDK

RK2118 NPU inference is performed by HIFI4 DSP0; CPU0 does not directly operate the NPU hardware. The related code is divided into three parts:

```text
components/hifi4/samples/rk2118/npu_demo/ # DSP0 firmware project
| # (menuconfig: HIFI4 Project → npu Demo)
└── npu_demo_dsp0/
    └── src/rknn_api_test.c # Main test program on the DSP side; runs automatically at boot
components/hifi4/rtt/rknn_dsp_comm/ # CPU0-side service (rknn_demo_server)
                                        # Handshakes with the DSP and provides file I/O
components/hifi4/rtt/dsp_fw/npu_demo/ # DSP firmware for packaging
                                        # (dsp0.bin, updated automatically by the DSP build)
```

The runtime data flow is as follows:

1. After system startup, CPU0 loads the DSP0 firmware to DSP0 and starts it; rknn_demo_server becomes ready on CPU0.

2. rknn_api_test.c on DSP0 establishes a handshake with CPU0 through IPC, then requests the model file ( check.rknn ) from the USB flash drive.

3. DSP0 calls APIs such as rknn_init and rknn_run to perform inference on the NPU.

4. CPU0 writes the inference output back to the USB flash drive for element-by-element comparison with the golden data on the PC.

The CPU0-side application does not call the RKNN APIs directly. All test logic is located in the DSP0 firmware. To modify the test logic, rebuild and package the DSP firmware; see Section 3.3.3.

### 4.2 Model Conversion

The following uses MobileNetV1 as an example to explain how to convert an RKNN model.

Enter the rt-thread/components/rknpu/examples/rknn_benchmark/res directory and run the convert.py script. The script converts the original PB model into an RKNN model:

```text
cd rt-thread/components/rknpu/examples/rknn_benchmark/res
python convert.py
```

If the conversion succeeds, mobilenetv1.rknn and dog.npy are generated. dog.npy is the model input file.

Note: Before preparing the USB flash drive in the next section, rename mobilenetv1.rknn to check.rknn and dog.npy to input_0.npy .

### 4.3 How to Use the NPU Demo

The following uses npu_demo as an example to explain how to use the DSP-based NPU Demo.

#### 4.3.1 Running Method

After the firmware is flashed, DSP0 automatically runs npu_demo during system startup; no command needs to be executed manually. Observe the logs through the serial port. All logs have the [DSP0 INFO] prefix.

#### 4.3.2 Preparing Files on the USB Flash Drive

Prepare a FAT32-formatted USB flash drive, place the files in the following directory structure, and insert it into the board's "USB 2.0 HOST" port. The system automatically mounts it at /udisk :

```text
/udisk
└── golden/
    ├── check.rknn # Model file generated in Section 4.2
    └── t0/
        └── <input_tensor_name>.npy # One file for each model input
```

Input file requirements:

- The file must be a standard NumPy .npy file with data type float32. The number of data bytes must equal the number of input elements × 4. The firmware performs strict validation and reports Input %d size mismatch if the size is incorrect.

- The file name must be the model input tensor name, with / , : , and . replaced by _ . For example, the tensor name input:0 corresponds to input_0.npy .

- Use the file name printed in the serial log during the first run, such as load file: /udisk/golden/t0/xxx.npy .

- The input .npy file is exported from RKNN-Toolkit2 as golden data.

#### 4.3.3 Viewing the Results

The results are available in two places:

1. Serial log: Prints model input/output information, NPU inference time for each iteration, the minimum and maximum values of the output tensor, and the first and last 16 elements. The message rknn api test done indicates that the test has completed successfully.

2. USB flash drive: The complete output is written back as a float32 file at /udisk/golden/t0_`<output_tensor_name>`.npy (using the same naming rules as above). It can be read directly with NumPy and compared element by element with the golden output on the PC.

Excerpt of the source MobileNetV1 measurement log (not an ArmSoM test):

```text
[DSP0 INFO] Read model file success: model_buffer = 0xA016CE80, model_size=...
[DSP0 INFO] index=0, name=input:0, n_dims=4, dims=[1, 224, 224, 3], ...
[DSP0 INFO] fmt=NHWC, w_stride=224, size_with_stride=301056, type=FP16
[DSP0 INFO] load file: /udisk/golden/t0/input_0.npy
[DSP0 INFO] Input 0 size check passed: 602112 bytes
[DSP0 INFO] NPU wait 0: Elapse Time = 45ms.
[DSP0 INFO] [0] MobilenetV1/Logits/SpatialSqueeze:0:
[DSP0 INFO] min = -8.1718752, max = 19.21875
```

Notes:

- To replace the model, replace only check.rknn and the input .npy files under t0/ on the USB flash drive; rebuilding the firmware is not required.

- To modify the test logic, such as loop_count or the dump switch, rebuild and package the DSP firmware; see Section 3.3.3.

{% endraw %}
