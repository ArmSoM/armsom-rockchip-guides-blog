---
title: "RKNN2 SDK V2.5.0 · Multi-batch inference"
description: "RKNN2 SDK V2.5.0 · Multi-batch inference · Complete development guide series"
excerpt: "Multi-batch inference"
translation_key: "rknn-v250-sdk-guide-multi-batch"
slug: "rknn-v250-sdk-guide-multi-batch"
lang: "en"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "V2.5.0", "NPU"]
---

Platform reference: this article follows the Rockchip RKNN2 SDK V2.5.0 Development Guide, including only the SoCs, Linux/Android Runtime and Toolkit combinations stated by the source. Features apply under the chip, SDK, driver and kernel conditions in each section, not automatically to every ArmSoM board. Check the actual ArmSoM BSP, NPU driver, Runtime and model versions before deployment. No ArmSoM hardware validation was performed; logs, performance figures and examples belong to the source.

Sources and proofreading: Chinese follows Chinese V2.5.0 (182 pages); English, Russian and German follow English V2.5.0 (208 pages). Source-specific technical information is retained; older-version content is not presented as new-version fact. Chinese figures come from the Chinese PDF; EN/RU/DE figures come from the English PDF, including separately extracted vector flowcharts. Original section and equation numbers remain. Some source cross-references still use old chapter numbers; dynamic-shape capacity examples contain “1224+140=264”, TP_NORM support statements conflict, and names such as init()/rknn.val_perf() differ from later API descriptions. These source issues are retained and require checking against actual V2.5.0 SDK headers/API references before execution. Code and parameters remain; PDF wrapping and table continuations are repaired.

[Rockchip RKNN2 SDK V2.5.0](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

**RKNN2 SDK V2.5.0 · 14/22**

[1. Software stack and core concepts](/articles/rknn-v250-sdk-guide-overview/)

[2. Environment, versions and board connection](/articles/rknn-v250-sdk-guide-environment/)

[3. Development workflow and interface selection](/articles/rknn-v250-sdk-guide-workflow/)

[4. Model conversion and ONNX editing](/articles/rknn-v250-sdk-guide-conversion/)

[5. Quantization, hybrid quantization and QAT](/articles/rknn-v250-sdk-guide-quantization/)

[6. Inference, accuracy, performance and memory evaluation](/articles/rknn-v250-sdk-guide-evaluation/)

[7. Runtime lifecycle, layouts and memory](/articles/rknn-v250-sdk-guide-runtime-basics/)

[8. Zero-copy interfaces and I/O constraints](/articles/rknn-v250-sdk-guide-zero-copy/)

[9. C API deployment and code generation](/articles/rknn-v250-sdk-guide-c-deployment/)

[10. Toolkit Lite2 Python deployment](/articles/rknn-v250-sdk-guide-lite-deployment/)

[11. Matmul API and matrix layouts](/articles/rknn-v250-sdk-guide-matmul/)

[12. NPU multicore configuration and performance](/articles/rknn-v250-sdk-guide-multicore/)

[13. Dynamic-shape models and deployment](/articles/rknn-v250-sdk-guide-dynamic-shape/)

**Multi-batch inference**

[15. RK3588/RK3576 NPU SRAM](/articles/rknn-v250-sdk-guide-sram/)

[16. Cache coherency and sparse inference](/articles/rknn-v250-sdk-guide-cache-sparsity/)

[17. Custom operators: Python and C API](/articles/rknn-v250-sdk-guide-custom-operators/)

[18. Encrypted model deployment](/articles/rknn-v250-sdk-guide-encryption/)

[19. Accuracy troubleshooting](/articles/rknn-v250-sdk-guide-accuracy/)

[20. Performance analysis and network optimization](/articles/rknn-v250-sdk-guide-performance/)

[21. Memory analysis, sharing and reuse](/articles/rknn-v250-sdk-guide-memory/)

[22. FAQ, error handling and references](/articles/rknn-v250-sdk-guide-faq/)

{% raw %}

### 4.1.4 Multi-Batch Usage

#### 4.1.4.1 MULTI-BATCH PRINCIPLE

There are 3 cores inside the RK3588 NPU and 2 cores inside the RK3576 NPU. In order to utilize the multi-core performance more efficiently, a multi-batch inference function is provided. When multi-batch inference is enabled, rknn_dup_context is called internally to copy the context ( rknn_dup_context only copies the Internal of the context , and the Weight is reused). When rknn_batch_size=2 , one copy is made; when rknn_batch_size &gt;=3 , two copies are made (at most 3 cores work at the same time, and only two copies are made to avoid memory waste). Each context core_mask will be set to 0 to allow automatic scheduling inside the multiple cores. When rknn_run() is executed, a thread pool is created internally, and 3 threads are called at the same time to perform inference on the 3 contexts .

![Figure 4-7 Multi-batch internal principle diagram ](/assets/images/rknn-v250/sdk-guide/en/p121-figure-01.png)

Figure 4-7 Multi-batch internal principle diagram

#### 4.1.4.2 MULTI-BATCH USAGE

The usage of multi-batch is as follows:

1. Enable multi-batch settings on Python:

```text
ret = rknn.build(do_quantization=True, dataset='./dataset.txt', rknn_batch_size=3)
```

In order to achieve optimal performance, it is recommended that rknn_batch_size be a multiple of 3 for RK3588, and a multiple of 2 for RK3576.

2. It is recommended to use zero-copy interface

#### 4.1.4.3 MULTI-BATCH INPUT AND OUTPUT SETTINGS

When the multi-batch function is enabled, the queried input and output sizes are rknn_batch_size times those when it is not enabled. Each internal context calculates its own input offset, takes the input data for inference according to this input offset, then calculates its own output offset, and writes to its own output according to this output offset. Taking the second batch as an example, the input offset is the queried input_size divided by rknn_batch_size , and the output offset is the queried output_size divided by rknn_batch_size .

![Figure 4-8 Multi-batch internal input and output address offset diagram ](/assets/images/rknn-v250/sdk-guide/en/p122-figure-01.png)

Figure 4-8 Multi-batch internal input and output address offset diagram

{% endraw %}
