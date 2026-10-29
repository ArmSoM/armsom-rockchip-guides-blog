---
title: "RKNN2 V2.5.0 · RV1103B/RV1106B：Shapes, slicing and transpose"
description: "RKNN2 V2.5.0 · RV1103B/RV1106B：Shapes, slicing and transpose · Complete operator parameters and constraints from the V2.5.0 source."
excerpt: "RKNN2 V2.5.0 · RV1103B/RV1106B：Shapes, slicing and transpose · Complete operator parameters and constraints from the V2.5.0 source."
translation_key: "rknn-v250-operators-rv1103b-rv1106b-shape-indexing"
slug: "rknn-v250-operators-rv1103b-rv1106b-shape-indexing"
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

Source pages: CN 332–343; EN 341–353.

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

**RKNN2 V2.5.0 · RV1103B/RV1106B：Shapes, slicing and transpose**

[RKNN2 V2.5.0 · RV1103B/RV1106B：Activations, normalization and extensions](/articles/rknn-v250-operators-rv1103b-rv1106b-activations-extensions/)

[RKNN2 V2.5.0 · CPU operator support and constraints](/articles/rknn-v250-operators-cpu/)

[RKNN2 V2.5.0 · GPU operator support and constraints](/articles/rknn-v250-operators-gpu/)

[RKNN2 V2.5.0 · Model I/O, alignment and convolution limits](/articles/rknn-v250-operators-model-io/)

</details>

{% raw %}

## Relu

Sets negative values of the input tensor to zero, keeping positive values unchanged

### Inputs

- input:T1
    - shape:\[batch,channel,height,width\]
    - Quantization support
        - per-layer
    - Broadcasting support
        - None

### Outputs

- output:T1
    - shape:\[batch,channel,height,width\]
    - Quantization support
        - per-layer

### Data Type Constraints

- T1:int8(Tensor)

### Other Support

- Multi-core: Not yet supported

## Clip/ReLU6

Clips the values of the input tensor to the range \[0,6\]

### Inputs

- input:T1
    - shape:\[batch,channel,height,width\]
    - Quantization support
        - per-layer
    - Broadcasting support
        - None

### Outputs

- output:T1
    - shape:\[batch,channel,height,width\]
    - Quantization support
        - per-layer

### Data Type Constraints

- T1:int8(Tensor)

### Other Support

- Multi-core: Not yet supported

## PRelu

Scales negative values of the input tensor by a learnable parameter, keeping positive values unchanged

### Inputs

- input:T1
    - shape:\[batch,channel,height,width\]
    - Quantization support
        - per-layer/per-channel
    - Broadcasting support
        - None

### Outputs

- output:T1
    - shape:\[batch,channel,height,width\]
    - Quantization support
        - per-layer/per-channel

### Attributes

- slope: PRelu coefficient
    - Only a single scalar or C-dimension coefficients are supported

### Data Type Constraints

- T1:int8(Tensor)

### Other Support

- Multi-core: Not yet supported

## LeakyRelu

Scales negative values of the input tensor by a fixed ratio, keeping positive values unchanged

### Inputs

- input:T1
    - shape:\[batch,channel,height,width\]
    - Quantization support
        - per-layer
    - Broadcasting support
        - None

### Outputs

- output:T1
    - shape:\[batch,channel,height,width\]
    - Quantization support
        - per-layer

### Data Type Constraints

- T1:int8(Tensor)

### Other Support

- Multi-core: Not yet supported

## Reshape

Returns a tensor with the specified shape without changing the input data or the number of elements.

### Inputs

- input:T1
    - shape:\[batch,channel,height,width\]
    - Quantization support
        - per-layer

### Outputs

- output:T1
    - shape:\[batch,channel,height,width\]
    - Quantization support
        - per-layer

### Data Type Constraints

- T1:int8(Tensor)

### Attributes

- shape:int
    - Specifies the shape of the output tensor

### Other Support

- Multi-core: Not yet supported

## Resize

Resizes the input tensor. In general, it computes each value in the output tensor as a weighted average of the input tensor values in the neighborhood (i.e., sampling locations) of the corresponding position

### Inputs

- X:T1
    - shape:\[batch,channel,height,width\]
    - Quantization support
        - per-layer
- roi(optional):T2
    - Currently not supported
- scales(optional):T2
    - The array of scale factors along each dimension
- sizes(optional):T3
    - The target size of the output tensor

### Outputs

- Y:T1
    - shape:\[batch,channel,height,width\]
    - Quantization support
        - per-layer

### Data Type Constraints

- T1:int8(Tensor)
- T2:float(Tensor)
- T3:int64(Tensor)

### Attributes

- antialias: int (default value 0)
    - Currently not supported to set
- axes:int\[\]
    - Currently not supported to set
- coordinate\_transformation\_mode: strings (default value "half\_pixel")
    - Currently only half\_pixel, pytorch\_half\_pixel, and align\_corners are supported
- cubic\_coeff\_a: float (default -0.75)
    - Currently not supported to set
- exclude\_outside: int (default value 0)
    - Currently not supported to set
- extrapolation\_value: float (default 0)
    - Currently not supported to set
- keep\_aspect\_ratio\_policy: strings (default value "stretch")
    - Currently not supported to set
- mode: strings (default value "nearest")
    - Currently only nearest and linear are configurable
- nearest\_mode: strings (default value "round\_prefer\_floor")
    - Currently not supported to set Support Note Currently only integer scaling in width/height direction is supported, and the scale factor must be an integer multiple of 2-8. If the input is (1,c,1,1), it can be scaled up to (1,c,h,w)

## Slice

Obtains a slice of the current vector, with the same rules as numpy slicing

### Inputs

- input\_tensor:T
    - shape:\[batch,channel,height,width\]
    - Quantization support
        - per-layer

### Outputs

- output:T
    - shape:\[batch,channel,height,width\]
    - Quantization support
        - per-layer

### Data Type Constraints

- T:int8(Tensor)

### Attributes

- starts:int(Tensor)
    - The start position of the split: No limitation
- ends:int(Tensor)
    - The end position of the split: No limitation
- axes:int(Tensor)
    - The axis to split: any axis 0~3 is supported, and multiple axes can be selected simultaneously
- steps:int(Tensor)
    - The step size of the corresponding axis for splitting
    - When height\*width==1&amp;&amp;channel%subc==0&amp;&amp;starts\[1\]%subc==0&amp;&amp;ends\[1\]% when subc==0&amp;&amp;steps\[1\]&lt;=subc, steps can be other than 1; otherwise, Slice OP can only run on the NPU when steps==\[1,1,1,1\]

## Softmax

This operator computes the normalized exponential value of the given input:

Softmax(input, axis) = exp(input − max(input, axis)) / Σ\_axis exp(input − max(input, axis))

The "axis" attribute indicates the dimension along which Softmax is performed. The output tensor has the same shape and contains the Softmax values of the corresponding input.

### Inputs

- input:T1
    - shape:\[batch,channel,height,width\]
        - Subject to the transpose specification constraints

### Outputs

- output:T1
    - shape:\[batch,channel,height,width\]

### Data Type Constraints

- T1:int8(Tensor)

### Attributes

- axis:int64
    - The axis for softmax: 1,3, i.e., channel and width directions

## exSoftmax13

This operator computes the normalized exponential value of the given input:

exSoftmax13(input, axis) = exp(input − max(input, axis)) / Σ\_axis exp(input − max(input, axis))

The "axis" attribute indicates the dimension along which Softmax is performed. The output tensor has the same shape and contains the Softmax values of the corresponding input.

### Inputs

- input:T1
    - shape:\[batch,channel,height,width\]
        - Subject to the transpose specification constraints

### Outputs

- output:T1
    - shape:\[batch,channel,height,width\]

### Data Type Constraints

- T1:int8(Tensor)

### Attributes

- axis:int64
    - The axis for softmax: 1,3, i.e., channel and width directions

## exSoftmaxMask

- Not yet supported

## Split

Splits the vector into num\_outputs vectors along the axis direction. split specifies the size of each split vector along the axis

### Inputs

- input\_tensor:T
    - shape:\[batch,channel,height,width\]
    - Quantization support
        - per-layer

### Outputs

- output:T
    - One or more output vectors, determined by the num\_outputs attribute
    - shape: determined by the splitting situation
    - Quantization support
        - per-layer

### Data Type Constraints

- T:int8(Tensor)

### Attributes

- axis:int
    - axis∈{0,1,2,3}
- num\_outputs:int
- split:int(Tensor)

## Sub

- Performs element-wise binary subtraction (C=A-B), supporting multi-directional NumPy-style broadcasting

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

- T1:int8(Tensor)
- T2:float(constTensor)

## Tile

Constructs a tensor by tiling a given tensor. This is the same as the tile function in Numpy, but without broadcasting

### Inputs

- input:T1
    - shape:\[batch,channel,height,width\]
    - Quantization support
        - per-layer
- repeats:T2
    - shape:\[batch,channel,height,width\]

### Outputs

- output:T1
    - shape:\[batch,channel,height,width\]
    - Quantization support
        - per-layer

### Data Type Constraints

- T1:int8(Tensor),float16(Tensor)
- T2:int64(Tensor)

## Transpose

Transposes the input tensor

### Inputs

- X:T1
    - shape:\[n1,c1,h1,w1\]
        - See Attributes for detailed constraint rules
    - Quantization support
        - per-layer

### Outputs

- Y:T1,T2
    - shape:\[n2,c2,h2,w2\]
        - See Attributes for detailed constraint rules
    - Quantization support
        - per-layer

### Attributes

- The axis order of the perm transpose: The perm parameter restrictions are as follows: (where p=268435456, q=65536)
    - perm=\[0,1,2,3\]
        - No limitation
    - perm=\[0,1,3,2\]
        - T1:h1%16=0,h1w1&lt;16p,h1w1&lt;2q
        - T2:h1%8=0,h1w1&lt;8p,h1w1&lt;2q
    - perm=\[0,2,3,1\]
        - T1:c1&lt;8192,h1w1%8=0,w1c1&lt;p\*16
        - T2:c1&lt;8192,h1w1%8=0,w1c1&lt;p\*8
    - perm=\[0,2,1,3\]
        - T1:h1%16=0,h1w1&lt;16p,h1w1&lt;2q,c1\*w1&lt;p
        - T2:h1%8=0,h1w1&lt;8p,h1w1&lt;2q,c1\*w1&lt;p
    - perm=\[0,3,1,2\]
        - T1,T2:h1w1&lt;p,w1&lt;8192,h1c1&lt;p
    - perm=\[0,3,2,1\]
        - T1:h1%16=0,h1w1&lt;16p,h1w1&lt;2q,c1&lt;p\*16
        - T2:h1%8=0,h1w1&lt;8p,h1w1&lt;2q,c1&lt;p\*8
    - perm=\[1,0,2,3\]
        - T1:h1w1&lt;16p,n1&lt;8192,h1\*w1&lt;p
        - T2:h1w1&lt;8p,n1&lt;8192,h1\*w1&lt;p
    - perm=\[1,0,3,2\]
        - T1:h1%16=0,c1h1w1&lt;16p,h1w1&lt;2\*q
        - T2:h1%8=0,c1h1w1&lt;8p,h1w1&lt;2\*q
    - perm=\[1,2,0,3\]
        - T1:n1w1&lt;p16,c1h1w1&lt;p,w1%16=0
        - T2:n1w1&lt;p8,c1h1w1p,w1%8=0
    - perm=\[1,2,3,0\]
        - T1:h1w1&lt;p,n1&lt;p16,c1h1w1&lt;p16,n1w1&lt;p\*16
        - T2:h1w1&lt;p,n1&lt;p8,c1h1w1&lt;p8,n1w1&lt;p\*8
    - perm=\[1,3,0,2\]
        - T1:c1w1&lt;8192,n1h1&lt;p,w1%16=0
        - T2:c1w1&lt;8192,n1h1&lt;p,w1%8=0
    - perm=\[1,3,2,0\]
        - T1:c1h1w1&lt;p,n1\*h1&lt;p,w1&lt;8192,w1%16=0
        - T2:c1h1w1&lt;p,n1\*h1&lt;p,w1&lt;8192,w1%8=0
    - perm=\[2,1,0,3\]
        - T1,T2:c1&lt;8192,c1h1w1&lt;p,n1\*w1&lt;p
    - perm=\[2,1,3,0\]
        - T1:c1h1w1&lt;p,n1w1&lt;p16,c1&lt;8192,n1\*w1%4=0
        - T2:c1h1w1&lt;p,n1w1&lt;p8,c1&lt;8192,n1\*w1%4=0
    - perm=\[2,0,3,1\]
        - T1,T2:c1&lt;8192,c1h1w1&lt;p
    - perm=\[2,0,1,3\]
        - T1:n1c1h1w1&lt;p,h1w1%16=0
        - T2:n1c1h1w1&lt;p,h1w1%8=0
    - perm=\[2,3,1,0\]
        - T1:c1h1w1&lt;p,n1c1&lt;p,h1w1&lt;8192,h1\*w1%16=0
        - T2:c1h1w1&lt;p,n1c1&lt;p,h1w1&lt;8192,h1\*w1%8=0
    - perm=\[2,3,0,1\]
        - T1,T2:h1w1&lt;8192,n1c1&lt;p
    - perm=\[3,0,2,1\]
        - T1:h1w1&lt;p,n1c1&lt;8192,c1h1&lt;p,n1w1&lt;8192,n1\*w1%16=0
        - T2:h1w1&lt;p,n1c1&lt;8192,c1h1&lt;p,n1w1&lt;8192,n1\*w1%8=0
    - perm=\[3,0,1,2\]
        - T1:h1w1&lt;p,n1c1&lt;8192,c1h1&lt;p,n1w1&lt;8192,n1h1w1%16=0
        - T2:h1w1&lt;p,n1c1&lt;8192,c1h1&lt;p,n1w1&lt;8192,n1h1w1%8=0
    - perm=\[3,2,0,1\]
        - T1,T2:h1w1&lt;p,n1c1&lt;8192,n1c1w1&lt;p
    - perm=\[3,2,1,0\]
        - T1:c1h1w1&lt;p,h1w1&lt;8192,2h1w1&lt;q,n1c1&lt;p\*16,h1%16=0
        - T2:c1h1w1&lt;p,h1w1&lt;8192,2h1w1&lt;q,n1c1&lt;p\*8,h1%8=0
    - perm=\[3,1,0,2\]
        - T1,T2:h1w1&lt;p,c1w1&lt;8192,n1\*h1&lt;p
    - perm=\[3,1,2,0\]
        - T1,T2:h1w1&lt;p,n1c1&lt;8192,n1h1&lt;p,n1c1\*w1&lt;p

### Data Type Constraints

- T1:int8(Tensor)
- T2:int16(Tensor)

### Other Support

- Multi-core: Not yet supported
{% endraw %}
