---
title: "RKNN2 V2.5.0 · RV1103B/RV1106B：Recurrent networks, arithmetic and pooling"
description: "RKNN2 V2.5.0 · RV1103B/RV1106B：Recurrent networks, arithmetic and pooling · Complete operator parameters and constraints from the V2.5.0 source."
excerpt: "RKNN2 V2.5.0 · RV1103B/RV1106B：Recurrent networks, arithmetic and pooling · Complete operator parameters and constraints from the V2.5.0 source."
translation_key: "rknn-v250-operators-rv1103b-rv1106b-recurrent-pooling"
slug: "rknn-v250-operators-rv1103b-rv1106b-recurrent-pooling"
lang: "en"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "NPU", "V2.5.0", "RV1103B/RV1106B"]
---

This RKNN2 V2.5.0 platform reference helps ArmSoM developers select and adapt models. It does not establish support on every ArmSoM board: verify the board SoC, actual Toolkit2, Runtime, NPU driver and BSP versions. The source specifies no universal Linux kernel version. No ArmSoM hardware validation was performed.

Source: the supplied Chinese and English RKNN2 Supported Operators and Constraints Reference V2.5.0, 374 and 384 pages respectively. Chinese follows the Chinese edition; English, Russian and German follow the English edition. Platform constraints remain separate. The English PDF itself contains Chinese I/O figures and output tables; their provenance is retained with editable localized tables. Source spellings such as ConvTranpose and the original LSTM/GRU equations are preserved; these equations are not corrections to SDK implementations.

Source pages: CN 324–331; EN 334–341.

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

**RKNN2 V2.5.0 · RV1103B/RV1106B：Recurrent networks, arithmetic and pooling**

[RKNN2 V2.5.0 · RV1103B/RV1106B：Shapes, slicing and transpose](/articles/rknn-v250-operators-rv1103b-rv1106b-shape-indexing/)

[RKNN2 V2.5.0 · RV1103B/RV1106B：Activations, normalization and extensions](/articles/rknn-v250-operators-rv1103b-rv1106b-activations-extensions/)

[RKNN2 V2.5.0 · CPU operator support and constraints](/articles/rknn-v250-operators-cpu/)

[RKNN2 V2.5.0 · GPU operator support and constraints](/articles/rknn-v250-operators-gpu/)

[RKNN2 V2.5.0 · Model I/O, alignment and convolution limits](/articles/rknn-v250-operators-model-io/)

</details>

{% raw %}

## Div

Performs element-wise binary division (C=A/B), supporting multi-directional NumPy-style broadcasting

### Inputs

- A:T1,T2
    - shape:\[batch,channel,height,width\]
    - Quantization support
        - per-layer
    - Broadcasting support
        - \[b,c,1,1\]
        - \[scalar\]
- B:T1,T2
    - shape:\[batch,channel,height,width\]
    - Quantization support
        - per-layer
    - Broadcasting support
        - \[b,c,1,1\]
        - \[scalar\]

### Outputs

- C:T1
    - shape:\[batch,channel,height,width\]
    - Quantization support
        - per-layer

### Data Type Constraints

- T1:float16(Tensor)
- T2:float(constTensor)

## Expand

Broadcast the input tensor according to the given shape and broadcasting rules. The broadcasting rule is similar to numpy.array(input) \* numpy.ones(shape): dimensions are right- aligned; two corresponding dimensions must have the same value, or one of them equals 1

### Inputs

- input:T1
    - shape:\[batch,channel,height,width\]
    - Quantization support
        - per-layer
- shape:T2
    - shape:\[batch,channel,height,width\]

### Outputs

- output:T1
    - shape:\[batch,channel,height,width\]
    - Quantization support
        - per-layer

### Data Type Constraints

- T1:int8(Tensor)
- T2:int64(Tensor)

Broadcasting constraints

- \[b,c,1,w\]-&gt;\[b,c,h,w\],h∈\[1,8192\]
- \[b,1,1,w\]-&gt;\[b,c,h,w\],h∈\[1,8192\]
- \[b,c,h,1\]-&gt;\[b,c,h,w\],w ∈\[1,8192\]
- \[b,1,h,1\]-&gt;\[b,c,h,w\],w ∈\[1,8192\]
- \[b,c,1,1\]-&gt;\[b,c,h,w\],h∈\[1,8192\],w ∈\[1,8192\]

## Max

Computes the element-wise maximum value of the input tensor

### Inputs

- A:T1
    - shape:\[batch,channel,height,width\]
    - Quantization support
        - per-layer
    - Broadcasting support
        - Supports broadcasting along arbitrary dimensions
        - Broadcasting constraints are the same as the Expand operator
- B:T1
    - shape:\[batch,channel,height,width\]
    - Quantization support
        - per-layer
    - Broadcasting support
        - Supports broadcasting along arbitrary dimensions
        - Broadcasting constraints are the same as the Expand operator

### Outputs

- C:T1
    - shape:\[batch,channel,height,width\]
    - Quantization support
        - per-layer/per-channel

### Data Type Constraints

- T1:int8(Tensor)

### Other Support

- Multi-core: Not yet supported

## Mul

Performs element-wise binary multiplication (C=A\*B), supporting multi-directional NumPy-style broadcasting

### Inputs

- A:T1,T2
    - shape:\[batch,channel,height,width\]
    - Quantization support
        - per-layer
    - Broadcasting support
        - Supports broadcasting along arbitrary dimensions
        - Broadcasting constraints are the same as the Expand operator
- B:T1,T2
    - shape:\[batch,channel,height,width\]
    - Quantization support
        - per-layer
    - Broadcasting support
        - Supports broadcasting along arbitrary dimensions
        - Broadcasting constraints are the same as the Expand operator

### Outputs

- C:T1
    - shape:\[batch,channel,height,width\]
    - Quantization support
        - per-layer

### Data Type Constraints

- T1:int8(Tensor)
- T2:float(constTensor)

## MulRelu

Mul and Relu fused computation, C=Relu(A\*B)

### Inputs

- Same as Mul

### Outputs

- Same as Mul

### Other Support

- Multi-core: Supported

## Pad

Given a tensor (data) containing the data to be padded, a tensor (pads) containing the start and end padding values for each axis, a mode (mode), and a constant value (constant\_value), generate a padded tensor (output)

### Inputs

- data:T1
    - shape:\[batch,channel,height,width\]
    - Quantization support
        - per-layer
- pads:T2
    - shape : \[batch\_begin, channel\_begin, height\_begin, width\_begin, batch\_end, channel\_end,height\_end,width\_end\]
- constant\_value(optional):T3
    - shape:\[1\]
    - Quantization support
        - per-layer

### Outputs

- output:T1
    - shape:\[batch,channel,height,width\]
    - Quantization support
        - per-layer

### Data Type Constraints

- T1:int8(Tensor)
- T2:int64(Tensor)
- T3:float(Scalar),int8(Scalar),float16(Scalar)

### Attributes

- mode: string (default value constant)
    - Supported modes: constant, reflect
        - constantNo limitation
        - reflectchannel∈(0,8192\],height∈(0,8192\],width∈(0,8176\]

### Other Support

- Multi-core: Not yet supported

## MaxPool

MaxPool consumes an input tensor X and applies max pooling to the tensor according to kernel size, stride size, and padding length. Max pooling consists of computing the maximum over all values of a subset of the input tensor according to the kernel size, and downsampling the data into output tensor Y for further processing. The output spatial shape calculation differs depending on whether explicit padding (when using pads) or automatic padding (when using auto\_pad) is used. Only explicit padding is used

### Inputs

- input:T1
    - shape:\[batch,channel,height,width\]
        - channel∈(0,8192\]
        - height∈(0,7\]
        - width∈(0,7\]

### Outputs

- output:T1
    - shape:\[batch,channel,height,width\]

### Attributes

- kernel\_shape:int64(kernel\_h,kernel\_w)
    - kernel\_h∈(0,7\]
    - kernel\_w∈(0,7\]
- auto\_pad:string
    - Padding mode: only NOTSET is supported
- ceil\_mode:int64
    - Whether to use ceil or floor to compute the output shape: not supported
- strides:int64(strides\_h,strides\_w)
    - strides\_h∈(0,8\]
    - strides\_w∈(0,8\]
- count\_include\_pad:int64\[\]
    - count\_include\_pad, whether to include pad values in computation: 1
- pad:int64(pad\_top,pad\_left,pad\_bottom,pad\_right)
    - pad\_top∈\[0,7\]
    - pad\_left∈\[0,7\]
    - pad\_bottom∈\[0,7\]
    - pad\_right∈\[0,7\]

### Data Type Constraints

- T1:int8(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)

## GlobalMaxPool

GlobalMaxPool consumes an input tensor X and applies max pooling over the values in the same channel. This is equivalent to a MaxPool with kernel\_shape equal to the spatial dimensions of the input.

### Inputs

- input:T1
    - shape:\[batch,channel,height,width\]
        - channel∈(0,8192\]
        - height∈(0,7\]
        - width∈(0,7\]

### Outputs

- output:T1
    - shape:\[batch,channel,height,width\]

### Attributes

- kernel\_shape:int64(kernel\_h,kernel\_w)
    - kernel\_h∈(0,7\]
    - kernel\_w∈(0,7\]
- auto\_pad:string
    - Padding mode: only NOTSET is supported
- ceil\_mode:int64
    - Whether to use ceil or floor to compute the output shape: not supported
- strides:int64(strides\_h,strides\_w)
    - strides\_h∈(0,8\]
    - strides\_w∈(0,8\]
- count\_include\_pad:int64\[\]
    - count\_include\_pad, whether to include pad values in computation: 1
- pad:int64(pad\_top,pad\_left,pad\_bottom,pad\_right)
    - pad\_top∈\[0,7\]
    - pad\_left∈\[0,7\]
    - pad\_bottom∈\[0,7\]
    - pad\_right∈\[0,7\]

### Data Type Constraints

- T1:int8(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)

## AveragePool

- Not supported (converted to convolution implementation on the tool side)

## GlobalAveragePool

- Not supported (converted to convolution implementation on the tool side)
{% endraw %}
