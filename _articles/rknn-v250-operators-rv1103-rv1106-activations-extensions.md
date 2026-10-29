---
title: "RKNN2 V2.5.0 · RV1103/RV1106：Activations, normalization and extensions"
description: "RKNN2 V2.5.0 · RV1103/RV1106：Activations, normalization and extensions · Complete operator parameters and constraints from the V2.5.0 source."
excerpt: "RKNN2 V2.5.0 · RV1103/RV1106：Activations, normalization and extensions · Complete operator parameters and constraints from the V2.5.0 source."
translation_key: "rknn-v250-operators-rv1103-rv1106-activations-extensions"
slug: "rknn-v250-operators-rv1103-rv1106-activations-extensions"
lang: "en"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "NPU", "V2.5.0", "RV1103/RV1106"]
---

This RKNN2 V2.5.0 platform reference helps ArmSoM developers select and adapt models. It does not establish support on every ArmSoM board: verify the board SoC, actual Toolkit2, Runtime, NPU driver and BSP versions. The source specifies no universal Linux kernel version. No ArmSoM hardware validation was performed.

Source: the supplied Chinese and English RKNN2 Supported Operators and Constraints Reference V2.5.0, 374 and 384 pages respectively. Chinese follows the Chinese edition; English, Russian and German follow the English edition. Platform constraints remain separate. The English PDF itself contains Chinese I/O figures and output tables; their provenance is retained with editable localized tables. Source spellings such as ConvTranpose and the original LSTM/GRU equations are preserved; these equations are not corrections to SDK implementations.

Source pages: CN 211–220; EN 217–227.

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

**RKNN2 V2.5.0 · RV1103/RV1106：Activations, normalization and extensions**

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

[RKNN2 V2.5.0 · Model I/O, alignment and convolution limits](/articles/rknn-v250-operators-model-io/)

</details>

{% raw %}

## Sigmoid

Given an input tensor, the function y=1/(1+exp(-x)) is applied element-wise to the input tensor to produce the output tensor

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

- T1:int8(Tensor),float16(Tensor)

## Tanh

Computes the hyperbolic tangent of the given input tensor element-wise

### Inputs

- X:T1
    - shape:\[batch,channel,height,width\]
    - Quantization support:per-layer

### Outputs

- Y:T1
    - shape:\[batch,channel,height,width\]
    - Quantization support:per-layer

### Data Type Constraints

- T1:int8(Tensor),float16(Tensor)

## Softplus

Applies the Softplus function element-wise, y=ln(exp(x)+1)

### Inputs

- X:T1
    - shape:\[batch,channel,height,width\]
    - Quantization support:per-layer

### Outputs

- Y:T1
    - shape:\[batch,channel,height,width\]
    - Quantization support:per-layer

### Data Type Constraints

- T1:int8(Tensor),float16(Tensor)

## HardSigmoid

Given an input tensor, the function y=max(0,min(1,alpha\*x+beta)) is applied element-wise to the input tensor to produce the output tensor, where alpha=1/6, beta=0.5

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

- T1:int8(Tensor),float16(Tensor)

## HardSwish

Applies the HardSwish function element-wise, y = x \* max(0, min(1, alpha \* x + beta)) = x \* HardSigmoid(x), where alpha=1/6, beta=0.5

### Inputs

- X:T1
    - shape:\[batch,channel,height,width\]
    - Quantization support:per-layer

### Outputs

- Y:T1
    - shape:\[batch,channel,height,width\]
    - Quantization support:per-layer

### Data Type Constraints

- T1:int8(Tensor),float16(Tensor)

## Elu

Given an input tensor, the function f(x)=alpha\*(exp(x)-1.) for x&lt;0, f(x)=x for x&gt;=0 is applied element-wise to the input tensor to produce the output tensor, where alpha=1

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

- T1:int8(Tensor),float16(Tensor)

## exSwish

Applies the Sigmoid Linear Unit function element-wise. The Swish function is also known as the SiLU function, y=x\*sigmoid(x)

### Inputs

- X:T1
    - shape:\[batch,channel,height,width\]
    - Quantization support:per-layer

### Outputs

- Y:T1
    - shape:\[batch,channel,height,width\]
    - Quantization support:per-layer

### Data Type Constraints

- T1:int8(Tensor),float16(Tensor)

## exMish

Given an input tensor, the function mish(x)=xtanh(softplus(x))=xtanh(ln(1+e^{x})) is applied element-wise to the input tensor to produce the output tensor

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

- T1:int8(Tensor),float16(Tensor)

## exGelu

Given an input tensor, y=x\*Φ(x) is applied element-wise to produce the output tensor. When Φ(x) is set to tanh: y=0.5\*x\*(1+Tanh(sqrt(2/π)\*(x+0.044715\*x^3))).

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

- T1:int8(Tensor),float16(Tensor)

## Where

Obtains values from x\_tensor or y\_tensor according to mask\_tensor. When the position of mask\_tensor is True, the value of x\_tensor at the corresponding position is taken; otherwise, the value of y\_tensor is taken.

### Inputs

- mask\_tensor:T1
    - shape:\[batch,channel,height,width\]
    - Broadcasting support
        - Supports broadcasting along arbitrary dimensions
    - Broadcasting constraints
        - Broadcasting constraints are the same as the Expand operator
- x\_tensor:\*T2
    - shape:\[batch,channel,height,width\]
    - Quantization support
        - per-layer
    - Broadcasting support
        - Supports broadcasting along arbitrary dimensions
    - Broadcasting constraints
        - Broadcasting constraints are the same as the Expand operator
- y\_tensor:T1
    - shape:\[batch,channel,height,width\]
    - Quantization support
        - per-layer
    - Broadcasting support
        - Supports broadcasting along arbitrary dimensions
    - Broadcasting constraints
        - Broadcasting constraints are the same as the Expand operator

### Outputs

- output:T2
    - shape:\[batch,channel,height,width\]
    - Quantization support
        - per-layer

### Data Type Constraints

- T1:bool(Tensor)
- T2:int8(Tensor),float16(Tensor)

## exGlu

Gated Linear Unit function, where a is the first half of the input matrix and b is the second half GLU(a,b)=a⊗σ(b)

### Inputs

- Input:T1
    - shape:\[batch,channel,height,width\]
    - Quantization support:per-layer

### Outputs

- Output:T1
    - shape:\[batch,channel/2,height,width\]
    - Quantization support:per-layer

### Data Type Constraints

- T1:int8(Tensor),float16(Tensor)

### Attributes

- axis: int (default value = 1)
    - The dimension to split the input
    - Constraint: only 1 is supported

## exMatMul

Matrix multiplication operation

```text
Y = A·B + C    if c_type = "add"
Y = A·B * C    if c_type = "mul"
```

### Inputs

- A:T1
    - shape:\[b,k,1,n\]
        - k ∈(0,8192\]
    - Quantization support
        - per-layer
- B:T1
    - shape:\[b,k,1,m\]
    - Quantization support
        - per-layer
- C(optional):T1,T2
    - shape:\[b,n,1,m\]
    - Quantization support
        - per-layer
    - Broadcasting support
        - Supports broadcasting along arbitrary dimensions
        - Broadcasting constraints are the same as the Expand operator

### Outputs

- Y:T1
    - shape:\[b,n,1,m\]
    - Quantization support
        - per-layer

### Data Type Constraints

- T1:int8(Tensor)
- T2:float(Tensor)

### Attributes

- c\_type: strings (default "add")
    - add and mul are optional, indicating whether C is added or multiplied

## exSDPAttention

Computes scaled dot-product attention (SDPA) between query, key, and value

### Inputs

- query:T1
    - shape:\[batch,channel,height,width\]
        - channel∈(0,8192\]
    - Quantization support
        - per-layer
- key:T1
    - shape:\[batch,channel,height,width\]
    - Quantization support
        - per-layer
- value:T1
    - shape:\[batch,channel,height,width\]
        - channel∈(0,8192\]
    - Quantization support
        - per-layer
- mask(optional):T1,T2
    - shape:\[batch,channel,height,width\]
    - Quantization support
        - per-layer
    - Broadcasting support
        - By default, supports broadcasting along arbitrary dimensions
- scale(optional):T3

### Outputs

- output:T1
    - shape:\[batch,channel,height,width\]
    - Quantization support
        - per-layer

### Data Type Constraints

- T1:int8(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)

## exWindow

exWindow originates from the window\_partition and window\_reverse operations of swin\_transformer. In the original paper, input features are divided into multiple non-overlapping windows, each of size window\_size × window\_size. Both input and output features are required to be 4-dimensional shapes, partitioned in both height and width directions. The pytorch implementation is as follows:

```python
def window_partition(x, window_size):
    """
    Args:
        x: (B, C, H, W)
        window_size (int): window size
    Returns:
        windows: (B, C, num_windows * num_windows, window_size * window_size)
    """
    B, C, H, W = x.shape
    x = x.view(B, C, H // window_size, window_size, W // window_size, window_size)
    windows = x.permute(0, 1, 2, 4, 3, 5).contiguous().view(B, C, -1, window_size * window_size)
    return windows

def window_reverse(windows, window_size, H, W):
    """
    Args:
        windows: (B, C, num_windows * num_windows, window_size * window_size)
        window_size (int): Window size
        H (int): Height of image
        W (int): Width of image
    Returns:
        x: (B, C, H, W)
    """
    B, C, _, _ = windows.shape
    x = windows.view(B, C, H // window_size, W // window_size, window_size, window_size)
    x = x.permute(0, 1, 2, 4, 3, 5).contiguous().view(B, C, H, W)
    return x
```

### Inputs

- X:T1
    - shape:\[batch,channel,height,width\]

### Outputs

- Y:T1
    - shape:\[batch,channel,height,width\]

### Data Type Constraints

- T1:int8(Tensor),float16(Tensor)

### Attributes

- mode:string
    - Supported modes: partition, reverse, partition\_num\_first
        - partition: implemented with reference to window\_partition;
        - reverse: implemented with reference to window\_reverse;
        - partition\_num\_first: the difference from partition is that the H,W of partition\_num\_first are divided according to num\_windows, while the H,W of partition are divided according to window\_sizes.
- window\_sizes:listofints
    - A 2-dimensional vector, the window size. Defines the height and width of each window. Attention computation and feature extraction within the window are based on this size.
- num\_windows:listofints
    - A 2-dimensional vector, the number of windows. Defines how many windows the height and width of the input feature are divided into.

### Other Support

- Multi-core: Not yet supported
{% endraw %}
