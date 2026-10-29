---
title: "RKNN2 V2.5.0 · Model I/O, alignment and convolution limits"
description: "RKNN2 V2.5.0 · Model I/O, alignment and convolution limits · Complete operator parameters and constraints from the V2.5.0 source."
excerpt: "RKNN2 V2.5.0 · Model I/O, alignment and convolution limits · Complete operator parameters and constraints from the V2.5.0 source."
translation_key: "rknn-v250-operators-model-io"
slug: "rknn-v250-operators-model-io"
lang: "en"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "NPU", "V2.5.0", "RKNN2"]
---

This RKNN2 V2.5.0 platform reference helps ArmSoM developers select and adapt models. It does not establish support on every ArmSoM board: verify the board SoC, actual Toolkit2, Runtime, NPU driver and BSP versions. The source specifies no universal Linux kernel version. No ArmSoM hardware validation was performed.

Source: the supplied Chinese and English RKNN2 Supported Operators and Constraints Reference V2.5.0, 374 and 384 pages respectively. Chinese follows the Chinese edition; English, Russian and German follow the English edition. Platform constraints remain separate. The English PDF itself contains Chinese I/O figures and output tables; their provenance is retained with editable localized tables. Source spellings such as ConvTranpose and the original LSTM/GRU equations are preserved; these equations are not corrections to SDK implementations.

Source pages: CN 368–374; EN 378–384.

[Rockchip RKNN2](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

<details markdown="1">
<summary>Operator reference series</summary>

[RKNN2 V2.5.0 · RK3566/RK3568：Basics and convolution](/articles/rknn-v250-operators-rk3566-rk3568-convolution/)

[RKNN2 V2.5.0 · RK3566/RK3568：Recurrent networks, arithmetic and pooling](/articles/rknn-v250-operators-rk3566-rk3568-recurrent-pooling/)

[RKNN2 V2.5.0 · RK3566/RK3568：Shapes, slicing and transpose](/articles/rknn-v250-operators-rk3566-rk3568-shape-indexing/)

[RKNN2 V2.5.0 · RK3566/RK3568：Activations, normalization and extensions](/articles/rknn-v250-operators-rk3566-rk3568-activations-extensions/)

[RKNN2 V2.5.0 · RK3588：Basics and convolution](/articles/rknn-v250-operators-rk3588-convolution/)

[RKNN2 V2.5.0 · RK3588：Recurrent networks, arithmetic and pooling](/articles/rknn-v250-operators-rk3588-recurrent-pooling/)

[RKNN2 V2.5.0 · RK3588：Shapes, slicing and transpose](/articles/rknn-v250-operators-rk3588-shape-indexing/)

[RKNN2 V2.5.0 · RK3588：Activations, normalization and extensions](/articles/rknn-v250-operators-rk3588-activations-extensions/)

[RKNN2 V2.5.0 · RK3562：Basics and convolution](/articles/rknn-v250-operators-rk3562-convolution/)

[RKNN2 V2.5.0 · RK3562：Recurrent networks, arithmetic and pooling](/articles/rknn-v250-operators-rk3562-recurrent-pooling/)

[RKNN2 V2.5.0 · RK3562：Shapes, slicing and transpose](/articles/rknn-v250-operators-rk3562-shape-indexing/)

[RKNN2 V2.5.0 · RK3562：Activations, normalization and extensions](/articles/rknn-v250-operators-rk3562-activations-extensions/)

[RKNN2 V2.5.0 · RV1103/RV1106：Basics and convolution](/articles/rknn-v250-operators-rv1103-rv1106-convolution/)

[RKNN2 V2.5.0 · RV1103/RV1106：Recurrent networks, arithmetic and pooling](/articles/rknn-v250-operators-rv1103-rv1106-recurrent-pooling/)

[RKNN2 V2.5.0 · RV1103/RV1106：Shapes, slicing and transpose](/articles/rknn-v250-operators-rv1103-rv1106-shape-indexing/)

[RKNN2 V2.5.0 · RV1103/RV1106：Activations, normalization and extensions](/articles/rknn-v250-operators-rv1103-rv1106-activations-extensions/)

[RKNN2 V2.5.0 · RK3576/RV1126B：Basics and convolution](/articles/rknn-v250-operators-rk3576-rv1126b-convolution/)

[RKNN2 V2.5.0 · RK3576/RV1126B：Recurrent networks, arithmetic and pooling](/articles/rknn-v250-operators-rk3576-rv1126b-recurrent-pooling/)

[RKNN2 V2.5.0 · RK3576/RV1126B：Shapes, slicing and transpose](/articles/rknn-v250-operators-rk3576-rv1126b-shape-indexing/)

[RKNN2 V2.5.0 · RK3576/RV1126B：Activations, normalization and extensions](/articles/rknn-v250-operators-rk3576-rv1126b-activations-extensions/)

[RKNN2 V2.5.0 · RK2118：Basics and convolution](/articles/rknn-v250-operators-rk2118-convolution/)

[RKNN2 V2.5.0 · RK2118：Recurrent networks, arithmetic and pooling](/articles/rknn-v250-operators-rk2118-recurrent-pooling/)

[RKNN2 V2.5.0 · RK2118：Shapes, slicing and transpose](/articles/rknn-v250-operators-rk2118-shape-indexing/)

[RKNN2 V2.5.0 · RK2118：Activations, normalization and extensions](/articles/rknn-v250-operators-rk2118-activations-extensions/)

[RKNN2 V2.5.0 · RV1103B/RV1106B：Basics and convolution](/articles/rknn-v250-operators-rv1103b-rv1106b-convolution/)

[RKNN2 V2.5.0 · RV1103B/RV1106B：Recurrent networks, arithmetic and pooling](/articles/rknn-v250-operators-rv1103b-rv1106b-recurrent-pooling/)

[RKNN2 V2.5.0 · RV1103B/RV1106B：Shapes, slicing and transpose](/articles/rknn-v250-operators-rv1103b-rv1106b-shape-indexing/)

[RKNN2 V2.5.0 · RV1103B/RV1106B：Activations, normalization and extensions](/articles/rknn-v250-operators-rv1103b-rv1106b-activations-extensions/)

[RKNN2 V2.5.0 · CPU operator support and constraints](/articles/rknn-v250-operators-cpu/)

[RKNN2 V2.5.0 · GPU operator support and constraints](/articles/rknn-v250-operators-gpu/)

**RKNN2 V2.5.0 · Model I/O, alignment and convolution limits**

</details>

{% raw %}

## Model I/O Limitations

## Model Input Limitations

1. The alignment constraints apply only to the zero-copy API; the normal API has no such constraints.

2. The input width alignment requirement can be queried from the w\_stride attribute of the zero-copy API. Note: w\_stride cannot be changed.

3. Only the input width has alignment requirements under different channel conditions; there are no other constraints.

4. If mean and scale are not needed for the input, set mean to 0 and scale to 1.

5. If channel &gt; 4, mean/scale uniformly use the first value, i.e., mean\[0\] and scale\[0\].

6. If the first layer is floating-point type, there is no quant operation.

7. RV1106/RV1103/RV1103B do not support CPU mean/scale/quant operations.

8. For detailed usage, refer to "Rockchip\_RKNPU\_User\_Guide\_RKNN\_SDK".

## RK3566/RK3568

![Model-input constraints from the source PDF](/assets/images/rknn-v250/operators/en/p378-figure-01.png)

Editable transcription of the original (merged cells expanded):

| Platform | First-layer precision | Input dimensions | Configured first-layer input type | mean/scale/quant backend | width alignment (elements), channel=1,3,4 | width alignment (elements), channel≠1,3,4 | width limits, channel=1,3,4 | width limits, channel≠1,3,4 |
|---|---|---|---|---|---|---|---|---|
| RK3566/RK3568 | int8 | 4 | uint8 | NPU | 8 | 1 | A | Unrestricted |
| RK3566/RK3568 | int8 | 4 | int8 | NPU | 8 | 1 | A | Unrestricted |
| RK3566/RK3568 | int8 | 4 | float16 | CPU | 8 | 1 | A | Unrestricted |
| RK3566/RK3568 | int8 | 4 | Other types (input alignment may change) | CPU | 8 | 1 | A | Unrestricted |
| RK3566/RK3568 | float16 | 4 | uint8 | CPU | 4 | 1 | B | Unrestricted |
| RK3566/RK3568 | float16 | 4 | int8 | CPU | 4 | 1 | B | Unrestricted |
| RK3566/RK3568 | float16 | 4 | float16 | CPU | 4 | 1 | B | Unrestricted |
| RK3566/RK3568 | float16 | 4 | Other types (input alignment may change) | CPU | 4 | 1 | B | Unrestricted |
| RK3566/RK3568 | Unrestricted | Not 4-dimensional | Unrestricted | CPU | 1 | 1 | Unrestricted | Unrestricted |

For each convolution type, width/kernel_h/kernel_w must satisfy both conditions below. N must be an integer from 1 to 7; convolutions outside that range are unsupported. N is computed below. The image spells dilation_kernel_h/w differently from dilated_kernel_h/w in the last chapter; the image spelling is preserved.

| Condition | Formula |
|---|---|
| A (1) | width \* dilation\_kernel\_h &lt; 1024 \* N |
| A (2) | width &lt;= 4096 |
| A / Convolution | N = 8 - CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128) |
| A / Depthwise Convolution | N = 8 - CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 4096) |
| A / ConvTranspose/Deconvolution | N = 8 - CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128) |

| Condition | Formula |
|---|---|
| B (1) | width \* dilation\_kernel\_h &lt; 1024 \* N |
| B (2) | width &lt;= 4096 |
| B / Convolution | N = 8 - CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128) |
| B / Depthwise Convolution | N = 8 - CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 4096) |
| B / ConvTranspose/Deconvolution | N = 8 - CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128) |

## RK3588

![Model-input constraints from the source PDF](/assets/images/rknn-v250/operators/en/p379-figure-01.png)

Editable transcription of the original (merged cells expanded):

| Platform | First-layer precision | Input dimensions | Configured first-layer input type | mean/scale/quant backend | width alignment (elements), channel=1,3,4 | width alignment (elements), channel≠1,3,4 | width limits, channel=1,3,4 | width limits, channel≠1,3,4 |
|---|---|---|---|---|---|---|---|---|
| RK3588 | int8 | 4 | uint8 | NPU | 16 | 1 | A | Unrestricted |
| RK3588 | int8 | 4 | int8 | NPU | 16 | 1 | A | Unrestricted |
| RK3588 | int8 | 4 | float16 | CPU | 16 | 1 | A | Unrestricted |
| RK3588 | int8 | 4 | Other types (input alignment may change) | CPU | 16 | 1 | A | Unrestricted |
| RK3588 | float16 | 4 | uint8 | CPU | 8 | 1 | B | Unrestricted |
| RK3588 | float16 | 4 | int8 | CPU | 8 | 1 | B | Unrestricted |
| RK3588 | float16 | 4 | float16 | CPU | 8 | 1 | B | Unrestricted |
| RK3588 | float16 | 4 | Other types (input alignment may change) | CPU | 8 | 1 | B | Unrestricted |
| RK3588 | Unrestricted | Not 4-dimensional | Unrestricted | CPU | 1 | 1 | Unrestricted | Unrestricted |

For each convolution type, width/kernel_h/kernel_w must satisfy both conditions below. N must be an integer from 1 to 7; convolutions outside that range are unsupported. N is computed below. The image spells dilation_kernel_h/w differently from dilated_kernel_h/w in the last chapter; the image spelling is preserved.

| Condition | Formula |
|---|---|
| A (1) | width \* dilation\_kernel\_h &lt;= 2048 \* N |
| A (2) | width &lt;= 8192 |
| A / Convolution | N = 12 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 3) |
| A / Depthwise Convolution | N = 12 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 2048), 3) |
| A / ConvTranspose/Deconvolution | N = 12 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 3) |

| Condition | Formula |
|---|---|
| B (1) | width \* dilation\_kernel\_h &lt;= 1024 \* N |
| B (2) | width &lt;= 8192 |
| B / Convolution | N = 12 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 3) |
| B / Depthwise Convolution | N = 12 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 2048), 3) |
| B / ConvTranspose/Deconvolution | N = 12 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 3) |

## RV1103/RV1106

![Model-input constraints from the source PDF](/assets/images/rknn-v250/operators/en/p379-figure-02.png)

Editable transcription of the original (merged cells expanded):

| Platform | First-layer precision | Input dimensions | Configured first-layer input type | mean/scale/quant backend | width alignment (elements), channel=1,3,4 | width alignment (elements), channel≠1,3,4 | width limits, channel=1,3,4 | width limits, channel≠1,3,4 |
|---|---|---|---|---|---|---|---|---|
| RV1103/RV1106 | int8 | 4 | uint8 | NPU | 16 | 1 | A | Unrestricted |

For each convolution type, width/kernel_h/kernel_w must satisfy both conditions below. N must be an integer from 1 to 7; convolutions outside that range are unsupported. N is computed below. The image spells dilation_kernel_h/w differently from dilated_kernel_h/w in the last chapter; the image spelling is preserved.

| Condition | Formula |
|---|---|
| A (1) | width \* dilation\_kernel\_h &lt;= 2048 \* N |
| A (2) | width &lt;= 4096 |
| A / Convolution | N = 8 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 2) |
| A / Depthwise Convolution | N = 8 - CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 4096) |
| A / ConvTranspose/Deconvolution | N = 8 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 2) |

> The original header refers to note 9, but the supplied input notes list only 1–8. Note 9 was not found and is not invented.

## RK3562

![Model-input constraints from the source PDF](/assets/images/rknn-v250/operators/en/p380-figure-01.png)

Editable transcription of the original (merged cells expanded):

| Platform | First-layer precision | Input dimensions | Configured first-layer input type | mean/scale/quant backend | width alignment (elements), channel=1,3,4 | width alignment (elements), channel≠1,3,4 | width limits, channel=1,3,4 | width limits, channel≠1,3,4 |
|---|---|---|---|---|---|---|---|---|
| RK3562 | int8 | 4 | uint8 | NPU | 16 | 1 | A | Unrestricted |
| RK3562 | int8 | 4 | int8 | NPU | 16 | 1 | A | Unrestricted |
| RK3562 | int8 | 4 | float16 | CPU | 16 | 1 | A | Unrestricted |
| RK3562 | int8 | 4 | Other types (input alignment may change) | CPU | 16 | 1 | A | Unrestricted |
| RK3562 | float16 | 4 | uint8 | CPU | 8 | 1 | B | Unrestricted |
| RK3562 | float16 | 4 | int8 | CPU | 8 | 1 | B | Unrestricted |
| RK3562 | float16 | 4 | float16 | CPU | 8 | 1 | B | Unrestricted |
| RK3562 | float16 | 4 | Other types (input alignment may change) | CPU | 8 | 1 | B | Unrestricted |
| RK3562 | Unrestricted | Not 4-dimensional | Unrestricted | CPU | 1 | 1 | Unrestricted | Unrestricted |

For each convolution type, width/kernel_h/kernel_w must satisfy both conditions below. N must be an integer from 1 to 7; convolutions outside that range are unsupported. N is computed below. The image spells dilation_kernel_h/w differently from dilated_kernel_h/w in the last chapter; the image spelling is preserved.

| Condition | Formula |
|---|---|
| A (1) | width \* dilation\_kernel\_h &lt;= 2048 \* N |
| A (2) | width &lt;= 4096 |
| A / Convolution | N = 8 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 2) |
| A / Depthwise Convolution | N = 8 - CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 4096) |
| A / ConvTranspose/Deconvolution | N = 8 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 2) |

| Condition | Formula |
|---|---|
| B (1) | width \* dilation\_kernel\_h &lt;= 2048 \* N |
| B (2) | width &lt;= 4096 |
| B / Convolution | N = 8 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 2) |
| B / Depthwise Convolution | N = 8 - CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 4096) |
| B / ConvTranspose/Deconvolution | N = 8 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 2) |

## RK3576/RV1126B

![Model-input constraints from the source PDF](/assets/images/rknn-v250/operators/en/p380-figure-02.png)

Editable transcription of the original (merged cells expanded):

| Platform | First-layer precision | Input dimensions | Configured first-layer input type | mean/scale/quant backend | width alignment (elements), channel=1,3,4 | width alignment (elements), channel≠1,3,4 | width limits, channel=1,3,4 | width limits, channel≠1,3,4 |
|---|---|---|---|---|---|---|---|---|
| RK3576/RV1126B | int8 | 4 | uint8 | NPU | 16 | 1 | A | Unrestricted |
| RK3576/RV1126B | int8 | 4 | int8 | NPU | 16 | 1 | A | Unrestricted |
| RK3576/RV1126B | int8 | 4 | float16 | CPU | 16 | 1 | A | Unrestricted |
| RK3576/RV1126B | int8 | 4 | Other types (input alignment may change) | CPU | 16 | 1 | A | Unrestricted |
| RK3576/RV1126B | float16 | 4 | uint8 | CPU | 8 | 1 | B | Unrestricted |
| RK3576/RV1126B | float16 | 4 | int8 | CPU | 8 | 1 | B | Unrestricted |
| RK3576/RV1126B | float16 | 4 | float16 | CPU | 8 | 1 | B | Unrestricted |
| RK3576/RV1126B | float16 | 4 | Other types (input alignment may change) | CPU | 8 | 1 | B | Unrestricted |
| RK3576/RV1126B | Unrestricted | Not 4-dimensional | Unrestricted | CPU | 1 | 1 | Unrestricted | Unrestricted |

For each convolution type, width/kernel_h/kernel_w must satisfy both conditions below. N must be an integer from 1 to 7; convolutions outside that range are unsupported. N is computed below. The image spells dilation_kernel_h/w differently from dilated_kernel_h/w in the last chapter; the image spelling is preserved.

| Condition | Formula |
|---|---|
| A (1) | width \* dilation\_kernel\_h &lt;= 2048 \* N |
| A (2) | width &lt;= 4096 |
| A / Convolution | N = 8 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 2) |
| A / Depthwise Convolution | N = 8 - CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 2048) |
| A / ConvTranspose/Deconvolution | N = 8 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 2) |

| Condition | Formula |
|---|---|
| B (1) | width \* dilation\_kernel\_h &lt;= 2048 \* N |
| B (2) | width &lt;= 4096 |
| B / Convolution | N = 8 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 2) |
| B / Depthwise Convolution | N = 8 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 2048), 3) |
| B / ConvTranspose/Deconvolution | N = 12 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 2) |

## RK2118

![Model-input constraints from the source PDF](/assets/images/rknn-v250/operators/en/p381-figure-01.png)

Editable transcription of the original (merged cells expanded):

| Platform | First-layer precision | Input dimensions | Configured first-layer input type | mean/scale/quant backend | width alignment (elements), channel=1,3,4 | width alignment (elements), channel≠1,3,4 | width limits, channel=1,3,4 | width limits, channel≠1,3,4 |
|---|---|---|---|---|---|---|---|---|
| RK2118 | float16 | 4 | float16 | CPU | 4 | 1 | A | Unrestricted |
| RK2118 | float16 | Not 4-dimensional | float16 | CPU | 1 | 1 | A | Unrestricted |

For each convolution type, width/kernel_h/kernel_w must satisfy both conditions below. N must be an integer from 1 to 7; convolutions outside that range are unsupported. N is computed below. The image spells dilation_kernel_h/w differently from dilated_kernel_h/w in the last chapter; the image spelling is preserved.

| Condition | Formula |
|---|---|
| A (1) | width \* dilation\_kernel\_h &lt;= 2048 \* N |
| A (2) | width &lt;= 4096 |
| A / Convolution | N = 8 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 2) |
| A / Depthwise Convolution | N = 8 - CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 4096) |
| A / ConvTranspose/Deconvolution | N = 8 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 2) |

## RV1103B

![Model-input constraints from the source PDF](/assets/images/rknn-v250/operators/en/p381-figure-02.png)

Editable transcription of the original (merged cells expanded):

| Platform | First-layer precision | Input dimensions | Configured first-layer input type | mean/scale/quant backend | width alignment (elements), channel=1,3,4 | width alignment (elements), channel≠1,3,4 | width limits, channel=1,3,4 | width limits, channel≠1,3,4 |
|---|---|---|---|---|---|---|---|---|
| RV1103B/RV1106B | int8 | 4 | uint8 | NPU | 8 | 1 | A | Unrestricted |
| RV1103B/RV1106B | int8 | 4 | int8 | NPU | 8 | 1 | A | Unrestricted |

For each convolution type, width/kernel_h/kernel_w must satisfy both conditions below. N must be an integer from 1 to 7; convolutions outside that range are unsupported. N is computed below. The image spells dilation_kernel_h/w differently from dilated_kernel_h/w in the last chapter; the image spelling is preserved.

| Condition | Formula |
|---|---|
| A (1) | width \* dilation\_kernel\_h &lt;= 2048 \* N |
| A (2) | width &lt;= 4096 |
| A / Convolution | N = 8 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 2) |
| A / Depthwise Convolution | N = 8 - CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 4096) |
| A / ConvTranspose/Deconvolution | N = 8 - MAX(CEIL((dilation\_kernel\_h \* dilation\_kernel\_w) / 128), 2) |

> The original header refers to note 9, but the supplied input notes list only 1–8. Note 9 was not found and is not invented.

## Model Output Limitations

1. If the output tensor type is NHWC and the output conversion is implemented by the NPU, there are alignment requirements; CPU implementations have no alignment requirements.

2. The output precision type int8/float16 indicates the data type of the raw output of the last layer of the model.

3. For NCHW output, if implemented by the NPU with the zero-copy interface, the output memory size should be based on the queried size.

4. For NC1HWC2 output, the output memory size should be based on the queried size.

## RK3566/RK3568

| Platform | Model output precision | Output dimensions | Output layout | Channel alignment | H\*W alignment |
|---|---|---|---|---|---|
| RK3566/RK3568 | int8 | 4 | NCHW | None | None |
| RK3566/RK3568 | int8 | 4 | NHWC | Aligned to 8 | None |
| RK3566/RK3568 | int8 | 4 | NC1HWC2 | Last layer convolution: aligned to 16; non-convolution: aligned to 8 | Aligned to 4 |
| RK3566/RK3568 | int8 | 4 | UNDEFINE | None | None |
| RK3566/RK3568 | float16 | 4 | NCHW | None | None |
| RK3566/RK3568 | float16 | 4 | NHWC | Aligned to 4 | None |
| RK3566/RK3568 | float16 | 4 | NC1HWC2 | Last layer convolution: aligned to 8; non-convolution: aligned to 4 | Aligned to 4 |
| RK3566/RK3568 | float16 | 4 | UNDEFINE | None | None |
| RK3566/RK3568 | Unrestricted | Not 4D | UNDEFINE | None | None |

## RK3588

| Platform | Model output precision | Output dimensions | Output layout | Channel alignment | H\*W alignment |
|---|---|---|---|---|---|
| RK3588 | int8 | 4 | NCHW | None | None |
| RK3588 | int8 | 4 | NHWC | Aligned to 16 | None |
| RK3588 | int8 | 4 | NC1HWC2 | Last layer convolution: aligned to 32; non-convolution: aligned to 16 | Aligned to 4 |
| RK3588 | int8 | 4 | UNDEFINE | None | None |
| RK3588 | float16 | 4 | NCHW | None | None |
| RK3588 | float16 | 4 | NHWC | Aligned to 8 | None |
| RK3588 | float16 | 4 | NC1HWC2 | Last layer convolution: aligned to 16; non-convolution: aligned to 8 | Aligned to 4 |
| RK3588 | float16 | 4 | UNDEFINE | None | None |
| RK3588 | Unrestricted | Not 4D | UNDEFINE | None | None |

## RV1103/RV1106

| Platform | Model output precision | Output dimensions | Output layout | Channel alignment | H\*W alignment |
|---|---|---|---|---|---|
| RV1103/RV1106 | int8 | 4 | NC1HWC2 | Last layer convolution: aligned to 32; non-convolution: aligned to 16 | Aligned to 4 |
| RV1103/RV1106 | int8 | 4 | NHWC | None | None |

## RK3562

| Platform | Model output precision | Output dimensions | Output layout | Channel alignment | H\*W alignment |
|---|---|---|---|---|---|
| RK3562 | int8 | 4 | NCHW | None | None |
| RK3562 | int8 | 4 | NHWC | None | None |
| RK3562 | int8 | 4 | NC1HWC2 | Last layer convolution: aligned to 32; non-convolution: aligned to 16 | Aligned to 4 |
| RK3562 | int8 | 4 | UNDEFINE | None | None |
| RK3562 | float16 | 4 | NCHW | None | None |
| RK3562 | float16 | 4 | NHWC | None | None |
| RK3562 | float16 | 4 | NC1HWC2 | Last layer convolution: aligned to 16; non-convolution: aligned to 8 | Aligned to 4 |
| RK3562 | float16 | 4 | UNDEFINE | None | None |
| RK3562 | Unrestricted | Not 4D | UNDEFINE | None | None |

## RK3576/RV1126B

| Platform | Model output precision | Output dimensions | Output layout | Channel alignment | H\*W alignment |
|---|---|---|---|---|---|
| RK3576/RV1126B | int8 | 4 | NCHW | None | None |
| RK3576/RV1126B | int8 | 4 | NHWC | None | None |
| RK3576/RV1126B | int8 | 4 | NC1HWC2 | Last layer convolution: aligned to 32; non-convolution: aligned to 16 | Aligned to 4 |
| RK3576/RV1126B | int8 | 4 | UNDEFINE | None | None |
| RK3576/RV1126B | float16 | 4 | NCHW | None | None |
| RK3576/RV1126B | float16 | 4 | NHWC | None | None |
| RK3576/RV1126B | float16 | 4 | NC1HWC2 | Last layer convolution: aligned to 16; non-convolution: aligned to 8 | Aligned to 4 |
| RK3576/RV1126B | float16 | 4 | UNDEFINE | None | None |
| RK3576/RV1126B | Unrestricted | Not 4D | UNDEFINE | None | None |

## RK2118

| Platform | Model output precision | Output dimensions | Output layout | Channel alignment | H\*W alignment |
|---|---|---|---|---|---|
| RK2118 | float16 | 4 | NC1HWC2 | Last layer convolution: aligned to 8; non-convolution: aligned to 4 | Aligned to 4 |
| RK2118 | float16 | 4 | NHWC | None | None |
| RK2118 | float16 | Not 4D | UNDEFINE | None | None |

## RV1103B/RV1106B

| Platform | Model output precision | Output dimensions | Output layout | Channel alignment | H\*W alignment |
|---|---|---|---|---|---|
| RV1103B/RV1106B | int8 | 4 | NC1HWC2 | Last layer convolution: aligned to 8; non-convolution: aligned to 8 | Aligned to 4 |
| RV1103B/RV1106B | int8 | 4 | NHWC | None | None |

## Special Notes

## dilated\_kernel\_h

dilated\_kernel\_h = kernel\_h \* dilations\_h - dilations\_h + 1

## dilated\_kernel\_w

dilated\_kernel\_w = kernel\_w \* dilations\_w - dilations\_w + 1

{% endraw %}
