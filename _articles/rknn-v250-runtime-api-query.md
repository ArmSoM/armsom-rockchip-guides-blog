---
layout: "article"
title: "RKNN Runtime C API V2.5.0 — Model, tensor and dynamic shape queries"
date: "2026-10-29"
author: "ArmSoM"
lang: "en"
translation_key: "rknn-v250-runtime-api-query"
slug: "rknn-v250-runtime-api-query"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "runtime"]
products: []
reference_products: []
description: "RKNN Runtime C API V2.5.0 — Model, tensor and dynamic shape queries | Complete parameters, examples and platform constraints"
excerpt: "RKNN Runtime C API V2.5.0 — Model, tensor and dynamic shape queries | Complete parameters, examples and platform constraints"
permalink: "/articles/rknn-v250-runtime-api-query/"
---

## Platform scope and source

This article follows the RKNN V2.5.0 vendor PDF. Only the chips and interfaces listed in the source are in scope. For an ArmSoM board, check the SoC, NPU driver, Toolkit/Runtime, SDK/BSP and kernel versions first. No ArmSoM hardware validation has been performed; source examples and measurements are not ArmSoM test results.

## Series navigation

- [Platforms, headers and linking](/articles/rknn-v250-runtime-api-overview-linking/)
- [Memory ownership and general/zero-copy flows](/articles/rknn-v250-runtime-api-conventions-zero-copy/)
- [Device, context and initialization flags](/articles/rknn-v250-runtime-api-device-context/)
- [Model, tensor and dynamic shape queries](/articles/rknn-v250-runtime-api-query/)
- [Input, execution, output and dynamic shapes](/articles/rknn-v250-runtime-api-inference/)
- [Tensor memory allocation and synchronization](/articles/rknn-v250-runtime-api-tensor-memory/)
- [Matrix multiplication APIs and dynamic shapes](/articles/rknn-v250-runtime-api-matmul/)
- [Custom operator registration and attributes](/articles/rknn-v250-runtime-api-custom-operators/)
- [Status codes, tensors, memory and extension types](/articles/rknn-v250-runtime-api-types-common/)
- [Matrix multiplication structures](/articles/rknn-v250-runtime-api-types-matmul/)
- [Custom operator types and deprecated API migration](/articles/rknn-v250-runtime-api-types-custom-migration/)

{% raw %}

<!-- source EN p17 unit 151 -->

### 5.2. Query

<!-- source EN p17 unit 152 -->

Query model attributes, SDK version, memory usage and other information.

<!-- source EN p17 unit 153 -->

### rknn_query

<!-- source EN p17 unit 154 -->

The rknn_query function can query the information of models and SDK, including model input and output information, layer-by-layer running time, total model inference time, SDK version, memory usage information, user- defined strings and other information.

<!-- source EN p17 unit 155 -->

| API | rknn_query |
| --- | --- |
| Description | Query the information about the model and the SDK. |
| Parameters | rknn_context context: The object of rknn_contex. |
| Parameters | rknn_query_cmd : The query command. |
| Parameters | void* info: The structure object that stores the result of the query. |
| Parameters | uint32_t size: The size of the info structure object. |
| Return | int: Error code (See Status Codes). |

<!-- source EN p17 unit 156 -->

Currently, the SDK supports following query commands:

<!-- source EN p17 unit 157 -->

| Query command | Return result<br>structure | Function |
| --- | --- | --- |
| RKNN_QUERY_IN_OUT_NUM | rknn_input_output_num | Query the number of input and output Tensors. |
| RKNN_QUERY_INPUT_ATTR | rknn_tensor_attr | Query the input Tensor attribute. |
| RKNN_QUERY_OUTPUT_ATTR | rknn_tensor_attr | Query the output Tensor attribute. |
| RKNN_QUERY_PERF_DETAIL | rknn_perf_detail | Query the running time of each layer of the<br>network. It only works when the flag of<br>RKNN_FLAG_COLLECT_PERF_MASK is set via<br>using the rknn_init. |
| RKNN_QUERY_PERF_RUN | rknn_perf_run | Query the total time of inference (excluding time<br>in setting input/output) in microseconds . |
| RKNN_QUERY_SDK_VERSION | rknn_sdk_version | Query the SDK version. |
| RKNN_QUERY_MEM_SIZE | rknn_mem_size | Query the memory size allocated for the weights<br>and internal tensors in the network. |
| RKNN_QUERY_CUSTOM_STRING | rknn_custom_string | Query the user-defined strings in the RKNN model. |

<!-- source EN p18 unit 158 -->

<!-- source EN p18 unit 159 -->

| Query command | Return result<br>structure | Function |
| --- | --- | --- |
| RKNN_QUERY_NATIVE_INPUT_ATTR | rknn_tensor_attr | When using the zero-copy API interface, it queries the native input Tensor attribute, which is the model input attribute directly read by the NPU. |
| RKNN_QUERY_NATIVE_OUTPUT_ATTR | rknn_tensor_attr | When using the zero-copy API interface, query the native output Tensor attribute, which is the model output attribute directly from the NPU. |
| RKNN_QUERY_NATIVE_NC1HWC2_INPUT_ATTR | rknn_tensor_attr | When using the zero-copy API interface, it queries the native input Tensor attribute, which is the model input attribute directly read by the NPU.it is same with RKNN_QUERY_NATIVE_INPUT_ATTR. |
| RKNN_QUERY_NATIVE_NC1HWC2_OUTPUT_ATTR | rknn_tensor_attr | When using the zero-copy API interface, it queries the native output Tensor attribute, which is the model input attribute directly read by the NPU.it is same with RKNN_QUERY_NATIVE_OUTPUT_ATTR. |
| RKNN_QUERY_NATIVE_NHWC_INPUT_ATTR | rknn_tensor_attr | When using the zero-copy API interface, it queries the native input Tensor attribute, which is the model input attribute directly read by the NPU.it is same with RKNN_QUERY_NATIVE_INPUT_ATTR. |
| RKNN_QUERY_NATIVE_NHWC_OUTPUT_ATTR | rknn_tensor_attr | When using the zero-copy API interface, it queries the native output NHWC Tensor attribute, which is the model input attribute directly read by the NPU. |
| RKNN_QUERY_DEVICE_MEM_INFO | rknn_tensor_mem | Query the memory properties of the model buffer. |
| RKNN_QUERY_INPUT_DYNAMIC_RANGE | rknn_input_range | When using the RKNN model that supports dynamic shapes, query the model to support input information such as the number of shapes, list, data layout and name corresponding to the shape. |
| RKNN_QUERY_CURRENT_INPUT_ATTR | rknn_tensor_attr | When using the RKNN model that supports dynamic shapes, query the input attributes used by the model for current inference. |
| RKNN_QUERY_CURRENT_OUTPUT_ATTR | rknn_tensor_attr | When using the RKNN model that supports dynamic shapes, query the output attributes used by the model for current inference. |
| RKNN_QUERY_CURRENT_NATIVE_INPUT_ATTR | rknn_tensor_attr | When using the RKNN model that supports dynamic shapes, query the NPU native input attributes used by the model's current inference. |
| RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR | rknn_tensor_attr | When using the RKNN model that supports dynamic shapes, query the NPU native output attributes used by the model's current inference. |

<!-- source EN p18 unit 171 -->

Next we will explain each query command in detail.

<!-- source EN p18 unit 172 -->

#### 1. Query the SDK version

<!-- source EN p18 unit 173 -->

The RKNN_QUERY_SDK_VERSION command can be used to query the version information of the RKNN SDK. You need to create the rknn_sdk_version structure object first.

<!-- source EN p18 unit 174 -->

Sample Code:

<!-- source EN p18 unit 175 -->

```c
rknn_sdk_version version;
ret = rknn_query(ctx, RKNN_QUERY_SDK_VERSION, &version,
             sizeof(rknn_sdk_version));
printf("sdk api version: %s\n", version.api_version);
printf("driver version: %s\n", version.drv_version);
```

<!-- source EN p18 unit 176 -->

#### 2. Query the number of input and output Tensor

<!-- source EN p19 unit 177 -->

The RKNN_QUERY_IN_OUT_NUM command can be used to query the number of model input and output Tensor. You need to create the rknn_input_output_num structure object first.

<!-- source EN p19 unit 178 -->

Sample Code:

<!-- source EN p19 unit 179 -->

```c
rknn_input_output_num io_num;
ret = rknn_query(ctx, RKNN_QUERY_IN_OUT_NUM, &io_num, sizeof(io_num));
printf("model input num: %d, output num: %d\n", io_num.n_input, io_num.n_output);
```

<!-- source EN p19 unit 180 -->

#### 3. Query input Tensor attribute (for general API interface)

<!-- source EN p19 unit 181 -->

The RKNN_QUERY_INPUT_ATTR command can be used to query the attribute of the model input Tensor. You need to create the rknn_tensor_attr structure object first (Note: the tensor queried by RV1106/RV1103/RV1106B/RV1103B/RK2118 is the tensor originally entered as native) .

<!-- source EN p19 unit 182 -->

Sample Code:

<!-- source EN p19 unit 183 -->

```c
rknn_tensor_attr input_attrs[io_num.n_input];
memset(input_attrs, 0, sizeof(input_attrs));
for (int i = 0; i < io_num.n_input; i++) {
   input_attrs[i].index = i;
   ret = rknn_query(ctx, RKNN_QUERY_INPUT_ATTR, &(input_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source EN p19 unit 184 -->

#### 4. Query output Tensor attribute (for general API interface)

<!-- source EN p19 unit 185 -->

The RKNN_QUERY_OUTPUT_ATTR command can be used to query the attribute of the model output Tensor. You need to create the rknn_tensor_attr structure object first.

<!-- source EN p19 unit 186 -->

Sample Code:

<!-- source EN p19 unit 187 -->

```c
rknn_tensor_attr output_attrs[io_num.n_output];
memset(output_attrs, 0, sizeof(output_attrs));
for (int i = 0; i < io_num.n_output; i++) {
   output_attrs[i].index = i;
   ret = rknn_query(ctx, RKNN_QUERY_OUTPUT_ATTR, &(output_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source EN p19 unit 188 -->

#### 5. Query layer-by-layer inference time of model

<!-- source EN p19 unit 189 -->

After the rknn_run interface is called, the RKNN_QUERY_PERF_DETAIL command can be used to query the layer- by-layer inference time in microseconds. The premise of using this command is that the flag parameter of the rknn_init interface needs to include the RKNN_FLAG_COLLECT_PERF_MASK flag.

<!-- source EN p19 unit 190 -->

Sample Code:

<!-- source EN p19 unit 191 -->

```c
rknn_context ctx;
int ret = rknn_init(&ctx, model_data, model_data_size, RKNN_FLAG_COLLECT_PERF_MASK, NULL);
...
ret = rknn_run(ctx,NULL);
...
rknn_perf_detail perf_detail;
ret = rknn_query(ctx, RKNN_QUERY_PERF_DETAIL, &perf_detail, sizeof(perf_detail));
```

<!-- source EN p19 unit 192 -->

#### 6. Query total inference time of model

<!-- source EN p19 unit 193 -->

After the rknn_run interface is called, the RKNN_QUERY_PERF_RUN command can be used to query the inference time of the model (not including setting input/output) in microseconds.

<!-- source EN p19 unit 194 -->

Sample Code:

<!-- source EN p20 unit 195 -->

```c
rknn_context ctx;
int ret = rknn_init(&ctx, model_data, model_data_size, 0, NULL);
...
ret = rknn_run(ctx,NULL);
...
rknn_perf_run perf_run;
ret = rknn_query(ctx, RKNN_QUERY_PERF_RUN, &perf_run, sizeof(perf_run));
```

<!-- source EN p20 unit 196 -->

#### 7. Query the memory allocation of the model

<!-- source EN p20 unit 197 -->

After the rknn_init interface is called, when the user needs to allocate memory for network by themself, the RKNN_QUERY_MEM_SIZE command can be used to query the weights of the model and the internal memory (excluding input and output) in the network. The requirement of using this command is that the flag parameter of the rknn_init interface needs to enable the RKNN_FLAG_MEM_ALLOC_OUTSIDE flag.

<!-- source EN p20 unit 198 -->

Sample Code:

<!-- source EN p20 unit 199 -->

```c
rknn_context ctx;
int ret = rknn_init(&ctx, model_data, model_data_size, RKNN_FLAG_MEM_ALLOC_OUTSIDE , NULL);
rknn_mem_size mem_size;
ret = rknn_query(ctx, RKNN_QUERY_MEM_SIZE, &mem_size, sizeof(mem_size));
```

<!-- source EN p20 unit 200 -->

#### 8. Query User-defined string in the model

<!-- source EN p20 unit 201 -->

After the rknn_init interface is called, if the user has added custom strings when generating the RKNN model, the RKNN_QUERY_CUSTOM_STRING command can be used to retrieve user-defined strings. For example, when converting the RKNN model, the user fills in the custom characters of "RGB" to identify that the RKNN model input is a three-channel image in RGB format instead of a three-channel image in BGR format. At runtime, the data is converted into an RGB image based on the queried "RGB" information.

<!-- source EN p20 unit 202 -->

Sample Code:

<!-- source EN p20 unit 203 -->

```c
rknn_context ctx;
int ret = rknn_init(&ctx, model_data, model_data_size, 0, NULL);
rknn_custom_string custom_string;
ret = rknn_query(ctx, RKNN_QUERY_CUSTOM_STRING, &custom_string, sizeof(custom_string));
```

<!-- source EN p20 unit 204 -->

#### 9. Query native input tensor attribute (for zero-copy API interface)

<!-- source EN p20 unit 205 -->

The RKNN_QUERY_NATIVE_INPUT_ATTR command(the same to RKNN_QUERY_NATIVE_NC1HWC2_INPUT_ATTR) can be used to query the native attribute of the model input Tensor. User need to create the rknn_tensor_attr structure object first.

<!-- source EN p20 unit 206 -->

Sample Code:

<!-- source EN p20 unit 207 -->

```c
rknn_tensor_attr input_attrs[io_num.n_input];
memset(input_attrs, 0, sizeof(input_attrs));
for (int i = 0; i < io_num.n_input; i++) {
   input_attrs[i].index = i;
   ret = rknn_query(ctx, RKNN_QUERY_NATIVE_INPUT_ATTR, &(input_attrs[i]),
sizeof(rknn_tensor_attr));
}
```

<!-- source EN p20 unit 208 -->

#### 9. Query native output tensor attribute (for zero-copy API interface)

<!-- source EN p20 unit 209 -->

The RKNN_QUERY_NATIVE_OUTPUT_ATTR command(the same to RKNN_QUERY_NATIVE_NC1HWC2_OUTPUT_ATTR) can be used to query the native attribute of the model output Tensor. User need to create the rknn_tensor_attr structure object first.

<!-- source EN p20 unit 210 -->

Sample Code:

<!-- source EN p21 unit 211 -->

```c
rknn_tensor_attr output_attrs[io_num.n_output];
memset(output_attrs, 0, sizeof(output_attrs));
for (int i = 0; i < io_num.n_output; i++) {
   output_attrs[i].index = i;
   ret = rknn_query(ctx, RKNN_QUERY_NATIVE_OUTPUT_ATTR,
&(output_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source EN p21 unit 212 -->

#### 10. Query native input tensor attribute (for zero-copy API interface)

<!-- source EN p21 unit 213 -->

The RKNN_QUERY_NATIVE_NHWC_INPUT_ATTR command can be used to query the NHWC attribute of the model input Tensor. User need to create the rknn_tensor_attr structure object first.

<!-- source EN p21 unit 214 -->

Sample Code:

<!-- source EN p21 unit 215 -->

```c
rknn_tensor_attr input_attrs[io_num.n_input];
memset(input_attrs, 0, sizeof(input_attrs));
for (int i = 0; i < io_num.n_input; i++) {
   input_attrs[i].index = i;
   ret = rknn_query(ctx, RKNN_QUERY_NATIVE_NHWC_INPUT_ATTR,
&(input_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source EN p21 unit 216 -->

#### 11. Query native output tensor attribute (for zero-copy API interface)

<!-- source EN p21 unit 217 -->

The RKNN_QUERY_NATIVE_NHWC_OUTPUT_ATTR command can be used to query the NHWC attribute of the model output Tensor. User need to create the rknn_tensor_attr structure object first.

<!-- source EN p21 unit 218 -->

Sample Code:

<!-- source EN p21 unit 219 -->

```c
rknn_tensor_attr output_attrs[io_num.n_output];
memset(output_attrs, 0, sizeof(output_attrs));
for (int i = 0; i < io_num.n_output; i++) {
   output_attrs[i].index = i;
   ret = rknn_query(ctx, RKNN_QUERY_NATIVE_NHWC_OUTPUT_ATTR,
&(output_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source EN p21 unit 220 -->

#### 12. Query the memory information of model buffer(Note: RV1106/RV1103/RV1106B/RV1103B/RK2118 supports this interface)

<!-- source EN p21 unit 222 -->

After the rknn_init interface is called, the RKNN_QUERY_DEVICE_MEM_INFO command can query the attributes of the model buffer created inside the runtime, including fd and physical address.

<!-- source EN p21 unit 223 -->

```c
rknn_tensor_mem mem_info;
memset(&mem_info, 0, sizeof(mem_info));
ret = rknn_query(ctx, RKNN_QUERY_DEVICE_MEM_INFO, &mem_info, sizeof(mem_info));
```

<!-- source EN p21 unit 224 -->

#### 13. Query the dynamic input shape information supported by the RKNN model (Note:

<!-- source EN p21 unit 225 -->

RV1106/RV1103/RV1106B/RV1103B/RK2118 does not support this interface)

<!-- source EN p21 unit 226 -->

After the rknn_init interface is called, pass in the RKNN_QUERY_INPUT_DYNAMIC_RANGE command to query the input shape information supported by the model, including the number of input shapes, the list of input shapes, the layout and name of the input shapes, and other information. The rknn_input_range structure object needs to be created first.

<!-- source EN p21 unit 227 -->

The sample code is as follows:

<!-- source EN p22 unit 228 -->

```c
rknn_input_range dyn_range[io_num.n_input];
memset(dyn_range, 0, io_num.n_input * sizeof(rknn_input_range));
for (uint32_t i = 0; i < io_num.n_input; i++) {
   dyn_range[i].index = i;
   ret = rknn_query(ctx, RKNN_QUERY_INPUT_DYNAMIC_RANGE, &dyn_range[i],
sizeof(rknn_input_range));
}
```

<!-- source EN p22 unit 229 -->

#### 14. Query the input dynamic shape currently used by the RKNN model

<!-- source EN p22 unit 230 -->

After the rknn_set_input_shapes interface is called, pass in the RKNN_QUERY_CURRENT_INPUT_ATTR command to query the input attribute information currently used by the model. The rknn_tensor_attr structure needs to be created first (Note: RV1106/RV1103/RV1103B/RV1106B/RK2118 does not support this command).

<!-- source EN p22 unit 231 -->

The sample code is as follows:

<!-- source EN p22 unit 232 -->

```c
rknn_tensor_attr cur_input_attrs[io_num.n_input];
memset(cur_input_attrs, 0, io_num.n_input * sizeof(rknn_tensor_attr));
for (uint32_t i = 0; i < io_num.n_input; i++) {
   cur_input_attrs[i].index = i;
   ret = rknn_query(ctx, RKNN_QUERY_CURRENT_INPUT_ATTR, &(cur_input_attrs[i]),
sizeof(rknn_tensor_attr));
}
```

<!-- source EN p22 unit 233 -->

#### 15. Query the output dynamic shape currently used by the RKNN model

<!-- source EN p22 unit 234 -->

After the rknn_set_input_shapes interface is called, pass in the RKNN_QUERY_CURRENT_OUTPUT_ATTR command to query the output attribute information currently used by the model. The rknn_tensor_attr structure needs to be created first (Note: RV1106/RV1103/RV1103B/RV1106B/RK2118 does not support this command).

<!-- source EN p22 unit 235 -->

The sample code is as follows:

<!-- source EN p22 unit 236 -->

```c
rknn_tensor_attr cur_output_attrs[io_num.n_output];
memset(cur_output_attrs, 0, io_num.n_output * sizeof(rknn_tensor_attr));
for (uint32_t i = 0; i < io_num.n_output; i++) {
   cur_output_attrs[i].index = i;
   ret = rknn_query(ctx, RKNN_QUERY_CURRENT_OUTPUT_ATTR, &(cur_output_attrs[i]),
sizeof(rknn_tensor_attr));
}
```

<!-- source EN p22 unit 237 -->

#### 16. Query the native input dynamic shape currently used by the RKNN model

<!-- source EN p22 unit 238 -->

After the rknn_set_input_shapes interface is called, pass in the RKNN_QUERY_CURRENT_NATIVE_INPUT_ATTR command to query the native input attribute information currently used by the model. The rknn_tensor_attr structure needs to be created first (Note: RV1106/RV1103/RV1103B/RV1106B/RK2118 does not support this command).

<!-- source EN p22 unit 239 -->

The sample code is as follows:

<!-- source EN p22 unit 240 -->

```c
rknn_tensor_attr cur_input_attrs[io_num.n_input];
memset(cur_input_attrs, 0, io_num.n_input * sizeof(rknn_tensor_attr));
for (uint32_t i = 0; i < io_num.n_input; i++) {
   cur_input_attrs[i].index = i;
   ret = rknn_query(ctx, RKNN_QUERY_CURRENT_NATIVE_INPUT_ATTR,
&(cur_input_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source EN p22 unit 241 -->

#### 17. Query the native output dynamic shape currently used by the RKNN model

<!-- source EN p22 unit 242 -->

After the rknn_set_input_shapes interface is called, pass in the RKNN_QUERY_CURRENT_OUTPUT_ATTR command to query the native output attribute information currently used by the model. The rknn_tensor_attr structure needs to be created first (Note: RV1106/RV1103/RV1103B/RV1106B/RK2118 does not support this command).

<!-- source EN p22 unit 243 -->

The sample code is as follows:

<!-- source EN p23 unit 244 -->

```c
rknn_tensor_attr cur_output_attrs[io_num.n_output];
memset(cur_output_attrs, 0, io_num.n_output * sizeof(rknn_tensor_attr));
for (uint32_t i = 0; i < io_num.n_output; i++) {
   cur_output_attrs[i].index = i;
   ret = rknn_query(ctx, RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR, &(cur_output_attrs[i]),
sizeof(rknn_tensor_attr));
}
```

{% endraw %}

## Source and editorial notes

Technical chapters are split by use. Code, identifiers and parameters are retained. Chinese follows the Chinese source; English, Russian and German follow the English source. No invented figures are added to chapters without figures.

Source caveats: Chapter numbers and example output are retained; old SDK versions in example logs are not the current document version. The Runtime source jumps from chapter 3 to 5 and repeats query subsection numbers. Its rknn_init parameter table calls extend disabled, while later types describe user_key and shared-weight fields. The native dynamic-output prose uses RKNN_QUERY_CURRENT_OUTPUT_ATTR, but its example uses RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR. Some native NHWC/NC1HWC2 descriptions also confuse input and output. Verify against actual V2.5.0 headers and the target SDK; these are not validated behaviors. The RK2118 cross-reference says RKNN3_RK2118_Quick_Start.pdf, while the current directory contains an RKNN2 quick-start guide.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
