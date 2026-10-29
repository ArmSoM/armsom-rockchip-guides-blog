---
title: "RKNN2 V2.5.0 · RV1103B/RV1106B：Basics and convolution"
description: "RKNN2 V2.5.0 · RV1103B/RV1106B：Basics and convolution · Complete operator parameters and constraints from the V2.5.0 source."
excerpt: "RKNN2 V2.5.0 · RV1103B/RV1106B：Basics and convolution · Complete operator parameters and constraints from the V2.5.0 source."
translation_key: "rknn-v250-operators-rv1103b-rv1106b-convolution"
slug: "rknn-v250-operators-rv1103b-rv1106b-convolution"
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

Source pages: CN 317–324; EN 326–334.

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

**RKNN2 V2.5.0 · RV1103B/RV1106B：Basics and convolution**

[RKNN2 V2.5.0 · RV1103B/RV1106B：Recurrent networks, arithmetic and pooling](/articles/rknn-v250-operators-rv1103b-rv1106b-recurrent-pooling/)

[RKNN2 V2.5.0 · RV1103B/RV1106B：Shapes, slicing and transpose](/articles/rknn-v250-operators-rv1103b-rv1106b-shape-indexing/)

[RKNN2 V2.5.0 · RV1103B/RV1106B：Activations, normalization and extensions](/articles/rknn-v250-operators-rv1103b-rv1106b-activations-extensions/)

[RKNN2 V2.5.0 · CPU operator support and constraints](/articles/rknn-v250-operators-cpu/)

[RKNN2 V2.5.0 · GPU operator support and constraints](/articles/rknn-v250-operators-gpu/)

[RKNN2 V2.5.0 · Model I/O, alignment and convolution limits](/articles/rknn-v250-operators-model-io/)

</details>

{% raw %}

## RV1103B/RV1106B

## Add

Performs element-wise binary addition(C=A+B),supporting multi-directional NumPy-style broadcasting

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

## AddRelu

Add and Relu fused computation, C=Relu(A+B)

### Inputs

- Same as Add

### Outputs

- Same as Add

### Other Support

- Multi-core: Supported

## BatchNormalization

Performs batch normalization on the input tensor according to the description in https://arxiv.org/abs/1502.03167

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

- epsilon: float (default value = 1e-5)
    - A real number added when dividing by the standard deviation to prevent division by 0
    - epsilon∈(0,∞\]
- momentum:float
    - Sliding average parameters during training

## Concat

Concatenate a sequence of vectors into a single vector along the axis specified by axis. All vectors must be the same size except in the axis dimension

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

- axisint64
    - axis∈{0,1,2,3}

## Convolution

Convolution

### Inputs

- input\_tensor:T1
    - shape:\[batch,channel,height,width\]
        - width: when dilated\_kernel\_h&gt;1, width&lt;16383. In addition, the first-layer input width is restricted; see the model input description for details.
    - Quantization support
        - per-layer
- weight:T1
    - shape:\[output\_channel,input\_channel,kernel\_h,kernel\_w\]
        - kernel\_h∈\[1,31\]
        - kernel\_w∈\[1,31\]
    - Quantization support
        - per-layer
        - per-channel

### Outputs

- output:T1
    - shape:\[batch,channel,height,width\]
    - Quantization support
        - per-layer

### Attributes

- strides:int(strides\_h,strides\_w)
    - stride\_h∈\[1,7\]
    - stride\_w∈\[1,7\]
- pads:int(pads\_top,pads\_left,pads\_bottom,pads\_right)
    - pads\_top∈\[0,15\]
    - pads\_left∈\[0,15\]
    - pads\_bottom∈\[0,15\]
    - pads\_right∈\[0,15\]
- group:int
- dilations:int(dilations\_h,dilations\_w)
    - dilations\_h∈\[1,31\]
    - dilations\_w∈\[1,31\]

### Data Type Constraints

- T1:int8(Tensor)

## Depthwise Convolution

Depthwise separable convolution

### Inputs

- input\_tensor:T1
    - shape:\[batch,channel,height,width\]
        - width: when dilated\_kernel\_h&gt;1, width&lt;16383. In addition, the first-layer input width is restricted; see the model input description for details.
    - Quantization support
        - per-layer
- weight:T1
    - shape:\[output\_channel,input\_channel,kernel\_h,kernel\_w\]
        - kernel\_h∈\[1,8\]
        - kernel\_w∈\[1,8\]
    - Quantization support
        - per-layer
        - per-channel

### Outputs

- output:T1
    - shape:\[batch,channel,height,width\]
    - Quantization support
        - per-layer

### Attributes

- strides:int(strides\_h,strides\_w)
    - stride\_h∈\[1,7\]
    - stride\_w∈\[1,7\]
- pads:int(pads\_top,pads\_left,pads\_bottom,pads\_right)
    - pads\_top∈\[0,15\]
    - pads\_left∈\[0,15\]
    - pads\_bottom∈\[0,15\]
    - pads\_right∈\[0,15\]
- group:int
- dilations:int(dilations\_h,dilations\_w)
    - dilations\_h∈\[1,32\]
    - dilations\_w∈\[1,32\]

### Data Type Constraints

- T1:int8(Tensor)

## ConvolutionRelu

Convolution and Relu fused computation, Output=Relu(Conv(Input)). Description and specification constraints are the same as Convolution

## ConvolutionClip

Convolution and Clip fused computation, Output=Clip(Conv(Input)). Description and specification constraints are the same as Convolution

## ConvolutionPRelu/LeakyRelu

Convolution and PRelu/LeakyRelu fused computation, Output = PRelu(Conv(Input)) or Output = LeakyRelu(Conv(Input)). Description and specification constraints are the same as Convolution

## ConvolutionAdd

Convolution and Add fused computation, Output=Add(Conv(Input0),Input1). Description and specification constraints are the same as Convolution

## ConvolutionSigmoid

Convolution and Sigmoid fused computation, Output=Sigmoid(Conv(Input)). Description and specification constraints are the same as Convolution

## ConvolutionTanh

Convolution and Tanh fused computation, Output=Tanh(Conv(Input)). Description and specification constraints are the same as Convolution

## ConvolutionSoftplus

Convolution and Softplus fused computation, Output=Softplus(Conv(Input)). Description and specification constraints are the same as Convolution

## ConvolutionHardSigmoid

Convolution and HardSigmoid fused computation, Output=HardSigmoid(Conv(Input)). Description and specification constraints are the same as Convolution

## ConvolutionHardSwish

Convolution and HardSwish fused computation, Output=HardSwish(Conv(Input)). Description and specification constraints are the same as Convolution

## ConvolutionElu

Convolution and Elu fused computation, Output=Elu(Conv(Input)). Description and specification constraints are the same as Convolution

## ConvolutionSwish

Convolution and Swish fused computation, Output=Swish(Conv(Input)). Description and specification constraints are the same as Convolution

## ConvolutionMish

Convolution and Mish fused computation, Output=Mish(Conv(Input)). Description and specification constraints are the same as Convolution

## ConvTranspose

Transposed convolution

### Inputs

- input\_tensor:T1
    - shape:\[batch,channel,height,width\]
        - width: when dilated\_kernel\_h&gt;1, width&lt;16383. In addition, the first-layer input width is restricted; see the model input description for details.
- Quantization support
    - per-layer
- weight:T1
    - shape:\[output\_channel,input\_channel,kernel\_h,kernel\_w\]
        - kernel\_h∈\[1,31\]
        - kernel\_w∈\[1,31\]
    - Quantization support
        - per-layer
        - per-channel

### Outputs

- output:T1
    - shape:\[batch,channel,height,width\]
    - Quantization support
        - per-layer

### Attributes

- strides:int(strides\_h,strides\_w)
    - stride\_h∈\[1,8\]
    - stride\_w∈\[1,8\]
- pads:int(pads\_top,pads\_left,pads\_bottom,pads\_right) Note when setting pad: kernel\_hdilations\_h-dilations\_h-pads\_top&lt;0 is not supported; kernel\_wdilations\_w- dilations\_w-pads\_left&lt;0 is not supported; stride\_h(height-1)-pads\_top+1&lt;output\_h is not supported; stride\_w(width-1)-pads\_left+1&lt;output\_w is not supported
    - pads\_top∈\[0,15\]
    - pads\_left∈\[0,15\]
    - pads\_bottom∈\[0,15\]
    - pads\_right∈\[0,15\]
- group:int
    - group: only 1 is supported; num\_output is supported if and only if num\_input=num\_output
- dilations:int(dilations\_h,dilations\_w)
    - dilations\_h∈\[1,32\]
    - dilations\_w∈\[1,32\]
    - When dilation is not equal to (1,1), only kernel=(1,1) is supported

### Data Type Constraints

- T1:int8(Tensor)

## ConvTranposeRelu

ConvTranspose and Relu fused computation, Output=Relu(ConvTranspose(Input)). Description and specification constraints are the same as ConvTranspose

## ConvTranposeClip

ConvTranspose and Clip fused computation, Output=Clip(ConvTranspose(Input)). Description and specification constraints are the same as ConvTranspose

## ConvTranposePRelu/LeakyRelu

ConvTranspose and PRelu/LeakyRelu fused computation, Output=PRelu(ConvTranspose(Input)) or Output= LeakyRelu(ConvTranspose(Input)). Description and specification constraints are the same as ConvTranspose

{% endraw %}
