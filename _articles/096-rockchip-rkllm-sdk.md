---
title: "RKLLM SDK 1.2.3 Complete Guide: Model Conversion, NPU Inference and Server Deployment"
description: "RKLLM SDK 1.2.3 Complete Guide: Model Conversion, NPU Inference and Server Deployment — RK3576, RK3588, RK3562, RV1126B; SDK 1.2.3."
translation_key: "096-rockchip-rkllm-sdk"
slug: "096-rockchip-rkllm-sdk"
lang: "en"
date: "2026-10-22"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
tags: ["ArmSoM", "Rockchip", "RKLLM", "RK3588", "RK3576", "NPU"]
excerpt: "RKLLM SDK 1.2.3 Complete Guide: Model Conversion, NPU Inference and Server Deployment — RK3576, RK3588, RK3562, RV1126B; SDK 1.2.3."
---

{% raw %}

# RKLLM SDK 1.2.3 Complete Guide: Model Conversion, NPU Inference and Server Deployment

This full technical article follows RKLLM SDK 1.2.3. Chinese follows the Chinese PDF; English follows the English PDF; Russian and German fully translate the English body. Chinese uses Chinese original figures; the other three languages use English original figures. Both PDFs are version 1.2.3, but example layout, comments and some descriptions differ; they have not been silently mixed. The source lists RK3576, RK3588, RK3562 and RV1126B, requires checking RKNPU 0.9.8, and discusses Linux 5.10.209/6.1.84, GCC 10.2 and Android NDK. This is an ArmSoM platform-adaptation reference only: the exact board, SDK/BSP, kernel and model combination remains unverified. No hardware tests or measurements were performed. “Latest” in the source refers to its version context, not the current latest release.

> Source-example caution: original Python indentation, a full-width parenthesis, mixed JSON/Python constants, interface types and cross-references have unresolved issues documented in the editorial notes; examples are not guaranteed runnable. verify=False disables certificate verification; trust_remote_code=True allows external code; chmod 777 broadens permissions. Driver replacement, kernel flashing, listening on 0.0.0.0 and public sharing with share=True require separate review. Original logs show Runtime 1.0.2b9 / driver 0.9.7, differing from the body requirement; they are not ArmSoM measurements.

[ArmSoM Docs](https://docs.armsom.org/) · [RKLLM](https://github.com/airockchip/rknn-llm) · [EDITORIAL-NOTES](/docs/rockchip-rkllm-sdk/EDITORIAL-NOTES.md)

<!-- PDF p.7; extraction unit 0 -->

## 1 Introduction to RKLLM

<!-- PDF p.7; extraction unit 1 -->

### 1.1 Introduction to RKLLM Toolchain

<!-- PDF p.7; extraction unit 2 -->

#### 1.1.1 Introduction to RKLLM-Toolkit

<!-- PDF p.7; extraction unit 3 -->

RKLLM-Toolkit is a development kit that provides users with the ability to quantify and convert large language models on the PC. Through the Python interface provided by the tool, the following functions can be conveniently accomplished:

<!-- PDF p.7; extraction unit 4 -->

1) Model Conversion: It supports the conversion of Large Language Model (LLM) in Hugging Face or GGUF format to RKLLM model, and the supported models include LLaMA, Qwen, Qwen2, Qwen3, Qwen2-VL, Qwen3-VL, Phi-2, Phi-3, ChatGLM3, Gemma, Gemma2, Gemma3, Gemma3n, InternLM2, TeleChat2, MiniCPM-S, MiniCPM, MiniCPM3, MiniCPM4, DeepSeekOCR, InternVL3. The converted RKLLM models can be loaded and used on Rockchip NPU platform.

<!-- PDF p.7; extraction unit 5 -->

2) Quantization Function: Supports quantization of floating-point models into fixed-point models. Currently supported quantization types include: a. w4a16; b. w4a16 grouped quantization (supported group sizes: 32, 64, 128); c. w8a8; d. w8a8 grouped quantization (supported group sizes: 128, 256, 512);

<!-- PDF p.7; extraction unit 6 -->

#### 1.1.2 Introduction to RKLLM Runtime

<!-- PDF p.7; extraction unit 7 -->

The RKLLM Runtime is primarily responsible for loading the RKLLM models obtained from the RKLLM-Toolkit conversion and executing inference via the Rockchip NPU. Throughout the RKLLM model inference process, users retain the autonomy to specify inference parameter configurations, define various text generation methodologies, and seamlessly retrieve inference results from the model via pre- defined callback functions.

<!-- PDF p.8; extraction unit 8 -->

### 1.2 Introduction to the RKLLM Development Process

<!-- PDF p.8; extraction unit 9 -->

The overall development process of RKLLM primarily comprises two phases: model conversion in PC and deployment and execution in board-side:

<!-- PDF p.8; extraction unit 10 -->

1) Model Conversion in PC: During this phase, the provided Hugging Face formatted LLM is converted into RKLLM format for efficient inference on the Rockchip NPU platform. This step includes: a. Model Acquisition: Obtain the large language model from: a) Open-source large language models in Hugging Face format. b) Self-trained large language models, with the requirement that the saved model structure is consistent with models on the Hugging Face platform. c) GGUF models, currently supporting only q4_0 and fp16 types. b. Model Loading: Load the model in huggingface format with the rkllm.load_huggingface() function and load the gguf format model with rkllm.load_gguf() function; c. Model Quantization Configuration: Utilize the rkllm.build() function to construct the RKLLM model, with the option to perform model quantization for enhanced hardware deployment performance. Additionally, choose different optimization levels and quantization types during the construction process. d. Model Export: Export the RKLLM model as a .rkllm format file using the rkllm.export_rkllm() function for subsequent deployment.

<!-- PDF p.8; extraction unit 11 -->

2) Deployment and Execution in Board-side: This phase encompasses the actual deployment and execution of the model, typically involving the following steps: a. Model Initialization: Load the RKLLM model onto the Rockchip NPU platform, configure model parameters accordingly to define the desired text generation methods, and pre-define callback functions to receive real-time inference results, preparing for inference. b. Model Inference: Execute the inference operation by passing input data to the model and

<!-- PDF p.9; extraction unit 12 -->

running model inference. Users can continuously retrieve inference results through pre-defined callback functions. c. Model Release: After completing the inference process, release the model resources to allow other tasks to utilize the computational resources of the NPU. These two steps constitute the complete RKLLM development process, ensuring successful conversion, debugging, and ultimately efficient deployment of the LLMs on the Rockchip NPU.

<!-- PDF p.9; extraction unit 13 -->

### 1.3 Applicable Hardware Platforms

<!-- PDF p.9; extraction unit 14 -->

The hardware platforms to which this document applies mainly include: RK3576, RK3588,RK3562,RV1126B. .

<!-- PDF p.10; extraction unit 15 -->

## 2 Development Environment Preparation

<!-- PDF p.10; extraction unit 16 -->

The RKLLM toolchain zip file contains the whl installer for the RKLLM-Toolkit, the associated files of the RKLLM Runtime library and reference sample code. The specific folder structure is shown below:

<!-- PDF p.10; extraction unit 17 -->

```text
doc
└──Rockchip_RKLLM_SDK_CN.pdf   # RKLLM SDK Documentation(Chinese)
└──Rockchip_RKLLM_SDK_EN.pdf   # RKLLM SDK Documentation(English)

examples
├──multimodal_model_demo    # Multimodal Inference Example
├──rkllm_api_demo           # Board-side Inference Example
└──rkllm_server_demo        # RKLLM-Server Deployment Example

rkllm-runtime
│   └── Android
│        └── librkllm_api
│             └──arm64-v8a
│                  └── librkllmrt.so  # 64位 Runtime库
│             └──armeabi-v7a
│                  └── librkllmrt.so   # 32 位Runtime库
│             └──include
│                  └── rkllm.h
│   └── Linux
│        └── librkllm_api
│             └──aarch64
│                  └── librkllmrt.so  # 64位Runtime库
│             └──armhf
│                  └── librkllmrt.so  # 32位Runtime库
│             └──include
│                  └── rkllm.h

rkllm-toolkit
│   └── packages
│        └──rkllm_toolkit-x.x.x-cp3xx-cp3xx-linux_x86_64.whl
│   └── examples

rknpu-driver
└──rknpu_driver_x.x.x_xxxxxxx.tar.bz2

scripts
├──fix_freq_rk3576.sh   # Fixed-frequency Script for RK3576
└──fix_freq_rk3588.sh   # Fixed-frequency Script for RK3588
└──fix_freq_rk3562.sh   # Fixed-frequency Script for RK3562
└──fix_freq_rv1126b.sh  # Fixed-frequency Script for RV1126B
```

<!-- PDF p.10; extraction unit 18 -->

This chapter provides detailed instructions for installing the RKLLM-Toolkit and RKLLM Runtime. For specific usage instructions, please refer to the instructions in Chapter 3.

<!-- PDF p.11; extraction unit 19 -->

### 2.1 Installation of RKLLM-Toolkit

<!-- PDF p.11; extraction unit 20 -->

This section mainly describes how to install the RKLLM-Toolkit with pip install command. Users can refer to the following detailed instructions to complete the installation of the RKLLM-Toolkit toolchain.

<!-- PDF p.11; extraction unit 21 -->

#### 2.1.1 Installation via Pip

<!-- PDF p.11; extraction unit 22 -->

##### 2.1.1.1 Installation of Miniforge3

<!-- PDF p.11; extraction unit 23 -->

To avoid the need for multiple versions of Python environments, it is recommended to use miniforge3 to manage your Python environments. Check if miniforge3 is installed and the version information of conda. If it is already installed, you can skip this section.

<!-- PDF p.11; extraction unit 24 -->

```text
conda -V
# If "conda: command not found" is displayed, it indicates that conda is not installed.
# For example, version information could be displayed as conda 23.9.0
```

<!-- PDF p.11; extraction unit 25 -->

Download the miniforge3 installation package.

<!-- PDF p.11; extraction unit 26 -->

```text
wget -c https://mirrors.bfsu.edu.cn/github-release/conda-forge/miniforge/LatestRelease/Miniforge3-Linux-x86_64.sh
```

<!-- PDF p.11; extraction unit 27 -->

Install miniforge3.

<!-- PDF p.11; extraction unit 28 -->

```text
chmod 777 Miniforge3-Linux-x86_64.sh
bash Miniforge3-Linux-x86_64.sh
```

<!-- PDF p.11; extraction unit 29 -->

##### 2.1.1.2 Create RKLLM-Toolkit Conda Environment

<!-- PDF p.11; extraction unit 30 -->

Activate the Conda base environment.

<!-- PDF p.11; extraction unit 31 -->

```text
source ~/miniforge3/bin/activate # directory of miniforge3
# (base) xxx@xxx-pc:~$
```

<!-- PDF p.11; extraction unit 32 -->

Create a Conda environment named RKLLM-Toolkit with Python version 3.8 (recommended).

<!-- PDF p.11; extraction unit 33 -->

```text
conda create -n RKLLM-Toolkit python=3.8
```

<!-- PDF p.11; extraction unit 34 -->

Activate the RKLLM-Toolkit Conda environment.

<!-- PDF p.11; extraction unit 35 -->

```text
conda activate RKLLM-Toolkit
# (RKLLM-Toolkit) xxx@xxx-pc:~$
```

<!-- PDF p.11; extraction unit 36 -->

##### 2.1.1.3 Installing RKLLM-Toolkit

<!-- PDF p.11; extraction unit 37 -->

In the RKLLM-Toolkit Conda environment, use the pip command to install the provided

<!-- PDF p.12; extraction unit 38 -->

toolchain .whl package directly. During the installation process, the installer will automatically download the necessary dependencies for the RKLLM-Toolkit tools.

<!-- PDF p.12; extraction unit 39 -->

```text
pip3 install rkllm_toolkit-x.x.x-cp3xx-cp3xx-linux_x86_64.whl
```

<!-- PDF p.12; extraction unit 40 -->

If executing the following command does not result in any errors, the installation is successful.

<!-- PDF p.12; extraction unit 41 -->

```text
python
from rkllm.api import RKLLM
```

<!-- PDF p.12; extraction unit 42 -->

### 2.2 Introduction for RKLLM Runtime Usage

<!-- PDF p.12; extraction unit 43 -->

Within the RKLLM toolchain files provided, the following components are included for the RKLLM runtime:

<!-- PDF p.12; extraction unit 44 -->

1) librkllmrt.so: RKLLM Runtime library suitable.

<!-- PDF p.12; extraction unit 45 -->

2) include/rkllm.h: Corresponding header file to librkllmrt.so, containing descriptions of related structures and function definitions. When constructing deployment inference code using the RKLLM toolchain, it is critical to ensure proper linkage to the above header file and function library to ensure compilation correctness. During the actual runtime of the code, it is equally important to ensure successful transfer of the above function library files to the board and complete library declaration through the following environment variable settings:

<!-- PDF p.12; extraction unit 46 -->

```text
export LD_LIBRARY_PATH=/path/to/your/lib
```

<!-- PDF p.12; extraction unit 47 -->

### 2.3 Compilation Requirements for RKLLM Runtime

<!-- PDF p.12; extraction unit 48 -->

When utilizing RKLLM Runtime, it's essential to pay attention to the version of the gcc compilation tool. We recommend the cross-compilation tool gcc-arm-10.2-2020.11-x86_64-aarch64-none-linux-gnu. Please note that cross-compilation tools often have backward compatibility but not upward compatibility, so refrain from using versions below 10.2. If you choose to use the Android platform, and you need to compile Android executable files, we recommend using the Android NDK tool for cross-compilation. You can download it from the following link: Android NDK Cross-Compilation Tool Download Link. We recommend using version r21e. You can also refer to the specific compilation methods in the compilation scripts located in the

<!-- PDF p.13; extraction unit 49 -->

examples/rkllm_api_demo/deploy directory.

<!-- PDF p.13; extraction unit 50 -->

### 2.4 Kernel Update

<!-- PDF p.13; extraction unit 51 -->

Due to the requirement of a higher version of the NPU kernel for the provided RKLLM, users need to verify that the NPU kernel on the board is version v0.9.8 before using RKLLM Runtime for model inference. The specific query command is as follows:

<!-- PDF p.13; extraction unit 52 -->

```text
# Execute the following command to query the NPU kernel version.
cat /sys/kernel/debug/rknpu/version

# Confirm that the command output is as follows:
# RKNPU driver: v0.9.8
```

<!-- PDF p.13; extraction unit 53 -->

If the queried NPU kernel version is lower than v0.9.8, please proceed to the official firmware address to download the latest firmware for updating. For users using non-official firmware, it's necessary to update the kernel. The RKNPU driver package supports two main kernel versions: kernel-5.10 and kernel-6.1. For kernel-5.10, it is recommended to use a specific version at GitHub-rockchip-linux/kernelatdevelop-5.10, and 5.10.209 is recommended. For kernel 6.1, it is recommended to use a specific version such as 6.1.84. Users can confirm the specific version number in the Makefile in the kernel's root directory. The specific steps to upgrade the kernel are as follows:

<!-- PDF p.13; extraction unit 54 -->

1) Download the rknpu_driver_0.9.8_20241009.tar.bz2.

<!-- PDF p.13; extraction unit 55 -->

2) Unzip the compressed file and overwrite the RKNPU driver into the current kernel code directory(kernel/drivers/rknpu).

<!-- PDF p.13; extraction unit 56 -->

3) Recompile the kernel.

<!-- PDF p.13; extraction unit 57 -->

4) Flash the newly compiled kernel to the device. If an error log, as shown in Figure 2-1, is encountered during the kernel compilation process:

<!-- PDF p.13; extraction unit 58 -->

![RKLLM original technical figure — PDF p.13](/docs/rockchip-rkllm-sdk/assets/en-p013-figure-02.png)

Copyable transcription of the original log (not an ArmSoM measurement; blurred account not reconstructed):

```text
drivers/rknpu/rknpu_gem.c: In function 'rknpu_gem_mmap_pages':
drivers/rknpu/rknpu_gem.c:891:2: error: implicit declaration of function 'vm_flags_set' [-Werror=implicit-function-declaration]
  891 |  vm_flags_set(vma, VM_MIXEDMAP);
      |  ^~~~~~~~~~~~
drivers/rknpu/rknpu_gem.c: In function 'rknpu_gem_mmap_buffer':
drivers/rknpu/rknpu_gem.c:988:2: error: implicit declaration of function 'vm_flags_clear' [-Werror=implicit-function-declaration]
  988 |  vm_flags_clear(vma, VM_PFNMAP);
      |  ^~~~~~~~~~~~~~
cc1: all warnings being treated as errors
make[2]: *** [scripts/Makefile.build:273: drivers/rknpu/rknpu_gem.o] Error 1
make[1]: *** [scripts/Makefile.build:516: drivers/rknpu] Error 2
make[1]: *** Waiting for unfinished jobs....
  AR      drivers/iio/built-in.a
make: *** [Makefile:1929: drivers] Error 2
MAKE KERNEL IMAGE FAILED.
```

<!-- PDF p.14; extraction unit 59 -->

Figure 2-1: Example of Kernel Compilation Error Then need to modify the kernel header file kernel/include/linux/mm.h by adding the following code:

<!-- PDF p.14; extraction unit 60 -->

```text
static inline void vm_flags_set(struct vm_area_struct *vma,
                          vm_flags_t flags){
      vma->vm_flags |= flags;
}

static inline void vm_flags_clear(struct vm_area_struct *vma,
                            vm_flags_t flags){
      vma->vm_flags &= ~flags;
}
```

<!-- PDF p.15; extraction unit 61 -->

## 3 RKLLM Instruction Guide

<!-- PDF p.15; extraction unit 62 -->

### 3.1 Model Conversion

<!-- PDF p.15; extraction unit 63 -->

RKLLM-Toolkit provides model conversion and quantization functionalities. As one of the core features of RKLLM-Toolkit, it allows users to convert LLMs in Hugging Face format or GGUF format into RKLLM models, enabling the deployment and execution of RKLLM models on Rockchip NPU. This section will focus on the specific implementation of model conversion by RKLLM-Toolkit for LLMs, serving as a reference for users.

<!-- PDF p.15; extraction unit 64 -->

#### 3.1.1 RKLLM Initialization

<!-- PDF p.15; extraction unit 65 -->

In this section, users need to initialize the RKLLM object, which is the first step in the entire workflow. In the example code, use the RKLLM() constructor function to initialize the RKLLM object.

<!-- PDF p.15; extraction unit 66 -->

#### 3.1.2 Loading Models

<!-- PDF p.15; extraction unit 67 -->

After initializing RKLLM, users need to call the rkllm.load_huggingface() function to pass the specific path of the model. RKLLM-Toolkit will then successfully load the large language model in Hugging Face format or GGUF format based on the corresponding path, enabling subsequent conversion and quantization operations. The specific function definition is as follows:

<!-- PDF p.16; extraction unit 68 -->

Table 3-1 Interface Specification for the load_huggingface Function

<!-- PDF p.16; extraction unit 69 -->

| Function | load_huggingface |
| --- | --- |
| Introduction | Used to load open-source LLMs in Hugging Face format. |
| Parameters | model: The path where the LLM files are stored, used for loading the model for<br>subsequent conversion and quantization.<br>model_lora: The file path of the LoRA weights. when converting, the model must<br>point to the corresponding base model path.<br>device: Specifies the device to be used for model conversion, supporting two options:<br>cuda and cpu.<br>dtype: The data type of the weights. Available options include float32, float16, and<br>bfloat16. Using float16 or bfloat16 can reduce memory consumption but may affect<br>quantization accuracy.<br>custom_config: Custom configuration file for the model. For details, refer to the<br>Custom Model Conversion section.<br>load_weight: Whether to load the weights. If set to False, the actual weights will not<br>be loaded. |
| Returns | 0 indicates successful model loading;<br>-1 indicates model loading failure. |

<!-- PDF p.16; extraction unit 70 -->

The example code is as follows:

<!-- PDF p.16; extraction unit 71 -->

```text
ret = rkllm.load_huggingface(
   model = './huggingface_model_dir',
   model_lora = './huggingface_lora_model_dir')
if ret != 0:
   print('Load model failed!')
```

<!-- PDF p.17; extraction unit 72 -->

Table 3-2 Interface Specification for the load_gguf Function

<!-- PDF p.17; extraction unit 73 -->

| Function | load_gguf |
| --- | --- |
| Introduction | Used to load open-source large language models in GGUF format, supporting the<br>numerical types q4_0 and fp16. GGUF-format LoRA models can also be loaded and<br>converted to RKLLM models through this interface. |
| Parameters | model: The path where the LLM files are stored, used for loading the model for<br>subsequent conversion and quantization. |
| Returns | 0 indicates successful model loading;<br>-1 indicates model loading failure. |

<!-- PDF p.17; extraction unit 74 -->

The example code is as follows:

<!-- PDF p.17; extraction unit 75 -->

```text
ret = rkllm.load_gguf(model = './model-Q4_0.gguf')
if ret != 0:
   print('Load model failed!')
```

<!-- PDF p.17; extraction unit 76 -->

#### 3.1.3 Construction for RKLLM Model

<!-- PDF p.17; extraction unit 77 -->

After loading the original model through the rkllm.load_huggingface() function, the next step is to build the RKLLM model using the rkllm.build() function. During model conversation, users can choose whether to perform quantization, which helps reduce the model size and improve inference performance on Rockchip NPU. The specific definition of the rkllm.build() function is as follows:

<!-- PDF p.18; extraction unit 78 -->

Table 3-3 Interface Specification for the build Function

<!-- PDF p.18; extraction unit 79 -->

| Function | build |
| --- | --- |
| Introduction | Used to construct the RKLLM model and define specific quantization operations<br>during the conversion process. |
| Parameters | do_quantization: This parameter controls whether to perform quantization operations<br>on the model, and it is recommended to set it to True.<br>optimization_level: This parameter is used to set whether to perform quantization<br>precision optimization. The available settings are {0, 1}, where 0 means no<br>optimization and 1 means precision optimization. Precision optimization may cause a<br>decrease in model inference performance.<br>quantized_dtype: This parameter is used to set the specific type of quantization.<br>Currently supported types include "w4a16", "w4a16_g32", "w4a16_g64",<br>"w4a16_g128", "w8a8", "w8a8_g128", "w8a8_g256", "w8a8_g512". "w4a16" means<br>4-bit quantization for weights and no quantization for activations. "w4a16_g64" means<br>4-bit grouped quantization for weights (group size=64) and no quantization for<br>activations. "w8a8" means 8-bit quantization for both weights and activations.<br>"w8a8_g128" means 8-bit grouped quantization for both weights and activations<br>(group size=128). The RK3576 and RV1126B platforms support five quantization<br>types: "w4a16", "w4a16_g32", "w4a16_g64", "w4a16_g128", and "w8a8". The<br>RK3588 platform supports four quantization types: "w8a8", "w8a8_g128",<br>"w8a8_g256", and "w8a8_g512". The RK3562 platform supports those quantization<br>types:"w8a8”, "w4a16_g32", "w4a16_g64", "w4a16_g128", "w4a8_g32". For GGUF<br>models, the quantization type corresponding to q4_0 is "w4a16_g32". Note: The<br>group size must divide the output dimension of the linear layer; otherwise,<br>quantization will fail!<br>quantized_algorithm: Quantization accuracy optimization algorithm, with selectable<br>options being "normal" "grq" or "gdq". All quantization types can choose "normal",<br>but the "gdq" and "grq" algorithm only support "w4a16" and grouped "w4a16"<br>quantization, and it requires high computational power, with GPU acceleration being<br>necessary.The grq algorithm is faster and consumes less memory compared to the gdq<br>algorithm. For 4-bit quantization, the grq algorithm should be preferred. It supports<br>improving quantization accuracy using LoRA modules. In the absence of any other<br>imported LoRA models, you can use algorithms such as "normal_r[164]", or<br>"gdq_r[1~64]" — for example, "normal_r8", "grq_r8", or "gdq_r8". In the end, both<br>the quantized model and the LoRA model will be exported, and the runtime will load<br>both models to perform inference.<br>num_npu_core: The number of NPU cores to be used for model inference. For<br>"RK3576", the options are [1, 2], for "RK3562", the options are [1] ,for "RK3588", the<br>options are [1, 2, 3] and for "RV1126B, the options are[1].<br>extra_qparams: Using the "gdq" and "grq" algorithm generate a *.qparams quantized<br>weight cache file. This parameter can be set to the *.qparams path to rebegin the<br>model export.<br>dataset: The dataset used for quantization calibration, formatted as JSON. An example<br>of the content is as follows, where input is the question (with a prompt), and target is<br>the answer. Multiple data entries are saved as dictionaries in a list;<br>hybrid_rate: The hybrid quantization rate ( ∈ [0,1)). When the quantization type is<br>"w4a16"/"w8a8", the model will mix "w4a16_g"/"w8a8_g" types at the specified rate<br>to improve accuracy. When the quantization type is grouped "w4a16_g"/"w8a8_g",<br>the model will mix "w4a16"/"w8a8" types at the specified rate to improve inference<br>performance. When the hybrid_rate value is 0, no hybrid quantization will be<br>performed.<br>target_platform: The hardware platform for running the model, with selectable<br>options including "RK3576” ,"RK3588”,"RK3562" and "RV1126B".<br>max_context: The maximum context length, supported up to 16,384 and must be<br>aligned to 32. |
| Returns | 0 indicates successful model conversion and quantization;<br>-1 indicates model conversion failure. |

<!-- PDF p.20; extraction unit 82 -->

The example code is as follows:

<!-- PDF p.20; extraction unit 83 -->

```text
ret = rkllm.build(
       do_quantization=True,
       optimization_level=1,
       quantized_dtype='w8a8',
       quantized_algorithm="normal",
       num_npu_core=3,
       extra_qparams=None,
       dataset="quant_data.json",
       hybrid_rate=0,
       target_platform='rk3588')
```

<!-- PDF p.20; extraction unit 84 -->

#### 3.1.4 Exporting Model

<!-- PDF p.20; extraction unit 85 -->

After constructing the RKLLM model using the rkllm.build() function, users can save the RKNN model as a .rkllm file for subsequent model deployment using the rkllm.export_rkllm() function. The specific parameter definition of the rkllm.export_rkllm() function is as follows:

<!-- PDF p.20; extraction unit 86 -->

Table 3-4 Interface Specification for the export_rkllm Function

<!-- PDF p.20; extraction unit 87 -->

| Function | export_rkllm |
| --- | --- |
| Introduction | Used to save the converted and quantized RKLLM model for subsequent inference. |
| Parameters | export_path: The save path for exporting the RKLLM model file. LoRA models will<br>automatically be saved with an _lora suffix in the RKLLM model filename. |
| Returns | 0 indicates successful export and saving of the model;<br>-1 indicates model export failure. |

<!-- PDF p.20; extraction unit 88 -->

The example code is as follows:

<!-- PDF p.20; extraction unit 89 -->

```text
ret = rkllm.export_rkllm(export_path = './model.rkllm'）
if ret != 0:
   print('Export model failed!')
```

<!-- PDF p.21; extraction unit 90 -->

#### 3.1.5 GPTQ Model Conversion

<!-- PDF p.21; extraction unit 91 -->

The user can convert a floating-point model to a 4-bit/8-bit model using the AutoGPTQ open-source quantization tool before converting it to an RKLLM model, in addition to using the quantization algorithms provided in the tools above. When using AutoGPTQ to quantize the floating-point model, the following parameters must be configured:

<!-- PDF p.21; extraction unit 92 -->

```text
bits=4
sym=true
group_size=32/64/128
desc_act=false
bits=8
sym=true
group_size=128/256/512
desc_act=false
```

<!-- PDF p.21; extraction unit 93 -->

Here’s an example code for converting a GPTQ model in HuggingFace format to an RKLLM model:

<!-- PDF p.21; extraction unit 94 -->

```text
modelpath = '/path/to/Model-Instruct-GPTQ-Int4'
llm = RKLLM()
ret = llm.load_huggingface(model=modelpath, model_lora = None,
device='cuda')
if ret != 0:
   print('Load model failed!')
   exit(ret)
# Build model
dataset = None
qparams = None
target_platform = "RK3576"
optimization_level = 1
quantized_dtype = "w4a16_g32" #w4a16_g64 or w4a16_g128
quantized_algorithm = "normal"
num_npu_core = 2
ret = llm.build(do_quantization=True,
optimization_level=optimization_level, quantized_dtype=quantized_dtype,
             quantized_algorithm=quantized_algorithm,
target_platform=target_platform, num_npu_core=num_npu_core,
extra_qparams=qparams, dataset=dataset)
if ret != 0:
   print('Build model failed!')
   exit(ret)
# Export rkllm model
ret = llm.export_rkllm(f"./{os.path.basename(modelpath)}_{quantized_dtype}_{target_platform}.rkllm")
if ret != 0:
   print('Export model failed!')
   exit(ret)
```

<!-- PDF p.22; extraction unit 95 -->

#### 3.1.6 Custom Model Conversion

<!-- PDF p.22; extraction unit 96 -->

If the user has modified the model structure or name, and the modified overall architecture is as follows, they can use the custom function to convert the model.

<!-- PDF p.22; extraction unit 97 -->

```text
           TOKEN_EMBD
             ↓
        embd_scale(optional)
             ↓
         ┌─ x
         │  ↓
         │  ATTN_NORM
         │  ↓
         │  attn
         │  ↓
         │  ATTN_POST_NORM(optional)
         │  ↓
         │  hidden_state_scale(optional)
         │  ↓
         │  cross attn(optional)
         │  ↓
   ┌─   └► +
   │
   │        ↓
   │     FFN_NORM
   │        ↓
   │        MLP
   │        ↓
   │   FFN_POST_NORM(optional)
   │        ↓
   │   hidden_state_scale(optional)
   │        ↓
   └───►   +

             ...
             ↓
         OUTPUT_NORM
             ↓
        lm_head_scale(optional)
             ↓
           OUTPUT
```

<!-- PDF p.22; extraction unit 98 -->

Taking the Qwen model as an example, the corresponding variable names in the modeling_qwen.py file should be filled into the custom configuration file as follows.

<!-- PDF p.23; extraction unit 99 -->

```text
{
   "BLOCKNAME": "QWenBlock",
   "TOKEN_EMBD": "wte",
   "ATTN_NORM": "ln_1",
   "ATTN_Q_NORM": "",
   "ATTN_K_NORM": "",
   "CROSS_ATTN_NORM": "",
   "CROSS_ATTN_Q": "",
   "ATTN_Q": "",
   "ATTN_K": "",
   "ATTN_V": "",
   "ATTN_QKV": "attn.c_attn",
   "ATTN_KV": "",
   "KV_CONTINUOUS": "true",
   "ATTN_OUT": "attn.c_proj",
   "CROSS_ATTN_OUT": "",
   "ATTN_POST_NORM": "",
   "FFN_NORM": "ln_2",
   "FFN_UP": "mlp.w1",
   "FFN_GATE": "mlp.w2",
   "ACT_TYPE": "silu",
   "FFN_DOWN": "mlp.c_proj",
   "FFN_POST_NORM": "",
   "OUTPUT_NORM": "ln_f",
   "OUTPUT": "lm_head"
}
```

<!-- PDF p.23; extraction unit 100 -->

The available options for ACT_TYPE are ["silu", "gelu", "relu", "fatrelu", "squarerelu", "swiglu"]. ATTN_NORM and FFN_NORM only support RMSNorm.

<!-- PDF p.23; extraction unit 101 -->

If ATTN_QKV or ATTN_KV is used, it must be confirmed whether the weights can be split into contiguous K&#124;V. If they are contiguous, set KV_CONTINUOUS to true. For example, the c_attn weights in the Qwen model are stored contiguously and can be sequentially split into Q, K, and V by size. In contrast, the wqkv weights in the InternLM2 model are stored non-contiguously, with Q, K, and V interleaved by head_dim.

<!-- PDF p.23; extraction unit 102 -->

The modeling_qwen.py file definition for the Qwen 1.8B model is as follows:

<!-- PDF p.24; extraction unit 103 -->

```text
class QWenLMHeadModel(QWenPreTrainedModel):
     def __init__(self, config):
       super().__init__(config)
         self.transformer = QWenModel(config)
         self.lm_head = nn.Linear(config.hidden_size,
config.vocab_size, bias=False)
class QWenModel(QWenPreTrainedModel):
   _keys_to_ignore_on_load_missing = ["attn.masked_bias"]

   def __init__(self, config):
       super().__init__(config)
       self.wte = nn.Embedding(self.vocab_size, self.embed_dim)
       self.ln_f = RMSNorm(
          self.embed_dim,
          eps=config.layer_norm_epsilon,
       )
class QWenBlock(nn.Module):
   def __init__(self, config):
       super().__init__()
       hidden_size = config.hidden_size
       self.bf16 = config.bf16

       self.ln_1 = RMSNorm(
          hidden_size,
          eps=config.layer_norm_epsilon,
       )
       self.attn = QWenAttention(config)
       self.ln_2 = RMSNorm(
          hidden_size,
          eps=config.layer_norm_epsilon,
       )
       self.mlp = QWenMLP(config)
class QWenAttention(nn.Module):
   def __init__(self, config):
       super().__init__()

       self.c_attn = nn.Linear(config.hidden_size, 3 *
self.projection_size)

       self.c_proj = nn.Linear(
          config.hidden_size, self.projection_size, bias=not
config.no_bias
       )

class QWenMLP(nn.Module):
   def __init__(self, config):
       super().__init__()
       self.w1 = nn.Linear(
          config.hidden_size, config.intermediate_size // 2, bias=not
config.no_bias
       )
       self.w2 = nn.Linear(
          config.hidden_size, config.intermediate_size // 2, bias=not
config.no_bias
       )
       ff_dim_in = config.intermediate_size // 2
       self.c_proj = nn.Linear(ff_dim_in, config.hidden_size, bias=not
config.no_bias)
```

<!-- PDF p.25; extraction unit 104 -->

For custom model conversion, including models with cross-attention support, we provide a reference Hugging Face model structure. The configuration file for customization is as follows:

<!-- PDF p.25; extraction unit 105 -->

```text
{
   "BLOCKNAME": "CustomDecoderLayer",
   "TOKEN_EMBD": "embed_tokens",
   "ATTN_NORM": "input_layernorm",
   "ATTN_Q_NORM": "",
   "ATTN_K_NORM": "",
   "CROSS_ATTN_NORM": "cross_layernorm",
   "CROSS_ATTN_Q": "cross_attn.cross_q_proj",
   "ATTN_Q": "",
   "ATTN_K": "",
   "ATTN_V": "",
   "ATTN_QKV": "self_attn.qkv_proj",
   "ATTN_KV": "",
   "KV_CONTINUOUS": "true",
   "ATTN_OUT": "self_attn.o_proj",
   "CROSS_ATTN_OUT": "cross_attn.cross_o_proj",
   "ATTN_POST_NORM": "",
   "FFN_NORM": "post_attention_layernorm",
   "FFN_UP": "mlp.up_proj",
   "FFN_GATE": "mlp.gate_proj",
   "ACT_TYPE": "silu",
   "FFN_DOWN": "mlp.down_proj",
   "FFN_POST_NORM": "",
   "OUTPUT_NORM": "norm",
   "OUTPUT": "lm_head"
}
```

<!-- PDF p.25; extraction unit 106 -->

#### 3.1.7 Update For Old Version Model

<!-- PDF p.25; extraction unit 107 -->

Since version 1.0.2 differs significantly from version 1.1 and later versions, the rkllm.update_rkllm() function is provided to update the 1.0.2 model to the latest version.. When updating the model, there is no need to perform the model loading and building steps mentioned earlier. Instead, the update can be done directly via this interface, and after the update, parameters such as model quantization type remain unchanged. Here is a description of the function and its parameters:

<!-- PDF p.26; extraction unit 108 -->

Table 3-5 Interface Specification for the update_rkllm Function

<!-- PDF p.26; extraction unit 109 -->

| Function | update_rkllm |
| --- | --- |
| Introduction | Update the model from version 1.0.2 to latest version |
| Parameters | model: The path to the RKLLM model of version 1.0.2. |
| Returns | 0 indicates that the model update was successful;<br>-1 indicates that the model update failed. |

<!-- PDF p.26; extraction unit 110 -->

The example code is as follows:

<!-- PDF p.26; extraction unit 111 -->

```text
ret = llm.update_rkllm(model = "./model_1.0.2version.rkllm")
if ret != 0:
   print('Load model failed!')
   exit(ret)
```

<!-- PDF p.26; extraction unit 112 -->

#### 3.1.8 Simulation Accuracy Evaluation

<!-- PDF p.26; extraction unit 113 -->

After the user builds the RKLLM model through the rkllm.build() function, they can perform simulation accuracy evaluation on the PC using the rkllm.get_logits() function. The specific parameter definitions for the rkllm.get_logits() function are as follows:

<!-- PDF p.26; extraction unit 114 -->

Table 3-6 Interface Specification for the get_logits Function

<!-- PDF p.26; extraction unit 115 -->

| Function | get_logits |
| --- | --- |
| Introduction | Used for simulation accuracy evaluation on the PC. |
| Parameters | inputs: The simulation input format is the same as Hugging Face model inference. An<br>example is as follows: {"input_ids": "", "top_k": 1, ...} |
| Returns | The logits values inferred by the model. |

<!-- PDF p.26; extraction unit 116 -->

Example code for using this function to perform PPL (perplexity) testing on the Wikitext dataset is as follows:

<!-- PDF p.27; extraction unit 117 -->

```text
def eval_wikitext(llm):
   seqlen = 512
   tokenizer = AutoTokenizer.from_pretrained(
       modelpath,
       trust_remote_code=True
       )
   #Dataset download link:
   #https://huggingface.co/datasets/Salesforce/wikitext/tree/main/wikitext-2-raw-v1
   testenc = load_dataset("parquet", data_files='./wikitext/wikitext-2-raw-1/test-00000-of-00001.parquet', split='train')
   testenc = tokenizer(
       "\n\n".join(testenc['text']),
       return_tensors="pt").input_ids
   nsamples = testenc.numel() // seqlen
   nlls = []
   for i in tqdm(range(nsamples), desc="eval_wikitext: "):
       batch = testenc[:, (i * seqlen): ((i + 1) * seqlen)]
       inputs = {"input_ids": batch}
       lm_logits = llm.get_logits(inputs)
       if lm_logits is None:
          print("get logits failed!")
          return
       shift_logits = lm_logits[:, :-1, :]
       shift_labels = batch[:, 1:].to(lm_logits.device)
       loss_fct = nn.CrossEntropyLoss().to(lm_logits.device)
       loss = loss_fct(shift_logits.view(-1, shift_logits.size(-1)),
shift_labels.view(-1))
       neg_log_likelihood = loss.float() * seqlen
       nlls.append(neg_log_likelihood)
   ppl = torch.exp(torch.stack(nlls).sum() / (nsamples * seqlen))
   print(f'wikitext-2-raw-1-test ppl: {round(ppl.item(), 2)}')
```

<!-- PDF p.27; extraction unit 118 -->

#### 3.1.9 Simulated Model Inference

<!-- PDF p.27; extraction unit 119 -->

After the user builds the RKLLM model using the rkllm.build() function, they can perform simulated inference on the PC using the rkllm.chat_model() function. The specific parameter definitions for the rkllm.chat_model() function are as follows:

<!-- PDF p.27; extraction unit 120 -->

Table 3-7 Interface Specification for the chat_model Function

<!-- PDF p.27; extraction unit 121 -->

| Function | chat_model |
| --- | --- |
| Introduction | Used for simulate model inference on the PC. |
| Parameters | messages: The text input, which needs to include the appropriate prompts.<br>args: Inference configuration parameters, such as sampling parameters like top_k. |
| Returns | The logits values inferred by the model. |

<!-- PDF p.28; extraction unit 122 -->

The example code is as follows:

<!-- PDF p.28; extraction unit 123 -->

```text
args ={
   "max_length":128,
   "top_k":1,
   "temperature":0.8,
   "do_sample":True,
   "repetition_penalty":1.1
   }

mesg = "Human: How’s the weather today?\nAssistant:"
print(llm.chat_model(mesg, args))
```

<!-- PDF p.28; extraction unit 124 -->

The above operations cover all steps of model conversion and quantization in the RKLLM-Toolkit. Depending on different requirements and application scenarios, users can choose different configuration options and quantization methods for customised settings, which facilitates subsequent deployment.

<!-- PDF p.28; extraction unit 125 -->

### 3.2 Inference Implementation in Board-side

<!-- PDF p.28; extraction unit 126 -->

This chapter introduces the usage of the general API interface functions. Users can refer to the content of this chapter to construct C++ code and implement inference of RKLLM models on the board to obtain inference results. The RKLLM board-side inference implementation is as follows:

1） Define the callback function callback().

2） Define the RKLLM model parameter structure RKLLMParam.

3） Initialize the RKLLM model with rkllm_init().

4） Perform model inference with rkllm_run().

5） Process the real-time inference results returned by the callback function callback().

6） Destroy the RKLLM model and release resources with rkllm_destroy(). In the subsequent parts of this chapter, the document will provide detailed explanations of each step in the process and provide detailed explanations of the functions involved.

<!-- PDF p.29; extraction unit 127 -->

#### 3.2.1 Define Callback Function

<!-- PDF p.29; extraction unit 128 -->

The callback function is used to receive real-time output results from the RKLLM model. It is bound during the initialization of RKLLM and continuously outputs results to the callback function during the RKLLM model inference process, returning only one token each time. Here is an example that callback function prints the output results in real-time to the terminal:

<!-- PDF p.29; extraction unit 129 -->

```text
int callback(RKLLMResult* result, void* userdata, LLMCallState state)
{
   if(state == LLM_RUN_NORMAL){
       printf("%s", result->text);
   }
   if (state == LLM_RUN_FINISH) {
       printf("finish\n");
   } else if (state == LLM_RUN_ERROR){
       printf("\run error\n");
   }
   return 0;
}
```

<!-- PDF p.29; extraction unit 130 -->

1) LLMCallState is a status flag, and its specific definition is as follows:

<!-- PDF p.29; extraction unit 131 -->

Table 3-8 Explanation of LLMCallState Status Flags

<!-- PDF p.29; extraction unit 132 -->

| Definition | LLMCallState |
| --- | --- |
| Introduction | Used to indicate the current running state of RKLLM. |
| Enumeration<br>Values | LLM_RUN_NORMAL: indicates that the RKLLM model is currently inferencing;<br>LLM_RUN_FINISH: indicates that the RKLLM model has completed inference;<br>LLM_RUN_WAITING: indicates that the currently decoded character from RKLLM<br>is not a complete UTF-8 encoding and needs to be concatenated with the next<br>decoding result;<br>LLM_RUN_ERROR: indicates that an error has occurred during inference; |

<!-- PDF p.29; extraction unit 133 -->

During the design process of the callback function, users can set different post-processing behaviors based on the different states of LLMCallState.

<!-- PDF p.29; extraction unit 134 -->

2) RKLLMResult is a return value structure, and its specific definition is as follows:

<!-- PDF p.30; extraction unit 135 -->

Table 3-9 Explanation of RKLLMResult Structure

<!-- PDF p.30; extraction unit 136 -->

| Definition | RKLLMResult |
| --- | --- |
| Introduction | Used to return the current inference-generated result. |
| Struct Fields | const char* text: indicates the text content generated by the current inference;<br>int32_t token_id: indicates the token_id generated by the current inference;<br>RKLLMResultLogits logits: Represents the logits information generated during the<br>current inference, only returned when RKLLMInferMode is set to<br>RKLLM_INFER_GET_LOGITS;<br>RKLLMPerfStat perf: Indicates the performance statistics at the end of the current<br>inference; data is only returned when in the RKLLM_RUN_FINISH state. |

<!-- PDF p.30; extraction unit 137 -->

3) RKLLMResultLogits is a return value structure, and its specific definition is as follows:

<!-- PDF p.30; extraction unit 138 -->

Table 3-9 Explanation of RKLLMResultLogitsStructure

<!-- PDF p.30; extraction unit 139 -->

| Definition | RKLLMResultLogits |
| --- | --- |
| Introduction | Used to return the current inference-generated logits. |
| Struct Fields | const float* logits: indicates the logits generated by the current inference;<br>int vocab_size:indicates the token_id generated by the current inference;<br>int num_tokens: Indicates the number of tokens returned; users can calculate the size<br>of the logits based on vocab_size and num_tokens; |

<!-- PDF p.30; extraction unit 140 -->

During the design process of the callback function, users can set different post-processing behaviors based on the values in RKLLMResult.

<!-- PDF p.30; extraction unit 141 -->

#### 3.2.2 Define RKLLMParam

<!-- PDF p.30; extraction unit 142 -->

The RKLLMParam structure is used to describe and define the detailed information of RKLLM. The specific definition is as follows:

<!-- PDF p.31; extraction unit 143 -->

Table 3-10 Explanation of RKLLMParam Structure

<!-- PDF p.31; extraction unit 144 -->

| Definition | RKLLMParam |
| --- | --- |
| Introduction | Used to define the detailed parameters of the RKLLM model. |
| Struct Fields | const char* model_path: the path to the RKLLM model file;<br>int32_t num_npu_core: the number of NPU cores used during model inference; The<br>"RK3576" platform has configurable range [1, 2]; while the "RK3588" is [1, 3];<br>bool use_gpu: whether to use GPU for prefill acceleration, default option is false;<br>int32_t max_context_len: the maximum context length during inference;<br>int32_t max_new_tokens: the maximum number of generated tokens in inferencing;<br>int32_t top_k: top-k sampling is a text generation method that selects the next token<br>only from the top-k tokens with the highest probabilities predicted by the model. This<br>method helps reduce the risk of generating low-probability or meaningless tokens. A<br>higher top-k value (e.g., 100) will consider more token choices, resulting in more<br>diverse text generation, while a lower value (e.g., 10) will focus on the most probable<br>tokens, generating more conservative text. The default value is 40;<br>float top_p: top-p sampling, also known as nucleus sampling, is another text<br>generation method that selects the next token from a group of tokens with cumulative<br>probabilities of at least p. This method balances diversity and quality by considering<br>the probabilities of tokens and the number of sampled tokens. A higher top-p value<br>(e.g., 0.95) results in more diverse text generation, while a lower value (e.g., 0.5)<br>generates more focused and conservative text. The default value is 0.9;<br>float temperature: a hyperparameter that controls the randomness of generated text by<br>adjusting the probability distribution of output tokens. A higher temperature (e.g., 1.5)<br>makes the output more random and creative. When the temperature is high, the model<br>considers more options with lower probabilities when selecting the next token,<br>resulting in more diverse and unexpected outputs. A lower temperature (e.g., 0.5)<br>makes the output more focused and conservative. Lower temperatures mean that the<br>model is more likely to choose high-probability tokens, resulting in more consistent<br>and predictable outputs. In the extreme case of a temperature of 0, the model always<br>chooses the most probable next token, resulting in identical outputs every time. To<br>balance randomness and determinism and ensure that the output is neither overly<br>uniform and predictable nor overly random and chaotic, the default value is 0.8;<br>float repeat_penalty: controls the occurrence of token sequence repetitions in the<br>generated text, helping to prevent the model from generating repetitive or monotonous<br>text. A higher value (e.g., 1.5) imposes a stronger penalty on repetitions, while a lower<br>value (e.g., 0.9) is more lenient. The default value is 1.1;<br>float frequency_penalty: a factor for penalizing word/phrase repetition, reducing the<br>probability of using words/phrases with higher frequencies overall and increasing the<br>likelihood of using those with lower frequencies. This may lead to more diversified<br>generated text, but could also result in text that is difficult to understand or not as<br>expected. The range is [-2.0, 2.0], with a default value of 0;<br>int32_t mirostat: an algorithm actively maintaining the quality of generated text<br>within the expected range during the text generation process. It aims to find a balance<br>between coherence and diversity, avoiding low-quality output caused by excessive<br>repetition (boredom trap) or incoherence (confusion trap). The values space is {0, 1,<br>2}, where 0 indicates not activating the algorithm, 1 indicates using the mirostat<br>algorithm, and 2 indicates using the mirostat 2.0 algorithm;<br>float mirostat_tau: an option setting the target entropy for mirostat, representing the<br>expected perplexity value of the generated text. Adjusting the target entropy allows to<br>control the balance between coherence and diversity in the generated text. Lower<br>values will result in more concentrated and coherent text, while higher values will lead<br>to more diversified text, possibly with lower coherence. The default value is 5.0;<br>float mirostat_eta: an option setting the learning rate for mirostat, which influences<br>the algorithm's responsiveness to feedback on generated text. A lower learning rate<br>will result in slower adjustment, while a higher learning rate will make the algorithm<br>more sensitive. The default value is 0.1;<br>bool skip_special_token: whether to skip special tokens and not output them, such as<br>the end-of-sequence token &lt;EOS&gt;.<br>bool is_async: whether to use asynchronous mode.<br>const char img_start*: option to set the start marker for multimodal input image<br>encoding, which needs to be configured in multimodal input mode.<br>const char img_end*: option to set the end marker for multimodal input image<br>encoding, which needs to be configured in multimodal input mode.<br>const char img_content*: option to set the content marker for multimodal input image<br>encoding, which needs to be configured in multimodal input mode.<br>n_keep: The number of cache entries to retain at the beginning when clearing the KV<br>cache. In multi-turn conversations, the n_keep value must be at least as long as the<br>system_prompt length.<br>RKLLMExtendParam extend_param: the special parameters for controlling<br>inference. |

<!-- PDF p.34; extraction unit 147 -->

Table 3-11 Explanation of RKLLMExtendParam Structure

<!-- PDF p.34; extraction unit 148 -->

| Definition | RKLLMExtendParam |
| --- | --- |
| Introduction | The special parameters for controlling inference. |
| Struct Fields | int32_t base_domain_id: controls from which domain the RKLLM model starts<br>initialization, default is 0.<br>int8_t embed_flash: Controls whether to store the model's vocabulary in flash<br>memory to save memory. Set to 0 to disable and 1 to enable.<br>int8_t enabled_cpus_num: Sets the number of CPUs to use for inference. The range<br>varies depending on the chip model. For RK3588/3576, the range is 1-8; for RK3562,<br>the range is 1-4, with the default set to 4.<br>uint32_t enabled_cpus_mask: Uses a binary mask to configure which<br>specific CPU cores are used for inference. In rkllm.h, macros are predefined<br>to represent CPU numbers, and you can configure them using the format<br>CPU4 &#124; CPU5 &#124; CPU6 &#124; CPU7.<br>uint8_t n_batch: Sets the level of parallel inference; the default value is 1.<br>int8_t use_cross_attn: Sets whether to enable cross-attention. |

<!-- PDF p.34; extraction unit 149 -->

In actual code construction, RKLLMParam needs to call the rkllm_createDefaultParam() function to initialize its definition, and set the corresponding model parameters according to requirements. Sample code is as follows:

<!-- PDF p.34; extraction unit 150 -->

```text
RKLLMParam param = rkllm_createDefaultParam();
param.model_path = "model.rkllm";
param.top_k = 1;
param.max_new_tokens = 256;
param.max_context_len = 512;
```

<!-- PDF p.34; extraction unit 151 -->

#### 3.2.3 Define Input Struct

<!-- PDF p.34; extraction unit 152 -->

To accommodate different input data types, the RKLLMInput input struct is defined, which currently accepts four types of input: text, image and text, token IDs, and encoded vectors. The specific definition is as follows:

<!-- PDF p.35; extraction unit 153 -->

Table 3-12 Explanation of RKLLMInput Structure

<!-- PDF p.35; extraction unit 154 -->

| Definition | RKLLMInput |
| --- | --- |
| Introduction | Used to receive different forms of input data. |
| Struct Fields | RKLLMInputType input_type: Input mode;<br>const char* role: Input type, optional values: ["user", "tool"];<br>bool enable_thinking: whether to enable the thinking mode of Qwen3;<br>union: Used to store different input data types, specifically including the following<br>forms:<br>const char prompt_input*: Text prompt input, used to pass natural language text;<br>RKLLMEmbedInput embed_input: Embedding vector input, representing processed<br>feature vectors;<br>RKLLMTokenInput token_input: Token input, used to pass the tokenized token<br>sequence;<br>RKLLMMultiModalInput multimodal_input: Multimodal input, which can pass<br>multimodal data, such as combined input of images and text; |

<!-- PDF p.35; extraction unit 155 -->

Table 3-13 Explanation of RKLLMInputType Structure

<!-- PDF p.35; extraction unit 156 -->

| Definition | RKLLMInputType |
| --- | --- |
| Introduction | Used to represent the type of input data. |
| Enumeration<br>Values | RKLLM_INPUT_PROMPT: Indicates that the input data is plain text.<br>RKLLM_INPUT_TOKEN: Indicates that the input data is token IDs.<br>RKLLM_INPUT_EMBED: Indicates that the input data is encoded vectors.<br>RKLLM_INPUT_MULTIMODAL: Indicates that the input data consists of images<br>and text. |

<!-- PDF p.36; extraction unit 157 -->

When the input data is plain text, it can be directly input using input_data. When the input data consists of token IDs, encoded vectors, or images and text, the RKLLMInput must be used in conjunction with the RKLLMTokenInput, RKLLMEmbedInput, and RKLLMMultiModalInput structures. The specific introduction is as follows:

<!-- PDF p.36; extraction unit 158 -->

1) RKLLMTokenInput is the input struct that receives token IDs. The specific definition is as follows:

<!-- PDF p.36; extraction unit 159 -->

Table 3-14 Explanation of RKLLMTokenInput Structure

<!-- PDF p.36; extraction unit 160 -->

| Definition | RKLLMTokenInput |
| --- | --- |
| Introduction | Used to receive token_id data. |
| Struct Fields | int32_t input_ids*: Memory pointer for the input token IDs.<br>size_t n_tokens: The number of tokens in the input data. |

<!-- PDF p.36; extraction unit 161 -->

2) RKLLMEmbedInput is the input struct that receives encoded vectors. The specific definition is as follows:

<!-- PDF p.36; extraction unit 162 -->

Table 3-15 Explanation of RKLLMEmbedInput Structure

<!-- PDF p.36; extraction unit 163 -->

| Definition | RKLLMEmbedInput |
| --- | --- |
| Introduction | Used to receive embedding data. |
| Struct Fields | float embed*: Memory pointer for the input token embeddings.<br>size_t n_tokens: The number of tokens in the input data. |

<!-- PDF p.36; extraction unit 164 -->

3) RKLLMMultiModalInput is the input struct that receives images and text. The specific definition is as follows:

<!-- PDF p.37; extraction unit 165 -->

Table 3-16 Explanation of RKLLMMultiModalInput Structure

<!-- PDF p.37; extraction unit 166 -->

| Definition | RKLLMMultiModalInput |
| --- | --- |
| Introduction | Used to receive images and text data. |
| Struct Fields | char prompt*: Memory pointer for the input text.<br>float image_embed*: Memory pointer for the input image embeddings.<br>size_t n_image_tokens: The number of tokens for the input image embeddings.<br>size_t n_image: number of input images; supports inputting multiple consecutive<br>frames.<br>size_t image_width: width of the input image used when computing embeddings, used<br>for mrope calculation parameters.<br>size_t image_height: height of the input image used when computing embeddings,<br>used for mrope calculation parameters. |

<!-- PDF p.37; extraction unit 167 -->

RKLLM supports different inference modes and defines the RKLLMInferParam structure. It currently supports joint inference with preloaded LoRA models during the inference process, or saving a Prompt Cache for subsequent inference acceleration. The specific definition is as follows:

<!-- PDF p.38; extraction unit 168 -->

Table 3-17 Explanation of RKLLMInferParam Structure

<!-- PDF p.38; extraction unit 169 -->

| Definition | RKLLMInferParam |
| --- | --- |
| Introduction | Used to define different inference modes. |
| Struct Fields | RKLLMInferMode mode: Inference mode, supporting<br>RKLLM_INFER_GENERATE normal inference mode and<br>RKLLM_INFER_GET_LOGITS additional logits retrieval inference mode.<br>RKLLMLoraParam lora_params*: Parameter configuration for the LoRA used<br>during inference, used to select which LoRA to infer when multiple LoRAs are<br>loaded. Set to NULL if LoRA is not needed.<br>RKLLMPromptCacheParam prompt_cache_params*: Parameter configuration for<br>using the Prompt Cache during inference. Set to NULL if Prompt Cache generation is<br>not needed.<br>keep_history: Indicates whether to retain the historical context during inference. Set to<br>1 for multi-turn conversations. |

<!-- PDF p.38; extraction unit 170 -->

Table 3-18 Explanation of RKLLMLoraParam Structure

<!-- PDF p.38; extraction unit 171 -->

| Definition | RKLLMLoraParam |
| --- | --- |
| Introduction | Used to define the parameters for using LoRA during inference. |
| Struct Fields | const char lora_adapter_name*: The name of the LoRA used during inference. |

<!-- PDF p.38; extraction unit 172 -->

Table 3-19 Explanation of RKLLMPromptCacheParam Structure

<!-- PDF p.38; extraction unit 173 -->

| Definition | RKLLMPromptCacheParam |
| --- | --- |
| Introduction | Used to define the parameters for using Prompt Cache during inference. |
| Struct Fields | int save_prompt_cache: Indicates whether to save the Prompt Cache during inference.<br>1 means it is required, and 0 means it is not.<br>const char prompt_cache_path*: Path to save the Prompt Cache. If not set, it defaults<br>to "./prompt_cache.bin”. |

<!-- PDF p.39; extraction unit 174 -->

Here is an example of using RKLLMPromptCacheParam for inference:

<!-- PDF p.39; extraction unit 175 -->

```text
// Initialize and Set Prompt Cache Parameters(if needed)
RKLLMPromptCacheParam prompt_cache_params;
// Enable saving Prompt Cache
prompt_cache_params.save_prompt_cache = true;
// Specify cache file path
prompt_cache_params.prompt_cache_path = "./prompt_cache.bin";
rkllm_infer_params.prompt_cache_params = &prompt_cache_params;
```

<!-- PDF p.39; extraction unit 176 -->

#### 3.2.4 Initialize Model

<!-- PDF p.39; extraction unit 177 -->

Before initializing the model, it is necessary to define the LLMHandle handle in advance. This handle is used for the initialization, inference, and resource release processes of the model. It's important to note that only by unifying the LLMHandle handle object across these three processes can the inference process of the model be completed correctly. Prior to model inference, users need to complete the model initialization through the rkllm_init() function. The specific function definition is as follows:

<!-- PDF p.39; extraction unit 178 -->

Table 3-20 Interface Specification for the rkllm_init Function

<!-- PDF p.39; extraction unit 179 -->

| Function | rkllm_init |
| --- | --- |
| Introduction | Used to initialize the specific parameters and inference settings for RKLLM model. |
| Parameters | LLMHandle* handle: register model to the corresponding handle for subsequent<br>inference and release calls;<br>RKLLMParam* param: the parameter structure defined for the model;<br>LLMResultCallback callback: callback function used to receive and process real-time<br>outputs from the model; |
| Returns | 0 indicates that the initialization process is normal;<br>-1 indicates initialization failure; |

<!-- PDF p.39; extraction unit 180 -->

The example code is as follows:

<!-- PDF p.39; extraction unit 181 -->

```text
LLMHandle llmHandle = nullptr;
rkllm_init(&llmHandle, &param, callback);
```

<!-- PDF p.40; extraction unit 182 -->

#### 3.2.5 Inference Model

<!-- PDF p.40; extraction unit 183 -->

After completing the initialization process of the RKLLM model, users can perform model inference using the rkllm_run() function. Real-time inference results can be processed using the callback function predefined during initialization. The specific function definition of rkllm_run() is as follows:

<!-- PDF p.40; extraction unit 184 -->

Table 3-21 Interface Specification for the rkllm_run Function

<!-- PDF p.40; extraction unit 185 -->

| Function | rkllm_run |
| --- | --- |
| Introduction | Used to performing result inference using the initialized RKLLM model. |
| Parameters | LLMHandle handle: the target handle registered during model initialization.<br>RKLLMInput rkllm_input*: Input data for model inference. For details, see section<br>3.2.3 on input structure definition.<br>RKLLMInferParam rkllm_infer_params*: Parameter passing during the model<br>inference process. For details, see section 3.2.3 on input structure definition.<br>void* userdata: the user-defined function pointer, typically set to NULL by default. |
| Returns | 0 indicates that the model inference runs normally;<br>-1 indicates a failure in calling the model inference; |

<!-- PDF p.40; extraction unit 186 -->

#### 3.2.6 Interrupt Model Inference

<!-- PDF p.40; extraction unit 187 -->

During model inference, users can call the rkllm_abort() function to interrupt the inference process. The specific function definition is as follows:

<!-- PDF p.40; extraction unit 188 -->

Table 3-22 Interface Specification for the rkllm_abort Function

<!-- PDF p.40; extraction unit 189 -->

| Function | rkllm_ abort |
| --- | --- |
| Introduction | Used to interrupt the RKLLM model inference process. |
| Parameters | LLMHandle handle: the target handle registered during model initialization; |
| Returns | 0 indicates successful interruption of the model;<br>-1 indicates a failure to interrupt the model. |

<!-- PDF p.41; extraction unit 190 -->

#### 3.2.7 Release Model

<!-- PDF p.41; extraction unit 191 -->

After completing all model inference calls, users need to call the rkllm_destroy() function to destroy the RKLLM model and release the CPU, GPU, and NPU computing resources allocated, for use by other processes or models. The specific function definition is as follows:

<!-- PDF p.41; extraction unit 192 -->

Table 3-23 Interface Specification for the rkllm_destroy Function

<!-- PDF p.41; extraction unit 193 -->

| Function | rkllm_ destroy |
| --- | --- |
| Introduction | Used to destroy the RKLLM model and release all computing resources. |
| Parameters | LLMHandle handle: the target handle registered during model initialization; |
| Returns | 0 indicates successful destruction and release of the RKLLM model;<br>-1 indicates a failure in releasing the model. |

<!-- PDF p.41; extraction unit 194 -->

The example code is as follows:

<!-- PDF p.41; extraction unit 195 -->

```text
// llmHandle is the the target handle registered
rkllm_destroy(llmHandle);
```

<!-- PDF p.41; extraction unit 196 -->

#### 3.2.8 Load LoRA Model

<!-- PDF p.41; extraction unit 197 -->

RKLLM supports running LoRA models simultaneously with the base model during inference. Before invoking the rkllm_run interface, you can load a LoRA model via the rkllm_load_lora interface. RKLLM allows loading multiple LoRA models; each call to rkllm_load_lora loads one LoRA model. The specific function definition is as follows:

<!-- PDF p.41; extraction unit 198 -->

Table 3-24 Interface Specification for the rkllm_load_lora Function

<!-- PDF p.41; extraction unit 199 -->

| Function | rkllm_load_lora |
| --- | --- |
| Introduction | Used to load LoRA model for the base model. |
| Parameters | LLMHandle handle: The target handle registered during model initialization. See<br>section 3.2.4 on initializing the model.<br>RKLLMLoraAdapter lora_adapter*: Parameter for loading the LoRA model. |
| Returns | 0 indicates the LoRA model was successfully loaded.<br>-1 indicates the model loading failed. |

<!-- PDF p.42; extraction unit 200 -->

Table 3-25 Explanation of RKLLMLoraAdapter Structure

<!-- PDF p.42; extraction unit 201 -->

| Definition | RKLLMLoraAdapter |
| --- | --- |
| Introduction | Used to configure parameters when loading a LoRA model. |
| Struct Fields | const char* lora_adapter_path: The path to the LoRA model to be loaded.<br>const char* lora_adapter_name: The name of the LoRA model to be loaded, defined<br>by the user, used to select the specified LoRA during inference.<br>float scale: The degree to which the LoRA model adjusts the base model parameters<br>during inference. |

<!-- PDF p.42; extraction unit 202 -->

Here is an example Code for Loading LoRA:

<!-- PDF p.42; extraction unit 203 -->

```text
RKLLMLoraAdapter lora_adapter;
memset(&lora_adapter, 0, sizeof(RKLLMLoraAdapter));
lora_adapter.lora_adapter_path = "lora.rkllm";
lora_adapter.lora_adapter_name = "lora_name";
lora_adapter.scale = 1.0;
ret = rkllm_load_lora(llmHandle, &lora_adapter);
if (ret != 0) {
   printf("\nload lora failed\n");
}
```

<!-- PDF p.42; extraction unit 204 -->

#### 3.2.9 Load Prompt Cache

<!-- PDF p.42; extraction unit 205 -->

During the model inference process, the Prefill stage typically consumes a significant amount of computational resources and time, especially when the Prompt is long. To accelerate this process, RKLLM supports loading Prompt Cache from files. By reusing cached content, you can significantly reduce the time spent in the Prefill stage, thereby improving overall inference efficiency. Before invoking the rkllm_run interface for inference, ensure that the prompt_cache_params parameters are correctly configured. This step allows the model to generate the corresponding Prompt Cache file after inference. When running inference for the first time, the system will automatically generate a Prompt Cache file. This file contains the intermediate results required for the Prefill stage, which can be reused in subsequent tasks. In subsequent inference tasks, you can load previously generated Prompt Cache files by calling the rkllm_load_prompt_cache interface. The specific function definitions are as follows:

<!-- PDF p.43; extraction unit 206 -->

Table 3-26 Interface Specification for the rkllm_load_prompt_cache Function

<!-- PDF p.43; extraction unit 207 -->

| Function | rkllm_load_prompt_cache |
| --- | --- |
| Introduction | Used to load Prompt Cache file. |
| Parameters | LLMHandle handle: The target handle registered during model initialization (refer to<br>section 3.2.4 Initialization Model).<br>const char* prompt_cache_path: The path to the Prompt Cache file to be loaded. |
| Returns | 0 indicates the Prompt Cache file was successfully loaded.<br>-1 indicates loading failed. |

<!-- PDF p.43; extraction unit 208 -->

Table 3-27 Interface Specification for the rkllm_release_prompt_cache Function

<!-- PDF p.43; extraction unit 209 -->

| Function | rkllm_release_prompt_cache |
| --- | --- |
| Introduction | Used to release the Prompt Cache. |
| Parameters | LLMHandle handle: The target handle registered during model initialization (refer to<br>section 3.2.4 Initialization Model). |
| Returns | 0 indicates that the Prompt Cache model was successfully released.<br>-1 indicates that the model release failed. |

<!-- PDF p.43; extraction unit 210 -->

Note: RKLLM will detect the parts of the input that are the same as those in the prompt_cache from the beginning. If your input format is fixed as PROMPT_PREFIX + text + PROMPT_POSTFIX, you can generate the Prompt Cache for just the PROMPT_PREFIX part. After loading, you can reuse this part of the result in subsequent inferences. RKLLM supports generating multiple Prompt Cache files. When different Prompt Cache files are needed, you can simply load the corresponding file. If you need to switch to another Prompt Cache file or no longer need the loaded Prompt Cache, please explicitly call the rkllm_release_prompt_cache interface to release it.

<!-- PDF p.44; extraction unit 211 -->

Here is an example Code for Loading Prompt Cache:

<!-- PDF p.44; extraction unit 212 -->

```text
// Initialize and set the Prompt Cache parameters, then call the run interface to generate the Prompt Cache file.

RKLLMPromptCacheParam prompt_cache_params;
// Whether to save the prompt cache
prompt_cache_params.save_prompt_cache = true;
// If you need to save the prompt cache, specify the absolute path of the cache file.
prompt_cache_params.prompt_cache_path = "/data/prompt_cache.bin";
rkllm_infer_params.prompt_cache_params = &prompt_cache_params;
rkllm_infer_params.mode = RKLLM_INFER_GENERATE;
rkllm_input.input_type = RKLLM_INPUT_PROMPT;
rkllm_input.prompt_input = (char *)prompt.c_str();
rkllm_run(llmHandle, &rkllm_input, &rkllm_infer_params, NULL);
// Load the prompt cache file to reduce prefill time.
rkllm_load_prompt_cache(llmHandle, "./prompt_cache.bin");
if (ret != 0) {
   printf("\nload Prompt Cache failed\n");
}
rkllm_run(llmHandle, &rkllm_input, &rkllm_infer_params, NULL);
```

<!-- PDF p.44; extraction unit 213 -->

#### 3.2.10 KV Cache Management

<!-- PDF p.44; extraction unit 214 -->

RKLLM supports manual clearing of the KV cache, which can be used for both single-turn and multi-turn dialogues. When invoking the cache clearing function, if keep_system_prompt is set to 1, the system prompt (if present) will be retained; otherwise, the entire cache will be cleared. The function definition is as follows:

<!-- PDF p.45; extraction unit 215 -->

Table 3-28 Interface Specification for the rkllm_clear_kv_cache Function

<!-- PDF p.45; extraction unit 216 -->

| Function | rkllm_clear_kv_cache |
| --- | --- |
| Introduction | Used to clear the KV cache. |
| Parameters | LLMHandle handle: The target handle registered during model initialization (refer to<br>section 3.2.4 Initialization Model).<br>keep_system_prompt: whether to retain the system prompt (1 to retain, 0 to clear).<br>start_pos: The starting position ID of the KV cache to be deleted, inclusive of the<br>start_pos position, If you don't need to use it, please manually set it to nullptr.<br>end_pos: The ending position ID of the KV cache to be deleted, exclusive of the<br>end_pos position, If you don't need to use it, please manually set it to nullptr.<br>Note:<br>deleting KV cache at specified positions is only supported when using the pause<br>inference feature in single-turn mode.<br>If a specific range [start_pos, end_pos) is provided, keep_system_prompt will be<br>ignored, and the kv cache within this range will be cleared instead. |
| Returns | 0: Indicates successful clearing of the KV cache.<br>-1: Indicates failure to clear the KV cache. |

<!-- PDF p.45; extraction unit 217 -->

#### 3.2.11 Chat Template Settings

<!-- PDF p.45; extraction unit 218 -->

when users input text, RKLLM preprocesses the text. During preprocessing, it automatically parses and applies the prompt template based on the chat_template field in the HuggingFace model ’ s tokenizer_config.json file. If customization is needed, you can reset it using the following function. Here, system_prompt acts as the system prompt to guide the model’s behavior, prompt_prefix is the prefix added before the user input, and prompt_postfix is the suffix added after the user input. The specific function definition is as follows. After the user resets the template, the enable_thinking option becomes ineffective, and users need to configure it within their custom prompt.

<!-- PDF p.46; extraction unit 219 -->

Table 3-29 Interface Specification for the rkllm_set_chat_template Function

<!-- PDF p.46; extraction unit 220 -->

| Function | rkllm_set_chat_template |
| --- | --- |
| Introduction | Used to set the prompt template. |
| Parameters | LLMHandle handle: The target handle registered during model initialization (refer to<br>section 3.2.4 Initialization Model).<br>system_prompt: The system prompt guiding the model behavior.<br>prompt_prefix: The prefix before user input.<br>prompt_postfix: The suffix after user input. |
| Returns | 0: Indicates the success of the chat template.<br>-1: Indicates failure to set the chat template. |

<!-- PDF p.46; extraction unit 221 -->

#### 3.2.12 Function Calling Settings

<!-- PDF p.46; extraction unit 222 -->

RKLLM supports structured interaction between the model and external systems through Function Calling, extending the capabilities of large language models and improving their performance in tasks such as knowledge augmentation and accurate data retrieval. when Function Calling mode is enabled, the application can pass function definitions to the model. Based on the user's query, the model determines whether a function call is needed and outputs a call request in the specified format. The application then calls the corresponding function based on the model's intent and returns the result. The model continues the conversation based on the returned result. the function used to configure Function Calling in RKLLM is defined as follows:

<!-- PDF p.47; extraction unit 223 -->

Table 3-30 Interface Specification for the rkllm_set_chat_template Function

<!-- PDF p.47; extraction unit 224 -->

| Function | rkllm_set_function_tools |
| --- | --- |
| Introduction | Function Calling configuration, including system prompt, tool function definitions, and<br>tool response identifier. |
| Parameters | LLMHandle handle: The target handle registered during model initialization (refer to<br>section 3.2.4 Initialization Model).<br>system_prompt: The system prompt guiding the model behavior.<br>tools: json-formatted function definition string that describes the available functions,<br>including their names, purposes, and parameter formats.<br>tool_response_str: Identifier tag for tool function call results, used to distinguish them<br>from regular conversation content. |
| Returns | 0: indicates successful configuration;<br>-1: indicates configuration failure. |

<!-- PDF p.47; extraction unit 225 -->

Example: first configure the tools.

```text
std::string system_prompt = "You are Qwen, created by Alibaba Cloud. You are a helpful assistant.\n\nCurrent Date: 2024-09-30";
std::string tools = R"([
   {
       "type": "function",
       "function": {
          "name": "get_current_temperature",
          "description": "Get current temperature at a location.",
          "parameters": {
             "type": "object",
             "properties": {
                 "location": {
                    "type": "string",
                    "description": "The location to get the temperature for, in the format \"City, State, Country\"."
                 },
                 "unit": {
                    "type": "string",
                    "enum": ["celsius", "fahrenheit"],
                    "description": "The unit to return the temperature in. Defaults to \"celsius\"."
                 }
             },
             "required": ["location"]
          }
       }
   },
   {
       "type": "function",
       "function": {
          "name": "get_temperature_date",
          "description": "Get temperature at a location and date.",
          "parameters": {
             "type": "object",
             "properties": {
                 "location": {
                    "type": "string",
                    "description": "The location to get the temperature for, in the format \"City, State, Country\"."
                 },
                 "date": {
                    "type": "string",
                    "description": "The date to get the temperature for, in the format \"Year-Month-Day\"."
                 },
                 "unit": {
                    "type": "string",
                    "enum": ["celsius", "fahrenheit"],
                    "description": "The unit to return the temperature in. Defaults to \"celsius\"."
                 }
             },
             "required": ["location", "date"]
          }
       }
   }
])";

rkllm_set_function_tools(llmHandle, system_prompt.c_str(),
tools.c_str(), "tool_response");
```

<!-- PDF p.48; extraction unit 227 -->

Next, during the inference process, integrate with rkllm_run to implement the function calling chain:

<!-- PDF p.49; extraction unit 228 -->

```text
// User's question
RKLLMInferParam rkllm_infer_params;
memset(&rkllm_infer_params, 0, sizeof(RKLLMInferParam));
rkllm_infer_params.mode = RKLLM_INFER_GENERATE;
rkllm_infer_params.keep_history = 0;

RKLLMInput rkllm_input;
rkllm_input.input_type = RKLLM_INPUT_PROMPT;
rkllm_input.enable_thinking = false;

rkllm_input.role = "user";
rkllm_input.prompt_input = "What's the temperature in San Francisco now? How about tomorrow?";

rkllm_run(llmHandle, &rkllm_input, &rkllm_infer_params, NULL);

// the first call to rkllm_run will return the name of the tool function that needs to be called;

<tool_call>
{"name": "get_current_temperature", "arguments": {"location": "San Francisco"}}
</tool_call>
<tool_call>
{"name": "get_temperature_date", "arguments": {"location": "San Francisco", "date": "2024-10-01"}}
</tool_call>

// return the tool call result to llm, and the role must be set to "tool"

rkllm_input.role = "tool";
rkllm_input.prompt_input = R"([
   {
       "temperature": 26.1,
       "location": "San Francisco",
       "unit": "celsius"
   },
   {
       "temperature": 25.9,
       "location": "San Francisco",
       "date": "2024-09-30",
       "unit": "celsius"
   }
])";

rkllm_run(llmHandle, &rkllm_input, &rkllm_infer_params, NULL);

// final result
"The current temperature in San Francisco is 26.1°C. Tomorrow, the temperature is expected to be 25.9°C."
```

<!-- PDF p.50; extraction unit 229 -->

#### 3.2.13 Cross Attention Settings

<!-- PDF p.50; extraction unit 230 -->

RKLLM supports cross-attention inference. Users can input the K/V cache, mask, and positional information generated by the encoder into the decoder for cross-attention computation through the following function. Cross-attention is only supported for custom model inference. The model conversion method is detailed in Section 3.1.6.

<!-- PDF p.50; extraction unit 231 -->

Table 3-31 Interface Specification for the rkllm_set_cross_attn_params Function

<!-- PDF p.50; extraction unit 232 -->

| Function | rkllm_set_cross_attn_params |
| --- | --- |
| Introduction | Used to configure cross-attention parameters. |
| Parameters | LLMHandle handle: The target handle registered during model initialization (refer to<br>section 3.2.4 Initialization Model).<br>RKLLMCrossAttnParam* cross_attn_params: Cross-attention parameters. |
| Returns | 0: indicates successful configuration;<br>-1: indicates configuration failure. |

<!-- PDF p.50; extraction unit 233 -->

Table 3-32 Explanation of RKLLMCrossAttnParam Structure

<!-- PDF p.50; extraction unit 234 -->

| Function | RKLLMCrossAttnParam |
| --- | --- |
| Introduction | Cross-attention parameters |
| Struct Fields | - float* encoder_k_cache: pointer to the encoder output key cache<br>- float* encoder_v_cache: pointer to the encoder output value cache<br>- float* encoder mask: attention mask for the encoder<br>- int32_t* encoder_pos: positional information of the input tokens to the encoder<br>- int* num_tokens: number of input tokens to the encoder |

<!-- PDF p.51; extraction unit 235 -->

#### 3.2.14 Multi-batch Parallel Inference

<!-- PDF p.51; extraction unit 236 -->

RKLLM supports simultaneous inference of multiple batches (it is recommended that the number of batches does not exceed 8). Below is an example code for inference using two batches:

<!-- PDF p.51; extraction unit 237 -->

 When initializing the model, the param.extend_param.n_batch parameter needs to be set to 2.  When using multiple batches for inference, both RKLLMInput and RKLLMResult in the callback are arrays of size n_batch.  The inference results for all batches are returned synchronously in the callback. When the token ID of a particular batch is negative, it indicates that the inference for that batch is complete. Inference will only stop once all batches have finished.  When handling the returned text in the callback, it is necessary to first check whether the returned text is a null pointer before performing assignment operations.

<!-- PDF p.52; extraction unit 238 -->

```text
#include <string.h>
#include <unistd.h>
#include <string>
#include "rkllm.h"
#include <fstream>
#include <iostream>
#include <csignal>
#include <vector>

using namespace std;
LLMHandle llmHandle = nullptr;

std::string output_texts[10];

int callback(RKLLMResult *result, void *userdata, LLMCallState state)
{
   if (state == RKLLM_RUN_FINISH)
   {
       printf("\nrkllm run finish\n");
   } else if (state == RKLLM_RUN_ERROR) {
       printf("\nrkllm run error\n");
   } else if (state == RKLLM_RUN_NORMAL) {
       RKLLMResult batch1 = result[0];
       RKLLMResult batch2 = result[1];
       if (batch1.text) {
          output_texts[0] += batch1.text;
          printf("batch 0 %s\n", output_texts[0].c_str());
       }
       if (batch2.text) {
          output_texts[1] += batch2.text;;
          printf("batch 1 %s\n", output_texts[1].c_str());
       }
   }
   return 0;
}

int main(int argc, char **argv)
{
   if (argc < 4) {
       std::cerr << "Usage: " << argv[0] << " model_path max_new_tokens max_context_len\n";
       return 1;
   }

   RKLLMParam param = rkllm_createDefaultParam();
   param.model_path = argv[1];
   param.top_k = 1;
   param.top_p = 0.95;
   param.temperature = 0.8;
   param.repeat_penalty = 1.1;
   param.frequency_penalty = 0.0;
   param.presence_penalty = 0.0;
   param.max_new_tokens = std::atoi(argv[2]);
   param.max_context_len = std::atoi(argv[3]);
   param.skip_special_token = true;
   param.extend_param.base_domain_id = 0;
   param.extend_param.embed_flash = 1;
   param.extend_param.n_batch = 2;
   int ret = rkllm_init(&llmHandle, &param, callback);
   if (ret == 0){
       printf("rkllm init success\n");
   } else {
       printf("rkllm init failed\n");
       exit_handler(-1);
   }

   RKLLMInput rkllm_input[2];
   memset(&rkllm_input, 0, sizeof(RKLLMInput)*2);
   RKLLMInferParam rkllm_infer_params;
   memset(&rkllm_infer_params, 0, sizeof(RKLLMInferParam));
   output_texts[0].clear();
   output_texts[1].clear();

   rkllm_infer_params.mode = RKLLM_INFER_GENERATE;
   rkllm_infer_params.keep_history = 0;

   rkllm_input[0].input_type = RKLLM_INPUT_PROMPT;
   rkllm_input[0].role = "user";
   rkllm_input[0].enable_thinking = false;
   rkllm_input[0].prompt_input = "上联: 江边惯看千帆过";

   rkllm_input[1].input_type = RKLLM_INPUT_PROMPT;
   rkllm_input[1].role = "user";
   rkllm_input[1].enable_thinking = false;
   rkllm_input[1].prompt_input = "以咏梅为题目，帮我写一首古诗，要求包含梅花、白雪等元素。";

   printf("robot: ");
   rkllm_run(llmHandle, &rkllm_input[0], &rkllm_infer_params, NULL);

   rkllm_destroy(llmHandle);
   return 0;
}
```

<!-- PDF p.53; extraction unit 240 -->

#### 3.2.15 Model Inference Pause

<!-- PDF p.53; extraction unit 241 -->

RKLLM supports pausing inference in single-turn mode by returning 1 in the callback. When inference is paused, the KV cache will not be cleared, allowing the user to modify the input and then call rkllm_run to resume inference.

<!-- PDF p.53; extraction unit 242 -->

#### 3.2.16 Model Performance Data Callback

<!-- PDF p.53; extraction unit 243 -->

RKLLM supports returning performance data for a single inference at the end of the inference process. This includes the total time spent on prefill and decoding inference, the number of tokens, and memory usage. The structure of the returned data is defined as follows:

<!-- PDF p.54; extraction unit 244 -->

Table 3-33 Explanation of RKLLMPerStat Structure

<!-- PDF p.54; extraction unit 245 -->

| Definition | RKLLMPerfStat |
| --- | --- |
| Introduction | return model inference performance data |
| Struct Fields | - float prefill_time_ms: total time spent in the prefill stage, in milliseconds<br>- int prefill_tokens: total number of tokens in the prefill stage<br>- float generate_time_ms: total time spent in the generate stage, in milliseconds<br>- int generate_tokens: total number of tokens in the generate stage<br>- float memory_usage_mb: Memory usage during inference process,measured by<br>VmHWM, in megabytes |

<!-- PDF p.54; extraction unit 246 -->

### 3.3 Board-side Inference Example

<!-- PDF p.54; extraction unit 247 -->

The directory, examples/rkllm_api_demo, is include the C++ project for the inference on the board- site, and which is synchronously updated with this documentation. Furthermore, compilation scripts are provided for users to facilitate the compilation of the project and the completion of the board-side inference of the RKLLM model.

<!-- PDF p.54; extraction unit 248 -->

#### 3.3.1 Complete Code of Example Project

<!-- PDF p.54; extraction unit 249 -->

The complete C++ code example for inference calls is located in the example/rkllm_api_demo/deploy/src directory of the toolchain. The llm_demo.cpp file serves as an example of large language model inference. These examples include the full process, including model initialization, inference, handling outputs with callback functions, and releasing model resources. Users can refer to the relevant code to implement custom functionality.

<!-- PDF p.54; extraction unit 250 -->

#### 3.3.2 Instructions for Example Project

<!-- PDF p.54; extraction unit 251 -->

Under the directory of examples/rkllm_api_demo/deploy, not only does it contain sample code for invoking the RKLLM model inference, but also includes compilation scripts build-android.sh and build- linux.sh. This section will provide a brief explanation of how to use the sample code, taking compiling

<!-- PDF p.55; extraction unit 252 -->

executable files for Linux systems as an example using the build-linux.sh script: Firstly, users need to prepare cross-compilation tools on their own, noting that the recommended version of the compilation tools in section 2.3 is 10.2 or above. Subsequently, before the compilation process, users should replace the path to the cross-compilation tools in build-linux.sh themselves:

<!-- PDF p.55; extraction unit 253 -->

```text
# Set the path of the cross-compiler GCC_COMPILER_PATH=~/gcc-arm-10.2-2020.11-x86_64-aarch64-none-linux-gnu/bin/aarch64-none-linux-gnu
```

<!-- PDF p.55; extraction unit 254 -->

Subsequently, users can use build-linux.sh to initiate the compilation process. Upon completion of the compilation, users will obtain the corresponding llm_demo program, which will installed in the install/demo_linux_aarch64/llm_demo directory directory. Following this, the executable file, library folder, and the RKLLM model (previously converted and quantized using the RKLLM-Toolkit tool) should be pushed to the board-side.

<!-- PDF p.55; extraction unit 255 -->

```text
adb push install/demo_Linux_aarch64  /data
adb push /PC/path/to/your/rkllm/model /data/demo_Linux_aarch64
```

<!-- PDF p.55; extraction unit 256 -->

After completing the above steps, users can enter the terminal interface of the board using adb, and navigate to the corresponding /data/demo_linux_aarch64 directory. Then, the inference of RKLLM model on the board can be invoked using the following command:

<!-- PDF p.55; extraction unit 257 -->

```text
adb shell
cd /data/demo_linux_aarch64
export LD_LIBRARY_PATH=./lib
./llm_demo /path/to/your/rkllm/model 1024 2048
```

<!-- PDF p.55; extraction unit 258 -->

With the above operations, users can enter the example inference interface, interact with the board- side model for inference, and obtain real-time inference results from the RKLLM model.

<!-- PDF p.55; extraction unit 259 -->

#### 3.3.3 Monitor inference performance and Log Viewing

<!-- PDF p.55; extraction unit 260 -->

If you need to view RKLLM's performance or logs during inference on the board, you can use the following commands:

<!-- PDF p.55; extraction unit 261 -->

```text
# View only TTFT, TPS, and memory usage data
export RKLLM_LOG_LEVEL=1
# In addition to performance data, also prints cache length and more details
export RKLLM_LOG_LEVEL=2
```

<!-- PDF p.56; extraction unit 262 -->

![RKLLM original technical figure — PDF p.56](/docs/rockchip-rkllm-sdk/assets/en-p056-figure-02.png)

Copyable transcription of the original log (not an ArmSoM measurement; blurred account not reconstructed):

```text
Model initialization: 834.82 ms
Stage       Total Time (ms)  Tokens  Time per Token (ms)  Tokens per Second
Prefill     306.31           13      23.56                42.44
Generate    1918.31          9       213.15               4.69
Peak Memory Usage (GB): 0.52
```

<!-- PDF p.56; extraction unit 263 -->

Figure 3-1 RKLLM inference performance logs on the hardware platform

<!-- PDF p.56; extraction unit 264 -->

### 3.4 Implementation of Board-side Server

<!-- PDF p.56; extraction unit 265 -->

After using RKLLM-Toolkit to convert the model and obtain the RKLLM model, users can deploy server-side services on Linux development boards. This involves setting up a server on a Linux device and exposing network interfaces to everyone in the local area network. Subsequently, the RKLLM model can be accessed by other users via the specified address, thus facilitating efficient and concise interaction. This section will introduce two different server deployment implementations.

<!-- PDF p.56; extraction unit 266 -->

1) RLM-Server-Flask based on Flask: Users can achieve API access between the client and server using request requests. The provided RKLLM-Server-Flask example includes a common conversation example and a single-round conversation example that supports the Function Calling function.

<!-- PDF p.56; extraction unit 267 -->

2) RKLLM-Server-Gradio based on Gradio: By reference to the provided example, users can rapidly construct a web server for visual interaction. Furthermore, the example illustrates the utilisation of the Gradio API interface, which enables users to undertake secondary development. Both examples of server implementations mentioned above are located in the examples/rkllm_server_demo directory. This directory contains specific code for both implementations, one-click deployment scripts, and API interface calling examples. Users can choose different examples for reference and further development. The directory structure is as follows:

<!-- PDF p.57; extraction unit 268 -->

```text
examples/rkllm_server_demo
├──rkllm_server          # Board-side Deployment Required Files
│   └── lib                    # RKLLM Runtime
│   └── flask_server.py            # RKLLM-Server-Flask Example
│   └── gradio_server.py           # RKLLM-Server-Gradio Example
├──build_rkllm_server_flask.sh # One-click Deployment Script -Flask
├──build_rkllm_server_gradio.sh# One-click Deployment Script -Gradio
├──chat_api_flask.py           # API Interface Example -Flask
├──chat_api_gradio.py          # API Interface Example -Gradio
└──Readme.md
```

<!-- PDF p.57; extraction unit 269 -->

#### 3.4.1 Deployment Example of RKLLM-Server-Flask

<!-- PDF p.57; extraction unit 270 -->

In the deployment example of RKLLM-Server-Flask, the main focus is on using the Flask framework to set up the server-side. On the client-side, data is transmitted using the request-response structure to achieve API access. Users send specific data structures to the server during the API call process. The main contents are as follows:

<!-- PDF p.57; extraction unit 271 -->

```text
{
   "model": "No models available",
   "messages": [
     {"role": "system",
       "content": "You are a helpful assistant."
     },
     {
       "role": "user",
       "content": "Hello!"
     }
   ],
   "stream": false,
   "enable_thinking": False,
   "tools": None

}
```

<!-- PDF p.57; extraction unit 272 -->

Among them, "model" and "stream" specify the specific model to be called and whether to initiate streaming inference transmission, while the "content" data in "messages" is the crucial user input. "enable_thinking" indicates whether the model performs deep thinking when answering (users need to set this option based on whether the model supports this function). "tools" is the functional description of the user-defined function in the Function Calling function (refer to Section 3.4.1.3.2 for specific definition rules). Users also need to set this parameter based on whether the model supports the Function Calling function. If it is not supported or not used, it should be set to "None".

<!-- PDF p.58; extraction unit 273 -->

As for the data returned by the server, the structure of the data output varies depending on whether streaming inference transmission is selected. The data content returned under non-streaming inference settings is as follows:

<!-- PDF p.58; extraction unit 274 -->

```text
{
  "id": "chatcmpl-123",
  "object": "chat.completion",
  "created": 1677652288,
  "model": "gpt-3.5-turbo-0125",
  "system_fingerprint": "fp_44709d6fcb",
  "choices": [{
   "index": 0,
   "message": {
     "role": "assistant",
     "content": "\n\nHello there, how may I assist you today?",},
   "logprobs": null,
   "finish_reason": "stop"
  }],
  "usage": {
   "prompt_tokens": 9,
   "completion_tokens": 12,
   "total_tokens": 21
  }
}
```

<!-- PDF p.58; extraction unit 275 -->

When streaming inference transmission is not selected, the most important part is the "messages" content under the "choices" section, which represents the inference results provided by the model. In contrast, when streaming inference transmission is enabled, the server returns a Response object, which includes the output results of the model at different points in time during the streaming inference process. The data content at each moment is as follows:

<!-- PDF p.58; extraction unit 276 -->

```text
{
"id": "chatcmpl-123",
  "object": "chat.completion.chunk",
  "created": 1677652288,
  "model": "gpt-3.5-turbo-0125",
  "system_fingerprint": "fp_44709d6fcb",
  "choices": [{
   "index": 0,
   "delta": {
     "role": "assistant",
     "content": "\n\nHello there, how may I assist you today?",},
   "logprobs": null,
   "finish_reason": "stop"
  }]
}
```

<!-- PDF p.58; extraction unit 277 -->

After receiving the data from streaming transmission, users need to focus on the "delta" data section within the "choices" part. Additionally, when "finish_reason" is empty (None), it indicates that the model is still in the inference state, and the data has not been fully generated yet. It's only when "finish_reason"

<!-- PDF p.59; extraction unit 278 -->

returns "stop" that the streaming inference is considered finished. In the provided deployment example code and API access examples for RKLLM-Server-Flask, you can see identical definitions of the transmission data structure, ensuring the generality of the deployed RKLLM-Server-Flask. In the subsequent sections of this chapter, we will separately introduce the one- click deployment script for the server, important settings for server deployment implementation, and the script design for client-side API access.

<!-- PDF p.59; extraction unit 279 -->

##### 3.4.1.1 Server-side: One-click Deployment Script for RKLLM-Server-Flask

<!-- PDF p.59; extraction unit 280 -->

The one-click deployment script for RKLLM-Server-Flask is named build_rkllm_server_flask.sh and is located in the rkllm_server_demo directory. This script helps users quickly set up the RKLLM- Server-Flask server on a Linux development board. Before using this script, users should note the following:

<!-- PDF p.59; extraction unit 281 -->

1) Ensure that the development board is connected to the network via an Ethernet cable. Use the "ifconfig" command in the adb shell to determine the specific IP address of the development board. The RKLLM-Server-Flask will then set up the server with this IP address within the local area network and accept client access.

<!-- PDF p.59; extraction unit 282 -->

2) Users should have successfully converted the RKLLM model beforehand. Before executing the one-click deployment script, ensure that the RKLLM model has been pushed to the Linux board. Users can directly invoke the build_rkllm_server_flask.sh script from their PC (not on a development board) to quickly deploy the RKLLM-Server-Flask server on a Linux development board. The specific usage of the one-click deployment script build_rkllm_server_flask.sh is as follows:

<!-- PDF p.59; extraction unit 283 -->

```text
./build_rkllm_server_flask.sh
   --workshop [RKLLM-Server Working Path]
   --model_path [Absolute Path of Converted RKLLM Model on Board] --platform [Target Platform: RK3588/RK3576/RK3562/RV1126B]
   [--lora_model_path [LoRA Model Path]]
   [--prompt_cache_path [Prompt Cache File Path]]
```

<!-- PDF p.59; extraction unit 284 -->

The `workshop` parameter specifies the subsequent working directory of RKLLM-Server-Flask on the board. The `model_path` parameter indicates the absolute path of the RKLLM model on the board, which was converted using RKLLM-Toolkit, and RKLLM-Server-Flask will read the model from this

<!-- PDF p.60; extraction unit 285 -->

path during operation. The `platform` parameter specifies the current platform type, either RK3588, RK3576, RK3562 or RV1126B. The `lora_model_path` and `prompt_cache_path` parameters are optional and can be used to specify file paths when the user needs to load a LoRA model or use the prompt feature. The following is a simple example of how to use the one-click deployment script `build_rkllm_server_flask.sh`:

<!-- PDF p.60; extraction unit 286 -->

```text
./build_rkllm_server_flask.sh
   --workshop /path/to/workshop
   --model_path /path/to/model.rkllm
   --platform rk3588
```

<!-- PDF p.60; extraction unit 287 -->

After executing the above command, the one-click deployment script will perform the following steps:

<!-- PDF p.60; extraction unit 288 -->

1) Check the Linux environment on the board.

<!-- PDF p.60; extraction unit 289 -->

2) Automatically install the Flask library if not already installed.

<!-- PDF p.60; extraction unit 290 -->

3) Push the necessary files under rkllm_server_demo/rkllm_server to the board.

<!-- PDF p.60; extraction unit 291 -->

4) Index the RKLLM model in the preset working directory for RKLLM-Server-Flask. Once you see the message "RKLLM Model has been initialized successfully!" in the terminal, it indicates that the RKLLM-Server-Flask example has been successfully launched.

<!-- PDF p.60; extraction unit 292 -->

![RKLLM original technical figure — PDF p.60](/docs/rockchip-rkllm-sdk/assets/en-p060-figure-02.png)

Copyable transcription of the original log (not an ArmSoM measurement; blurred account not reconstructed):

```text
=========init....===========
rkllm-runtime version: 1.0.2b9, rknpu driver version: 0.9.7, platform: RK3588
load prompt cache from '/data/cw/prompt_cache.bin'
loaded a prompt cache with prompt size of 27 tokens
RKLLM Model has been initialized successfully!
===========================
 * Serving Flask app 'flask_server'
 * Debug mode: off
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:8080
 * Running on http://172.16.10.79:8080
Press CTRL+C to quit
```

<!-- PDF p.60; extraction unit 293 -->

Figure 3-2 Successful deployment of RKLLM-Server-Flask in terminal By referring to the specific code logic in build_rkllm_server_flask.sh, users can understand the detailed deployment process of the RKLLM-Server-Flask example. This enables users to customize the deployment implementation of their server more flexibly. It is important to emphasize that in step 3 of the one-click deployment script, the script automatically synchronizes the current version of RKLLM Runtime to rkllm_server/lib/librkllmrt.so. This ensures that flask_server.py calls the current version of librkllmrt.so during runtime.

<!-- PDF p.61; extraction unit 294 -->

##### 3.4.1.2 Server-side: Introductions for RKLLM-Server-Flask Example

<!-- PDF p.61; extraction unit 295 -->

In this section, we will outline and introduce the implementation approach of the deployment example for RKLLM-Server-Flask, helping users understand the construction logic of the example code for potential secondary development. The deployment example of RKLLM-Server-Flask primarily relies on the Flask library to achieve the basic implementation of the server. Additionally, for RKLLM model inference, the ctypes library in Python is chosen to directly call the RKLLM Runtime library. In the overall implementation of rkllm_server/flask_server.py, in order to call librkllmrt.so via ctypes, it's necessary to define relevant structures in Python based on the header file rkllm.h corresponding to librkllmrt.so beforehand. After the Flask server receives the struct data sent by users, it calls relevant functions to perform inference with the RKLLM model. The specific code implementation of flask_server.py mainly consists of the following steps:

<!-- PDF p.61; extraction unit 296 -->

![RKLLM original technical figure — PDF p.61](/docs/rockchip-rkllm-sdk/assets/en-p061-figure-02.png)

<!-- PDF p.61; extraction unit 297 -->

Figure 3-3 Overview of the RKLLM-Server-Flask Deployment Implementation Process

<!-- PDF p.61; extraction unit 298 -->

1) Load RKLLM Runtime: Set the path for the dynamic library and load the dynamic library librkllmrt.so using ctypes to achieve the analysis of the RKLLM Runtime.

<!-- PDF p.61; extraction unit 299 -->

2) Completing the external implementation of the Runtime: In the Python code, use ctypes to complete the external definitions of relevant implementations from the RKLLM Runtime header files, including definitions of data structures, callback functions, initialization functions, inference functions, destroy functions, and loading functions for LoRA/Prompt Cache.

<!-- PDF p.61; extraction unit 300 -->

3) Encapsulate a complete class function: Based on the various Runtime data types and function

<!-- PDF p.62; extraction unit 301 -->

interfaces implemented in step 2), encapsulate complete class functions that integrate RKLLM’s initialization, inference, destroy, and other operations for easier subsequent calls.

<!-- PDF p.62; extraction unit 302 -->

4) Set up RKLLM-Server-Flask: Using the complete class functions encapsulated in step 3, build the Flask server, including loading the RKLLM model based on user-specified parameters at Flask startup, defining the format of user input and the method for parsing the input, differentiating between streaming/non-streaming inference call methods, defining the return format for inference output and the specific implementation of callback functions, and handling RKLLM release. The specific implementations of the above modules form the main body of the code in rkllm_server/flask_server.py, thereby completing the deployment of the RKLLM-Server-Flask example. Users can modify the initialization definitions for the RKLLM model to implement different custom models. Additionally, users can refer to the RKLLM-Server-Flask deployment example for implementing their own custom server deployment.

<!-- PDF p.62; extraction unit 303 -->

##### 3.4.1.3 Client-side: API Access Example

<!-- PDF p.62; extraction unit 304 -->

The file rkllm_server_demo/chat_api_flask.py contains a basic conversation demo (with the main code in main_demo1) as well as a single-round conversation demo that supports Function Calling (with the main code in main_demo2).

<!-- PDF p.62; extraction unit 305 -->

###### 3.4.1.3.1 Example 1 - normal conversation

<!-- PDF p.62; extraction unit 306 -->

The example is a common question-and-answer conversation. This section describes the general conversation example in detail:

<!-- PDF p.62; extraction unit 307 -->

1) Define the network address of RKLLM-Server-Flask. Users need to set the target address based on the specific IP of the Linux development board, the port number set by the Flask framework, and the function name for access.

<!-- PDF p.62; extraction unit 308 -->

```text
server_url = 'http://172.16.10.xx:8080/rkllm_chat'
```

<!-- PDF p.62; extraction unit 309 -->

2) Define the form of API access, with options for non-streaming transmission and streaming transmission, defaulting to non-streaming transmission.

<!-- PDF p.63; extraction unit 310 -->

```text
main_demo1(is_streaming=True)
```

<!-- PDF p.63; extraction unit 311 -->

3) Define the session object, using requests.Session() to configure the communication process between the API access interface and the server. Users can customize modifications according to their actual development needs.

<!-- PDF p.63; extraction unit 312 -->

```text
session = requests.Session()
session.keep_alive = False  # Close the connection pool
adapter = requests.adapters.HTTPAdapter(max_retries=5)
session.mount('https://', adapter)
session.mount('http://', adapter)
```

<!-- PDF p.63; extraction unit 313 -->

4) Define the structure used to wrap the data sent during API calls. User access to RKLLM-Server- Flask will be encapsulated within this structure.

<!-- PDF p.63; extraction unit 314 -->

```text
# Prepare the data to be sent
# model: the model defined by the user when setting up RKLLM-Server, which has no effect here
# messages: the questions input by the user; supports adding multiple questions to messages
# stream: whether to enable streaming dialogue, same as the OpenAI interface
# enable_thinking: whether to enable deep thinking
# tools: user's description of custom functions
data = {
   "model": 'your_model_deploy_with_RKLLM_Server',
   "messages": [{"role": "user", "content": user_message}],
   "stream": is_streaming,
   "enable_thinking": False,
   "tools": None
}
```

<!-- PDF p.63; extraction unit 315 -->

5) Send a request to the RKLLM-Server-Flask server and retrieve the returned data.

<!-- PDF p.63; extraction unit 316 -->

```text
responses = session.post(server_url, json=data, headers=headers,
stream=is_streaming, verify=False)
```

<!-- PDF p.63; extraction unit 317 -->

6) Define the parsing method for the returned data structure.

<!-- PDF p.64; extraction unit 318 -->

```text
# Parse the response
# Non-streaming transmission
if not is_streaming:
       if responses.status_code == 200:
       print("Q:", data["messages"][-1]["content"])
       print("A:", json.loads(responses.text)["choices"][-1]["message"]["content"])
   else:
       print("Error:", responses.text)

# Streaming transmission
else:
   if responses.status_code == 200:
       print("Q:", data["messages"][-1]["content"])
       print("A:", end="")
       for line in responses.iter_lines():
if line:
             line = json.loads(line.decode('utf-8'))
             if line["choices"][-1]["finish_reason"] != "stop":
                 print(line["choices"][-1]["delta"]["content"], end="")

                 sys.stdout.flush()
   else:
       print('Error:', responses.text)
```

<!-- PDF p.64; extraction unit 319 -->

The overall process from steps 1 to 6 represents the API access method for the RKLLM-Server-Flask server. Users can develop custom functionalities based on the example code provided above. It is important for users to verify the specific address of the RKLLM-Server-Flask, namely the IP address, port number, and the function interface that the server accepts input from. Additionally, when encountering specific requirements for send-receive structures, users can customize the required data structures on both the server and client sides to ensure the implementation of custom functionalities.

<!-- PDF p.64; extraction unit 320 -->

###### 3.4.1.3.2 Example 2 - single-turn conversation with Function Calling

<!-- PDF p.64; extraction unit 321 -->

LLMs do not have knowledge of information that was not included in their training data, including events that occurred after the training was completed. Moreover, they learn through probabilistic methods, which means they may not be precise enough for tasks governed by fixed rule sets, such as mathematical calculations. To address this limitation, Function Calling allows the model to automatically invoke predefined functions based on user requests, in order to retrieve more accurate and real-time information. In this section, we illustrate the Function Calling feature using a weather query task as an example. Scenario: Suppose a user wants to ask the LLM for the current temperature and tomorrow’s temperature in San Francisco. Normally, the model would be unable to answer such real-time questions. However, the

<!-- PDF p.65; extraction unit 322 -->

user has two functions: one that retrieves the current temperature of a city, and another that retrieves the temperature for a specific date. The goal is for the model to utilize these two functions to generate an accurate answer.

1） Define the network address of RKLLM-Server-Flask. Users need to set the target address based on the specific IP of the Linux development board, the port number set by the Flask framework, and the function name for access.

<!-- PDF p.65; extraction unit 323 -->

```text
server_url = 'http://172.16.10.166:8080/rkllm_chat'
```

<!-- PDF p.65; extraction unit 324 -->



2） Define the form of API access, with options for non-streaming transmission and streaming transmission, defaulting to non-streaming transmission.

<!-- PDF p.65; extraction unit 325 -->

```text
main_demo2(is_streaming=True)
```

<!-- PDF p.65; extraction unit 326 -->



3） Define the session object, using requests.Session() to configure the communication process between the API access interface and the server. Users can customize modifications according to their actual development needs.

<!-- PDF p.65; extraction unit 327 -->

```text
session = requests.Session()
session.keep_alive = False
adapter = requests.adapters.HTTPAdapter(max_retries=5)
session.mount('https://', adapter)
session.mount('http://', adapter)
```

<!-- PDF p.65; extraction unit 328 -->



4） Define the functions required for the LLM to call:The get_current_temperature function returns the current temperature of a specified city, and the get_temperature_date function returns the temperature of a specified city on a specified date.

<!-- PDF p.66; extraction unit 329 -->

```text
def get_current_temperature(location: str, unit: str = "celsius"):
       """
       Get current temperature at a location.

       Args:
          location: The location to get the temperature for, in the
format "City, State, Country".
          unit: The unit to return the temperature in. Defaults to
"celsius". (choices: ["celsius", "fahrenheit"])

       Returns:
          the temperature, the location, and the unit in a dict
       """
       return {
          "temperature": 26.1,
          "location": location,
          "unit": unit,
       }

def get_temperature_date(location: str, date: str, unit: str =
"celsius"):
       """
       Get temperature at a location and date.

       Args:
          location: The location to get the temperature for, in the
format "City, State, Country".
          date: The date to get the temperature for, in the format
"Year-Month-Day".
          unit: The unit to return the temperature in. Defaults to
"celsius". (choices: ["celsius", "fahrenheit"])

       Returns:
          the temperature, the location, the date and the unit in a
dict
       """
       return {
          "temperature": 25.9,
          "location": location,
          "date": date,
          "unit": unit}
```

<!-- PDF p.66; extraction unit 330 -->



5） Define the description of the custom function In this example, TOOLS contains descriptions of two functions. Each function description contains a JSON object with two fields: type: string, used to specify the tool type, currently only "function" is valid function: object, detailed description of how to use the function. For each function, it is a JSON object with three fields: name: string indicates the function name; description: string describes the function purpose; parameters: JSON Schema (https://json-schema.org/learn/getting-started-step-by-step), used to

<!-- PDF p.67; extraction unit 331 -->

specify the parameters accepted by the function. See the link to learn how to construct a JSON Schema. Notable fields include type, required, and enum.

<!-- PDF p.68; extraction unit 332 -->

```text
TOOLS = [
       {
          "type": "function",
          "function": {
             "name": "get_current_temperature",
             "description": "Get current temperature at a location.",
             "parameters": {
                 "type": "object",
                 "properties": {
                    "location": {
                       "type": "string",
                       "description": 'The location to get the temperature for, in the format "City, State, Country".',
                    },
                    "unit": {
                       "type": "string",
                       "enum": ["celsius", "fahrenheit"],
                       "description": 'The unit to return the temperature in. Defaults to "celsius".',
                    },
                 },
                 "required": ["location"],
             },
          },
       },
       {
          "type": "function",
          "function": {
             "name": "get_temperature_date",
             "description": "Get temperature at a location and date.",
             "parameters": {
                 "type": "object",
                 "properties": {
                    "location": {
                       "type": "string",
                       "description": 'The location to get the temperature for, in the format "City, State, Country".',
                    },
                    "date": {
                       "type": "string",
                       "description": 'The date to get the temperature for, in the format "Year-Month-Day".',
                    },
                    "unit": {
                       "type": "string",
                       "enum": ["celsius", "fahrenheit"],
                       "description": 'The unit to return the temperature in. Defaults to "celsius".',
                    },
                 },
                 "required": ["location", "date"],
             },
          },
       },
   ]
```

<!-- PDF p.68; extraction unit 333 -->



6） Define the structure used to package the sent data during the API call process. The user's access

<!-- PDF p.69; extraction unit 334 -->

to RKLLM-Server-Flask will be included in this structure, starting the first call to LLM.

<!-- PDF p.69; extraction unit 335 -->

```text
# Prepare the data to be sent
# model: The model defined by the user when setting up RKLLM-Server, which has no effect here
# messages: Questions entered by the user; this example only supports one question, i.e., a single round of dialogue
# stream: Whether to enable streaming dialogue
# enable_thinking: Whether to enable deep thinking
# tools: User description of custom functions

messages = [
   {"role": "system", "content": "You are Qwen, created by Alibaba Cloud. You are a helpful assistant.\n\nCurrent Date: 2024-09-30"},
   {"role": "user",  "content": "What's the temperature in San Francisco now? How about tomorrow?"},
   ]

data = {
       "model": 'your_model_deploy_with_RKLLM_Server',
       "messages": messages,
       "stream": False,
       "enable_thinking": False,
       "tools": TOOLS
   }

# Send a POST request
responses = session.post(server_url, json=data, headers=headers,
stream=False, verify=False)
```

<!-- PDF p.69; extraction unit 336 -->

The first call to LLM returns the following: that is, it returns the input parameters of the user-defined function.

<!-- PDF p.69; extraction unit 337 -->

```text
server_answer = json.loads(responses.text)["choices"][-1]["message"]["content"]
matches = re.findall(r"<tool_call>\s*(\{.*?\})\s*</tool_call>",
''.join(server_answer), re.DOTALL)
print("server_answer:", server_answer, '\n')

'''
The following is the output of print("server_answer:", server_answer,
'\n')

server_answer: <tool_call>
{"name": "get_current_temperature", "arguments": {"location": "San Francisco"}}
</tool_call>
<tool_call>
{"name": "get_temperature_date", "arguments": {"location": "San Francisco", "date": "2024-10-01"}}
</tool_call>
'''
```

<!-- PDF p.69; extraction unit 338 -->



7） Next, parse the LLM return, construct the input for the second call to LLM, and start the second call to LLM.

<!-- PDF p.70; extraction unit 339 -->

```text
result = [json.loads(match) for match in matches]
for function_call in result:
   messages.append({'role': 'assistant', 'content': '',
'function_call':function_call})

tool_calls = [{'function': result[i]} for i in range(len(result))]
function_call = []
for tool_call in tool_calls:
   if fn_call := tool_call.get("function"):
       fn_name: str = fn_call["name"]
       fn_args: dict = fn_call["arguments"]
       fn_res: str = json.dumps(get_function_by_name(fn_name)(**fn_args))
       messages.append({'role': 'tool', 'name': fn_name,
'content':fn_res})

print("messages:", messages, '\n')

'''
The following is the output of print("messages:", messages, '\n')

messages: [{'role': 'system', 'content': 'You are Qwen, created by
Alibaba Cloud. You are a helpful assistant.\n\nCurrent Date: 2024-09-30'}, {'role': 'user', 'content': "What's the temperature in San Francisco now? How about tomorrow?"}, {'role': 'assistant', 'content':
'', 'function_call': {'name': 'get_current_temperature', 'arguments':
{'location': 'San Francisco'}}}, {'role': 'assistant', 'content': '',
'function_call': {'name': 'get_temperature_date', 'arguments':
{'location': 'San Francisco', 'date': '2024-10-01'}}}, {'role': 'tool',
'name': 'get_current_temperature', 'content': '{"temperature": 26.1,
"location": "San Francisco", "unit": "celsius"}'}, {'role': 'tool',
'name': 'get_temperature_date', 'content': '{"temperature": 25.9,
"location": "San Francisco", "date": "2024-10-01", "unit":
"celsius"}'}]
'''

data = {
"model": 'your_model_deploy_with_RKLLM_Server',
"messages": messages,
"stream": is_streaming,
"enable_thinking": False,
"tools": TOOLS
}

# Send a POST request
responses = session.post(server_url, json=data, headers=headers,
stream=is_streaming, verify=False)
```

<!-- PDF p.70; extraction unit 340 -->



8） Parse the returned data structure from the second call to LLM to get the model's final answer about San Francisco's current temperature and tomorrow's temperature.

<!-- PDF p.71; extraction unit 341 -->

```text
if not is_streaming:
       # Parse the response
       if responses.status_code == 200:
          print("A:", json.loads(responses.text)["choices"][-1]["message"]["content"])
       else:
          print("Error:", responses.text)
else:
   if responses.status_code == 200:
       print("A:", end="")
       for line in responses.iter_lines():
       if line:
          line = json.loads(line.decode('utf-8'))
          if line["choices"][-1]["finish_reason"] != "stop":
             print(line["choices"][-1]["delta"]["content"], end="")
             sys.stdout.flush()
   else:
       print('Error:', responses.text)

'''
The following is the output of print()

A:The current temperature in San Francisco is 26.1°C. Tomorrow, the temperature is expected to be 25.9°C.
'''
```

<!-- PDF p.71; extraction unit 342 -->

The overall process described in steps 1–8 serves as an example of how to use Function Calling with the RKLLM-Server-Flask backend. Users can develop custom functionalities based on the sample code provided above. It is important to note that users must ensure the selected LLM supports the Function Calling feature. Additionally, for models with relatively limited capabilities—such as Qwen3-0.6B— Function Calling may fail because the model cannot accurately return the input parameters for user- defined functions after the first call.

<!-- PDF p.71; extraction unit 343 -->

#### 3.4.2 Deployment Example of RKLLM-Server-Gradio

<!-- PDF p.71; extraction unit 344 -->

Gradio is a simple and easy-to-use Python library used for quickly building interactive interfaces for machine learning models. In this section, we will specifically introduce how to quickly deploy RKLLM- Server-Gradio on a Linux device using Gradio, and directly access the server within the local network to perform RKLLM model inference. The following Figure shows an example of the web interface after successfully deploying RKLLM-Server-Gradio:

<!-- PDF p.72; extraction unit 345 -->

![RKLLM original technical figure — PDF p.72](/docs/rockchip-rkllm-sdk/assets/en-p072-figure-02.png)

<!-- PDF p.72; extraction unit 346 -->

Figure 3-4 External access page for RKLLM-Server deployment example In the current rkllm_server_demo directory, the specific implementation code for the RKLLM- Server-Gradio deployment example shown in Figure 3-3 is included. Users can also directly use the one- click deployment script build_rkllm_server_gradio.sh to quickly set up RKLLM-Server-Gradio. After successful deployment, users can choose to access the RKLLM model for inference either through the web interface or via API access.

<!-- PDF p.72; extraction unit 347 -->

##### 3.4.2.1 Server-side: Introductions for RKLLM-Server-Gradio Example

<!-- PDF p.72; extraction unit 348 -->

The one-click deployment script build_rkllm_server_gradio.sh is designed to facilitate the quick setup of RKLLM-Server-Gradio on a Linux development board. Similar to the setup process for RKLLM-Server-Flask, users should pay attention to the following points before using the one-click deployment script:

<!-- PDF p.72; extraction unit 349 -->

1) Ensure that the development board is connected to the network via an Ethernet cable. Use the ifconfig command in the adb shell to query the specific IP address of the development board. RKLLM- Server-Gradio will be set up as a server within the local network using this IP address to accept client access.

<!-- PDF p.72; extraction unit 350 -->

2) Users need to complete the smooth conversion of the RKLLM model and have pushed the RKLLM model to the Linux board before executing the one-click deployment script.

<!-- PDF p.73; extraction unit 351 -->

The usage of the one-click deployment script build_rkllm_server_gradio.sh is similar to that of build_rkllm_server_flask.sh:

<!-- PDF p.73; extraction unit 352 -->

```text
./build_rkllm_server_gradio.sh
   --workshop [RKLLM-Server Working Path]
   --model_path [Absolute Path of Converted RKLLM Model on Board] --platform [Target Platform: RK3588/RK3576/RK3562/RV1126B]
   [--lora_model_path [LoRA Model Path]]
   [--prompt_cache_path [Prompt Cache File Path]]
```

<!-- PDF p.73; extraction unit 353 -->

Similarly, the workshop parameter specifies the working directory for RKLLM-Server-Gradio on the device; the model_path parameter indicates the absolute path of the RKLLM model on the device, which was converted using RKLLM-Toolkit, and RKLLM-Server-Gradio will read the model from this path during operation; the platform parameter specifies the platform type being used, such as RK3588, RK3576, RK3562 or RV1126B; lora_model_path and prompt_cache_path are optional parameters, allowing the user to specify the file paths for loading a LoRA model or utilizing the Prompt feature if needed. Users can directly call the build_rkllm_server_gradio.sh script on the PC side (not on the development board) using the following command to quickly deploy the RKLLM-Server-Gradio example:

<!-- PDF p.73; extraction unit 354 -->

```text
./build_rkllm_server_gradio.sh
   --workshop /user/data
   --model_path /user/data/model.rkllm
   --platform rk3588
```

<!-- PDF p.73; extraction unit 355 -->

After executing the above command, the one-click deployment script will perform the following steps:

<!-- PDF p.73; extraction unit 356 -->

1) Check the Linux environment on the board.

<!-- PDF p.73; extraction unit 357 -->

2) Automatically install the Gradio library if not already installed.

<!-- PDF p.73; extraction unit 358 -->

3) Push the necessary files under rkllm_server_demo/rkllm_server to the board.

<!-- PDF p.73; extraction unit 359 -->

4) Index the RKLLM model in the preset working directory for RKLLM-Server-Gradio. Once you see the message "RKLLM Model has been initialized successfully!" in the terminal, it indicates that the RKLLM-Server-Gradio example has been successfully launched.

<!-- PDF p.74; extraction unit 360 -->

![RKLLM original technical figure — PDF p.74](/docs/rockchip-rkllm-sdk/assets/en-p074-figure-02.png)

Copyable transcription of the original log (not an ArmSoM measurement; blurred account not reconstructed):

```text
warnings.warn(
=========init....===========
rkllm-runtime version: 1.0.2b9, rknpu driver version: 0.9.7, platform: RK3588
load prompt cache from '/data/cw/prompt_cache.bin'
loaded a prompt cache with prompt size of 27 tokens
RKLLM Model has been initialized successfully!
===========================
Running on local URL:  http://0.0.0.0:8080
To create a public link, set `share=True` in `launch()`.
```

<!-- PDF p.74; extraction unit 361 -->

Figure 3-5 Successful deployment of RKLLM-Server-Gradio in terminal By referencing the specific code in build_rkllm_server_gradio.sh, users can understand the detailed deployment process of the RKLLM-Server-Gradio example. This can help users deploy custom servers more flexibly. It is important to emphasize that in step 3 of build_rkllm_server_gradio.sh, the one-click deployment script automatically synchronizes the current version of RKLLM Runtime to rkllm_server/lib/librkllmrt.so. This ensures that gradio_server.py indexes librkllmrt.so when running, and users need to pay attention to the invocation of librkllmrt.so when customizing the server.

<!-- PDF p.74; extraction unit 362 -->

##### 3.4.2.2 Server-side: Introductions for RKLLM-Server-Gradio Example

<!-- PDF p.74; extraction unit 363 -->

The deployment implementation of RKLLM-Server-Gradio is similar to RKLLM-Server-Flask. It also uses the ctypes library to directly call the RKLLM Runtime library to perform RKLLM model inference. The specific deployment implementation process can be referenced in Figure below:

<!-- PDF p.74; extraction unit 364 -->

![RKLLM original technical figure — PDF p.74](/docs/rockchip-rkllm-sdk/assets/en-p074-figure-03.png)

<!-- PDF p.74; extraction unit 365 -->

Figure 3-6 Overview of the RKLLM-Server-Flask Deployment Implementation Process The difference is that RKLLM-Server-Gradio chooses to use the gradio library to implement the server setup and complete communication with the client, providing a simple web-based service. This requires specific handling of the Gradio interface in RKLLM-Server-Gradio as follows:

<!-- PDF p.75; extraction unit 366 -->



1）The Gradio function library provides complete communication for input and output data, so there is no need to define complex input-output implementations for the server via Flask.

2）Gradio is a deployment framework based on different control elements. During usage, it is necessary to call various Gradio components to complete the interface design and specify the trigger conditions, function call logic, and the data flow logic between different components for each element. Users can refer to the main code in rkllm_server/gradio_server.py to understand the specific implementation of RKLLM-Server-Gradio, and by modifying the initialization definitions for the RKLLM model within it, they can implement different custom models. Additionally, users can refer to the deployment example of the RKLLM-Server-Gradio to deploy their own custom server.

<!-- PDF p.75; extraction unit 367 -->

##### 3.4.2.3 Client: RKLLM-Server-Gradio Usage Instructions

<!-- PDF p.75; extraction unit 368 -->

After successfully deploying the RKLLM-Server-Gradio on a Linux development board, users can access it via two methods: "Interface Access" and "API Access".

<!-- PDF p.75; extraction unit 369 -->

1) Interface Access: Upon successfully starting the RKLLM-Server-Gradio with the one-click deployment script, users can directly access the RKLLM model for quick interaction by opening any web browser on a computer within the current local area network and navigating to "board_IP:8080" (e.g., "172.16.10.178:8080" as shown in Figure 3-2). Gradio automatically integrates Markdown, HTML, and other syntaxes, adapting to the format of the RKLLM model's output results, such as code snippets and Markdown text. Additionally, during the setup of RKLLM-Server, an access queue is initiated. When multiple users interact with the RKLLM-Server simultaneously, the inputs are processed and returned in the order they were submitted. It's important to note that when a user's interaction with the RKLLM- Server is in the inference state (i.e., the dialogue box is highlighted), the server will not accept the user's next input until the current inference is completed.

<!-- PDF p.75; extraction unit 370 -->

2) API Access: In the rkllm_server_demo directory, chat_api_gradio.py is provided. After installing gradio_client on the PC (using the command: pip install gradio_client), users can interact with the RKLLM-Server solely through the API interface without relying on the graphical interface, as shown in

<!-- PDF p.76; extraction unit 371 -->

following Figure. Before using chat_api_gradio.py, it's important to modify the IP address in the code to match the current IP address of the development board, as shown in the following code.

<!-- PDF p.76; extraction unit 372 -->

```text
from gradio_client import Client
client = Client("http://172.16.10.xx:8080/")
```

<!-- PDF p.76; extraction unit 373 -->

![RKLLM original technical figure — PDF p.76](/docs/rockchip-rkllm-sdk/assets/en-p076-figure-02.png)

Copyable transcription of the original log (not an ArmSoM measurement; blurred account not reconstructed):

```text
(base) [原图已模糊 / blurred in original]/rkllm/rkllm-runtime/examples/rkllm_server_demo$ python chat_api.py
===========================
在终端中输入您的问题，即可与 RKLLM 模型进行对话....
===========================
请输入您的问题: 请给出福州的介绍
Loaded as API: http://172.16.10.102:8080/ ✓
Q: 请给出福州的介绍
A: 福州，福建省省会，位于中国东南沿海的大陆架上，东临太平洋，西隔台湾海峡与台湾岛相望；北濒东海，南界巴士海峡与菲律宾群岛相对。全市总面积13247平方千米，其中市区面积6580平方千米。福州市气候温暖湿润，四季分明，是著名的“鱼米之乡”。福州是中国东南沿海重要的港口城市和风景名胜区，拥有众多的历史文化遗产和自然景观。
请输入您的问题:
```

<!-- PDF p.76; extraction unit 374 -->

Figure 3-7 Access the RKLLM-Server-Gradio via API calls in terminal Users can choose between the two client invocation methods based on their specific needs. For instance, when providing interactive services within a local area network, it's recommended to use the interface access method. On the other hand, if customizing access behaviors to RKLLM-Server-Gradio is required, it's advisable to use API Access for further development. Lastly, it's important to note that in the implementation of RKLLM-Server-Gradio, there isn't a definition of data structures for sending and receiving data similar to OpenAI-API. Therefore, this deployment implementation is not compatible with the OpenAI-API interface. When conducting further development, users should refer to the specific function implementation in chat_api_gradio.py. If compatibility with the OpenAI-API interface is required, please refer to the implementation of RKLLM- Server-Flask.

<!-- PDF p.77; extraction unit 375 -->

## 4 Reference

<!-- PDF p.77; extraction unit 376 -->

RKLLM: https://github.com/airockchip/rknn-llm RKNN: https://github.com/airockchip/rknn-toolkit2

## Original-source link index

[developer.arm.com: 10-2-2020-11](https://developer.arm.com/downloads/-/gnu-a/10-2-2020-11)

[github.com: AutoGPTQ](https://github.com/AutoGPTQ/AutoGPTQ)

[github.com: rknn-llm](https://github.com/airockchip/rknn-llm)

[github.com: rknpu-driver](https://github.com/airockchip/rknn-llm/tree/main/rknpu-driver)

[github.com: rknn-toolkit2](https://github.com/airockchip/rknn-toolkit2)

[github.com: Unsupported-Downloads](https://github.com/android/ndk/wiki/Unsupported-Downloads)

[github.com: develop-5.10](https://github.com/rockchip-linux/kernel/tree/develop-5.10)

{% endraw %}
