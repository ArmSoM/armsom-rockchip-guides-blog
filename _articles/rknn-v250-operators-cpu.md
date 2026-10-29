---
title: "RKNN2 V2.5.0 · CPU operator support and constraints"
description: "RKNN2 V2.5.0 · CPU operator support and constraints · Complete operator parameters and constraints from the V2.5.0 source."
excerpt: "RKNN2 V2.5.0 · CPU operator support and constraints · Complete operator parameters and constraints from the V2.5.0 source."
translation_key: "rknn-v250-operators-cpu"
slug: "rknn-v250-operators-cpu"
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

Source pages: CN 353–366; EN 363–376.

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

**RKNN2 V2.5.0 · CPU operator support and constraints**

[RKNN2 V2.5.0 · GPU operator support and constraints](/articles/rknn-v250-operators-gpu/)

[RKNN2 V2.5.0 · Model I/O, alignment and convolution limits](/articles/rknn-v250-operators-model-io/)

</details>

{% raw %}

## CPU OP Specifications

## Note:

- RK2118 does not support all CPU operators
- RV1106/RV1103/RV1106B/RV1103B only support some CPU operators as follows
    - Concat, DataConvert, Div, exLayerNorm, Exp, Gather, ReduceL2, ReduceMax, Reshape, ScatterND,Softmax,Pow

## Add

- Description: Addition operation
- Specification Constraints: No limitation

## AveragePool

- Description: Average pooling
- Specification Constraints: No limitation

## ArgMin

- Description: Returns the index of the minimum value
- Specification Constraints: No limitation

## ArgMax

- Description: Returns the index of the maximum value
- Specification Constraints: No limitation

## BatchNormalization

- Description: Batch normalization
- Specification Constraints: No limitation

## Cast

- Description: Data type conversion
- Specification Constraints: SRC supports:float32/bool/int8/float16/int32/int64 DST supports:float32/int8/int32/float16

## Clip

- Description: Clipping activation layer
- Specification Constraints: No limitation

## Concat

- Description: Concatenation operation
- Specification Constraints: axis only supports {0,1,2,3}

## Convolution

- Description: Convolution operation
- Specification Constraints: No limitation

## ConvTranspose/Deconvolution

- Description: Transposed convolution
- Specification Constraints: No limitation

## ConvTransposePad

- Description: Combined operator
- Specification Constraints: No limitation

## Cos

- Description: Cosine function
- Specification Constraints: No limitation

## DataConvert

- Description: Data type conversion
- Specification Constraints: only bool/int8/float type conversion is supported

## DepthToSpace

- Description: Channel-to-spatial direction conversion
- Specification Constraints: No limitation

## Div

- Description: Division operation
- Specification Constraints: No limitation

## Equal

- Description: Equal to
- Specification Constraints: No limitation

## Exp

- Description: Exponential function
- Specification Constraints: No limitation

## Flatten

- Description: Flatten operation
- Specification Constraints: No limitation

## Gather

- Description: Gather operation
- Specification Constraints: No limitation

## Greater

- Description: Greater than
- Specification Constraints: No limitation

## GreaterOrEqual

- Description: Greater than or equal to
- Specification Constraints: No limitation

## GRU

- Description: Gated Recurrent Unit
- Specification Constraints: No limitation

## exGRU

- Description: Gated Recurrent Unit
- Specification Constraints: No limitation
    - Note: ONNX extension operator

## exHardSwish

- Description: Activation function
- Specification Constraints: No limitation
    - Note: ONNX extension operator

## InstanceNormalization

- Description: Instance normalization
- Specification Constraints: No limitation

## exLayerNorm

- Description: Layer normalization
- Specification Constraints: No limitation
    - Note: ONNX extension operator

## Less

- Description: Less than
- Specification Constraints: No limitation

## LessOrEqual

- Description: Less than or equal to
- Specification Constraints: No limitation

## LogSoftmax

- Description: Activation function
- Specification Constraints: batchsize only supports 1

## LpNormalization

- Description: Lp normalization
- Specification Constraints: No limitation

## exLRN

- Description: Local response normalization
- Specification Constraints: No limitation
    - Note: ONNX extension operator

## MatMul

- Description: Multi-dimensional matrix multiplication
- Specification Constraints: No limitation (4D x 4D and 4D x 3D computation are supported)

## Max

- Description: Maximum
- Specification Constraints: No limitation

## MaxPool

- Description: Max pooling
- Specification Constraints: No limitation

## MaxRoiPool

- Description: Region Max pooling
- Specification Constraints: No limitation

## MaxUnpool

- Description: Reverse Max pooling
- Specification Constraints: No limitation

## exMish

- Description: Activation function
- Specification Constraints: No limitation
    - Note: ONNX extension operator

## Min

- Description: Minimum value
- Specification Constraints: No limitation

## Mul

- Description: Multiplication
- Specification Constraints: No limitation

## Pad

- Description: Padding
- Specification Constraints: No limitation

## Pow

- Description: Exponentiation
- Specification Constraints: No limitation

## exProposal

- Description: Region proposal network
- Specification Constraints: batchsize only supports 1
    - Note: ONNX extension operator

## ReduceMax

- Description: Compute Max along the specified dimension
- Specification Constraints: the output dimension cannot exceed 4 dimensions

## ReduceMean

- Description: Compute Mean along the specified dimension
- Specification Constraints: the output dimension cannot exceed 4 dimensions

## ReduceSum

- Description: Compute Sum along the specified dimension
- Specification Constraints: the output dimension cannot exceed 4 dimensions

## ReduceMin

- Description: Compute Min along the specified dimension
- Specification Constraints: the output dimension cannot exceed 4 dimensions

## Reorg

- Description: Data reorganization
- Specification Constraints: No limitation

## Reshape

- Description: Data shape change
- Specification Constraints: No limitation

## Resize

- Description: Data width/height direction scaling
- Specification Constraints: supported interpolation methods are bilinear; nearest2d

## ReverseSequence

- Description: Sequence reversal
- Specification Constraints: No limitation

## exRMSNorm

- Description: Root mean square normalization
- Specification Constraints: No limitation
    - Note: ONNX extension operator

## RoiAlign

- Description: Region align pooling
- Specification Constraints: only AvgPoolMode is supported, batchsize only supports 1

## ScatterND

- Description: N-dimensional index gathering
- Specification Constraints: No limitation

## Sin

- Description: Sine function
- Specification Constraints: No limitation

## Slice

- Description: Slice operation
- Specification Constraints: batchsize only supports 1

## Softmax

- Description: Activation function
- Specification Constraints: batchsize only supports 1
    - Note: consistent with the ONNX OPSET11 specification

## exSoftmax13

- Description: Activation function
- Specification Constraints: batchsize only supports 1
    - Note: ONNX extension operator, consistent with the ONNX OPSET13 specification

## SpaceToDetph

- Description: Spatial-to-channel direction conversion
- Specification Constraints: No limitation

## Split

- Description: Split data
- Specification Constraints: No limitation

## Sqrt

- Description: Square root
- Specification Constraints: No limitation

## Squeeze

- Description: Squeeze data dimensions
- Specification Constraints: No limitation

## Sub

- Description: Subtraction
- Specification Constraints: No limitation

## Tanh

- Description: Hyperbolic tangent function
- Specification Constraints: No limitation

## Tile

- Description: Expand and copy data
- Specification Constraints: batchsize only supports 1, broadcasting is not supported

## Transpose

- Description: Transpose computation
- Specification Constraints: No limitation

## Upsample

- Description: Upsample
- Specification Constraints: supported interpolation methods are bilinear; nearest2d

## Not

- Description: Element-wise negation
- Specification Constraints: No limitation

## where

- Description: Gather by mask
- Specification Constraints: No limitation

## Erf

- Description: Error function (Erf)
- Specification Constraints: No limitation

## Floor

- Description: Floor operation function
- Specification Constraints: No limitation

## Mod

- Description: Modulo function
- Specification Constraints: No limitation

## exMeanVarianceNormalization

- Description: Mean variance normalization function
- Specification Constraints: No limitation

## And

- Description: AND function
- Specification Constraints: No limitation

## GatherElements

- Description: Element gathering function
- Specification Constraints: No limitation

## Log

- Description: Log function
- Specification Constraints: No limitation

## exDataConvert

- Description: Precision conversion
- Specification Constraints: No limitation

## SpaceToDepth

- Description: Dimension transformation
- Specification Constraints: No limitation

## SoftmaxMask

- Description: where-fused softmax activation function
- Specification Constraints: No limitation

## TransposeReshape

- Description: Combined operator
- Specification Constraints: No limitation

## ReshapeTranspose

- Description: Combined operator
- Specification Constraints: No limitation

## ReduceL2

- Description: L2 norm along an axis
- Specification Constraints: No limitation

## LayerNormalization

- Description: Layer normalization
- Specification Constraints: No limitation

## PassThrough

- Description: Direct connection
- Specification Constraints: No limitation

## Expand

- Description: Tensor data copy or expansion
- Specification Constraints: No limitation

## Sigmoid

- Description: Activation function
- Specification Constraints: No limitation

## Tanh

- Description: Trigonometric functions
- Specification Constraints: No limitation

## Cos

- Description: Trigonometric functions
- Specification Constraints: No limitation

## Sin

- Description: Trigonometric functions
- Specification Constraints: No limitation

## exSwish

- Description: Activation function
- Specification Constraints: No limitation

## exGlu

- Description: Activation function
- Specification Constraints: No limitation

## exGelu

- Description: Activation function
- Specification Constraints: No limitation

## exWindow

- Description: exWindow originates from the window\_partition and window\_reverse operations of Swin-Transformer
- Specification Constraints: No limitation

## exNorm

- Description: When mode is set to 'pixel', exNorm will use PixelNorm for normalization. When mode is omitted, exNorm uses LayerNorm for normalization by default.
- Specification Constraints: No limitation

## Round

- Description: Data saturation
- Specification Constraints: No limitation

## TopK

- Description: Get the top K ranked values
- Specification Constraints: No limitation

## exSwooshR

- Description: Activation function
- Specification Constraints: No limitation

## exSwooshL

- Description: Activation function
- Specification Constraints: No limitation

## OneHot

- Description: One-hot encoding
- Specification Constraints: No limitation

## Cumsum

- Description: Cumulative sum along the specified dimension
- Specification Constraints: No limitation
{% endraw %}
