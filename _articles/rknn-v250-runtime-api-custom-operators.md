---
layout: "article"
title: "RKNN Runtime C API V2.5.0 — Custom operator registration and attributes"
date: "2026-10-29"
author: "ArmSoM"
lang: "en"
translation_key: "rknn-v250-runtime-api-custom-operators"
slug: "rknn-v250-runtime-api-custom-operators"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "runtime"]
products: []
reference_products: []
description: "RKNN Runtime C API V2.5.0 — Custom operator registration and attributes | Complete parameters, examples and platform constraints"
excerpt: "RKNN Runtime C API V2.5.0 — Custom operator registration and attributes | Complete parameters, examples and platform constraints"
permalink: "/articles/rknn-v250-runtime-api-custom-operators/"
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

<!-- source EN p34 unit 386 -->

### 5.6. Custom Operators

<!-- source EN p34 unit 387 -->

Custom operator registration and operator attribute retrieval.

<!-- source EN p34 unit 388 -->

### rknn_register_custom_ops

<!-- source EN p34 unit 389 -->

After the context is successfully initialized, this function is used to register several custom operator information in the context, including custom operator types, running backend types, OpenCL kernel information, and callback function pointers. After successful registration, during the inference phase, the rknn_run interface will call the callback function implemented by the developer.

<!-- source EN p34 unit 390 -->

| API | rknn_register_custom_ops |
| --- | --- |
| Description | Register several custom operators into the context. |
| Parameters | rknn_context *context: the rknn_context pointer. Before the function is called, the context must have been<br>successfully initialized. |
| Parameters | rknn_custom_op* op: the custom operator information array, each element of the array is a rknn_custom_op<br>structure object. |
| Parameters | uint32_t custom_op_num: custom operator information array length. |
| Return | int: Error code (See Status Codes). |

<!-- source EN p35 unit 392 -->

Sample Code:

<!-- source EN p35 unit 393 -->

```c
// CPU operators
rknn_custom_op user_op[2];
memset(user_op, 0, 2 * sizeof(rknn_custom_op));
strncpy(user_op[0].op_type, "cstSoftmax", RKNN_MAX_NAME_LEN - 1);
user_op[0].version = 1;
user_op[0].target = RKNN_TARGET_TYPE_CPU;
user_op[0].init = custom_op_init_callback;
user_op[0].compute = compute_custom_softmax_float32;
user_op[0].destroy = custom_op_destroy_callback;

strncpy(user_op[1].op_type, "ArgMax", RKNN_MAX_NAME_LEN - 1);
user_op[1].version = 1;
user_op[1].target = RKNN_TARGET_TYPE_CPU;
user_op[1].init = custom_op_init_callback;
user_op[1].compute = compute_custom_argmax_float32;
user_op[1].destroy = custom_op_destroy_callback;

ret = rknn_register_custom_ops(ctx, user_op, 2);
if (ret < 0) {
  printf("rknn_register_custom_ops fail! ret = %d\n", ret);
  return -1;
}
```

<!-- source EN p35 unit 394 -->

### rknn_custom_op_get_op_attr

<!-- source EN p35 unit 395 -->

This function is used to obtain the parameter information of the custom operator in the callback function of the custom operator, such as the axis parameter of the Softmax operator. It passes in the field name of the custom operator parameter and a rknn_custom_op_attr structure pointer. After calling this interface, the parameter value will be stored in the data member in the rknn_custom_op_attr structure. The developer forces the pointer according to the dtype member in the returned structure. Convert it into the first address of the array of a specific data type in C language, and then read out the complete parameter value according to the number of elements.

<!-- source EN p35 unit 396 -->

| API | rknn_custom_op_get_op_attr |
| --- | --- |
| Description | Get the parameters or properties of a custom operator. |
| Parameters | rknn_custom_op_context* op_ctx: custom operator context pointer. |
| Parameters | const char* attr_name: field name of custom operator parameter. |
| Parameters | rknn_custom_op_attr* op_attr: a structure representing the custom operator parameter value. |
| Return | No value. |

<!-- source EN p35 unit 397 -->

Sample Code:

<!-- source EN p35 unit 398 -->

```c
rknn_custom_op_attr op_attr;
rknn_custom_op_get_op_attr(op_ctx, "axis", &op_attr);
if (op_attr.n_elems == 1 && op_attr.dtype == RKNN_TENSOR_INT64) {
   axis = ((int64_t*)op_attr.data)[0];
}
...
```

{% endraw %}

## Source and editorial notes

Technical chapters are split by use. Code, identifiers and parameters are retained. Chinese follows the Chinese source; English, Russian and German follow the English source. No invented figures are added to chapters without figures.

Source caveats: Chapter numbers and example output are retained; old SDK versions in example logs are not the current document version. The Runtime source jumps from chapter 3 to 5 and repeats query subsection numbers. Its rknn_init parameter table calls extend disabled, while later types describe user_key and shared-weight fields. The native dynamic-output prose uses RKNN_QUERY_CURRENT_OUTPUT_ATTR, but its example uses RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR. Some native NHWC/NC1HWC2 descriptions also confuse input and output. Verify against actual V2.5.0 headers and the target SDK; these are not validated behaviors. The RK2118 cross-reference says RKNN3_RK2118_Quick_Start.pdf, while the current directory contains an RKNN2 quick-start guide.

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
