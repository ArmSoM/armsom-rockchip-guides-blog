---
layout: "article"
title: "RKNN Runtime C API V2.5.0 — 模型、张量与动态形状查询"
date: "2026-10-29"
author: "ArmSoM"
lang: "zh"
translation_key: "rknn-v250-runtime-api-query"
slug: "rknn-v250-runtime-api-query"
category: "ai"
tags: ["RKNN", "NPU", "RKNN-Toolkit2", "V2.5.0", "runtime"]
products: []
reference_products: []
description: "RKNN Runtime C API V2.5.0 — 模型、张量与动态形状查询 | 完整参数、代码与平台限制参考"
excerpt: "RKNN Runtime C API V2.5.0 — 模型、张量与动态形状查询 | 完整参数、代码与平台限制参考"
permalink: "/zh/articles/rknn-v250-runtime-api-query/"
---

## 平台参考与来源

本文依据 RKNN V2.5.0 原厂 PDF 整理。适用于原文列出的芯片和接口；ArmSoM 板卡须先核对 SoC、NPU 驱动、Toolkit/Runtime、SDK/BSP 和内核版本。尚未进行 ArmSoM 硬件验证，原文示例及测量值不是 ArmSoM 实测。

## 系列导航

- [平台支持、头文件与编译链接](/zh/articles/rknn-v250-runtime-api-overview-linking/)
- [内存所有权与通用、零拷贝流程](/zh/articles/rknn-v250-runtime-api-conventions-zero-copy/)
- [设备、上下文与初始化标志](/zh/articles/rknn-v250-runtime-api-device-context/)
- [模型、张量与动态形状查询](/zh/articles/rknn-v250-runtime-api-query/)
- [输入、执行、输出与动态形状设置](/zh/articles/rknn-v250-runtime-api-inference/)
- [张量、内存分配与同步](/zh/articles/rknn-v250-runtime-api-tensor-memory/)
- [矩阵乘法接口与动态形状](/zh/articles/rknn-v250-runtime-api-matmul/)
- [自定义算子注册与属性](/zh/articles/rknn-v250-runtime-api-custom-operators/)
- [状态码、张量、内存与扩展结构](/zh/articles/rknn-v250-runtime-api-types-common/)
- [矩阵乘法数据结构](/zh/articles/rknn-v250-runtime-api-types-matmul/)
- [自定义算子结构与废弃 API 迁移](/zh/articles/rknn-v250-runtime-api-types-custom-migration/)

{% raw %}

<!-- source CN p17 unit 146 -->

### 5.2. 查询

<!-- source CN p17 unit 147 -->

查询模型属性、SDK版本、内存占用等信息。

<!-- source CN p17 unit 148 -->

### rknn_query

<!-- source CN p17 unit 149 -->

rknn_query函数能够查询获取到模型输入输出信息、逐层运行时间、模型推理的总时间、SDK版本、内存占用信息、用戶自定义字符串等信息。

<!-- source CN p17 unit 150 -->

| API | rknn_query |
| --- | --- |
| 功能 | 查询模型与SDK的相关信息。 |
| 参数 | rknn_context context:rknn_context对象。 |
| 参数 | rknn_query_cmd :查询命令。 |
| 参数 | void* info:存放返回结果的结构体变量。 |
| 参数 | uint32_t size:info对应的结构体变量的大小。 |
| 返回值 | int 错误码(⻅状态码)。 |

<!-- source CN p17 unit 151 -->

当前SDK支持的查询命令如下表所示:

<!-- source CN p18 unit 152 -->

| 查询命令 | 返回结果结构体 | 功能 |
| --- | --- | --- |
| RKNN_QUERY_IN_OUT_NUM | rknn_input_output_num | 查询输入输出tensor个数。 |
| RKNN_QUERY_INPUT_ATTR | rknn_tensor_attr | 查询输入tensor属性。 |
| RKNN_QUERY_OUTPUT_ATTR | rknn_tensor_attr | 查询输出tensor属性。 |
| RKNN_QUERY_PERF_DETAIL | rknn_perf_detail | 查询网络各层运行时间,需要调用rknn_init接口时,设置<br>RKNN_FLAG_COLLECT_PERF_MASK标志才能生效。 |
| RKNN_QUERY_PERF_RUN | rknn_perf_run | 查询推理模型(不包含设置输入/输出)的耗时,单位是微<br>秒。 |
| RKNN_QUERY_SDK_VERSION | rknn_sdk_version | 查询SDK版本。 |
| RKNN_QUERY_MEM_SIZE | rknn_mem_size | 查询分配给权重和网络中间tensor的内存大小。 |
| RKNN_QUERY_CUSTOM_STRING | rknn_custom_string | 查询RKNN模型里面的用戶自定义字符串信息。 |
| RKNN_QUERY_NATIVE_INPUT_ATTR | rknn_tensor_attr | 使用零拷贝API接口时,查询原生输入tensor属性,它是<br>NPU直接读取的模型输入属性。 |
| RKNN_QUERY_NATIVE_OUTPUT_ATTR | rknn_tensor_attr | 使用零拷贝API接口时,查询原生输出tensor属性,它是<br>NPU直接输出的模型输出属性。 |
| RKNN_QUERY_NATIVE_NC1HWC2_INPUT_ATTR | rknn_tensor_attr | 使用零拷贝API接口时,查询原生输入tensor属性,它是<br>NPU直接读取的模型输入属性与<br>RKNN_QUERY_NATIVE_INPUT_ATTR查询结果一致。 |
| RKNN_QUERY_NATIVE_NC1HWC2_OUTPUT_ATTR | rknn_tensor_attr | 使用零拷贝API接口时,查询原生输出tensor属性,它是<br>NPU直接输出的模型输出属与<br>RKNN_QUERY_NATIVE_OUTPUT_ATTR查询结果一致<br>性。 |
| RKNN_QUERY_NATIVE_NHWC_INPUT_ATTR | rknn_tensor_attr | 使用零拷贝API接口时,查询原生输入 tensor属性与<br>RKNN_QUERY_NATIVE_INPUT_ATTR查询结果一致 。 |
| RKNN_QUERY_NATIVE_NHWC_OUTPUT_ATTR | rknn_tensor_attr | 使用零拷贝API接口时,查询原生输出NHWC tensor属性。 |
| RKNN_QUERY_DEVICE_MEM_INFO | rknn_tensor_mem | 查询模型buffer的内存属性。 |
| RKNN_QUERY_INPUT_DYNAMIC_RANGE | rknn_input_range | 使用支持动态形状RKNN模型时,查询模型支持输入形状<br>数量、列表、形状对应的数据布局和名称等信息。 |
| RKNN_QUERY_CURRENT_INPUT_ATTR | rknn_tensor_attr | 使用支持动态形状RKNN模型时,查询模型当前推理所使<br>用的输入属性。 |
| RKNN_QUERY_CURRENT_OUTPUT_ATTR | rknn_tensor_attr | 使用支持动态形状RKNN模型时,查询模型当前推理所使<br>用的输出属性。 |
| RKNN_QUERY_CURRENT_NATIVE_INPUT_ATTR | rknn_tensor_attr | 使用支持动态形状RKNN模型时,查询模型当前推理所使<br>用的NPU原生输入属性。 |
| RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR | rknn_tensor_attr | 使用支持动态形状RKNN模型时,查询模型当前推理所使<br>用的NPU原生输出属性。 |

<!-- source CN p18 unit 153 -->

各个指令用法的详细说明,如下:

<!-- source CN p18 unit 154 -->

#### 1. 查询SDK版本

<!-- source CN p18 unit 155 -->

传入RKNN_QUERY_SDK_VERSION命令可以查询RKNN SDK的版本信息。其中需要先创建rknn_sdk_version结构体对象。

<!-- source CN p18 unit 156 -->

示例代码如下:

<!-- source CN p18 unit 157 -->

```c
rknn_sdk_version version;
ret = rknn_query(ctx, RKNN_QUERY_SDK_VERSION, &version, sizeof(rknn_sdk_version));
printf("sdk api version: %s\n", version.api_version);
printf("driver version: %s\n", version.drv_version);
```

<!-- source CN p18 unit 158 -->

#### 2. 查询输入输出tensor个数

<!-- source CN p18 unit 159 -->

在rknn_init接口调用完毕后,传入RKNN_QUERY_IN_OUT_NUM命令可以查询模型输入输出tensor的个数。其中需要先创建rknn_input_output_num结构体对象。

<!-- source CN p19 unit 160 -->

示例代码如下:

<!-- source CN p19 unit 161 -->

```c
rknn_input_output_num io_num;
ret = rknn_query(ctx, RKNN_QUERY_IN_OUT_NUM, &io_num, sizeof(io_num));
printf("model input num: %d, output num: %d\n", io_num.n_input, io_num.n_output);
```

<!-- source CN p19 unit 162 -->

#### 3. 查询输入tensor属性(用于通用API接口)

<!-- source CN p19 unit 163 -->

在rknn_init接口调用完毕后,传入RKNN_QUERY_INPUT_ATTR命令可以查询模型输入tensor的属性。其中需要先创建rknn_tensor_attr结构体对象 (注意:RV1106/RV1103/RV1106B/RV1103B/RK2118查询出来的tensor是原始输入native的tensor) 。

<!-- source CN p19 unit 164 -->

示例代码如下:

<!-- source CN p19 unit 165 -->

```c
rknn_tensor_attr input_attrs[io_num.n_input];
memset(input_attrs, 0, sizeof(input_attrs));
for (int i = 0; i < io_num.n_input; i++) {
   input_attrs[i].index = i;
   ret = rknn_query(ctx, RKNN_QUERY_INPUT_ATTR, &(input_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source CN p19 unit 166 -->

#### 4. 查询输出tensor属性(用于通用API接口)

<!-- source CN p19 unit 167 -->

在rknn_init接口调用完毕后,传入RKNN_QUERY_OUTPUT_ATTR命令可以查询模型输出tensor的属性。其中需要先创建rknn_tensor_attr结构体对象。

<!-- source CN p19 unit 168 -->

示例代码如下:

<!-- source CN p19 unit 169 -->

```c
rknn_tensor_attr output_attrs[io_num.n_output];
memset(output_attrs, 0, sizeof(output_attrs));
for (int i = 0; i < io_num.n_output; i++) {
   output_attrs[i].index = i;
   ret = rknn_query(ctx, RKNN_QUERY_OUTPUT_ATTR, &(output_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source CN p19 unit 170 -->

#### 2. 查询模型推理的逐层耗时

<!-- source CN p19 unit 171 -->

在rknn_run接口调用完毕后,rknn_query接口传入RKNN_QUERY_PERF_DETAIL可以查询网络推理时逐层的耗时,单位是微秒。使用该命令的前提是,在rknn_init接口的flag参数需要包含RKNN_FLAG_COLLECT_PERF_MASK标志。

<!-- source CN p19 unit 172 -->

示例代码如下:

<!-- source CN p19 unit 173 -->

```c
rknn_context ctx;
int ret = rknn_init(&ctx, model_data, model_data_size, RKNN_FLAG_COLLECT_PERF_MASK, NULL);
...
ret = rknn_run(ctx,NULL);
...
rknn_perf_detail perf_detail;
ret = rknn_query(ctx, RKNN_QUERY_PERF_DETAIL, &perf_detail, sizeof(perf_detail));
```

<!-- source CN p19 unit 174 -->

#### 3. 查询模型推理的总耗时

<!-- source CN p19 unit 175 -->

在rknn_run接口调用完毕后,rknn_query接口传入RKNN_QUERY_PERF_RUN可以查询上模型推理(不包含设置输入/输出)的耗时,单位是微秒。

<!-- source CN p19 unit 176 -->

示例代码如下:

<!-- source CN p19 unit 177 -->

```c
rknn_context ctx;
int ret = rknn_init(&ctx, model_data, model_data_size, 0, NULL);
...
ret = rknn_run(ctx,NULL);
...
rknn_perf_run perf_run;
ret = rknn_query(ctx, RKNN_QUERY_PERF_RUN, &perf_run, sizeof(perf_run));
```

<!-- source CN p20 unit 178 -->

#### 7. 查询模型的内存占用情况

<!-- source CN p20 unit 179 -->

在rknn_init接口调用完毕后,当用戶需要自行分配网络的内存时,rknn_query接口传入RKNN_QUERY_MEM_SIZE可以查询模型的权重、网络中间tensor的内存(不包括输入和输出)、推演模型所用的所有DMA内存的以及SRAM内存(如果sram没开或者没有此项功能则为0)的占用情况。使用该命令的前提是在rknn_init接口的flag参数需要包含RKNN_FLAG_MEM_ALLOC_OUTSIDE标志。

<!-- source CN p20 unit 180 -->

示例代码如下:

<!-- source CN p20 unit 181 -->

```c
rknn_context ctx;
int ret = rknn_init(&ctx, model_data, model_data_size, RKNN_FLAG_MEM_ALLOC_OUTSIDE , NULL);
rknn_mem_size mem_size;
ret = rknn_query(ctx, RKNN_QUERY_MEM_SIZE, &mem_size, sizeof(mem_size));
```

<!-- source CN p20 unit 182 -->

#### 4. 查询模型中用戶自定义字符串

<!-- source CN p20 unit 183 -->

在rknn_init接口调用完毕后,当用戶需要查询生成RKNN模型时加入的自定义字符串,rknn_query接口传入RKNN_QUERY_CUSTOM_STRING可以获取该字符串。例如,在转换RKNN模型时,用戶填入“RGB”的自定义字符来标识RKNN模型输入是RGB格式三通道图像而不是BGR格式三通道图像,在运行时则根据查询到的“RGB”信息将数据转换成RGB图像。

<!-- source CN p20 unit 184 -->

示例代码如下:

<!-- source CN p20 unit 185 -->

```c
rknn_context ctx;
int ret = rknn_init(&ctx, model_data, model_data_size, 0, NULL);
rknn_custom_string custom_string;
ret = rknn_query(ctx, RKNN_QUERY_CUSTOM_STRING, &custom_string, sizeof(custom_string));
```

<!-- source CN p20 unit 186 -->

#### 9. 查询原生输入tensor属性(用于零拷贝API接口)

<!-- source CN p20 unit 187 -->

在rknn_init接口调用完毕后,传入RKNN_QUERY_NATIVE_INPUT_ATTR命令(同RKNN_QUERY_NATIVE_NC1HWC2_INPUT_ATTR)可以查询模型原生输入tensor的属性。其中需要先创建rknn_tensor_attr结构体对象。

<!-- source CN p20 unit 188 -->

示例代码如下:

<!-- source CN p20 unit 189 -->

```c
rknn_tensor_attr input_attrs[io_num.n_input];
memset(input_attrs, 0, sizeof(input_attrs));
for (int i = 0; i < io_num.n_input; i++) {
   input_attrs[i].index = i;
   ret = rknn_query(ctx, RKNN_QUERY_NATIVE_INPUT_ATTR, &(input_attrs[i]),
sizeof(rknn_tensor_attr));
}
```

<!-- source CN p20 unit 190 -->

#### 10. 查询原生输出tensor属性(用于零拷贝API接口)

<!-- source CN p20 unit 191 -->

在rknn_init接口调用完毕后,传入RKNN_QUERY_NATIVE_OUTPUT_ATTR命令(同RKNN_QUERY_NATIVE_NC1HWC2_OUTPUT_ATTR)可以查询模型原生输出tensor的属性。其中需要先创建rknn_tensor_attr结构体对象。

<!-- source CN p20 unit 192 -->

示例代码如下:

<!-- source CN p20 unit 193 -->

```c
rknn_tensor_attr output_attrs[io_num.n_output];
memset(output_attrs, 0, sizeof(output_attrs));
for (int i = 0; i < io_num.n_output; i++) {
   output_attrs[i].index = i;
   ret = rknn_query(ctx, RKNN_QUERY_NATIVE_OUTPUT_ATTR, &(output_attrs[i]),
sizeof(rknn_tensor_attr));
}
```

<!-- source CN p20 unit 194 -->

#### 5. 查询NHWC格式原生输入tensor属性(用于零拷贝API接口)

<!-- source CN p20 unit 195 -->

在rknn_init接口调用完毕后,传入RKNN_QUERY_NATIVE_NHWC_INPUT_ATTR命令可以查询模型NHWC格式输入tensor的属性。其中需要先创建rknn_tensor_attr结构体对象。

<!-- source CN p20 unit 196 -->

示例代码如下:

<!-- source CN p21 unit 197 -->

```c
rknn_tensor_attr input_attrs[io_num.n_input];
memset(input_attrs, 0, sizeof(input_attrs));
for (int i = 0; i < io_num.n_input; i++) {
   input_attrs[i].index = i;
   ret = rknn_query(ctx, RKNN_QUERY_NATIVE_NHWC_INPUT_ATTR,
                &(input_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source CN p21 unit 198 -->

#### 12. 查询NHWC格式原生输出tensor属性(用于零拷贝API接口)

<!-- source CN p21 unit 199 -->

在rknn_init接口调用完毕后,传入RKNN_QUERY_NATIVE_NHWC_OUTPUT_ATTR命令可以查询模型NHWC格式输出tensor的属性。其中需要先创建rknn_tensor_attr结构体对象。

<!-- source CN p21 unit 200 -->

示例代码如下:

<!-- source CN p21 unit 201 -->

```c
rknn_tensor_attr output_attrs[io_num.n_output];
memset(output_attrs, 0, sizeof(output_attrs));
for (int i = 0; i < io_num.n_output; i++) {
   output_attrs[i].index = i;
   ret = rknn_query(ctx, RKNN_QUERY_NATIVE_NHWC_OUTPUT_ATTR,
                &(output_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source CN p21 unit 202 -->

#### 13. 查询模型buffer的内存属性(注:仅RV1106/RV1103/RV1106B/RV1103B/RK2118支持该查询)

<!-- source CN p21 unit 203 -->

在rknn_init接口调用完毕后,传入RKNN_QUERY_DEVICE_MEM_INFO命令可以查询Runtime内部开辟的模型buffer的包括fd、物理地址等属性。

<!-- source CN p21 unit 204 -->

```c
rknn_tensor_mem mem_info;
memset(&mem_info, 0, sizeof(mem_info));
ret = rknn_query(ctx, RKNN_QUERY_DEVICE_MEM_INFO, &mem_info, sizeof(mem_info));
```

<!-- source CN p21 unit 205 -->

#### 14. 查询RKNN模型支持的动态输入形状信息(注:RV1106/RV1103/RV1106B/RV1103B/RK2118不支持该接口)

<!-- source CN p21 unit 206 -->

在rknn_init接口调用完毕后,传入RKNN_QUERY_INPUT_DYNAMIC_RANGE命令可以查询模型支持的输入形状信息,包含输入形状个数 、输入形状列表、输入形状对应的布局和名称等信息。其中需要先创建rknn_input_range结构体对象。

<!-- source CN p21 unit 207 -->

示例代码如下:

<!-- source CN p21 unit 208 -->

```c
rknn_input_range dyn_range[io_num.n_input];
memset(dyn_range, 0, io_num.n_input * sizeof(rknn_input_range));
for (uint32_t i = 0; i < io_num.n_input; i++) {
   dyn_range[i].index = i;
   ret = rknn_query(ctx, RKNN_QUERY_INPUT_DYNAMIC_RANGE,
                &dyn_range[i], sizeof(rknn_input_range));
}
```

<!-- source CN p21 unit 209 -->

#### 15. 查询RKNN模型当前使用的输入动态形状

<!-- source CN p21 unit 210 -->

在rknn_set_input_shapes接口调用完毕后,传入RKNN_QUERY_CURRENT_INPUT_ATTR命令可以查询模型当前使用的输入属性信息。其中需要先创建rknn_tensor_attr结构体(注:RV1106/RV1103/RV1106B/RV1103B/RK2118不支持该命令)。

<!-- source CN p21 unit 211 -->

示例代码如下:

<!-- source CN p21 unit 212 -->

```c
rknn_tensor_attr cur_input_attrs[io_num.n_input];
memset(cur_input_attrs, 0, io_num.n_input * sizeof(rknn_tensor_attr));
for (uint32_t i = 0; i < io_num.n_input; i++) {
   cur_input_attrs[i].index = i;
   ret = rknn_query(ctx, RKNN_QUERY_CURRENT_INPUT_ATTR,
                &(cur_input_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source CN p21 unit 213 -->

#### 6. 查询RKNN模型当前使用的输出动态形状

<!-- source CN p21 unit 214 -->

在rknn_set_input_shapes接口调用完毕后,传入RKNN_QUERY_CURRENT_OUTPUT_ATTR命令可以查询模型当前使用的输出属性信息。其中需要先创建rknn_tensor_attr结构体(注:RV1106/RV1103/RV1106B/RV1103B/RK2118不支持该命令)。

<!-- source CN p22 unit 216 -->

示例代码如下:

<!-- source CN p22 unit 217 -->

```c
rknn_tensor_attr cur_output_attrs[io_num.n_output];
memset(cur_output_attrs, 0, io_num.n_output * sizeof(rknn_tensor_attr));
for (uint32_t i = 0; i < io_num.n_output; i++) {
   cur_output_attrs[i].index = i;
   ret = rknn_query(ctx, RKNN_QUERY_CURRENT_OUTPUT_ATTR,
                &(cur_output_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source CN p22 unit 218 -->

#### 7. 查询RKNN模型当前使用的原生输入动态形状

<!-- source CN p22 unit 219 -->

在rknn_set_input_shapes接口调用完毕后,传入RKNN_QUERY_CURRENT_NATIVE_INPUT_ATTR命令可以查询模型当前使用的原生输入属性信息。其中需要先创建rknn_tensor_attr结构体(注:RV1106/RV1103/RV1106B/RV1103B/RK2118不支持该命令)。

<!-- source CN p22 unit 220 -->

示例代码如下:

<!-- source CN p22 unit 221 -->

```c
rknn_tensor_attr cur_input_attrs[io_num.n_input];
memset(cur_input_attrs, 0, io_num.n_input * sizeof(rknn_tensor_attr));
for (uint32_t i = 0; i < io_num.n_input; i++) {
   cur_input_attrs[i].index = i;
   ret = rknn_query(ctx, RKNN_QUERY_CURRENT_NATIVE_INPUT_ATTR,
                &(cur_input_attrs[i]), sizeof(rknn_tensor_attr));
}
```

<!-- source CN p22 unit 222 -->

#### 8. 查询RKNN模型当前使用的原生输出动态形状

<!-- source CN p22 unit 223 -->

在rknn_set_input_shapes接口调用完毕后,传入RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR命令可以查询模型当前使用的原生输出属性信息。其中需要先创建rknn_tensor_attr结构体(注:RV1106/RV1103/RV1106B/RV1103B/RK2118不支持该命令)。

<!-- source CN p22 unit 224 -->

示例代码如下:

<!-- source CN p22 unit 225 -->

```c
rknn_tensor_attr cur_output_attrs[io_num.n_output];
memset(cur_output_attrs, 0, io_num.n_output * sizeof(rknn_tensor_attr));
for (uint32_t i = 0; i < io_num.n_output; i++) {
   cur_output_attrs[i].index = i;
   ret = rknn_query(ctx, RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR,
                &(cur_output_attrs[i]), sizeof(rknn_tensor_attr));
}
```

{% endraw %}

## 来源与校对说明

原始技术章节按用途拆分，代码、标识符和参数保留。中文采用中文原稿；英文、俄文、德文采用对应英文稿。无图章节不添加虚构配图。

原稿保留事项：章节编号与示例输出按原文保留，示例日志可能显示早期 SDK 版本，不代表本文当前软件版本。Runtime 原文直接由第 3 章跳到第 5 章；查询小节序号存在重复。rknn_init 参数表称 extend 当前禁用，但后文列出 user_key/共享权重等字段；查询原生动态输出的说明写 RKNN_QUERY_CURRENT_OUTPUT_ATTR，示例使用 RKNN_QUERY_CURRENT_NATIVE_OUTPUT_ATTR。原文对部分 native NHWC/NC1HWC2 查询描述也存在输入/输出混称。请以实际 V2.5.0 头文件及目标 SDK 核对，不把这些说明当作已验证行为。RK2118 引用文件在原文写为 RKNN3_RK2118_Quick_Start.pdf，当前目录对应 RKNN2 快速入门。

[RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [ArmSoM documentation](https://docs.armsom.org/)
