---
title: "RKNN2 SDK V2.5.0 · Zero-copy interfaces and I/O constraints"
description: "RKNN2 SDK V2.5.0 · Zero-copy interfaces and I/O constraints · Complete development guide series"
excerpt: "Zero-copy interfaces and I/O constraints"
translation_key: "rknn-v250-sdk-guide-zero-copy"
slug: "rknn-v250-sdk-guide-zero-copy"
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

**RKNN2 SDK V2.5.0 · 8/22**

[1. Software stack and core concepts](/articles/rknn-v250-sdk-guide-overview/)

[2. Environment, versions and board connection](/articles/rknn-v250-sdk-guide-environment/)

[3. Development workflow and interface selection](/articles/rknn-v250-sdk-guide-workflow/)

[4. Model conversion and ONNX editing](/articles/rknn-v250-sdk-guide-conversion/)

[5. Quantization, hybrid quantization and QAT](/articles/rknn-v250-sdk-guide-quantization/)

[6. Inference, accuracy, performance and memory evaluation](/articles/rknn-v250-sdk-guide-evaluation/)

[7. Runtime lifecycle, layouts and memory](/articles/rknn-v250-sdk-guide-runtime-basics/)

**Zero-copy interfaces and I/O constraints**

[9. C API deployment and code generation](/articles/rknn-v250-sdk-guide-c-deployment/)

[10. Toolkit Lite2 Python deployment](/articles/rknn-v250-sdk-guide-lite-deployment/)

[11. Matmul API and matrix layouts](/articles/rknn-v250-sdk-guide-matmul/)

[12. NPU multicore configuration and performance](/articles/rknn-v250-sdk-guide-multicore/)

[13. Dynamic-shape models and deployment](/articles/rknn-v250-sdk-guide-dynamic-shape/)

[14. Multi-batch inference](/articles/rknn-v250-sdk-guide-multi-batch/)

[15. RK3588/RK3576 NPU SRAM](/articles/rknn-v250-sdk-guide-sram/)

[16. Cache coherency and sparse inference](/articles/rknn-v250-sdk-guide-cache-sparsity/)

[17. Custom operators: Python and C API](/articles/rknn-v250-sdk-guide-custom-operators/)

[18. Encrypted model deployment](/articles/rknn-v250-sdk-guide-encryption/)

[19. Accuracy troubleshooting](/articles/rknn-v250-sdk-guide-accuracy/)

[20. Performance analysis and network optimization](/articles/rknn-v250-sdk-guide-performance/)

[21. Memory analysis, sharing and reuse](/articles/rknn-v250-sdk-guide-memory/)

[22. FAQ, error handling and references](/articles/rknn-v250-sdk-guide-faq/)

{% raw %}

### 3.1.6 RKNN Runtime Zero-Copy Interface

#### 3.1.6.1 ZERO-COPY INTRODUCTION

Currently, there are two groups of APIs available on RK3562 / RK3566 / RK3568 / RK3576 / RK3588 / RV1126B, namely the general API interface and the zero-copy process API interface, and the RV1103 series / RV1106 series support the zero-copy process API interface. For zero-copy example code, refer to the examples/rknn_zero_copy directory under the rknpu2 project. For detailed information and the code repository of rknpu2, please visit the link: https://github.com/airockchip/rknn-toolkit2/tree/master/rknpu2.

When performing inference on an RKNN model, the raw data goes through three major processes: input processing, NPU running the model, and output processing. Currently, depending on the model input format and quantization method, there are two processing flows inside the interface: the general API and the zero-copy API, as shown in Figure 3-5 and Figure 3-6. The main difference between the two groups of APIs is that every time the frame data is updated, the general interface needs to copy the data allocated by the external module into the input memory of the NPU runtime, while the zero-copy process interface directly uses pre- allocated memory (including memory created by the NPU runtime or created by other external frameworks, such as the DRM framework), which reduces the overhead of memory copying, delivers better performance, and uses less bandwidth. When the user input data has only a virtual address, only the general API interface can be used; when the user input data has a physical address or fd, both groups of interfaces can be used. The general API and the zero- copy API cannot be called in a mixed manner.

![Source technical figure ](/assets/images/rknn-v250/sdk-guide/en/p071-vector-731.png)

Figure 3-5 Data processing flow of the general API

![Source technical figure ](/assets/images/rknn-v250/sdk-guide/en/p071-vector-734.png)

Figure 3-6 Data processing flow of the zero-copy API

1. General API

The flow of the general API is shown in Figure 3-5. The normalization, quantization, data layout conversion, and dequantization of the data run on the CPU (when the zero-copy input requirements are met, normalization and quantization run on the NPU, but the input data still needs to be copied by the CPU to the model's input buffer), while the inference of the model itself runs on the NPU.

1. Zero-copy API

The flow of the zero-copy API is shown in Figure 3-6. It optimizes the data processing flow of the general API: with the zero-copy API, normalization, quantization, and model inference all run on the NPU, while the output data layout conversion and the dequantization process run on the CPU or the NPU. The zero-copy API processes the input data flow more efficiently than the general API.

The usage conditions for the zero-copy scenario are shown in the following table:

Table 3-2 Zero-copy input requirements

| Input dimensions | RV1103B / RV1106B / RK3566 / RK3568 | RK3562 / RK3576 / RK3588 / RV1103 / RV1106 / RV1126B |
| --- | --- | --- |
| 4 dimensions, number of channels is 1, 3, 4 | Width 8-byte aligned | Width 16-byte aligned |
| Not 4 dimensions | Total size 8-byte aligned | Total size 16-byte aligned |

#### 3.1.6.2 C API ZERO-COPY PROCESS

The zero-copy API interface uses the rknn_tensor_memory structure, which needs to be created and set before inference, and the memory information in the structure is read after inference. Depending on whether the user needs to allocate the model's module memory (input/output/weights/intermediate results) themselves, and on the memory representation (file descriptor/physical address, etc.), there are the following three typical zero-copy calling processes, as shown in Figure 3-7 to Figure 3-9. The parts in red indicate the interfaces and data structures specially added for zero-copy, and the italics indicate the data structures passed between interface calls.

Input/output memory allocated by the runtime

![Figure 3-7 Zero-copy API interface calling process (input/output allocated internally) ](/assets/images/rknn-v250/sdk-guide/en/p073-figure-01.png)

Figure 3-7 Zero-copy API interface calling process (input/output allocated internally)

As shown in Figure 3-7, when the input/output memory is allocated by the runtime, the rknn_create_mem() interface is called to create the rknn_tensor_memory structure, and rknn_set_io_mem() sets the input and output rknn_tensor_memory structures.

The input/output memory information structure created by the rknn_create_mem() interface contains the file descriptor member and the physical address. The RGA interface uses the memory information allocated by the NPU: preprocess_rga() represents the RGA interface, stream_fd represents the memory data of the RGA interface input source, and postprocess_cpu() represents the CPU implementation of post-processing.

Input/output memory allocated externally

![Source technical figure ](/assets/images/rknn-v250/sdk-guide/en/p074-vector-754.png)

Figure 3-8 Zero-copy API interface calling process (input/output allocated externally)

As shown in Figure 3-8, when the input/output memory is allocated externally, the rknn_create_mem_from_fd() / rknn_create_mem_from_phys() interfaces are called to create the rknn_tensor_memory structure, and rknn_set_io_mem() sets the input and output rknn_tensor_memory structures. flush_cache indicates that the user needs to call the interface associated with the allocated memory type to flush the output cache.

Input/output/weights/intermediate result memory allocated externally

![Source technical figure ](/assets/images/rknn-v250/sdk-guide/en/p075-vector-771.png)

Figure 3-9 Zero-copy API interface calling process (input/output/weights/intermediate results allocated externally)

As shown in Figure 3-9, when the input/output/weights/intermediate result memory is allocated externally, the rknn_create_mem_from_fd() / rknn_create_mem_from_phys() interfaces are called to create the rknn_tensor_memory structure, rknn_set_io_mem() sets the input and output rknn_tensor_memory structures, and rknn_set_weight_mem() / rknn_set_internal_mem() set the weights/intermediate result rknn_tensor_memory structures.

#### 3.1.6.3 C API ZERO-COPY USAGE

Taking Figure 3-7, the zero-copy API interface calling process (input/output allocated internally), as an example, the usage is as follows:

rknn_query()

Input:

Use RKNN_QUERY_NATIVE_INPUT_ATTR to query the related attributes (note, not RKNN_QUERY_INPUT_ATTR). When the queried fmt (also called layout) differs, the way to pre- process the data in advance also differs. This method queries the input layout and type that are optimal for hardware efficiency.

The input cases of rknn_query() are as follows:

a. When the layout is RKNN_TENSOR_NCHW , the input is generally 4-dimensional and the data type is bool or int64. When passing data to the NPU, it also needs to be arranged in the NCHW format for the NPU.

b. When the layout is RKNN_TENSOR_NHWC , the input is generally 4-dimensional and the data type is float32/float16/int8/uint8, and the number of input channels is 1, 3, or 4. When passing data to the NPU, it also needs to be arranged in the NHWC format for the NPU. Note that when pass_through=1 , the width may need to be stride-aligned, depending on the queried w_stride value.

c. When the layout is RKNN_TENSOR_NC1HWC2 , the input is generally 4-dimensional and the data type is float16/int8, and the number of input channels is not 1, 3, or 4. When pass_through=0 , the input data is arranged in the NHWC format, and the interface internally performs the CPU conversion from NHWC to NC1HWC2 ; when pass_through=1 , the input data is arranged in the NC1HWC2 format, and the user needs to convert it externally.

d. When the layout is RKNN_TENSOR_UNDEFINED , the input is generally not 4-dimensional. When passing data to the NPU, it needs to be passed to the NPU according to the input format of the ONNX model. The NPU does not perform any mean/std processing or layout conversion.

If the input configuration required by the user is different from the rknn_tensor_attr structure obtained by the query interface, the rknn_tensor_attr structure can be modified accordingly. The currently supported modifiable input data types are shown in Table 3-3. Special attention: if the queried data type is uint8 and the user wants to pass in float32 data, the size of the rknn_tensor_attr structure must be modified to four times the original size, and the data type in it must be modified to RKNN_TENSOR_FLOAT32 . After modifying in this way, the hardware efficiency is no longer optimal, and the interface internally calls the CPU to perform the data type conversion.

Table 3-3 Input modifiable data type table

| User type / queried model type | bool | int8 | float16 | int16 | int32 | Int64 |
| --- | --- | --- | --- | --- | --- | --- |
| bool | Y |  |  |  |  |  |
| int8 |  | Y |  |  |  |  |
| uint8 |  | Y | Y |  |  |  |
| float32 |  | Y | Y |  |  |  |
| float16 |  |  | Y |  |  |  |
| int16 |  |  |  | Y |  |  |
| int32 |  |  |  |  | Y |  |
| Int64 |  |  |  |  |  | Y |

Output:

Use RKNN_QUERY_NATIVE_OUTPUT_ATTR to query the related attributes (note, not RKNN_QUERY_OUTPUT_ATTR). When the queried fmt (also called layout) differs, the required post-processing also differs. This method queries the output layout and type that are optimal for hardware efficiency.

When the output is 4-dimensional and the user needs a 4-dimensional output in the NHWC layout, RKNN_QUERY_NATIVE_NHWC_OUTPUT_ATTR can be used to query the related attributes. In this way, an output in the NHWC layout can be obtained directly.

The output cases of rknn_query() are as follows:

a. When the layout is RKNN_TENSOR_NC1HWC2 , the output is generally 4-dimensional and the data type is float16/int8. When the user needs the NCHW layout, the conversion from NC1HWC2 to NCHW needs to be performed externally.

b. When the layout is RKNN_TENSOR_UNDEFINED , the output is generally not 4-dimensional and the data type is float16/int8. The user does not need to perform layout conversion externally.

c. When the layout is RKNN_TENSOR_NCHW , the output is generally 4-dimensional and the data type is float16/int8. The user does not need to perform layout conversion externally.

d. When the layout is RKNN_TENSOR_NHWC , the output is generally 4-dimensional and the data type is float16/int8. This case generally occurs when the user calls the RKNN_QUERY_NATIVE_NHWC_OUTPUT_ATTR interface to query the layout.

If the output configuration required by the user is different from the rknn_tensor_attr structure obtained by the query interface, the rknn_tensor_attr structure can be modified accordingly. The modifiable configuration information is shown in Table 3-5 and Table 3-4. Special attention: if the queried output data type is int8 and the user wants to obtain a float32 output, the size of the rknn_tensor_attr structure must be modified to four times the original size, and the data type in it must be modified to RKNN_TENSOR_FLOAT32 . After modifying in this way, the hardware efficiency is no longer optimal, and the interface internally calls the CPU to perform the data type conversion.

Table 3-5 Output modifiable data type table

| User type / queried model type | bool | int8 | float16 | int16 | int32 | Int64 |
| --- | --- | --- | --- | --- | --- | --- |
| bool | Y |  |  |  |  |  |
| int8 |  | Y |  |  |  |  |
| uint8 |  |  |  |  |  |  |
| float32 |  | Y | Y |  |  |  |
| float16 |  |  | Y |  |  |  |
| int16 |  |  |  | Y |  |  |
| int32 |  |  |  |  | Y |  |
| Int64 |  |  |  |  |  | Y |

Table 3-4 Output modifiable layout type table

| User layout / queried model layout | NC1HWC2 | NCHW | NHWC | UNDEFINE |
| --- | --- | --- | --- | --- |
| NC1HWC2 | Y |  |  |  |
| NCHW | Y | Y |  |  |
| NHWC |  |  | Y |  |
| UNDEFINE |  |  |  | Y |

The zero-copy interface NPU output configurations supported by RK3562/RK3566/RK3568/RK3576/RK3588/RV1126B are shown in Table 3-6, and the zero-copy interface NPU output configurations supported by RV1106/RV1106B/RV1103/RV1103B are shown in Table 3-7.

Table 3-6 Output configurations supported by the RK3562/RK3566/RK3568/RK3576/RK3588/RV1126B zero-copy interface NPU

| Model type | Output data type | Output dimensions | Supported output layout |
| --- | --- | --- | --- |
| int8 model | int8/float16/float32 | 4-dimensional | NCHW/NC1HWC2/NHWC |
| int8 model | int8/float16/float32 | Non-4-dimensional | UNDEFINE |
| float16 model | float16/float32 | 4-dimensional | NCHW/NC1HWC2/NHWC |
| float16 model | float16/float32 | Non-4-dimensional | UNDEFINE |

Table 3-7 Output configurations supported by the RV1103/RV1103B/RV1106/RV1106B zero-copy interface NPU

| Model type | Output data type | Output dimensions | Supported output layout |
| --- | --- | --- | --- |
| int8 model | int8/float16 | 4-dimensional | NCHW/NC1HWC2/NHWC |
| int8 model | int8/float16 | Non-4-dimensional | UNDEFINE |

rknn_create_mem

The zero-copy API interface uses the rknn_tensor_memory structure, which needs to be created and set before inference, and the memory information in the structure is read after inference. When there is no need to modify the layout and type queried by RKNN_QUERY_NATIVE_INPUT_ATTR and RKNN_QUERY_NATIVE_OUTPUT_ATTR , simply create the memory with the default configured size_with_stride . If the corresponding layout and type have been modified, the memory must be created according to the corresponding size (for example, if the output data type is int8 and the user wants to obtain a float32 output, the size must be modified to four times the original size).

rknn_set_io_mem

rknn_set_io_mem() is used to set the rknn_tensor_mem structure containing the model input/output memory information. Similar to rknn_init() , it only needs to be called once at the very beginning, and then rknn_run() can be executed repeatedly.

{% endraw %}
