---
title: "RKNN2 SDK V2.5.0 · Matmul API and matrix layouts"
description: "RKNN2 SDK V2.5.0 · Matmul API and matrix layouts · Complete development guide series"
excerpt: "Matmul API and matrix layouts"
translation_key: "rknn-v250-sdk-guide-matmul"
slug: "rknn-v250-sdk-guide-matmul"
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

**RKNN2 SDK V2.5.0 · 11/22**

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

**Matmul API and matrix layouts**

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

## 4. Advanced Features and Extensions

## 4.1 Advanced Runtime Features

### 4.1.1 Matrix Multiplication API

Matmul API is a separate set of C API provided by Runtime, which is used to run matrix multiplication operations on the NPU (RK2118 / RV1103 series / RV1106 series are not supported yet). Matrix multiplication is an important operation in linear algebra. The operation is defined as follows: C=AB. Where A is an M×K matrix, B is a K×N matrix, and C is an M×N matrix.

#### 4.1.1.1 FEATURES AND USAGE

The Matmul API is mostly used for parameter calculation tasks in deep learning. For example, matrix multiplication is used extensively for computation in the main modules of the currently widely used Transformer model structure (the self-attention mechanism and the feedforward neural network layers), so the efficiency of matrix multiplication is crucial to the overall performance of Transformer models. The Matmul API has the following characteristics:

Efficient: The underlying layer is implemented with RKNPU, offering the advantages of high performance and low power consumption.

Flexible: No need to load an RKNN model. It supports int4, int8 and float16, the three input data types commonly used for edge-side computing, and provides a separate memory allocation interface or a mechanism for using external memory, so users can manage and reuse the input and output memory of the matrices.

#### 4.1.1.2 MATMUL API FLOW CHART

![Source technical figure ](/assets/images/rknn-v250/sdk-guide/en/p090-vector-929.png)

Figure 4-1 The flow chart of basic Matmul API

First, the structures and interfaces of the Matmul API are located in the rknn_matmul_api.h header file, which must be included when compiling the developer's program. The flow of basic Matmul API usage is shown in the figure above.

Using the Matmul API typically involves the following steps:

1. Create the context: set the rknn_matmul_info structure, which contains M, K, N, the data types of the input and output matrices, the data layout used by the input and output matrices, and other information; then, call the rknn_matmul_create interface to initialize the context. After initialization, obtain the rknn_matmul_io_attr structure pointer, which contains the tensor information of the input and output matrices.

2. Specify the NPU core to run on (only valid on chip platforms with a multi-core NPU): call rknn_matmul_set_core_mask and set the mask to specify a certain NPU core to perform the computation. On chip platforms with a multi-core NPU, the default behavior when this interface is not called is to automatically select an idle core.

3. Set the quantization parameters of matrices A, B and C: call rknn_matmul_set_quant_params to pass in the rknn_quant_params structure containing the quantization parameter values of the corresponding matrices. The default behavior when this interface is not called is scale=1.0, zero_point=0 for each matrix.

4. Create input and output memory: call the rknn_create_mem interface to create memory according to the sizes in the input and output matrix tensor information.

5. Fill in the input data: fill in the data of input matrices A and B according to the shape and data type, and set the quantization parameters with the quantized values.

6. Set input and output memory: call rknn_matmul_set_io_mem to record the input matrix filled with data into the context, and the output memory is also recorded into the context. Besides recording the memory addresses, this interface also rearranges the data according to the configured layout, so it must be called after the input data is filled in or updated. This behavior differs from that of the rknn_set_io_mem interface in the zero-copy API.

7. Run the matrix multiplication: after the input and output memory is set up, call rknn_matmul_run to perform the matrix multiplication.

8. Process the output: after the matrix multiplication is performed, read the result from the output memory according to the configured layout.

9. Destroy the resources: after the execution is finished, call rknn_destroy_mem and rknn_matmul_destroy to destroy the memory and context resources respectively.

#### 4.1.1.3 ADVANCED USAGE OF MATMUL API

When creating the context, the user is required to set the rknn_matmul_info structure. rknn_matmul_info represents the specification information used to perform matrix multiplication; it contains the scale of the matrix multiplication, as well as the data types and data layouts of the input and output matrices. Among them, B_layout and AC_layout are used to set the high-performance data layouts. The specific structure definition is shown in the following table:

Table 4-1 Definition of the rknn_matmul_info structure

| Member | Data Type | Description |
| --- | --- | --- |
| M | int32_t | The number of rows of matrix A |
| K | int32_t | The number of columns of matrix A |

| Member | Data Type | Description |
| --- | --- | --- |
| N | int32_t | The number of columns of matrix B |
| type | rknn_matmul_type | The data types of the input and output matrices: RKNN_FLOAT16_MM_FLOAT16_TO_FLOAT32: indicates that matrices A and B are of type float16, and matrix C is of type float32; RKNN_INT8_MM_INT8_TO_INT32: indicates that matrices A and B are of type int8, and matrix C is of type int32; RKNN_INT8_MM_INT8_TO_INT8: indicates that matrices A, B and C are of type int8; RKNN_FLOAT16_MM_FLOAT16_TO_FLOAT16: indicates that matrices A, B and C are of type float16; RKNN_FLOAT16_MM_INT8_TO_FLOAT32: indicates that matrix A is of type float16, matrix B is of type int8, and matrix C is of type float32; RKNN_FLOAT16_MM_INT8_TO_FLOAT16: indicates that matrix A is of type float16, matrix B is of type int8, and matrix C is of type float16; RKNN_FLOAT16_MM_INT4_TO_FLOAT32: indicates that matrix A is of type float16, matrix B is of type int4, and matrix C is of type float32; RKNN_FLOAT16_MM_INT4_TO_FLOAT16: indicates that matrix A is of type float16, matrix B is of type int4, and matrix C is of type float16; RKNN_INT8_MM_INT8_TO_FLOAT32: indicates that matrices A and B are of type int8, and matrix C is of type float32; RKNN_INT4_MM_INT4_TO_INT16: indicates that matrices A and B are of type int4, and matrix C is of type int16; RKNN_INT8_MM_INT4_TO_INT32: indicates that matrix A is of type int8, matrix B is of type int4, and matrix C is of type int32 |
| B_layout | int16_t | The data layout of matrix B. RKNN_MM_LAYOUT_NORM: indicates that matrix B is arranged in its original shape, i.e., the KxN shape; RKNN_MM_LAYOUT_NATIVE: indicates that matrix B is arranged in a high-performance shape; RKNN_MM_LAYOUT_TP_NORM: indicates that matrix B is arranged in the shape after Transpose, i.e., the NxK shape |
| B_quant_type | int16_t | The quantization type of matrix B. RKNN_QUANT_TYPE_PER_LAYER_SYM: indicates that matrix B is symmetrically quantized in the Per-Layer manner; RKNN_QUANT_TYPE_PER_LAYER_ASYM: indicates that matrix B is asymmetrically quantized in the Per-Layer manner; RKNN_QUANT_TYPE_PER_CHANNEL_SYM: indicates that matrix B is symmetrically quantized in the Per-Channel manner; RKNN_QUANT_TYPE_PER_CHANNEL_ASYM: indicates that matrix B is asymmetrically quantized in the Per-Channel manner; RKNN_QUANT_TYPE_PER_GROUP_SYM: indicates that matrix B is symmetrically quantized in the Per-Group manner; RKNN_QUANT_TYPE_PER_GROUP_ASYM: indicates that matrix B is asymmetrically quantized in the Per-Group manner |

| Member | Data Type | Description |
| --- | --- | --- |
| AC_layout | int16_t | The data layout of matrices A and C. RKNN_MM_LAYOUT_NORM: indicates that matrices A and C are arranged in their original shapes; RKNN_MM_LAYOUT_NATIVE: indicates that matrices A and C are arranged in high-performance shapes; For a detailed description of the layouts, please refer to 4.1.1.4 High-Performance Data Layouts |
| AC_quant_type | int16_t | The quantization type of matrices A and C. RKNN_QUANT_TYPE_PER_LAYER_SYM: indicates that matrices A and C are symmetrically quantized in the Per-Layer manner; RKNN_QUANT_TYPE_PER_LAYER_ASYM: indicates that matrices A and C are asymmetrically quantized in the Per-Layer manner |
| iommu_domain_id | int32_t | The index of the IOMMU address space domain where the matrix context resides. IOMMU address spaces correspond to contexts one-to-one, and each IOMMU address space is 4GB in size. This parameter is mainly used when the specifications of matrices A, B and C are large, and the memory allocated by the NPU in a domain exceeds 4GB and another domain needs to be switched to. |
| group_size | int16_t | The number of elements in a group. It takes effect only after group quantization is enabled. |
| reserved | int8_t[] | Reserved field |

Among them, the original shape of matrix A is MxK, the original shape of matrix B is KxN, and the original shape of matrix C is MxN.

##### 4.1.1.3.1 Matrix multiplication with specified quantization parameters

If the high-bit data of the matrix product needs to be quantized into low-bit data according to the quantization parameters, for example, matrices A and B are of type int8 and matrix C is of type int8, the quantization parameters of the matrices need to be set. The quantization parameters consist of scale and zero_point, represented by the rknn_quant_params structure. The quantization parameters of matrices A and C are set through the rknn_matmul_set_quant_params interface. After the quantization parameters are set successfully, the quantization parameters of matrix B in Per-Channel quantization mode can be read through the rknn_matmul_get_quant_params interface. The definition of the rknn_quant_params data structure is shown in the following table:

Table 4-2 Definition of the rknn_quant_params structure

| Member | Data Type | Description |
| --- | --- | --- |
| name | char[] | The name of the matrix |
| scale | float* | The first address of the quantization parameter scale array |
| scale_len | int32_t | The length of the quantization parameter scale array |
| zp | int32_t* | The first address of the quantization parameter zero_point array |
| zp_len | int32_t | The length of the quantization parameter zero_point array |

Matmul supports three quantization methods: Per-Layer, Per-Channel and Per-Group, and the differences of the quantization parameters are as follows:

Per-Layer method: the length of the scale and zp arrays is 1.

Per-Channel method: the length of the scale and zp arrays is N.

Per-Group method: the length of the scale and zp arrays is N*K/group_size. The number of elements in each group is specified by group_size, and elements in the same group share the same quantization parameters. In terms of the storage order of the quantization parameter arrays, the quantization parameters of K/group_size groups are stored first, and then N quantization parameters are stored.

Each quantization method can be either symmetric quantization or asymmetric quantization: symmetric quantization means that zp is all 0, and asymmetric quantization means that zp is not all 0.

##### 4.1.1.3.2 Matrix multiplication of dynamic shape input

![Source technical figure ](/assets/images/rknn-v250/sdk-guide/en/p095-vector-973.png)

Figure 4-2 Matmul API calling process for dynamic shape input

The flow of Matmul API usage for dynamic shape input is shown in the figure above. The differences between using the dynamic shape Matmul API and the basic Matmul API are as follows:

1. Create the context: configure the number of shapes and the required shapes, and set the rknn_matmul_info structure, which contains the data types of the input and output matrices, the data layout used by the input and output matrices, and other information. Note that M, K and N in the dynamic shape Matmul interface parameter rknn_matmul_info do not need to be set. Then, call the rknn_matmul_create_dynamic_shape interface to initialize the context. After initialization, obtain the rknn_matmul_io_attr structure array, which contains the input and output matrix tensor information under all shape configurations.

2. Create input and output memory: first obtain the maximum tensor size from the rknn_matmul_io_attr structure array, then call the rknn_create_mem interface to create memory using the maximum input and output matrix tensor sizes.

3. Set the input shape: by calling the rknn_matmul_set_dynamic_shape interface and passing in the rknn_matmul_shape pointer, set the shape used in the current inference process.

4. Set input and output memory: call rknn_matmul_set_io_mem to record the input matrix filled with data into the context, and the output memory is also recorded into the context. The passed-in rknn_tensor_mem parameter is the input and output memory of the maximum size created previously, and the rknn_matmul_tensor_attr parameter is the matrix attribute information corresponding to the current shape.

#### 4.1.1.4 THE DATA LAYOUT FOR HIGH-PERFORMANCE

Since the NPU is a dedicated hardware architecture, reading data in original shapes such as MxK and KxN is not the most efficient; likewise, writing the C matrix in the MxN shape is not the most efficient either. Users can achieve higher performance by using special data layouts. The AC_layout parameter controls whether matrices A and C use the high-performance data layout, and the B_layout parameter controls whether matrix B uses the high- performance data layout. Assume that the original shape of matrix A is MxK, the original shape of matrix B is KxN, and the original shape of matrix C is MxN. The required data layouts are as follows:

1. If AC_layout=RKNN_MM_LAYOUT_NORM and B_layout=RKNN_MM_LAYOUT_NORM, the shape of matrix A is [M,K], the shape of matrix B is [K,N], and the shape of matrix C is [M,N].

2. If AC_layout=RKNN_MM_LAYOUT_NATIVE and B_layout=RKNN_MM_LAYOUT_NATIVE, the high-performance data layouts of matrices A, B and C under different chip platforms and data types are shown in the following table (the division results in the table are all rounded up, and the extra parts are padded with 0):

3. The difference between B_layout=RKNN_MM_LAYOUT_NORM and B_layout=RKNN_MM_LAYOUT_TP_NORM is that in the former, matrix B is in the shape of [K,N], while in the latter, matrix B is in the shape of [N,K]; the latter offers better execution efficiency.

Table 4-3 High-performance shapes of matrices A, B and C on each chip platform

|  | RK3562 | RK3566/RK3568 | RK3576/RV1126B | RK3588 |
| --- | --- | --- | --- | --- |
| A shape (int4) | not supported yet | not supported yet | [K/32,M,32] | [K/32,M,32] |
| B shape (int4) | not supported yet | not supported yet | [N/64,K/32,64,32]* | [N/64,K/32,64,32] |
| C shape (int16) | not supported yet | not supported yet | [N/8,M,8] | [N/8,M,8] |
| A shape (int8) | [K/16,M,16] | [K/8,M,8] | [K/16,M,16] | [K/16,M,16] |
| B shape (int8) | [N/16,K/32,16,32] | [N/16,K/32,16,32] | [N/32,K/32,32,32]* | [N/32,K/32,32,32] |
| C shape (int32) | [N/4,M,4] | [N/4,M,4] | [N/4,M,4] | [N/4,M,4] |
| A shape (float16) | [K/8,M,8] | [K/4,M,4] | [K/8,M,8] | [K/8,M,8] |
| B shape (float16) | [N/8,K/32,8,32] | [N/8,K/16,8,16] | [N/16,K/32,16,32] | [N/16,K/32,16,32] |
| C shape (float32) | [N/4,M,4] | [N/4,M,4] | [N/4,M,4] | [N/4,M,4] |

[!NOTE]

The data layouts in the table above are the high-performance shapes for the "same-type" case of A and B (i.e., A and B have the same data type). RK3576/RV1126B supports "heterogeneous" inputs, i.e., A and B are allowed to have different data types. In the "heterogeneous" input case, the high-performance data layout of B is the same as the shape of B in the "same-type" case corresponding to the type of C. For example, if A is of type int4, B is of type float16, and C is of type float32, then the high-performance data layout of B is [N/16,K/32,16,32]. The rknn_B_normal_layout_to_native_layout interface provides the functionality of converting the original shape of B into the high-performance layout.

Taking the RK3566/RK3568 platform and the int8 data type as an example, the element correspondence of matrix A transformed from [M,K] to [K/8,M,8] is shown in the figure below:

![Source technical figure ](/assets/images/rknn-v250/sdk-guide/en/p097-vector-1012.png)

Figure 4-3 The element correspondence diagram of int8 type matrix A transformed from [M,K] to [K/8,M,8]

In the figure, the data corresponding to the (i,j)-th element of matrix A is Di,j; the left figure is a matrix with shape=[M,K], and each small matrix in the right figure has shape=[M,8], K/8 of them from top to bottom.

The example code for converting matrix A or C from the original shape to the high-performance shape is as follows:

```text
template <typename Ti, typename To>
void norm_layout_to_perf_layout(Ti *src, To *dst, int32_t M, int32_t K, int32_t
subK){
    int outter_size = (int)std::ceil(K * 1.0f / subK);
    for (int i = 0; i < outter_size; i++)
    {
        for (int m = 0; m < M; m++)
        {
           for (int j = 0; j < subK; j++)
           {
               int ki = i * subK + j;
               if (ki >= K)
               {
                 dst[i * M * subK + m * subK + j] = 0;
               }
               else
               {
                 dst[i * M * subK + m * subK + j] = src[m * K + ki];
               }
           }
        }
    }
}
```

Taking the RK3566/RK3568 platform and the int8 data type as an example, the element correspondence of matrix B transformed from [K,N] to [N/16,K/32,16,32] is shown in the figure below:

![Source technical figure ](/assets/images/rknn-v250/sdk-guide/en/p099-vector-1026.png)

Figure 4-4 The element correspondence diagram of the int8 type matrix B transformed from [K, N] to [N/16, K/32, 16, 32]

In the figure, the data corresponding to the (i,j)-th element of matrix B is Di,j; the left figure is a matrix with shape=[K,N], and each small cube in the right figure has shape=[K/32,16,32], N/16 of them from top to bottom.

The example code for converting matrix B from the original shape to the high-performance shape is as follows:

```text
template <typename Ti, typename To>
voi norm_layout_to_native_layout(Ti *src, To *dst, int32_t K, int32_t N, int32_t
subN, int32_t subK)
{
    int N_remain = (int)std::ceil(N * 1.0f / subN);
    int K_remain = (int)std::ceil(K * 1.0f / subK);
    for (int i = 0; i < N_remain; i++)
    {
        for (int j = 0; j < K_remain; j++)
        {
           for (int n = 0; n < subN; n++)
           {
               int ni = i * subN + n;
               for (int k = 0; k < subK; k++)
               {
                   int ki = j * subK + k;
                   if (ki < K && ni < N)
                   {
                       dst[((i * K_remain + j) * subN + n) * subK + k] = src[ki * N + ni];
                   }
                   else
                   {
                       dst[((i * K_remain + j) * subN + n) * subK + k] = 0;
                   }
               }
           }
        }
    }
}
```

[!NOTE]

For the complete Matmul API example code, see https://github.com/airockchip/rknn-toolkit2/tree/master/rknpu2/examples/rknn_matmul_api_demo.

##### 4.1.1.4.1 Matrix specification restrictions

The Matmul API is implemented based on the NPU hardware architecture and is subject to hardware specifications. It has the following restrictions on the parameters:

AC_layout and B_layout can be set independently. AC_layout and B_layout support RKNN_MM_LAYOUT_NORM or RKNN_MM_LAYOUT_TP_NORM on all hardware platforms; except for the RK3566/RK3568 platform, all other platforms support RKNN_MM_LAYOUT_TP_NORM.

The Matmul interface supports a variety of input and output data bit widths. The matrix data type combinations currently supported by each platform are shown in the following table:

Table 4-4 Data type combinations of matrices A, B and C supported by the Matmul interface

| Serial number | RK356X | RK3576/RV1126B | RK3588 |
| --- | --- | --- | --- |
| 1 | RKNN_INT8_MM_INT8_TO_INT32 | RKNN_FLOAT16_MM_FLOAT16_TO_FLOAT16 | RKNN_FLOAT16_MM_FLOAT16_TO_FLOAT16 |
| 2 | RKNN_FLOAT16_MM_FLOAT16_TO_FLOAT32 | RKNN_FLOAT16_MM_FLOAT16_TO_FLOAT32 | RKNN_FLOAT16_MM_FLOAT16_TO_FLOAT32 |
| 3 |  | RKNN_INT8_MM_INT8_TO_INT32 | RKNN_INT8_MM_INT8_TO_INT32 |
| 4 |  | RKNN_FLOAT16_MM_INT8_TO_FLOAT32 | RKNN_INT8_MM_INT8_TO_FLOAT32 |
| 5 |  | RKNN_FLOAT16_MM_INT4_TO_FLOAT16 | RKNN_INT8_MM_INT8_TO_INT8 |
| 6 |  | RKNN_FLOAT16_MM_INT4_TO_FLOAT32 | RKNN_INT4_MM_INT4_TO_INT16 |
| 7 |  | RKNN_INT8_MM_INT4_TO_INT32 |  |

Where RK356X refers to platforms such as RK3562/RK3566/RK3568. The float16 floating-point format follows the IEEE-754 standard; for the specific format, please refer to IEEE-754 half.

The size restrictions of K and N in Matmul are as follows:

Table 4-5 Size restrictions of K and N on each chip platform

|  | RK3562 | RK3566/RK3568 | RK3576/RV1126B | RK3588 |
| --- | --- | --- | --- | --- |
| K size limit (int4) | not supported yet | not supported yet | * | 32-aligned |
| K size limit (int8) | K &lt;= 10240 and K mod 32 = 0 | K &lt;= 10240 and K mod 32 = 0 | 32-aligned | 32-aligned |
| K size limit (float16) | K &lt;= 10240 and K mod 32 = 0 | K &lt;= 10240 and K mod 32 = 0 | 32-aligned | 32-aligned |
| N size limit (int4) | not supported yet | not supported yet | * | N &lt;= 8192 and N mod 64 = 0 |
| N size limit (int8) | N &lt;= 4096 and N mod 16 = 0 | N &lt;= 4096 and N mod 16 = 0 | N &lt;= 4096 and N mod 32 = 0 | N &lt;= 4096 and N mod 32 = 0 |
| N size limit (float16) | N &lt;= 4096 and N mod 16 = 0 | N &lt;= 4096 and N mod 16 = 0 | N &lt;= 4096 and N mod 32 = 0 | N &lt;= 4096 and N mod 32 = 0 |

[!NOTE]

* indicates that the size and alignment restrictions are the same as those of B corresponding to the data type of A on the same platform. For example, the size and alignment restrictions of B for the RKNN_FLOAT16_MM_INT4_TO_FLOAT32 combination type are the same as those for the RKNN_FLOAT16_MM_FLOAT16_TO_FLOAT32 combination.

For RK3588:

When K &gt; 8192, B will be split into T segments,

```text
int T = std::ceil(K / 8192);
```

For example: normal layout -&gt; native layout, K = 20488, N = 4096, T = 3, the data will be split into 3 segments,

```text
subN = rknn_matmul_io_attr.B.dims[2];
subK = rknn_matmul_io_attr.B.dims[3];
```

The transformation process of K,N is as follows:

```text
                     (8196, 4096) (4096 / subN, 8196 / subK, subN, subK)
 (K, N) = (20488, 4096)->(8196, 4096)->(4096 / subN, 8196 / subK, subN, subK)
         normal layout (4096, 4096) (4096 / subN, 4096 / subK, subN, subK)
                   T normal layout T native layout
```

It is recommended to use the rknn_B_normal_layout_to_native_layout interface for direct data conversion.

For RK3576/RV1126B: When K &gt; 4096, B will be split into T segments,

```text
int T = std::ceil(K / 4096);
```

For example: normal layout -&gt; native layout, K = 10240, N = 2048, T = 3, the data will be split into 3 segments,

```text
subN = rknn_matmul_io_attr.B.dims[2];
subK = rknn_matmul_io_attr.B.dims[3];
```

The transformation process of K,N is as follows:

```text
                        (4096, 2048) (2048 / subN, 4096 / subK, subN, subK)
(K, N) = (10240, 2048) -> (4096, 2048) -> (2048 / subN, 4096 / subK, subN, subK)
        normal layout (2048, 2048) (2048 / subN, 2048 / subK, subN, subK)
                     T normal layout T native layout
```

It is recommended to use the rknn_B_normal_layout_to_native_layout interface for direct data conversion.

{% endraw %}
