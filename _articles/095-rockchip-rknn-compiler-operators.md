---
title: "RKNN Compiler V2.3.2 Complete Operator Specifications: Seven NPU Platform Groups, CPU and I/O Limits"
description: "Full platform-specific operators, data types, quantization, broadcasting, attributes, formulas and zero-copy alignment matrices, with source ambiguities disclosed for ArmSoM adaptation."
translation_key: "095-rockchip-rknn-compiler-operators"
slug: "095-rockchip-rknn-compiler-operators"
lang: "en"
date: "2026-10-22"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
tags: ["ArmSoM", "Rockchip", "RKNN", "NPU", "RK3588", "RK3576"]
excerpt: "Full platform-specific operators, data types, quantization, broadcasting, attributes, formulas and zero-copy alignment matrices, with source ambiguities disclosed for ArmSoM adaptation."
---

{% raw %}

# RKNN Compiler V2.3.2 Complete Operator Specifications: Seven NPU Platform Groups, CPU and I/O Limits

This complete technical reference follows RK-YH-YF-418 / V2.3.2. It covers seven NPU platform groups: RK3566/RK3568, RK3588, RK3562, RV1103/RV1106, RK3576/RV1126B, RK2118 and RV1103B/RV1106B, plus CPU operators and model I/O restrictions. The PDFs in the Chinese and English directories both have 343 pages and identical SHA-256 hashes; their actual text is Chinese, with no separate English original. English, Russian and German fully translate that Chinese source. All four versions reuse the same Chinese original figures; these are not presented as English-language figures. This is an ArmSoM platform-adaptation reference only: verify board SoC, RKNN-Toolkit2/Compiler/Runtime versions, SDK/BSP, kernel driver, quantization, model and zero-copy interfaces. The source does not prescribe one kernel version for every operator and does not prove support on every ArmSoM board. No model execution, performance measurement or hardware validation was performed.

[ArmSoM Docs](https://docs.armsom.org/) · [RKNN-Toolkit2](https://github.com/airockchip/rknn-toolkit2) · [EDITORIAL-NOTES](/docs/rockchip-rknn-compiler-operators/EDITORIAL-NOTES.md)



<!-- PDF p.9 -->

## Software change history



<!-- PDF p.9 -->

### 2.1 V2.3.2


- (1) Added documentation for RV1126B.
- (2) Added documentation for RV1106B.
- (3) Updated ConvDilation parameter limits on all platforms.
- (4) Updated Resize operator limits.


<!-- PDF p.9 -->

### 2.2 V2.3.0


- (1) Added documentation of exNorm mean&#95;var mode on RK3576/RK3588/RK3562/RK3568.
- (2) MAX/MIN OPs support Broadcast on all platforms.
- (3) Changed the RK3576 Softmax limits.


<!-- PDF p.10 -->

### 2.3 V2.2.0


- (1) Changed softmax limits on all platforms except rk3568; added softmax splitting.
- (2) Added RMSNorm support on RK3576, RK3588, RK3562 and RK3568.


<!-- PDF p.10 -->

### 2.4 V2.1.0


- (1) Added RK2118 documentation.
- (2) Added RV1103B documentation.
- (3) Updated operator specifications on all platforms.
- (4) Added RK3576 operator specifications, including Hardmax and ConvLut.
- (5) RK2118 exConvStreaming support.
- (6) Added FlashAttentionV2 optimization support to exSDPA on RK3562/RK3576.


<!-- PDF p.10 -->

### 2.5 V2.0.0‑beta


- (1) Added supported-operator specifications for RK3576.
- (2) Added hardware-support specifications for exSDPAttention and exMatMul on RK3588/RK3562/RK3576.
- (3) Added CPU operator support for Floor, Mod, And, GatherElements and exMeanVarianceNormalization.
- (4) Added supported-operator specifications for RK2118.


<!-- PDF p.11 -->

## NPU operator specifications



<!-- PDF p.12 -->

### 3.1 RK3566/RK3568



<!-- PDF p.12 -->

#### 3.1.1 Add



Performs elementwise binary addition (C=A+B), supporting multidirectional NumPy-style broadcasting.



**Inputs**


- A:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.
- B:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.


**Outputs**


- C:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(constTensor)


<!-- PDF p.12 -->

#### 3.1.2 AddRelu



Fused Add and Relu computation, C=Relu(A+B).



**Inputs**


- Same as Add.


**Outputs**


- Same as Add.


**Other support**


- Multi-core cooperation: supported.


<!-- PDF p.13 -->

#### 3.1.3 BatchNormalization



Applies batch normalization to the input tensor as described in https://arxiv.org/abs/1502.03167.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Attributes**


- epsilon:float (default=1e‑5)
  - Real value added when dividing by the standard deviation to prevent division by 0.
  - epsilon∈(0,∞&#93;
- momentum:float
  - Moving-average parameter used during training.


<!-- PDF p.13 -->

#### 3.1.4 Concat



Concatenates a sequence of vectors along axis into one vector. All vector dimensions other than axis must match.



**Inputs**


- input&#95;tensor:T
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T:int8(Tensor),float16(Tensor)


**Attributes**


- axisint64
  - axis∈{0,1,2,3}


<!-- PDF p.14 -->

#### 3.1.5 Convolution



Convolution



**Inputs**


- input&#95;tensor:T1
  - shape:&#91;batch,channel,height,width&#93;
    - width: when dilated&#95;kernel&#95;h&gt;1, width&lt;16383. Additional limits apply to the first-layer input width; see the model-input description.
  - Quantization support
    - per‑layer
- weight:T1
  - shape:&#91;output&#95;channel,input&#95;channel,kernel&#95;h,kernel&#95;w&#93;


```text
kernel_h∈[1,31]
```


- 


```text
kernel_w∈[1,31]
```


- 
- Quantization support
  - per‑layer
  - per‑channel


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Attributes**


- strides:int(strides&#95;h,strides&#95;w)
  - stride&#95;h∈&#91;1,7&#93;
  - stride&#95;w∈&#91;1,7&#93;
- pads:int(pads&#95;top,pads&#95;left,pads&#95;bottom,pads&#95;right)
  - pads&#95;top∈&#91;0,15&#93;
  - pads&#95;left∈&#91;0,15&#93;
  - pads&#95;bottom∈&#91;0,15&#93;
  - pads&#95;right∈&#91;0,15&#93;
- group:int
- dilations:int(dilations&#95;h,dilations&#95;w)
  - dilations&#95;h∈&#91;1,31&#93;
  - dilations&#95;w∈&#91;1,31&#93;


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


<!-- PDF p.15 -->

#### 3.1.6 DepthwiseConvolution



Depthwise separable convolution



**Inputs**


- input&#95;tensor:T1
  - shape:&#91;batch,channel,height,width&#93;
    - width: when dilated&#95;kernel&#95;h&gt;1, width&lt;16383. Additional limits apply to the first-layer input width; see the model-input description.
  - Quantization support
    - per‑layer
- weight:T1
  - shape:&#91;output&#95;channel,input&#95;channel,kernel&#95;h,kernel&#95;w&#93;


```text
kernel_h∈[1,8]
```


- 


```text
kernel_w∈[1,8]
```


- 
- Quantization support
  - per‑layer
  - per‑channel


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Attributes**


- strides:int(strides&#95;h,strides&#95;w)
  - stride&#95;h∈&#91;1,7&#93;
  - stride&#95;w∈&#91;1,7&#93;
- pads:int(pads&#95;top,pads&#95;left,pads&#95;bottom,pads&#95;right)
  - pads&#95;top∈&#91;0,15&#93;
  - pads&#95;left∈&#91;0,15&#93;
  - pads&#95;bottom∈&#91;0,15&#93;
  - pads&#95;right∈&#91;0,15&#93;
- group:int
- dilations:int(dilations&#95;h,dilations&#95;w)
  - dilations&#95;h∈&#91;1,32&#93;
  - dilations&#95;w∈&#91;1,32&#93;


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


<!-- PDF p.16 -->

#### 3.1.7 ConvolutionRelu



Fused Convolution and Relu computation, Output=Relu(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.16 -->

#### 3.1.8 ConvolutionClip



Fused Convolution and Clip computation, Output=Clip(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.16 -->

#### 3.1.9 ConvolutionPRelu/LeakyRelu



Fused Convolution and PRelu/LeakyRelu computation, Output = PRelu(Conv(Input)) or Output =



LeakyRelu(Conv(Input))



Description and specification limits are the same as Convolution.



<!-- PDF p.16 -->

#### 3.1.10 ConvolutionAdd



Fused Convolution and Add computation, Output=Add(Conv(Input0),Input1).



Description and specification limits are the same as Convolution.



<!-- PDF p.16 -->

#### 3.1.11 ConvolutionSigmoid



Fused Convolution and Sigmoid computation, Output=Sigmoid(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.16 -->

#### 3.1.12 ConvolutionTanh



Fused Convolution and Tanh computation, Output=Tanh(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.17 -->

#### 3.1.13 ConvolutionSoftplus



Fused Convolution and Softplus computation, Output=Softplus(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.17 -->

#### 3.1.14 ConvolutionHardSigmoid



Fused Convolution and HardSigmoid computation, Output=HardSigmoid(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.17 -->

#### 3.1.15 ConvolutionHardSwish



Fused Convolution and HardSwish computation, Output=HardSwish(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.17 -->

#### 3.1.16 ConvolutionElu



Fused Convolution and Elu computation, Output=Elu(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.17 -->

#### 3.1.17 ConvolutionSwish



Fused Convolution and Swish computation, Output=Swish(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.17 -->

#### 3.1.18 ConvolutionMish



Fused Convolution and Mish computation, Output=Mish(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.17 -->

#### 3.1.19 ConvolutionAddRelu



Fused Convolution, Add and Relu computation, Output=Relu(Add(Conv(Input0),Input1)).



Description and specification limits are the same as Convolution.



<!-- PDF p.18 -->

#### 3.1.20 ConvTranspose



Transposed convolution



**Inputs**


- input&#95;tensor:T1
  - shape:&#91;batch,channel,height,width&#93;
    - width: when dilated&#95;kernel&#95;h&gt;1, width&lt;16383. In addition, the first-layer input


width is constrained; see model-input instructions.



```text
- **量化支持**
  - per-layer
```


- weight:T1
  - shape:&#91;output&#95;channel,input&#95;channel,kernel&#95;h,kernel&#95;w&#93;


```text
kernel_h∈[1,31]
```


- 


```text
kernel_w∈[1,31]
```


- 
- Quantization support
  - per‑layer
  - per‑channel


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Attributes**


- strides:int(strides&#95;h,strides&#95;w)
  - stride&#95;h supports only 1,2,4,8.
  - stride&#95;w supports only 1,2,4,8.
- pads:int(pads&#95;top,pads&#95;left,pads&#95;bottom,pads&#95;right). When setting pad, note that the following are unsupported: kernel&#95;h&#42;dilations&#95;h‑dilations&#95;h‑pads&#95;top&lt;0; kernel&#95;w&#42;dilations&#95;w‑dilations&#95;w‑pads&#95;left&lt;0; stride&#95;h&#42;(height‑1)‑pads&#95;top+1&lt;output&#95;h; stride&#95;w&#42;(width‑1)‑pads&#95;left+1&lt;output&#95;w.
  - pads&#95;top∈&#91;0,15&#93;
  - pads&#95;left∈&#91;0,15&#93;
  - pads&#95;bottom∈&#91;0,15&#93;
  - pads&#95;right∈&#91;0,15&#93;
- group:int
  - group: only 1 is supported; num&#95;output is supported if and only if num&#95;input=num&#95;output.
- dilations:int(dilations&#95;h,dilations&#95;w)
  - dilations&#95;h∈&#91;1,32&#93;
  - dilations&#95;w∈&#91;1,32&#93;
  - When dilation differs from (1,1), only kernel=(1,1) is supported.


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


<!-- PDF p.19 -->

#### 3.1.21 ConvTranposeRelu



Fused ConvTranpose and Relu computation, Output=Relu(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.19 -->

#### 3.1.22 ConvTranposeClip



Fused ConvTranpose and Clip computation, Output=Clip(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.19 -->

#### 3.1.23 ConvTranposePRelu/LeakyRelu



Fused ConvTranpose and PRelu/LeakyRelu computation, Output=PRelu(ConvTranpose(Input)) or Output=



LeakyRelu(ConvTranpose(Input))



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.19 -->

#### 3.1.24 ConvTranposeAdd



Fused ConvTranpose and Add computation, Output=Add(ConvTranpose(Input0),Input1).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.19 -->

#### 3.1.25 ConvTranposeSigmoid



Fused ConvTranpose and Sigmoid computation, Output=Sigmoid(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.20 -->

#### 3.1.26 ConvTranposeTanh



Fused ConvTranpose and Tanh computation, Output=Tanh(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.20 -->

#### 3.1.27 ConvTranposeSoftplus



Fused ConvTranpose and Softplus computation, Output=Softplus(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.20 -->

#### 3.1.28 ConvTranposeHardSigmoid



Fused ConvTranpose and HardSigmoid computation, Output=HardSigmoid(ConvTranpose(Input)).



<!-- PDF p.20 -->

#### 3.1.29 ConvTranposeHardSwish



Fused ConvTranpose and HardSwish computation, Output=HardSwish(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.20 -->

#### 3.1.30 ConvTranposeElu



Fused ConvTranpose and Elu computation, Output=Elu(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.20 -->

#### 3.1.31 ConvTranposeSwish



Fused ConvTranpose and Swish computation, Output=Swish(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.20 -->

#### 3.1.32 ConvTranposeMish



Fused ConvTranpose and Mish computation, Output=Mish(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.21 -->

#### 3.1.33 Div



Performs elementwise binary division (C=A/B), supporting multidirectional NumPy-style broadcasting.



**Inputs**


- A:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.
- B:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.


**Outputs**


- C:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:float16(Tensor)
- T2:float(constTensor)


<!-- PDF p.21 -->

#### 3.1.34 Expand



Broadcasts the input tensor using the given shape and broadcasting rules, similar to numpy.array(input) &#42;numpy.ones(shape): dimensions are right-aligned; each pair of corresponding dimensions must be equal or one of them must be 1.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
- shape:T2
  - shape:&#91;batch,channel,height,width&#93;


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:int64(Tensor)


Broadcasting constraints


- &#91;b,c,1,w&#93;‑&gt;&#91;b,c,h,w&#93;,h∈&#91;1,8192&#93;
- &#91;b,1,1,w&#93;‑&gt;&#91;b,c,h,w&#93;,h∈&#91;1,8192&#93;
- &#91;b,c,h,1&#93;‑&gt;&#91;b,c,h,w&#93;,w ∈&#91;1,8192&#93;
- &#91;b,1,h,1&#93;‑&gt;&#91;b,c,h,w&#93;,w ∈&#91;1,8192&#93;
- &#91;b,c,1,1&#93;‑&gt;&#91;b,c,h,w&#93;,h∈&#91;1,8192&#93;,w ∈&#91;1,8192&#93;


<!-- PDF p.22 -->

#### 3.1.35 GRU



Gated Recurrent Unit (GRU). GRU extensions and variants are named exGRU; parameters marked (extern) are exclusive to exGRU. The equations follow:



```text
f = Sigmoid; g = Tanh
r_t = f(x_t · W_r + h_{t-1} · R_r + Wb_r + Rb_r)
z_t = f(x_t · W_z + h_{t-1} · R_z + Wb_z + Rb_z)
h_t = g(x_t · W_h + (r_t ⊙ h_{t-1}) · R_h + Rb_h + Wb_h), (WRB = 0)
h_t = g(x_t · W_h + r_t ⊙ (h_{t-1} · R_h + Rb_h)) + Wb_h, (WRB = 1)
H_t = (1-z_t) ⊙ h_t + z_t ⊙ h_{t-1}
```



**Inputs**


- X:T1
  - shape:&#91;seq&#95;length,batch&#95;size,input&#95;size&#93;


```text
seqlength∈(0,8192]
```


- batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
- 


```text
inputsize∈(0,8192]
```


- 
- Quantization support
  - per‑layer
- W:T1
  - shape:&#91;num&#95;directions,4&#42;hidden&#95;size,input&#95;size&#93;


```text
inputsize∈(0,8192]
```


- 


```text
hiddensize∈(0,8192]
```


- 
- numdirections:1or2
- Quantization support
  - per‑layer
  - per‑channel
- R:T1
  - shape:&#91;num&#95;directions,4&#42;hidden&#95;size,hidden&#95;size&#93;


```text
hiddensize∈(0,8192]
```


- 
- numdirections:1or2
- Quantization support
  - per‑layer
  - per‑channel
- B:T2
  - shape:&#91;num&#95;directions,8&#42;hidden&#95;size&#93;


```text
hiddensize∈(0,8192]
```


- 
- numdirections:1or2
- Quantization support
  - per‑layer
  - per‑channel
- sequence&#95;lens:T3(optional)
  - shape:&#91;batch&#95;size&#93;; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
    - 
- initial&#95;h:T1(optional)
  - shape:&#91;num&#95;directions,batch&#95;size,hidden&#95;size&#93;
    - numdirections:1or2; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
    - 


```text
hiddensize∈(0,8192]
```


- 
- Quantization support
  - per‑layer


**Outputs**


- Y:T1
  - shape:&#91;seq&#95;length,num&#95;directions,batch&#95;size,hidden&#95;size&#93;


```text
seqlength∈(0,8192]
```


- 
- numdirections:1or2; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
- 


```text
hiddensize∈(0,8192]
```


- 
- Quantization support
  - per‑layer
- Y&#95;h:T1(optional)
  - shape:&#91;num&#95;directions,batch&#95;size,hidden&#95;size&#93;
    - numdirections:1or2; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
    - 


```text
hiddensize∈(0,8192]
```


- 
- Quantization support
  - per‑layer


**Attributes**


- linear&#95;before&#95;reset:int
  - Selects the LBR variant:1(T)or0(F).
- direction(extern):string
  - Specifies the GRU processing direction.
  - forward: processes GRU forwards.
  - reverse: processes GRU backwards.
  - bidirectional: processes GRU in both directions.
- sequence&#95;size(extern):int
  - Specifies the GRU input seqsize; unrestricted, but alignment to 4 is recommended.
- hidden&#95;size(extern):int
  - hiddensize within the GRU unit; unrestricted, but alignment to 8 is recommended.
- input&#95;layout(extern):int
  - Specifies a layout consistent with the meaning of the corresponding input shape.
  - The specified layout and the actual batch&#95;size, sequence&#95;size and hidden&#95;size of this op must be provided.
  - snc: the input shape for this layout is &#91;seqs,batches,input&#95;size&#93;.
  - (sn)c: the input shape for this layout is &#91;seqs&#42;batches,input&#95;size,1,1&#93;.
- output&#95;layout(extern):int
  - Specifies a layout consistent with the meaning of the corresponding output shape.
  - The specified layout and the actual batch&#95;size, sequence&#95;size, hidden&#95;size and directions of this op must be provided.
  - sbnc: the output shape for this layout is &#91;seqs,directions,batches,hidden&#95;size&#93;.
  - (sn)c: the output shape for this layout is &#91;seqsbatches,directionsinput&#95;size,1,1&#93;.


**Data-type constraints**


- T1:float16(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.25 -->

#### 3.1.36 Gather



Uses Indices to select entries of input X along the specified axis and concatenates them.



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
- Indices:T2
  - Indices of the elements to gather; rank =1.


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:int(Tensor)


**Attributes**


- axis:int(Tensor)
  - axis∈{0,1,2,3}
  - Specifies the input dimension accessed by Indices.


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.25 -->

#### 3.1.37 LSTM



Long Short-Term Memory (LSTM). LSTM extensions and variants are named exLSTM; parameters marked (extern) are exclusive to exLSTM. The equations follow:



```text
f = Sigmoid; g = Tanh; h = Tanh
i_t = f(x_t · W_i + h_{t-1} · R_i + Wb_i + Rb_i)
f_t = f(x_t · W_f + h_{t-1} · R_f + Wb_f + Rb_f)
c_t = f(x_t · W_c + h_{t-1} · R_c + Wb_c + Rb_c)
o_t = f(x_t · W_o + h_{t-1} · R_o + Wb_o + Rb_o)
C_t = f_t ⊙ C(t-1) + i_t ⊙ c_t
h_t = o_t ⊙ h(C_t)
```



**Inputs**


- X:T1
  - shape:&#91;seq&#95;length,batch&#95;size,input&#95;size&#93;


```text
seqlength∈(0,8192]
```


- batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
- 


```text
inputsize∈(0,8192]
```


- 
- Quantization support
  - per‑layer
- W:T1
  - shape:&#91;num&#95;directions,4&#42;hidden&#95;size,input&#95;size&#93;


```text
inputsize∈(0,8192]
```


- 


```text
hiddensize∈(0,8192]
```


- 
- numdirections:1or2
- Quantization support
  - per‑layer
  - per‑channel
- R:T1
  - shape:&#91;num&#95;directions,4&#42;hidden&#95;size,hidden&#95;size&#93;


```text
hiddensize∈(0,8192]
```


- 
- numdirections:1or2
- Quantization support
  - per‑layer
  - per‑channel
- B:T2,T3
  - shape:&#91;num&#95;directions,8&#42;hidden&#95;size&#93;


```text
hiddensize∈(0,8192]
```


- 
- numdirections:1or2
- Quantization support
  - per‑layer
  - per‑channel
- sequence&#95;lens:T4,T5(optional)
  - shape:&#91;batch&#95;size&#93;; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
    - 
- initial&#95;h:T1(optional)
  - shape:&#91;num&#95;directions,batch&#95;size,hidden&#95;size&#93;
    - numdirections:1or2; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
    - 


```text
hiddensize∈(0,8192]
```


- 
- Quantization support
  - per‑layer
- initial&#95;c:T1(optional)
  - shape:&#91;num&#95;directions,batch&#95;size,hidden&#95;size&#93;
    - numdirections:1or2; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
    - 


```text
hiddensize∈(0,8192]
```


- 
- Quantization support
  - per‑layer


**Outputs**


- Y:T1
  - shape:&#91;seq&#95;length,num&#95;directions,batch&#95;size,hidden&#95;size&#93;


```text
seqlength∈(0,8192]
```


- 
- numdirections:1or2; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
- 


```text
hiddensize∈(0,8192]
```


- 
- Quantization support
  - per‑layer
- Y&#95;h:T1(optional)
  - shape:&#91;num&#95;directions,batch&#95;size,hidden&#95;size&#93;
    - numdirections:1or2; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
    - 


```text
hiddensize∈(0,8192]
```


- 
- Quantization support
  - per‑layer
- Y&#95;c:T1(optional)
  - shape:&#91;num&#95;directions,batch&#95;size,hidden&#95;size&#93;
    - numdirections:1or2; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
    - 


```text
hiddensize∈(0,8192]
```


- 
- Quantization support
  - per‑layer


**Attributes**


- direction(extern):string
  - Specifies the LSTM processing direction.
  - forward: processes LSTM forwards.
  - reverse: processes LSTM backwards.
  - bidirectional: processes LSTM in both directions.
- sequence&#95;size(extern):int
  - Specifies the LSTM input seqsize; unrestricted, but alignment to 4 is recommended.
- hidden&#95;size(extern):int
  - hiddensize within the LSTM unit; unrestricted, but alignment to 8 is recommended.
- proj&#95;size(extern):int
  - proj&#95;size for projection; projsize∈&#91;0,hiddensize&#93;.
  - Currently restricted to 0; projection is not yet supported.
- input&#95;forget(extern):int
  - Selects the cifg variant:1(T)or0(F). Currently restricted to 0, so it is not yet supported.
- has&#95;projection(extern):int
  - projection variant:1(T)or0(F). Currently restricted to 0, so it is not yet supported.
- input&#95;layout(extern):int
  - Specifies a layout consistent with the meaning of the corresponding input shape.
  - The specified layout and the actual batch&#95;size, sequence&#95;size and hidden&#95;size of this op must be provided.
  - snc: the input shape for this layout is &#91;seqs,batches,input&#95;size&#93;.
  - (sn)c: the input shape for this layout is &#91;seqs&#42;batches,input&#95;size,1,1&#93;.
- output&#95;layout(extern):int
  - Specifies a layout consistent with the meaning of the corresponding output shape.
  - The specified layout and the actual batch&#95;size, sequence&#95;size, hidden&#95;size and directions of this op must be provided.
  - sbnc: the output shape for this layout is &#91;seqs,directions,batches,hidden&#95;size&#93;.
  - (sn)c: the output shape for this layout is &#91;seqsbatches,directionsinput&#95;size,1,1&#93;.


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)
- T3:int32(Tensor)
- T4:float(Scalar)
- T5:int(Scalar)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.28 -->

#### 3.1.38 Max



Computes the elementwise maximum of the input tensors.



**Inputs**


- A:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.
- B:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.


**Outputs**


- C:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer/per‑channel


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.29 -->

#### 3.1.39 Min



Computes the elementwise minimum of the input tensors.



**Inputs**


- A:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.
- B:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.


**Outputs**


- C:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer/per‑channel


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.30 -->

#### 3.1.40 Mul



Performs elementwise binary multiplication (C=A&#42;B), supporting multidirectional NumPy-style broadcasting.



**Inputs**


- A:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.
- B:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.


**Outputs**


- C:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(constTensor)


<!-- PDF p.31 -->

#### 3.1.41 MulRelu



Other descriptions are the same as Mul.


- Supported data types: same as Mul.


<!-- PDF p.31 -->

#### 3.1.42 Pad



Given a data tensor (data), a tensor of beginning/end padding values for each axis (pads), a mode (mode) and a constant value (constant&#95;value), produces a padded tensor (output).



**Inputs**


- data:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
- pads:T2
  - shape : &#91;batch&#95;begin, channel&#95;begin, height&#95;begin, width&#95;begin, batch&#95;end, chan‑nel&#95;end,height&#95;end,width&#95;end&#93;
- constant&#95;value(optional):T3
  - shape:&#91;1&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:int64(Tensor)
- T3:float(Scalar),int8(Scalar),float16(Scalar)


**Attributes**


- mode:string (default constant)
  - Supported modes: constant,reflect.
    - constant: unrestricted.


```text
reflectchannel∈(0,8192],height∈(0,8192],width∈(0,8176]
```


- 


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.32 -->

#### 3.1.43 MaxPool



MaxPool consumes input tensor X and applies max pooling according to kernel size, stride size and pad lengths. It computes the maximum over subsets of the input tensor determined by the kernel, downsampling into output tensor Y for further processing. The output spatial shape depends on whether explicit padding (pads) or automatic padding (auto&#95;pad) is used. Only explicit padding is used here.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;


```text
channel∈(0,8192]
```


- 


```text
height∈(0,8192]
```


- 


```text
width∈(0,8192]
```


- 


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Attributes**


- kernel&#95;shape:int64(kernel&#95;h,kernel&#95;w)
  - kernel&#95;h∈(0,7&#93;
  - kernel&#95;w∈(0,7&#93;
- auto&#95;pad:string
  - Padding mode: only NOTSET is supported.
- ceil&#95;mode:int64
  - Computing output shape using ceil or floor: unsupported.
- strides:int64(strides&#95;h,strides&#95;w)
  - strides&#95;h∈(0,8&#93;
  - strides&#95;w∈(0,8&#93;
- count&#95;include&#95;pad:int64&#91;&#93;
  - count&#95;include&#95;pad, whether to include pad values in calculation:1.
- pad:int64(pad&#95;top,pad&#95;left,pad&#95;bottom,pad&#95;right)
  - pad&#95;top∈&#91;0,7&#93;
  - pad&#95;left∈&#91;0,7&#93;
  - pad&#95;bottom∈&#91;0,7&#93;
  - pad&#95;right∈&#91;0,7&#93;
- storage&#95;order:int64
  - Preferred storage order:0.


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)


<!-- PDF p.33 -->

#### 3.1.44 GlobalMaxPool



GlobalMaxPool takes input tensor X and applies max pooling to values within each channel. It is equivalent to MaxPool with kernel&#95;shape equal to the spatial dimensions of input.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;


```text
channel∈(0,8192]
```


- 


```text
height∈(1,7]
```


- 


```text
width∈(1,7]
```


- 


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Attributes**


- kernel&#95;shape:int64(kernel&#95;h,kernel&#95;w)
  - kernel&#95;h∈(0,7&#93;
  - kernel&#95;w∈(0,7&#93;
- auto&#95;pad:string
  - Padding mode: only NOTSET is supported.
- ceil&#95;mode:int64
  - Computing output shape using ceil or floor: unsupported.
- strides:int64(strides&#95;h,strides&#95;w)
  - strides&#95;h∈(0,8&#93;
  - strides&#95;w∈(0,8&#93;
- count&#95;include&#95;pad:int64&#91;&#93;
  - count&#95;include&#95;pad, whether to include pad values in calculation:1.
- pad:int64(pad&#95;top,pad&#95;left,pad&#95;bottom,pad&#95;right)
  - pad&#95;top∈&#91;0,7&#93;
  - pad&#95;left∈&#91;0,7&#93;
  - pad&#95;bottom∈&#91;0,7&#93;
  - pad&#95;right∈&#91;0,7&#93;


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)


<!-- PDF p.34 -->

#### 3.1.45 AveragePool



AveragePool consumes input tensor X and applies average pooling according to kernel size, stride size and pad lengths. It averages all values in subsets of the input tensor determined by the kernel and downsamples into output tensor Y for further processing. The output spatial shape depends on whether explicit padding (pads) or automatic padding (auto&#95;pad) is used. Only explicit padding is used here.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;


```text
channel∈(0,8192]
```


- 


```text
height∈(0,8192]
```


- 


```text
width∈(0,8192]
```


- 


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Attributes**


- kernel&#95;shape:int64(kernel&#95;h,kernel&#95;w)
  - kernel&#95;h∈(0,7&#93;
  - kernel&#95;w∈(0,7&#93;
- auto&#95;pad:string
  - Padding mode: only NOTSET is supported.
- ceil&#95;mode:int64
  - Computing output shape using ceil or floor: unsupported.
- strides:int64(strides&#95;h,strides&#95;w)
  - strides&#95;h∈(0,8&#93;
  - strides&#95;w∈(0,8&#93;
- count&#95;include&#95;pad:int64&#91;&#93;
  - count&#95;include&#95;pad, whether to include pad values in calculation:1.
- pad:int64(pad&#95;top,pad&#95;left,pad&#95;bottom,pad&#95;right)
  - pad&#95;top∈&#91;0,7&#93;
  - pad&#95;left∈&#91;0,7&#93;
  - pad&#95;bottom∈&#91;0,7&#93;
  - pad&#95;right∈&#91;0,7&#93;


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)


<!-- PDF p.35 -->

#### 3.1.46 GlobalAveragePool



GlobalAveragePool applies average pooling to values within each channel of input tensor X. This equals AveragePool with kernel&#95;shape equal to the spatial dimensions of the input tensor.



Inputs&#42;


- input:T1
  - shape:&#91;batch,channel,height,width&#93;


```text
channel∈(0,8192]
```


- 


```text
height∈(0,7]
```


- 


```text
width∈(0,7]
```


- 


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Attributes**


- kernel&#95;shape:int64(kernel&#95;h,kernel&#95;w)
  - kernel&#95;h∈(0,7&#93;
  - kernel&#95;w∈(0,7&#93;
- auto&#95;pad:string
  - Padding mode: only NOTSET is supported.
- ceil&#95;mode:int64
  - Computing output shape using ceil or floor: unsupported.
- strides:int64(strides&#95;h,strides&#95;w)
  - strides&#95;h∈(0,8&#93;
  - strides&#95;w∈(0,8&#93;
- count&#95;include&#95;pad:int64&#91;&#93;
  - count&#95;include&#95;pad, whether to include pad values in calculation:1.
- pad:int64(pad&#95;top,pad&#95;left,pad&#95;bottom,pad&#95;right)
  - pad&#95;top∈&#91;0,7&#93;
  - pad&#95;left∈&#91;0,7&#93;
  - pad&#95;bottom∈&#91;0,7&#93;
  - pad&#95;right∈&#91;0,7&#93;


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)


<!-- PDF p.36 -->

#### 3.1.47 Pow



```text
Z =XY
```



Exponentiation: takes input data (a tensor) and an exponent, and produces output data (a tensor).



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
- Y:T2
  - shape:&#91;1&#93;
    - Currently supports only 0,1,2,3,0.5,‑0.5.


**Outputs**


- Z:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:int8(Tensor),int32(Tensor),int64(Tensor),float16(Tensor),float(Tensor)


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.36 -->

#### 3.1.48 Relu



Sets negative input-tensor values to zero; positive values remain unchanged.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - None


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.37 -->

#### 3.1.49 Clip/ReLU6



Clips input-tensor values to &#91;0,6&#93;.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - None


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.37 -->

#### 3.1.50 PRelu



Scales negative input-tensor values by a learnable parameter; positive values remain unchanged.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer/per‑channel
  - Broadcasting support
    - None


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer/per‑channel


**Attributes**


- slope: PRelu coefficient.
  - Only a single scalar or coefficients along dimension C are supported.


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.38 -->

#### 3.1.51 LeakyRelu



Scales negative input-tensor values by a fixed ratio; positive values remain unchanged.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - None


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.39 -->

#### 3.1.52 Reshape



Returns a tensor of the specified shape without changing the input data or element count.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Attributes**


- shape:int
  - Specifies the output tensor shape.


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.39 -->

#### 3.1.53 Resize



Resizes the input tensor. In general, each output value is computed as a weighted average of a neighborhood (sampling locations) in the input tensor.



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
- roi(optional):T2
  - Not currently supported.
- scales(optional):T2
  - Array of scale factors along each dimension.
- sizes(optional):T3
  - Target size of the output tensor.


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)
- T3:int64(Tensor)


**Attributes**


- antialias:int (default 0)
  - Setting this is currently unsupported.
- axes:int&#91;&#93;
  - Setting this is currently unsupported.
- coordinate&#95;transformation&#95;mode:strings (default ”half&#95;pixel”)
  - Currently supports only half&#95;pixel, pytorch&#95;half&#95;pixel and align&#95;corners.
- cubic&#95;coeff&#95;a:float (default ‑0.75)
  - Setting this is currently unsupported.
- exclude&#95;outside:int (default 0)
  - Setting this is currently unsupported.
- extrapolation&#95;value:float (default 0)
  - Setting this is currently unsupported.
- keep&#95;aspect&#95;ratio&#95;policy:strings (default ”stretch”)
  - Setting this is currently unsupported.
- mode:strings (default ”nearest”)
  - Only nearest and linear are currently configurable.
- nearest&#95;mode:strings (default ”round&#95;prefer&#95;floor”)
  - Setting this is currently unsupported.


Support: currently only integer scaling in width and height is supported, with integer factors 2‑8. An input (1,c,1,1) can be enlarged to (1,c,h,w).



<!-- PDF p.40 -->

#### 3.1.54 Slice



Obtains a slice of the current vector using the same rules as NumPy slicing.



**Inputs**


- input&#95;tensor:T
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T:int8(Tensor),float16(Tensor)


**Attributes**


- starts:int(Tensor)
  - Slice start position: unrestricted.
- ends:int(Tensor)
  - Slice end position: unrestricted.
- axes:int(Tensor)
  - Slice-axis selection: any axis 0~3; multiple axes may be selected simultaneously.
- steps:int(Tensor)
  - Selects the step along each sliced axis.
  - When height&#42;width==1&amp;&amp;channel%subc==0&amp;&amp;starts&#91;1&#93;%subc==0&amp;&amp;ends&#91;1&#93;%subc==0&amp;&amp;steps&#91;1&#93;&lt;=subc, steps may differ from 1. Otherwise SliceOP runs on the NPU only when steps==&#91;1,1,1,1&#93;.


<!-- PDF p.41 -->

#### 3.1.55 Split



Splits the vector along axis into num&#95;outputs vectors; split specifies their sizes along axis.



**Inputs**


- input&#95;tensor:T
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T
  - One or more output vectors, determined by num&#95;outputs.
  - shape: determined by the split.
  - Quantization support
    - per‑layer


**Data-type constraints**


- T:int8(Tensor),float16(Tensor)


**Attributes**


- axis:int
  - axis∈{0,1,2,3}
- num&#95;outputs:int
- split:int(Tensor)


<!-- PDF p.42 -->

#### 3.1.56 Sub


- Performs elementwise binary subtraction (C=A‑B), supporting multidirectional NumPy-style broadcasting.


**Inputs**


- A:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - &#91;b,c,1,1&#93;
    - &#91;scalar&#93;
- B:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - &#91;b,c,1,1&#93;
    - &#91;scalar&#93;


**Outputs**


- C:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(constTensor)


<!-- PDF p.42 -->

#### 3.1.57 Tile



Constructs a tensor by tiling the given tensor, like NumPy tile but without broadcasting.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
- repeats:T2
  - shape:&#91;batch,channel,height,width&#93;


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:int64(Tensor)


<!-- PDF p.43 -->

#### 3.1.58 Transpose



Transposes the input tensor.



**Inputs**


- X:T1
  - shape:&#91;n1,c1,h1,w1&#93;
    - See the attribute list for detailed constraints.
  - Quantization support
    - per‑layer


**Outputs**


- Y:T1,T2
  - shape:&#91;n2,c2,h2,w2&#93;
    - See the attribute list for detailed constraints.
  - Quantization support
    - per‑layer


**Attributes**


- perm, order of transposed axes: constraints for each perm follow (p=8192,q=2048).
  - perm=&#91;0,1,2,3&#93;
    - Unrestricted
  - perm=&#91;0,1,3,2&#93;
    - Unsupported
  - perm=&#91;0,2,3,1&#93;
    - Unsupported
  - perm=&#91;0,2,1,3&#93;
    - Unsupported
  - perm=&#91;0,3,1,2&#93;
    - Unsupported
  - perm=&#91;0,3,2,1&#93;
    - Unsupported
  - perm=&#91;1,0,2,3&#93;
    - Unsupported
  - perm=&#91;1,0,3,2&#93;
    - Unsupported
  - perm=&#91;1,2,0,3&#93;
    - Unsupported
  - perm=&#91;1,2,3,0&#93;
    - Unsupported
  - perm=&#91;1,3,0,2&#93;
    - Unsupported
  - perm=&#91;1,3,2,0&#93;
    - Unsupported
  - perm=&#91;2,1,0,3&#93;
    - T1,T2:c1&lt;8192,n&lt;8192,h1&#42;w1&lt;8192,(h1=w1=1,n1%4=0)or(n1=h1=1,h1%4=0)
  - perm=&#91;2,1,3,0&#93;
    - T1,T2:c1&lt;8192,n&lt;8192,h1&#42;w1&lt;8192,(h1=w1=1,n1%4=0)or(n1=h1=1,h1%4=0)
  - perm=&#91;2,0,3,1&#93;
    - Unsupported
  - perm=&#91;2,0,1,3&#93;
    - Unsupported
  - perm=&#91;2,3,1,0&#93;
    - Unsupported
  - perm=&#91;2,3,0,1&#93;
    - Unsupported
  - perm=&#91;3,0,2,1&#93;
    - Unsupported
  - perm=&#91;3,0,1,2&#93;
    - Unsupported
  - perm=&#91;3,2,0,1&#93;
    - Unsupported
  - perm=&#91;3,2,1,0&#93;
    - Unsupported
  - perm=&#91;3,1,0,2&#93;
    - T1,T2:c1&lt;8192,n&lt;8192,h1&#42;w1&lt;8192,(h1=w1=1,n1%4=0)or(n1=h1=1,w1%4=0)
  - perm=&#91;3,1,2,0&#93;
    - T1,T2:c1&lt;8192,n&lt;8192,h1&#42;w1&lt;8192,(h1=w1=1,n1%4=0)or(n1=h1=1,w1%4=0)


**Data-type constraints**


- T1:int8(Tensor)
- T2:int16(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.45 -->

#### 3.1.59 Sigmoid



Applies y=1/(1+exp(‑x)) elementwise to the input tensor to produce the output tensor.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


<!-- PDF p.45 -->

#### 3.1.60 Tanh



Computes the hyperbolic tangent of each input-tensor element.



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


<!-- PDF p.46 -->

#### 3.1.61 Softplus



Applies Softplus elementwise, y=ln(exp(x)+1).



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


<!-- PDF p.46 -->

#### 3.1.62 HardSigmoid



Applies y=max(0,min(1,alpha&#42;x+beta)) elementwise to the input tensor to produce the output tensor, where



```text
alpha=1/6，beta=0.5
```



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


<!-- PDF p.46 -->

#### 3.1.63 HardSwish



Applies HardSwish elementwise: y = x &#42; max(0, min(1, alpha &#42; x + beta)) = x &#42; HardSigmoid&lt;alpha,beta&gt;(x), where alpha=1/6,beta=0.5.



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


<!-- PDF p.47 -->

#### 3.1.64 Elu



Applies f(x)=alpha&#42;(exp(x)‑1.)forx&lt;0,f(x)=xforx&gt;=0 elementwise to produce the output tensor, with alpha=1.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


<!-- PDF p.47 -->

#### 3.1.65 exSwish



Applies the Sigmoid Linear Unit elementwise. Swish is also called SiLU: y=x&#42;sigmoid(x).



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


<!-- PDF p.48 -->

#### 3.1.66 exMish



Applies mish(x)=x&#42;tanh(softplus(x))=x&#42;tanh(ln(1+e^{x})) elementwise to the input tensor to produce the output tensor.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


<!-- PDF p.48 -->

#### 3.1.67 exGelu



Applies y =x∗Φ(x) elementwise to the input tensor to produce the output tensor. When Φ(x) is set to tanh,



```text
y = 0.5 * x * (1 + Tanh(sqrt(2/π) * (x + 0.044715 * x^3)))
```



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


<!-- PDF p.49 -->

#### 3.1.68 exSwooshR



Applies the following function from https://arxiv.org/abs/2310.11230 elementwise to the input tensor to produce the output tensor.



```text
SwooshR(x)=log(1+exp(x－1))－0.08x－0.313261687
```



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


<!-- PDF p.49 -->

#### 3.1.69 exSwooshL



Applies the following function from https://arxiv.org/abs/2310.11230 elementwise to the input tensor to produce the output tensor.



```text
SwooshL(x)=log(1+exp(x－4))－0.08x－0.035
```



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


<!-- PDF p.50 -->

#### 3.1.70 Where



Selects values from x&#95;tensor or y&#95;tensor according to mask&#95;tensor: True selects the corresponding x&#95;tensor value; otherwise the y&#95;tensor value.



**Inputs**


- mask&#95;tensor:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Broadcasting support
    - Supports broadcasting along any dimension.
  - Broadcasting constraints
    - Broadcasting constraints are the same as for Expand.
- x&#95;tensor:&#42;T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
  - Broadcasting constraints
    - Broadcasting constraints are the same as for Expand.
- y&#95;tensor:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
  - Broadcasting constraints
    - Broadcasting constraints are the same as for Expand.


**Outputs**


- output:T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:bool(Tensor)
- T2:int8(Tensor),float16(Tensor)


<!-- PDF p.51 -->

#### 3.1.71 exGlu



Gated Linear Unit function; a is the first half of the input matrix and b is the second half.



```text
GLU(a,b)=a⊗σ(b)
```



**Inputs**


- Input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Outputs**


- Output:T1
  - shape:&#91;batch,channel/2,height,width&#93;
  - Quantization support:per‑layer.


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Attributes**


- axis:int(default=1)
  - Dimension along which to split the input.
  - Constraint: only 1 is supported.


<!-- PDF p.51 -->

#### 3.1.72 exMatMul



Matrix multiplication



```text
Y =
  A · B + C   if c_type = "add"
  A · B * C   if c_type = "mul"
```



**Inputs**


- A:T1
  - shape:&#91;b,k,1,n&#93;
    - k ∈(0,8192&#93;
  - Quantization support
    - per‑layer
- B:T1
  - shape:&#91;b,k,1,m&#93;
  - Quantization support
    - per‑layer
- C(optional):T1,T2
  - shape:&#91;b,n,1,m&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.


**Outputs**


- Y:T1
  - shape:&#91;b,n,1,m&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)


**Attributes**


- c&#95;type:strings(default “add”)
  - Select add or mul to specify whether C is added or multiplied.


<!-- PDF p.52 -->

#### 3.1.73 exNorm



Applies normalization to input data. Currently supports LayerNormlization, RMSNormlization and MeanVarianceNormalization:



```text
LayerNorm(x) = (x - µ) / sqrt(σ^2 + ϵ) · W + B
RMSNorm(x) = x / sqrt(RMS^2 + ϵ) · W + B
MeanVarianceNorm(x) = (x - µ) / sqrt(Variance + ϵ) · W + B
```



Here x is the input vector. µ and σ2 are the mean and variance of the input vector:



```text
µ = (1/H) Σ_{i=1}^{H} x_i
σ^2 = (1/H) Σ_{i=1}^{H} (x_i - µ)^2
```



RMS is the root mean square of the input vector:



```text
RMS = sqrt((1/H) Σ_{i=1}^{H} (x_i)^2)
```



Variance is the equivalent variance of the input vector:



```text
Variance = (1/H) Σ_{i=1}^{H} (x_i)^2 - µ^2
```



ϵ is a small value preventing division by zero. W and B are optional parameters.



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
- W(optional):T1
  - shape:&#91;batch,channel,height,width&#93;
- B(optional):T1
  - shape:&#91;batch,channel,height,width&#93;


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;


**Data-type constraints**


- T1:float16(Tensor)


**Attributes**


- epsilon:float(default 1e‑05)
  - epsilon value used to prevent division by 0.
- mode:string
  - Supports three selectable Normalization modes: layer, rms and mean&#95;var.
- axes:int64&#91;&#93;(default &#91;1&#93;)
  - Normalization axes: currently only &#91;1&#93; and &#91;1,2,3&#93; are supported.


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.53 -->

#### 3.1.74 exWindow



exWindow derives from window&#95;partition and window&#95;reverse in swin&#95;transformer. In the original paper, input features are divided into non-overlapping windows of window&#95;size×window&#95;size. Input and output features must have a 4-dimensional shape, partitioned in both height and width. The PyTorch implementation follows:



```text
def window_partition(x, window_size):
  """
  Args:
    x: (B, C, H, W)
    window_size (int): window size
  Returns:
    windows: (B, C, num_windows*num_windows, window_size*window_size)
  """
  B, C, H, W = x.shape
  x = x.view(B, C, H // window_size, window_size, W // window_size, window_size)
  windows = x.permute(0, 1, 2, 4, 3, 5).contiguous().view(B, C, -1, window_size*window_size)
  return windows
def window_reverse(windows, window_size, H, W):
  """
  Args:
    windows: (B, C, num_windows*num_windows, window_size*window_size)
    window_size (int): Window size
    H (int): Height of image
    W (int): Width of image
  Returns:
    x: (B, C, H, W)
  """
  B,C,_,_ = windows.shape
  x = windows.view(B, C, H // window_size, W // window_size, window_size, window_size)
  x = x.permute(0, 1, 2, 4, 3, 5).contiguous().view(B, C, H, W)
  return x
```



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Attributes**


- mode:string
  - Supported modes:partition,reverse,partition&#95;num&#95;first.
    - partition: see the window&#95;partition implementation.
    - reverse: see the window&#95;reverse implementation.
    - partition&#95;num&#95;first differs from partition in that its H,W are divided according to num&#95;windows, whereas partition divides H,W according to window&#95;sizes.
- window&#95;sizes:listofints
  - 2-dimensional vector of window sizes, defining the height and width of each window. Attention calculation and feature extraction within each window use this size.
- num&#95;windows:listofints
  - 2-dimensional vector of window counts, defining how many windows the input feature height and width are divided into.


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.56 -->

### 3.2 RK3588



<!-- PDF p.56 -->

#### 3.2.1 Add



Performs elementwise binary addition (C=A+B), supporting multidirectional NumPy-style broadcasting.



**Inputs**


- A:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.
- B:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.


**Outputs**


- C:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(constTensor)


**Other support**


- Multi-core cooperation: supported.


<!-- PDF p.57 -->

#### 3.2.2 AddRelu



Fused Add and Relu computation, C=Relu(A+B).



**Inputs**


- Same as Add.


**Outputs**


- Same as Add.


**Other support**


- Multi-core cooperation: supported.


<!-- PDF p.57 -->

#### 3.2.3 BatchNormalization



Applies batch normalization to the input tensor as described in https://arxiv.org/abs/1502.03167.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Attributes**


- epsilon:float (default=1e‑5)
  - Real value added when dividing by the standard deviation to prevent division by 0.
  - epsilon∈(0,∞&#93;
- momentum:float
  - Moving-average parameter used during training.


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.58 -->

#### 3.2.4 Concat



Concatenates a sequence of vectors along axis into one vector. All vector dimensions other than axis must match.



**Inputs**


- input&#95;tensor:T
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T:int8(Tensor),float16(Tensor)


**Attributes**


- axisint64
  - axis∈{0,1,2,3}


<!-- PDF p.58 -->

#### 3.2.5 Convolution



Convolution



**Inputs**


- input&#95;tensor:T1
  - shape:&#91;batch,channel,height,width&#93;
    - width: when dilated&#95;kernel&#95;h&gt;1, width&lt;16383. Additional limits apply to the first-layer input width; see the model-input description.
  - Quantization support
    - per‑layer
- weight:T1
  - shape:&#91;output&#95;channel,input&#95;channel,kernel&#95;h,kernel&#95;w&#93;


```text
kernel_h∈[1,31]
```


- 


```text
kernel_w∈[1,31]
```


- 
- Quantization support
  - per‑layer
  - per‑channel


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Attributes**


- strides:int(strides&#95;h,strides&#95;w)
  - stride&#95;h∈&#91;1,7&#93;
  - stride&#95;w∈&#91;1,7&#93;
- pads:int(pads&#95;top,pads&#95;left,pads&#95;bottom,pads&#95;right)
  - pads&#95;top∈&#91;0,15&#93;
  - pads&#95;left∈&#91;0,15&#93;
  - pads&#95;bottom∈&#91;0,15&#93;
  - pads&#95;right∈&#91;0,15&#93;
- group:int
- dilations:int(dilations&#95;h,dilations&#95;w)
  - dilations&#95;h∈&#91;1,31&#93;
  - dilations&#95;w∈&#91;1,31&#93;


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: supported.


<!-- PDF p.59 -->

#### 3.2.6 DepthwiseConvolution



Depthwise separable convolution



**Inputs**


- input&#95;tensor:T1
  - shape:&#91;batch,channel,height,width&#93;
    - width: when dilated&#95;kernel&#95;h&gt;1, width&lt;16383. Additional limits apply to the first-layer input width; see the model-input description.
  - Quantization support
    - per‑layer
- weight:T1
  - shape:&#91;output&#95;channel,input&#95;channel,kernel&#95;h,kernel&#95;w&#93;


```text
kernel_h∈[1,8]
```


- 


```text
kernel_w∈[1,8]
```


- 
- Quantization support
  - per‑layer
  - per‑channel


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Attributes**


- strides:int(strides&#95;h,strides&#95;w)
  - stride&#95;h∈&#91;1,7&#93;
  - stride&#95;w∈&#91;1,7&#93;
- pads:int(pads&#95;top,pads&#95;left,pads&#95;bottom,pads&#95;right)
  - pads&#95;top∈&#91;0,15&#93;
  - pads&#95;left∈&#91;0,15&#93;
  - pads&#95;bottom∈&#91;0,15&#93;
  - pads&#95;right∈&#91;0,15&#93;
- group:int
- dilations:int(dilations&#95;h,dilations&#95;w)
  - dilations&#95;h∈&#91;1,32&#93;
  - dilations&#95;w∈&#91;1,32&#93;


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: supported.


<!-- PDF p.60 -->

#### 3.2.7 ConvolutionRelu



Fused Convolution and Relu computation, Output=Relu(Conv(Input)).



Description and specification limits are the same as Convolution.



**Other support**


- Multi-core cooperation: supported.


<!-- PDF p.61 -->

#### 3.2.8 ConvolutionClip



Fused Convolution and Clip computation, Output=Clip(Conv(Input)).



Description and specification limits are the same as Convolution.



**Other support**


- Multi-core cooperation: supported.


<!-- PDF p.61 -->

#### 3.2.9 ConvolutionPRelu/LeakyRelu



Fused Convolution and PRelu/LeakyRelu computation, Output = PRelu(Conv(Input)) or Output =



LeakyRelu(Conv(Input))



Description and specification limits are the same as Convolution.



**Other support**


- Multi-core cooperation: supported.


<!-- PDF p.61 -->

#### 3.2.10 ConvolutionAdd



Fused Convolution and Add computation, Output=Add(Conv(Input0),Input1).



Description and specification limits are the same as Convolution.



**Other support**


- Multi-core cooperation: supported.


<!-- PDF p.61 -->

#### 3.2.11 ConvolutionSigmoid



Fused Convolution and Sigmoid computation, Output=Sigmoid(Conv(Input)).



Description and specification limits are the same as Convolution.



**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.62 -->

#### 3.2.12 ConvolutionTanh



Fused Convolution and Tanh computation, Output=Tanh(Conv(Input)).



Description and specification limits are the same as Convolution.



**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.62 -->

#### 3.2.13 ConvolutionSoftplus



Fused Convolution and Softplus computation, Output=Softplus(Conv(Input)).



Description and specification limits are the same as Convolution.



**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.62 -->

#### 3.2.14 ConvolutionHardSigmoid



Fused Convolution and HardSigmoid computation, Output=HardSigmoid(Conv(Input)).



Description and specification limits are the same as Convolution.



**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.62 -->

#### 3.2.15 ConvolutionHardSwish



Fused Convolution and HardSwish computation, Output=HardSwish(Conv(Input)).



Description and specification limits are the same as Convolution.



**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.63 -->

#### 3.2.16 ConvolutionElu



Fused Convolution and Elu computation, Output=Elu(Conv(Input)).



Description and specification limits are the same as Convolution.



**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.63 -->

#### 3.2.17 ConvolutionSwish



Fused Convolution and Swish computation, Output=Swish(Conv(Input)).



Description and specification limits are the same as Convolution.



**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.63 -->

#### 3.2.18 ConvolutionMish



Fused Convolution and Mish computation, Output=Mish(Conv(Input)).



Description and specification limits are the same as Convolution.



**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.63 -->

#### 3.2.19 ConvolutionAddRelu



Fused Convolution, Add and Relu computation, Output=Relu(Add(Conv(Input0),Input1)).



Description and specification limits are the same as Convolution.



**Other support**


- Multi-core cooperation: supported.


<!-- PDF p.64 -->

#### 3.2.20 ConvTranspose



Transposed convolution



**Inputs**


- input&#95;tensor:T1
  - shape:&#91;batch,channel,height,width&#93;
    - width: when dilated&#95;kernel&#95;h&gt;1, width&lt;16383. In addition, the first-layer input


width is constrained; see model-input instructions.



```text
- **量化支持**
  - per-layer
```


- weight:T1
  - shape:&#91;output&#95;channel,input&#95;channel,kernel&#95;h,kernel&#95;w&#93;


```text
kernel_h∈[1,31]
```


- 


```text
kernel_w∈[1,31]
```


- 
- Quantization support
  - per‑layer
  - per‑channel


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Attributes**


- strides:int(strides&#95;h,strides&#95;w)
  - stride&#95;h supports only 1,2,4,8.
  - stride&#95;w supports only 1,2,4,8.
- pads:int(pads&#95;top,pads&#95;left,pads&#95;bottom,pads&#95;right). When setting pad, note that the following are unsupported: kernel&#95;h&#42;dilations&#95;h‑dilations&#95;h‑pads&#95;top&lt;0; kernel&#95;w&#42;dilations&#95;w‑dilations&#95;w‑pads&#95;left&lt;0; stride&#95;h&#42;(height‑1)‑pads&#95;top+1&lt;output&#95;h; stride&#95;w&#42;(width‑1)‑pads&#95;left+1&lt;output&#95;w.
  - pads&#95;top∈&#91;0,15&#93;
  - pads&#95;left∈&#91;0,15&#93;
  - pads&#95;bottom∈&#91;0,15&#93;
  - pads&#95;right∈&#91;0,15&#93;
- group:int
  - group: only 1 is supported; num&#95;output is supported if and only if num&#95;input=num&#95;output.
- dilations:int(dilations&#95;h,dilations&#95;w)
  - dilations&#95;h∈&#91;1,32&#93;
  - dilations&#95;w∈&#91;1,32&#93;
  - When dilation differs from (1,1), only kernel=(1,1) is supported.


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.65 -->

#### 3.2.21 ConvTranposeRelu



Fused ConvTranpose and Relu computation, Output=Relu(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.65 -->

#### 3.2.22 ConvTranposeClip



Fused ConvTranpose and Clip computation, Output=Clip(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.65 -->

#### 3.2.23 ConvTranposePRelu/LeakyRelu



Fused ConvTranpose and PRelu/LeakyRelu computation, Output=PRelu(ConvTranpose(Input)) or Output=



LeakyRelu(ConvTranpose(Input))



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.65 -->

#### 3.2.24 ConvTranposeAdd



Fused ConvTranpose and Add computation, Output=Add(ConvTranpose(Input0),Input1).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.66 -->

#### 3.2.25 ConvTranposeSigmoid



Fused ConvTranpose and Sigmoid computation, Output=Sigmoid(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.66 -->

#### 3.2.26 ConvTranposeTanh



Fused ConvTranpose and Tanh computation, Output=Tanh(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.66 -->

#### 3.2.27 ConvTranposeSoftplus



Fused ConvTranpose and Softplus computation, Output=Softplus(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.66 -->

#### 3.2.28 ConvTranposeHardSigmoid



Fused ConvTranpose and HardSigmoid computation, Output=HardSigmoid(ConvTranpose(Input)).



<!-- PDF p.66 -->

#### 3.2.29 ConvTranposeHardSwish



Fused ConvTranpose and HardSwish computation, Output=HardSwish(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.66 -->

#### 3.2.30 ConvTranposeElu



Fused ConvTranpose and Elu computation, Output=Elu(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.66 -->

#### 3.2.31 ConvTranposeSwish



Fused ConvTranpose and Swish computation, Output=Swish(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.67 -->

#### 3.2.32 ConvTranposeMish



Fused ConvTranpose and Mish computation, Output=Mish(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.67 -->

#### 3.2.33 Div



Performs elementwise binary division (C=A/B), supporting multidirectional NumPy-style broadcasting.



**Inputs**


- A:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.
- B:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.


**Outputs**


- C:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:float16(Tensor)
- T2:float(constTensor)


**Other support**


- Multi-core cooperation: unsupported.


<!-- PDF p.68 -->

#### 3.2.34 Expand



Broadcasts the input tensor using the given shape and broadcasting rules, similar to numpy.array(input) &#42;numpy.ones(shape): dimensions are right-aligned; each pair of corresponding dimensions must be equal or one of them must be 1.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
- shape:T2
  - shape:&#91;batch,channel,height,width&#93;


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:int64(Tensor)


Broadcasting constraints


- &#91;b,c,1,w&#93;‑&gt;&#91;b,c,h,w&#93;,h∈&#91;1,8192&#93;
- &#91;b,1,1,w&#93;‑&gt;&#91;b,c,h,w&#93;,h∈&#91;1,8192&#93;
- &#91;b,c,h,1&#93;‑&gt;&#91;b,c,h,w&#93;,w ∈&#91;1,8192&#93;
- &#91;b,1,h,1&#93;‑&gt;&#91;b,c,h,w&#93;,w ∈&#91;1,8192&#93;
- &#91;b,c,1,1&#93;‑&gt;&#91;b,c,h,w&#93;,h∈&#91;1,8192&#93;,w ∈&#91;1,8192&#93;


**Other support**


- Multi-core cooperation: unsupported.


<!-- PDF p.68 -->

#### 3.2.35 GRU



Gated Recurrent Unit (GRU). GRU extensions and variants are named exGRU; parameters marked (extern) are exclusive to exGRU. The equations follow:



```text
f = Sigmoid; g = Tanh
r_t = f(x_t · W_r + h_{t-1} · R_r + Wb_r + Rb_r)
z_t = f(x_t · W_z + h_{t-1} · R_z + Wb_z + Rb_z)
h_t = g(x_t · W_h + (r_t ⊙ h_{t-1}) · R_h + Rb_h + Wb_h), (WRB = 0)
h_t = g(x_t · W_h + r_t ⊙ (h_{t-1} · R_h + Rb_h)) + Wb_h, (WRB = 1)
H_t = (1-z_t) ⊙ h_t + z_t ⊙ h_{t-1}
```



**Inputs**


- X:T1
  - shape:&#91;seq&#95;length,batch&#95;size,input&#95;size&#93;


```text
seqlength∈(0,8192]
```


- batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
- 


```text
inputsize∈(0,8192]
```


- 
- Quantization support
  - per‑layer
- W:T1
  - shape:&#91;num&#95;directions,4&#42;hidden&#95;size,input&#95;size&#93;


```text
inputsize∈(0,8192]
```


- 


```text
hiddensize∈(0,8192]
```


- 
- numdirections:1or2
- Quantization support
  - per‑layer
  - per‑channel
- R:T1
  - shape:&#91;num&#95;directions,4&#42;hidden&#95;size,hidden&#95;size&#93;


```text
hiddensize∈(0,8192]
```


- 
- numdirections:1or2
- Quantization support
  - per‑layer
  - per‑channel
- B:T2
  - shape:&#91;num&#95;directions,8&#42;hidden&#95;size&#93;


```text
hiddensize∈(0,8192]
```


- 
- numdirections:1or2
- Quantization support
  - per‑layer
  - per‑channel
- sequence&#95;lens:T3(optional)
  - shape:&#91;batch&#95;size&#93;; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
    - 
- initial&#95;h:T1(optional)
  - shape:&#91;num&#95;directions,batch&#95;size,hidden&#95;size&#93;
    - numdirections:1or2; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
    - 


```text
hiddensize∈(0,8192]
```


- 
- Quantization support
  - per‑layer


**Outputs**


- Y:T1
  - shape:&#91;seq&#95;length,num&#95;directions,batch&#95;size,hidden&#95;size&#93;


```text
seqlength∈(0,8192]
```


- 
- numdirections:1or2; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
- 


```text
hiddensize∈(0,8192]
```


- 
- Quantization support
  - per‑layer
- Y&#95;h:T1(optional)
  - shape:&#91;num&#95;directions,batch&#95;size,hidden&#95;size&#93;
    - numdirections:1or2; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
    - 


```text
hiddensize∈(0,8192]
```


- 
- Quantization support
  - per‑layer


**Attributes**


- linear&#95;before&#95;reset:int
  - Selects the LBR variant:1(T)or0(F).
- direction(extern):string
  - Specifies the GRU processing direction.
  - forward: processes GRU forwards.
  - reverse: processes GRU backwards.
  - bidirectional: processes GRU in both directions.
- sequence&#95;size(extern):int
  - Specifies the GRU input seqsize; unrestricted, but alignment to 4 is recommended.
- hidden&#95;size(extern):int
  - hiddensize within the GRU unit; unrestricted, but alignment to 8 is recommended.
- input&#95;layout(extern):int
  - Specifies a layout consistent with the meaning of the corresponding input shape.
  - The specified layout and the actual batch&#95;size, sequence&#95;size and hidden&#95;size of this op must be provided.
  - snc: the input shape for this layout is &#91;seqs,batches,input&#95;size&#93;.
  - (sn)c: the input shape for this layout is &#91;seqs&#42;batches,input&#95;size,1,1&#93;.
- output&#95;layout(extern):int
  - Specifies a layout consistent with the meaning of the corresponding output shape.
  - The specified layout and the actual batch&#95;size, sequence&#95;size, hidden&#95;size and directions of this op must be provided.
  - sbnc: the output shape for this layout is &#91;seqs,directions,batches,hidden&#95;size&#93;.
  - (sn)c: the output shape for this layout is &#91;seqsbatches,directionsinput&#95;size,1,1&#93;.


**Data-type constraints**


- T1:float16(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.71 -->

#### 3.2.36 Gather



Uses Indices to select entries of input X along the specified axis and concatenates them.



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
- Indices:T2
  - Indices of the elements to gather; rank =1.


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:int(Tensor)


**Attributes**


- axis:int(Tensor)
  - axis∈{0,1,2,3}
  - Specifies the input dimension accessed by Indices.


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.72 -->

#### 3.2.37 Hardmax



**Outputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;


```text
axis=1,height∗width<16384;
```


- axis=3/‑1,channel∗height&lt;16384; also subject to tranpose specification limits.
- 


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Attributes**


- axis:int
  - hardmax axis:1,3/‑1, corresponding to channel and width.


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.72 -->

#### 3.2.38 LSTM



Long Short-Term Memory (LSTM). LSTM extensions and variants are named exLSTM; parameters marked (extern) are exclusive to exLSTM. The equations follow:



```text
f = Sigmoid; g = Tanh; h = Tanh
i_t = f(x_t · W_i + h_{t-1} · R_i + Wb_i + Rb_i)
f_t = f(x_t · W_f + h_{t-1} · R_f + Wb_f + Rb_f)
c_t = f(x_t · W_c + h_{t-1} · R_c + Wb_c + Rb_c)
o_t = f(x_t · W_o + h_{t-1} · R_o + Wb_o + Rb_o)
C_t = f_t ⊙ C(t-1) + i_t ⊙ c_t
h_t = o_t ⊙ h(C_t)
```



**Inputs**


- X:T1
  - shape:&#91;seq&#95;length,batch&#95;size,input&#95;size&#93;


```text
seqlength∈(0,8192]
```


- batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
- 


```text
inputsize∈(0,8192]
```


- 
- Quantization support
  - per‑layer
- W:T1
  - shape:&#91;num&#95;directions,4&#42;hidden&#95;size,input&#95;size&#93;


```text
inputsize∈(0,8192]
```


- 


```text
hiddensize∈(0,8192]
```


- 
- numdirections:1or2
- Quantization support
  - per‑layer
  - per‑channel
- R:T1
  - shape:&#91;num&#95;directions,4&#42;hidden&#95;size,hidden&#95;size&#93;


```text
hiddensize∈(0,8192]
```


- 
- numdirections:1or2
- Quantization support
  - per‑layer
  - per‑channel
- B:T2,T3
  - shape:&#91;num&#95;directions,8&#42;hidden&#95;size&#93;


```text
hiddensize∈(0,8192]
```


- 
- numdirections:1or2
- Quantization support
  - per‑layer
  - per‑channel
- sequence&#95;lens:T4,T5(optional)
  - shape:&#91;batch&#95;size&#93;; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
    - 
- initial&#95;h:T1(optional)
  - shape:&#91;num&#95;directions,batch&#95;size,hidden&#95;size&#93;
    - numdirections:1or2; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
    - 


```text
hiddensize∈(0,8192]
```


- 
- Quantization support
  - per‑layer
- initial&#95;c:T1(optional)
  - shape:&#91;num&#95;directions,batch&#95;size,hidden&#95;size&#93;
    - numdirections:1or2; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
    - 


```text
hiddensize∈(0,8192]
```


- 
- Quantization support
  - per‑layer


**Outputs**


- Y:T1
  - shape:&#91;seq&#95;length,num&#95;directions,batch&#95;size,hidden&#95;size&#93;


```text
seqlength∈(0,8192]
```


- 
- numdirections:1or2; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
- 


```text
hiddensize∈(0,8192]
```


- 
- Quantization support
  - per‑layer
- Y&#95;h:T1(optional)
  - shape:&#91;num&#95;directions,batch&#95;size,hidden&#95;size&#93;
    - numdirections:1or2; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
    - 


```text
hiddensize∈(0,8192]
```


- 
- Quantization support
  - per‑layer
- Y&#95;c:T1(optional)
  - shape:&#91;num&#95;directions,batch&#95;size,hidden&#95;size&#93;
    - numdirections:1or2; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
    - 


```text
hiddensize∈(0,8192]
```


- 
- Quantization support
  - per‑layer


**Attributes**


- direction(extern):string
  - Specifies the LSTM processing direction.
  - forward: processes LSTM forwards.
  - reverse: processes LSTM backwards.
  - bidirectional: processes LSTM in both directions.
- sequence&#95;size(extern):int
  - Specifies the LSTM input seqsize; unrestricted, but alignment to 4 is recommended.
- hidden&#95;size(extern):int
  - hiddensize within the LSTM unit; unrestricted, but alignment to 8 is recommended.
- proj&#95;size(extern):int
  - proj&#95;size for projection; projsize∈&#91;0,hiddensize&#93;.
  - Currently restricted to 0; projection is not yet supported.
- input&#95;forget(extern):int
  - Selects the cifg variant:1(T)or0(F). Currently restricted to 0, so it is not yet supported.
- has&#95;projection(extern):int
  - projection variant:1(T)or0(F). Currently restricted to 0, so it is not yet supported.
- input&#95;layout(extern):int
  - Specifies a layout consistent with the meaning of the corresponding input shape.
  - The specified layout and the actual batch&#95;size, sequence&#95;size and hidden&#95;size of this op must be provided.
  - snc: the input shape for this layout is &#91;seqs,batches,input&#95;size&#93;.
  - (sn)c: the input shape for this layout is &#91;seqs&#42;batches,input&#95;size,1,1&#93;.
- output&#95;layout(extern):int
  - Specifies a layout consistent with the meaning of the corresponding output shape.
  - The specified layout and the actual batch&#95;size, sequence&#95;size, hidden&#95;size and directions of this op must be provided.
  - sbnc: the output shape for this layout is &#91;seqs,directions,batches,hidden&#95;size&#93;.
  - (sn)c: the output shape for this layout is &#91;seqsbatches,directionsinput&#95;size,1,1&#93;.


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)
- T3:int32(Tensor)
- T4:float(Scalar)
- T5:int(Scalar)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.75 -->

#### 3.2.39 Max



Computes the elementwise maximum of the input tensors.



**Inputs**


- A:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.
- B:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.


**Outputs**


- C:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer/per‑channel


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.76 -->

#### 3.2.40 Min



Computes the elementwise minimum of the input tensors.



**Inputs**


- A:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.
- B:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.


**Outputs**


- C:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer/per‑channel


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.77 -->

#### 3.2.41 Mul



Performs elementwise binary multiplication (C=A&#42;B), supporting multidirectional NumPy-style broadcasting.



**Inputs**


- A:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.
- B:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.


**Outputs**


- C:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(constTensor)


**Other support**


- Multi-core cooperation: supported.


<!-- PDF p.78 -->

#### 3.2.42 MulRelu



Fused Mul and Relu computation,C=Relu(A&#42;B).



**Inputs**


- Same as Mul.


**Outputs**


- Same as Mul.


**Other support**


- Multi-core cooperation: supported.


<!-- PDF p.78 -->

#### 3.2.43 Pad



Given a data tensor (data), a tensor of beginning/end padding values for each axis (pads), a mode (mode) and a constant value (constant&#95;value), produces a padded tensor (output).



**Inputs**


- data:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
- pads:T2
  - shape : &#91;batch&#95;begin, channel&#95;begin, height&#95;begin, width&#95;begin, batch&#95;end, chan‑nel&#95;end,height&#95;end,


width&#95;end&#93;


- constant&#95;value(optional):T3
  - shape:&#91;1&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:int64(Tensor)
- T3:float(Scalar),int8(Scalar),float16(Scalar)


**Attributes**


- mode:string (default constant)
  - Supported modes: constant,reflect.
    - constant: unrestricted.


```text
reflectchannel∈(0,8192],height∈(0,8192],width∈(0,8176]
```


- 


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.79 -->

#### 3.2.44 MaxPool



MaxPool consumes input tensor X and applies max pooling according to kernel size, stride size and pad lengths. It computes the maximum over subsets of the input tensor determined by the kernel, downsampling into output tensor Y for further processing. The output spatial shape depends on whether explicit padding (pads) or automatic padding (auto&#95;pad) is used. Only explicit padding is used here.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;


```text
channel∈(0,8192]
```


- 


```text
height∈(0,8192]
```


- 


```text
width∈(0,8192]
```


- 


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Attributes**


- kernel&#95;shape:int64(kernel&#95;h,kernel&#95;w)
  - kernel&#95;h∈(0,7&#93;
  - kernel&#95;w∈(0,7&#93;
- auto&#95;pad:string
  - Padding mode: only NOTSET is supported.
- ceil&#95;mode:int64
  - Computing output shape using ceil or floor: unsupported.
- strides:int64(strides&#95;h,strides&#95;w)
  - strides&#95;h∈(0,8&#93;
  - strides&#95;w∈(0,8&#93;
- count&#95;include&#95;pad:int64&#91;&#93;
  - count&#95;include&#95;pad, whether to include pad values in calculation:1.
- pad:int64(pad&#95;top,pad&#95;left,pad&#95;bottom,pad&#95;right)
  - pad&#95;top∈&#91;0,7&#93;
  - pad&#95;left∈&#91;0,7&#93;
  - pad&#95;bottom∈&#91;0,7&#93;
  - pad&#95;right∈&#91;0,7&#93;
- storage&#95;order:int64
  - Preferred storage order:0.


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)


<!-- PDF p.80 -->

#### 3.2.45 GlobalMaxPool



GlobalMaxPool takes input tensor X and applies max pooling to values within each channel. It is equivalent to MaxPool with kernel&#95;shape equal to the spatial dimensions of input.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;


```text
channel∈(0,8192]
```


- 


```text
height∈(0,7]
```


- 


```text
width∈(0,7]
```


- 


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Attributes**


- kernel&#95;shape:int64(kernel&#95;h,kernel&#95;w)
  - kernel&#95;h∈(0,7&#93;
  - kernel&#95;w∈(0,7&#93;
- auto&#95;pad:string
  - Padding mode: only NOTSET is supported.
- ceil&#95;mode:int64
  - Computing output shape using ceil or floor: unsupported.
- strides:int64(strides&#95;h,strides&#95;w)
  - strides&#95;h∈(0,8&#93;
  - strides&#95;w∈(0,8&#93;
- count&#95;include&#95;pad:int64&#91;&#93;
  - count&#95;include&#95;pad, whether to include pad values in calculation:1.
- pad:int64(pad&#95;top,pad&#95;left,pad&#95;bottom,pad&#95;right)
  - pad&#95;top∈&#91;0,7&#93;
  - pad&#95;left∈&#91;0,7&#93;
  - pad&#95;bottom∈&#91;0,7&#93;
  - pad&#95;right∈&#91;0,7&#93;


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)


<!-- PDF p.81 -->

#### 3.2.46 AveragePool



AveragePool consumes input tensor X and applies average pooling according to kernel size, stride size and pad lengths. It averages all values in subsets of the input tensor determined by the kernel and downsamples into output tensor Y for further processing. The output spatial shape depends on whether explicit padding (pads) or automatic padding (auto&#95;pad) is used. Only explicit padding is used here.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;


```text
channel∈(0,8192]
```


- 


```text
height∈(0,8192]
```


- 


```text
width∈(0,8192]
```


- 


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Attributes**


- kernel&#95;shape:int64(kernel&#95;h,kernel&#95;w)
  - kernel&#95;h∈(0,7&#93;
  - kernel&#95;w∈(0,7&#93;
- auto&#95;pad:string
  - Padding mode: only NOTSET is supported.
- ceil&#95;mode:int64
  - Computing output shape using ceil or floor: unsupported.
- strides:int64(strides&#95;h,strides&#95;w)
  - strides&#95;h∈(0,8&#93;
  - strides&#95;w∈(0,8&#93;
- count&#95;include&#95;pad:int64&#91;&#93;
  - count&#95;include&#95;pad, whether to include pad values in calculation:1.
- pad:int64(pad&#95;top,pad&#95;left,pad&#95;bottom,pad&#95;right)
  - pad&#95;top∈&#91;0,7&#93;
  - pad&#95;left∈&#91;0,7&#93;
  - pad&#95;bottom∈&#91;0,7&#93;
  - pad&#95;right∈&#91;0,7&#93;


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)


<!-- PDF p.82 -->

#### 3.2.47 GlobalAveragePool



GlobalAveragePool applies average pooling to values within each channel of input tensor X. This equals AveragePool with kernel&#95;shape equal to the spatial dimensions of the input tensor.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;


```text
channel∈(0,8192]
```


- 


```text
height∈(0,7]
```


- 


```text
width∈(0,7]
```


- 


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Attributes**


- kernel&#95;shape:int64(kernel&#95;h,kernel&#95;w)
  - kernel&#95;h∈(0,7&#93;
  - kernel&#95;w∈(0,7&#93;
- auto&#95;pad:string
  - Padding mode: only NOTSET is supported.
- ceil&#95;mode:int64
  - Computing output shape using ceil or floor: unsupported.
- strides:int64(strides&#95;h,strides&#95;w)
  - strides&#95;h∈(0,8&#93;
  - strides&#95;w∈(0,8&#93;
- count&#95;include&#95;pad:int64&#91;&#93;
  - count&#95;include&#95;pad, whether to include pad values in calculation:1.
- pad:int64(pad&#95;top,pad&#95;left,pad&#95;bottom,pad&#95;right)
  - pad&#95;top∈&#91;0,7&#93;
  - pad&#95;left∈&#91;0,7&#93;
  - pad&#95;bottom∈&#91;0,7&#93;
  - pad&#95;right∈&#91;0,7&#93;


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)


<!-- PDF p.83 -->

#### 3.2.48 Pow



```text
Z =XY
```



Exponentiation: takes input data (a tensor) and an exponent, and produces output data (a tensor).



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
- Y:T2
  - shape:&#91;1&#93;
    - Currently supports only 0,1,2,3,0.5,‑0.5.


**Outputs**


- Z:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:int8(Tensor),int32(Tensor),int64(Tensor),float16(Tensor),float(Tensor)


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.83 -->

#### 3.2.49 Relu



Sets negative input-tensor values to zero; positive values remain unchanged.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - None


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.84 -->

#### 3.2.50 Clip/ReLU6



Clips input-tensor values to &#91;0,6&#93;.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - None


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.85 -->

#### 3.2.51 PRelu



Scales negative input-tensor values by a learnable parameter; positive values remain unchanged.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer/per‑channel
  - Broadcasting support
    - None


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer/per‑channel


**Attributes**


- slope: PRelu coefficient.
  - Only a single scalar or coefficients along dimension C are supported.


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.85 -->

#### 3.2.52 LeakyRelu



Scales negative input-tensor values by a fixed ratio; positive values remain unchanged.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - None


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.86 -->

#### 3.2.53 Reshape



Returns a tensor of the specified shape without changing the input data or element count.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Attributes**


- shape:int
  - Specifies the output tensor shape.


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.86 -->

#### 3.2.54 Resize



Resizes the input tensor. In general, each output value is computed as a weighted average of a neighborhood (sampling locations) in the input tensor.



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
- roi(optional):T2
  - Not currently supported.
- scales(optional):T2
  - Array of scale factors along each dimension.
- sizes(optional):T3
  - Target size of the output tensor.


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)
- T3:int64(Tensor)


**Attributes**


- antialias:int (default 0)
  - Setting this is currently unsupported.
- axes:int&#91;&#93;
  - Setting this is currently unsupported.
- coordinate&#95;transformation&#95;mode:strings (default ”half&#95;pixel”)
  - Currently supports only half&#95;pixel, pytorch&#95;half&#95;pixel and align&#95;corners.
- cubic&#95;coeff&#95;a:float (default ‑0.75)
  - Setting this is currently unsupported.
- exclude&#95;outside:int (default 0)
  - Setting this is currently unsupported.
- extrapolation&#95;value:float (default 0)
  - Setting this is currently unsupported.
- keep&#95;aspect&#95;ratio&#95;policy:strings (default ”stretch”)
  - Setting this is currently unsupported.
- mode:strings (default ”nearest”)
  - Only nearest and linear are currently configurable.
- nearest&#95;mode:strings (default ”round&#95;prefer&#95;floor”)
  - Setting this is currently unsupported.


Support: currently only integer scaling in width and height is supported, with integer factors 2‑8. An input (1,c,1,1) can be enlarged to (1,c,h,w).


- Multi-core cooperation: unsupported.


<!-- PDF p.88 -->

#### 3.2.55 Slice



Obtains a slice of the current vector using the same rules as NumPy slicing.



**Inputs**


- input&#95;tensor:T
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T:int8(Tensor),float16(Tensor)


**Attributes**


- starts:int(Tensor)
  - Slice start position: unrestricted.
- ends:int(Tensor)
  - Slice end position: unrestricted.
- axes:int(Tensor)
  - Slice-axis selection: any axis 0~3; multiple axes may be selected simultaneously.
- steps:int(Tensor)
  - Selects the step along each sliced axis.
  - When height&#42;width==1&amp;&amp;channel%subc==0&amp;&amp;starts&#91;1&#93;%subc==0&amp;&amp;ends&#91;1&#93;%subc==0&amp;&amp;steps&#91;1&#93;&lt;=subc, steps may differ from 1. Otherwise SliceOP runs on the NPU only when steps==&#91;1,1,1,1&#93;.


<!-- PDF p.88 -->

#### 3.2.56 Softmax



This operator computes normalized exponential values of the input:



```text
Softmax(input, axis) = exp(input - max(input, axis)) / Σ_axis exp(input - max(input, axis))
```



The “axis” attribute specifies the dimension along which Softmax is applied. The output tensor has the same shape and contains the corresponding input Softmax values.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;, subject to tranpose specification limits.


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Attributes**


- axis:int
  - softmax axis:1,3, corresponding to channel and width.


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.89 -->

#### 3.2.57 exSoftmax13



This operator computes normalized exponential values of the input:



```text
exSoftmax13(input, axis) = exp(input - max(input, axis)) / Σ_axis exp(input - max(input, axis))
```



The “axis” attribute specifies the dimension along which Softmax is applied. The output tensor has the same shape and contains the corresponding input Softmax values.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;, subject to tranpose specification limits.


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Attributes**


- axis:int64
  - softmax axis:1,3, corresponding to channel and width.


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.90 -->

#### 3.2.58 exSoftmaxMask



This operator computes normalized exponential values of the input:



```text
input(x, mast_t, mask_value) =
  x + (mast_t - 1) * inf   if mask_value = 0
  x + mast_t * (-inf)      elif mask_value = 1
exSoftmaxMask(input, axis) = exp(input - max(input, axis)) / Σ_axis exp(input - max(input, axis))
```



The “axis” attribute specifies the dimension along which Softmax is applied. The output tensor has the same shape and contains the corresponding input Softmax values.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;, subject to tranpose specification limits.
- mask(optional):T1
  - shape:&#91;1,channel,height,width&#93;


```text
channel∈(0,8192]
```


- 
- width:· axis=1, unrestricted;


```text
· axis=3/‑1,width∈(0,8192]
```



**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Attributes**


- axis:int64
  - softmax axis:1,3, corresponding to channel and width.
- mask&#95;value:int64
  - Values requiring masking:0,1.


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.91 -->

#### 3.2.59 Split



Splits the vector along axis into num&#95;outputs vectors; split specifies their sizes along axis.



**Inputs**


- input&#95;tensor:T
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T
  - One or more output vectors, determined by num&#95;outputs.
  - shape: determined by the split.
  - Quantization support
    - per‑layer


**Data-type constraints**


- T:int8(Tensor),float16(Tensor)


**Attributes**


- axis:int
  - axis∈{0,1,2,3}
- num&#95;outputs:int
- split:int(Tensor)


<!-- PDF p.91 -->

#### 3.2.60 Sub


- Performs elementwise binary subtraction (C=A‑B), supporting multidirectional NumPy-style broadcasting.


**Inputs**


- A:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - &#91;b,c,1,1&#93;
    - &#91;scalar&#93;
- B:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - &#91;b,c,1,1&#93;
    - &#91;scalar&#93;


**Outputs**


- C:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(constTensor)


**Other support**


- Multi-core cooperation: unsupported.


<!-- PDF p.92 -->

#### 3.2.61 Tile



Constructs a tensor by tiling the given tensor, like NumPy tile but without broadcasting.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
- repeats:T2
  - shape:&#91;batch,channel,height,width&#93;


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:int64(Tensor)


**Other support**


- Multi-core cooperation: unsupported.


<!-- PDF p.93 -->

#### 3.2.62 Transpose



Transposes the input tensor.



**Inputs**


- X:T1
  - shape:&#91;n1,c1,h1,w1&#93;
    - See the attribute list for detailed constraints.
  - Quantization support
    - per‑layer


**Outputs**


- Y:T1,T2
  - shape:&#91;n2,c2,h2,w2&#93;
    - See the attribute list for detailed constraints.
  - Quantization support
    - per‑layer


**Attributes**


- perm, order of transposed axes: constraints for each perm follow (p=8192,q=2048).
  - perm=&#91;0,1,2,3&#93;
    - Unrestricted
  - perm=&#91;0,1,3,2&#93;
    - T1:h1%16=0,h1&#42;w1&lt;16&#42;p,h1&#42;w1&lt;2&#42;q
    - T2:h1%8=0,h1&#42;w1&lt;8&#42;p,h1&#42;w1&lt;2&#42;q
  - perm=&#91;0,2,3,1&#93;
    - T1:c1&lt;8192,h1&#42;w1%8=0，w1&#42;c1&lt;p&#42;16
    - T2:c1&lt;8192,h1&#42;w1%8=0，w1&#42;c1&lt;p&#42;8
  - perm=&#91;0,2,1,3&#93;
    - T1:h1%16=0,h1&#42;w1&lt;16&#42;p,h1&#42;w1&lt;2&#42;q,c1&#42;w1&lt;p
    - T2:h1%8=0,h1&#42;w1&lt;8&#42;p,h1&#42;w1&lt;2&#42;q,c1&#42;w1&lt;p
  - perm=&#91;0,3,1,2&#93;
    - T1,T2:h1&#42;w1&lt;p,w1&lt;8192,h1&#42;c1&lt;p
  - perm=&#91;0,3,2,1&#93;
    - T1:h1%16=0,h1&#42;w1&lt;16&#42;p,h1&#42;w1&lt;2&#42;q,c1&lt;p&#42;16
    - T2:h1%8=0,h1&#42;w1&lt;8&#42;p,h1&#42;w1&lt;2&#42;q,c1&lt;p&#42;8
  - perm=&#91;1,0,2,3&#93;
    - T1:h1&#42;w1&lt;16&#42;p,n1&lt;8192,h1&#42;w1&lt;p
    - T2:h1&#42;w1&lt;8&#42;p,n1&lt;8192,h1&#42;w1&lt;p
  - perm=&#91;1,0,3,2&#93;
    - T1:h1%16=0,c1&#42;h1&#42;w1&lt;16&#42;p,h1&#42;w1&lt;2&#42;q
    - T2:h1%8=0,c1&#42;h1&#42;w1&lt;8&#42;p,h1&#42;w1&lt;2&#42;q
  - perm=&#91;1,2,0,3&#93;
    - T1:n1&#42;w1&lt;p&#42;16,c1&#42;h1&#42;w1&lt;p,w1%16=0
    - T2:n1&#42;w1&lt;p&#42;8,c1&#42;h1&#42;w1p,w1%8=0
  - perm=&#91;1,2,3,0&#93;
    - T1:h1&#42;w1&lt;p,n1&lt;p&#42;16,c1&#42;h1&#42;w1&lt;p&#42;16,n1&#42;w1&lt;p&#42;16
    - T2:h1&#42;w1&lt;p,n1&lt;p&#42;8,c1&#42;h1&#42;w1&lt;p&#42;8,n1&#42;w1&lt;p&#42;8
  - perm=&#91;1,3,0,2&#93;
    - T1:c1&#42;w1&lt;8192,n1&#42;h1&lt;p,w1%16=0
    - T2:c1&#42;w1&lt;8192,n1&#42;h1&lt;p,w1%8=0
  - perm=&#91;1,3,2,0&#93;
    - T1:c1&#42;h1&#42;w1&lt;p,n1&#42;h1&lt;p,w1&lt;8192,w1%16=0
    - T2:c1&#42;h1&#42;w1&lt;p,n1&#42;h1&lt;p,w1&lt;8192,w1%8=0
  - perm=&#91;2,1,0,3&#93;
    - T1,T2:c1&lt;8192,c1&#42;h1&#42;w1&lt;p,n1&#42;w1&lt;p
  - perm=&#91;2,1,3,0&#93;
    - T1:c1&#42;h1&#42;w1&lt;p,n1&#42;w1&lt;p&#42;16,c1&lt;8192,n1&#42;w1%4=0
    - T2:c1&#42;h1&#42;w1&lt;p,n1&#42;w1&lt;p&#42;8,c1&lt;8192,n1&#42;w1%4=0
  - perm=&#91;2,0,3,1&#93;
    - T1,T2:c1&lt;8192,c1&#42;h1&#42;w1&lt;p
  - perm=&#91;2,0,1,3&#93;
    - T1:n1&#42;c1&#42;h1&#42;w1&lt;p,h1&#42;w1%16=0
    - T2:n1&#42;c1&#42;h1&#42;w1&lt;p,h1&#42;w1%8=0
  - perm=&#91;2,3,1,0&#93;
    - T1:c1&#42;h1&#42;w1&lt;p,n1&#42;c1&lt;p,h1&#42;w1&lt;8192,h1&#42;w1%16=0
    - T2:c1&#42;h1&#42;w1&lt;p,n1&#42;c1&lt;p,h1&#42;w1&lt;8192,h1&#42;w1%8=0
  - perm=&#91;2,3,0,1&#93;
    - T1,T2:h1&#42;w1&lt;8192,n1&#42;c1&lt;p
  - perm=&#91;3,0,2,1&#93;
    - T1:h1&#42;w1&lt;p,n1&#42;c1&lt;8192,c1&#42;h1&lt;p,n1&#42;w1&lt;8192,n1&#42;w1%16=0
    - T2:h1&#42;w1&lt;p,n1&#42;c1&lt;8192,c1&#42;h1&lt;p,n1&#42;w1&lt;8192,n1&#42;w1%8=0
  - perm=&#91;3,0,1,2&#93;
    - T1:h1&#42;w1&lt;p,n1&#42;c1&lt;8192,c1&#42;h1&lt;p,n1&#42;w1&lt;8192,n1&#42;h1&#42;w1%16=0
    - T2:h1&#42;w1&lt;p,n1&#42;c1&lt;8192,c1&#42;h1&lt;p,n1&#42;w1&lt;8192,n1&#42;h1&#42;w1%8=0
  - perm=&#91;3,2,0,1&#93;
    - T1,T2:h1&#42;w1&lt;p,n1&#42;c1&lt;8192,n1&#42;c1&#42;w1&lt;p
  - perm=&#91;3,2,1,0&#93;
    - T1:c1&#42;h1&#42;w1&lt;p,h1&#42;w1&lt;8192,2&#42;h1&#42;w1&lt;q,n1&#42;c1&lt;p&#42;16,h1%16=0
    - T2:c1&#42;h1&#42;w1&lt;p,h1&#42;w1&lt;8192,2&#42;h1&#42;w1&lt;q,n1&#42;c1&lt;p&#42;8,h1%8=0
  - perm=&#91;3,1,0,2&#93;
    - T1,T2:h1&#42;w1&lt;p,c1&#42;w1&lt;8192,n1&#42;h1&lt;p
  - perm=&#91;3,1,2,0&#93;
    - T1,T2:h1&#42;w1&lt;p,n1&#42;c1&lt;8192,n1&#42;h1&lt;p,n1&#42;c1&#42;w1&lt;p


**Data-type constraints**


- T1:int8(Tensor)
- T2:int16(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.95 -->

#### 3.2.63 Sigmoid



Applies y=1/(1+exp(‑x)) elementwise to the input tensor to produce the output tensor.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.95 -->

#### 3.2.64 Tanh



Computes the hyperbolic tangent of each input-tensor element.



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.96 -->

#### 3.2.65 Softplus



Applies Softplus elementwise, y=ln(exp(x)+1).



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.96 -->

#### 3.2.66 HardSigmoid



Applies y=max(0,min(1,alpha&#42;x+beta)) elementwise to the input tensor to produce the output tensor, where



```text
alpha=1/6，beta=0.5
```



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.97 -->

#### 3.2.67 HardSwish



Applies HardSwish elementwise: y = x &#42; max(0, min(1, alpha &#42; x + beta)) = x &#42; HardSigmoid&lt;alpha,beta&gt;(x), where alpha=1/6,beta=0.5.



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.97 -->

#### 3.2.68 Elu



Applies f(x)=alpha&#42;(exp(x)‑1.)forx&lt;0,f(x)=xforx&gt;=0 elementwise to produce the output tensor, with alpha=1.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.98 -->

#### 3.2.69 exSwish



Applies the Sigmoid Linear Unit elementwise. Swish is also called SiLU: y=x&#42;sigmoid(x).



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.98 -->

#### 3.2.70 exMish



Applies mish(x)=x&#42;tanh(softplus(x))=x&#42;tanh(ln(1+e^{x})) elementwise to the input tensor to produce the output tensor.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.99 -->

#### 3.2.71 exGelu



Applies y =x∗Φ(x) elementwise to the input tensor to produce the output tensor. When Φ(x) is set to tanh,



```text
y = 0.5 * x * (1 + Tanh(sqrt(2/π) * (x + 0.044715 * x^3)))
```



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.99 -->

#### 3.2.72 exSwooshR



Applies the following function from https://arxiv.org/abs/2310.11230 elementwise to the input tensor to produce the output tensor.



```text
SwooshR(x)=log(1+exp(x－1))－0.08x－0.313261687
```



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.100 -->

#### 3.2.73 exSwooshL



Applies the following function from https://arxiv.org/abs/2310.11230 elementwise to the input tensor to produce the output tensor.



```text
SwooshL(x)=log(1+exp(x－4))－0.08x－0.035
```



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.100 -->

#### 3.2.74 Where



Selects values from x&#95;tensor or y&#95;tensor according to mask&#95;tensor: True selects the corresponding x&#95;tensor value; otherwise the y&#95;tensor value.



**Inputs**


- mask&#95;tensor:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Broadcasting support
    - Supports broadcasting along any dimension.
  - Broadcasting constraints
    - Broadcasting constraints are the same as for Expand.
- x&#95;tensor:&#42;T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
  - Broadcasting constraints
    - Broadcasting constraints are the same as for Expand.
- y&#95;tensor:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
  - Broadcasting constraints
    - Broadcasting constraints are the same as for Expand.


**Outputs**


- output:T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:bool(Tensor)
- T2:int8(Tensor),float16(Tensor)


<!-- PDF p.101 -->

#### 3.2.75 exGlu



Gated Linear Unit function; a is the first half of the input matrix and b is the second half.



```text
GLU(a,b)=a⊗σ(b)
```



**Inputs**


- Input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Outputs**


- Output:T1
  - shape:&#91;batch,channel/2,height,width&#93;
  - Quantization support:per‑layer.


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Attributes**


- axis:int(default=1)
  - Dimension along which to split the input.
  - Constraint: only 1 is supported.


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.102 -->

#### 3.2.76 exMatMul



Matrix multiplication



```text
Y =
  A · B + C   if c_type = "add"
  A · B * C   if c_type = "mul"
```



**Inputs**


- A:T1
  - shape:&#91;b,k,1,n&#93;
    - k ∈(0,8192&#93;
  - Quantization support
    - per‑layer
- B:T1
  - shape:&#91;b,k,1,m&#93;
  - Quantization support
    - per‑layer
- C(optional):T1,T2
  - shape:&#91;b,n,1,m&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.


**Outputs**


- Y:T1
  - shape:&#91;b,n,1,m&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)


**Attributes**


- c&#95;type:strings(default “add”)
  - Select add or mul to specify whether C is added or multiplied.


**Other support**


- Multi-core cooperation: unsupported.


<!-- PDF p.103 -->

#### 3.2.77 exNorm



Applies normalization to input data. Currently supports LayerNormlization, RMSNormlization and MeanVarianceNormalization:



```text
LayerNorm(x) = (x - µ) / sqrt(σ^2 + ϵ) · W + B
RMSNorm(x) = x / sqrt(RMS^2 + ϵ) · W + B
MeanVarianceNorm(x) = (x - µ) / sqrt(Variance + ϵ) · W + B
```



Here x is the input vector. µ and σ2 are the mean and variance of the input vector:



```text
µ = (1/H) Σ_{i=1}^{H} x_i
σ^2 = (1/H) Σ_{i=1}^{H} (x_i - µ)^2
```



RMS is the root mean square of the input vector:



```text
RMS = sqrt((1/H) Σ_{i=1}^{H} (x_i)^2)
```



Variance is the equivalent variance of the input vector:



```text
Variance = (1/H) Σ_{i=1}^{H} (x_i)^2 - µ^2
```



ϵ is a small value preventing division by zero. W and B are optional parameters.



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
- W(optional):T1
  - shape:&#91;batch,channel,height,width&#93;
- B(optional):T1
  - shape:&#91;batch,channel,height,width&#93;


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;


**Data-type constraints**


- T1:float16(Tensor)


**Attributes**


- epsilon:float(default 1e‑05)
  - epsilon value used to prevent division by 0.
- mode:string
  - Supports three selectable Normalization modes: layer, rms and mean&#95;var.
- axes:int64&#91;&#93;(default &#91;1&#93;)
  - Normalization axes: currently only &#91;1&#93; and &#91;1,2,3&#93; are supported.


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.104 -->

#### 3.2.78 exSDPAttention



Computes scaled dot-product attention (SDPA) between query, key and value.



**Inputs**


- query:T1
  - shape:&#91;batch,channel,height,width&#93;


```text
channel∈(0,8192]
```


- 
- Quantization support
  - per‑layer
- key:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
- value:T1
  - shape:&#91;batch,channel,height,width&#93;


```text
channel∈(0,8192]
```


- 
- Quantization support
  - per‑layer
- mask(optional):T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
- scale(optional):T3


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)


**Other support**


- Multi-core cooperation: unsupported.


<!-- PDF p.105 -->

#### 3.2.79 exWindow



exWindow derives from window&#95;partition and window&#95;reverse in swin&#95;transformer. In the original paper, input features are divided into non-overlapping windows of window&#95;size×window&#95;size. Input and output features must have a 4-dimensional shape, partitioned in both height and width. The PyTorch implementation follows:



```text
def window_partition(x, window_size):
  """
  Args:
    x: (B, C, H, W)
    window_size (int): window size
  Returns:
    windows: (B, C, num_windows*num_windows, window_size*window_size)
  """
  B, C, H, W = x.shape
  x = x.view(B, C, H // window_size, window_size, W // window_size, window_size)
  windows = x.permute(0, 1, 2, 4, 3, 5).contiguous().view(B, C, -1, window_size*window_size)
  return windows
def window_reverse(windows, window_size, H, W):
  """
  Args:
    windows: (B, C, num_windows*num_windows, window_size*window_size)
    window_size (int): Window size
    H (int): Height of image
    W (int): Width of image
  Returns:
    x: (B, C, H, W)
  """
  B,C,_,_ = windows.shape
  x = windows.view(B, C, H // window_size, W // window_size, window_size, window_size)
  x = x.permute(0, 1, 2, 4, 3, 5).contiguous().view(B, C, H, W)
  return x
```



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Attributes**


- mode:string
  - Supported modes:partition,reverse,partition&#95;num&#95;first.
    - partition: see the window&#95;partition implementation.
    - reverse: see the window&#95;reverse implementation.
    - partition&#95;num&#95;first differs from partition in that its H,W are divided according to num&#95;windows, whereas partition divides H,W according to window&#95;sizes.
- window&#95;sizes:listofints
  - 2-dimensional vector of window sizes, defining the height and width of each window. Attention calculation and feature extraction within each window use this size.
- num&#95;windows:listofints
  - 2-dimensional vector of window counts, defining how many windows the input feature height and width are divided into.


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.108 -->

### 3.3 RK3562



<!-- PDF p.108 -->

#### 3.3.1 Add



Performs elementwise binary addition (C=A+B), supporting multidirectional NumPy-style broadcasting.



**Inputs**


- A:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.
- B:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.


**Outputs**


- C:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(constTensor)


<!-- PDF p.108 -->

#### 3.3.2 AddRelu



Fused Add and Relu computation, C=Relu(A+B).



**Inputs**


- Same as Add.


**Outputs**


- Same as Add.


**Other support**


- Multi-core cooperation: supported.


<!-- PDF p.109 -->

#### 3.3.3 BatchNormalization



Applies batch normalization to the input tensor as described in https://arxiv.org/abs/1502.03167.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Attributes**


- epsilon:float (default=1e‑5)
  - Real value added when dividing by the standard deviation to prevent division by 0.
  - epsilon∈(0,∞&#93;
- momentum:float
  - Moving-average parameter used during training.


<!-- PDF p.109 -->

#### 3.3.4 Concat



Concatenates a sequence of vectors along axis into one vector. All vector dimensions other than axis must match.



**Inputs**


- input&#95;tensor:T
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T:int8(Tensor),float16(Tensor)


**Attributes**


- axisint64
  - axis∈{0,1,2,3}


<!-- PDF p.110 -->

#### 3.3.5 Convolution



Convolution



**Inputs**


- input&#95;tensor:T1
  - shape:&#91;batch,channel,height,width&#93;
    - width: when dilated&#95;kernel&#95;h&gt;1, width&lt;16383. Additional limits apply to the first-layer input width; see the model-input description.
  - Quantization support
    - per‑layer
- weight:T1
  - shape:&#91;output&#95;channel,input&#95;channel,kernel&#95;h,kernel&#95;w&#93;


```text
kernel_h∈[1,31]
```


- 


```text
kernel_w∈[1,31]
```


- 
- Quantization support
  - per‑layer
  - per‑channel


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Attributes**


- strides:int(strides&#95;h,strides&#95;w)
  - stride&#95;h∈&#91;1,7&#93;
  - stride&#95;w∈&#91;1,7&#93;
- pads:int(pads&#95;top,pads&#95;left,pads&#95;bottom,pads&#95;right)
  - pads&#95;top∈&#91;0,15&#93;
  - pads&#95;left∈&#91;0,15&#93;
  - pads&#95;bottom∈&#91;0,15&#93;
  - pads&#95;right∈&#91;0,15&#93;
- group:int
- dilations:int(dilations&#95;h,dilations&#95;w)
  - dilations&#95;h∈&#91;1,31&#93;
  - dilations&#95;w∈&#91;1,31&#93;


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


<!-- PDF p.111 -->

#### 3.3.6 DepthwiseConvolution



Depthwise separable convolution



**Inputs**


- input&#95;tensor:T1
  - shape:&#91;batch,channel,height,width&#93;
    - width: when dilated&#95;kernel&#95;h&gt;1, width&lt;16383. Additional limits apply to the first-layer input width; see the model-input description.
  - Quantization support
    - per‑layer
- weight:T1
  - shape:&#91;output&#95;channel,input&#95;channel,kernel&#95;h,kernel&#95;w&#93;


```text
kernel_h∈[1,8]
```


- 


```text
kernel_w∈[1,8]
```


- 
- Quantization support
  - per‑layer
  - per‑channel


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Attributes**


- strides:int(strides&#95;h,strides&#95;w)
  - stride&#95;h∈&#91;1,7&#93;
  - stride&#95;w∈&#91;1,7&#93;
- pads:int(pads&#95;top,pads&#95;left,pads&#95;bottom,pads&#95;right)
  - pads&#95;top∈&#91;0,15&#93;
  - pads&#95;left∈&#91;0,15&#93;
  - pads&#95;bottom∈&#91;0,15&#93;
  - pads&#95;right∈&#91;0,15&#93;
- group:int
- dilations:int(dilations&#95;h,dilations&#95;w)
  - dilations&#95;h∈&#91;1,32&#93;
  - dilations&#95;w∈&#91;1,32&#93;


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


<!-- PDF p.112 -->

#### 3.3.7 ConvolutionRelu



Fused Convolution and Relu computation, Output=Relu(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.112 -->

#### 3.3.8 ConvolutionClip



Fused Convolution and Clip computation, Output=Clip(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.112 -->

#### 3.3.9 ConvolutionPRelu/LeakyRelu



Fused Convolution and PRelu/LeakyRelu computation, Output = PRelu(Conv(Input)) or Output =



LeakyRelu(Conv(Input))



Description and specification limits are the same as Convolution.



<!-- PDF p.112 -->

#### 3.3.10 ConvolutionAdd



Fused Convolution and Add computation, Output=Add(Conv(Input0),Input1).



Description and specification limits are the same as Convolution.



<!-- PDF p.112 -->

#### 3.3.11 ConvolutionSigmoid



Fused Convolution and Sigmoid computation, Output=Sigmoid(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.112 -->

#### 3.3.12 ConvolutionTanh



Fused Convolution and Tanh computation, Output=Tanh(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.113 -->

#### 3.3.13 ConvolutionSoftplus



Fused Convolution and Softplus computation, Output=Softplus(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.113 -->

#### 3.3.14 ConvolutionHardSigmoid



Fused Convolution and HardSigmoid computation, Output=HardSigmoid(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.113 -->

#### 3.3.15 ConvolutionHardSwish



Fused Convolution and HardSwish computation, Output=HardSwish(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.113 -->

#### 3.3.16 ConvolutionElu



Fused Convolution and Elu computation, Output=Elu(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.113 -->

#### 3.3.17 ConvolutionSwish



Fused Convolution and Swish computation, Output=Swish(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.113 -->

#### 3.3.18 ConvolutionMish



Fused Convolution and Mish computation, Output=Mish(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.113 -->

#### 3.3.19 ConvolutionAddRelu



Fused Convolution, Add and Relu computation, Output=Relu(Add(Conv(Input0),Input1)).



Description and specification limits are the same as Convolution.



<!-- PDF p.114 -->

#### 3.3.20 ConvTranspose



Transposed convolution



**Inputs**


- input&#95;tensor:T1
  - shape:&#91;batch,channel,height,width&#93;
    - width: when dilated&#95;kernel&#95;h&gt;1, width&lt;16383. In addition, the first-layer input


width is constrained; see model-input instructions.



```text
- **量化支持**
  - per-layer
```


- weight:T1
  - shape:&#91;output&#95;channel,input&#95;channel,kernel&#95;h,kernel&#95;w&#93;


```text
kernel_h∈[1,31]
```


- 


```text
kernel_w∈[1,31]
```


- 
- Quantization support
  - per‑layer
  - per‑channel


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Attributes**


- strides:int(strides&#95;h,strides&#95;w)
  - stride&#95;h∈&#91;1,8&#93;
  - stride&#95;w∈&#91;1,8&#93;
- pads:int(pads&#95;top,pads&#95;left,pads&#95;bottom,pads&#95;right). When setting pad, note that the following are unsupported: kernel&#95;h&#42;dilations&#95;h‑dilations&#95;h‑pads&#95;top&lt;0; kernel&#95;w&#42;dilations&#95;w‑dilations&#95;w‑pads&#95;left&lt;0; stride&#95;h&#42;(height‑1)‑pads&#95;top+1&lt;output&#95;h; stride&#95;w&#42;(width‑1)‑pads&#95;left+1&lt;output&#95;w.
  - pads&#95;top∈&#91;0,15&#93;
  - pads&#95;left∈&#91;0,15&#93;
  - pads&#95;bottom∈&#91;0,15&#93;
  - pads&#95;right∈&#91;0,15&#93;
- group:int
  - group: only 1 is supported; num&#95;output is supported if and only if num&#95;input=num&#95;output.
- dilations:int(dilations&#95;h,dilations&#95;w)
  - dilations&#95;h∈&#91;1,32&#93;
  - dilations&#95;w∈&#91;1,32&#93;
  - When dilation differs from (1,1), only kernel=(1,1) is supported.


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


<!-- PDF p.115 -->

#### 3.3.21 ConvTranposeRelu



Fused ConvTranpose and Relu computation, Output=Relu(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.115 -->

#### 3.3.22 ConvTranposeClip



Fused ConvTranpose and Clip computation, Output=Clip(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.115 -->

#### 3.3.23 ConvTranposePRelu/LeakyRelu



Fused ConvTranpose and PRelu/LeakyRelu computation, Output=PRelu(ConvTranpose(Input)) or Output=



LeakyRelu(ConvTranpose(Input))



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.115 -->

#### 3.3.24 ConvTranposeAdd



Fused ConvTranpose and Add computation, Output=Add(ConvTranpose(Input0),Input1).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.115 -->

#### 3.3.25 ConvTranposeSigmoid



Fused ConvTranpose and Sigmoid computation, Output=Sigmoid(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.116 -->

#### 3.3.26 ConvTranposeTanh



Fused ConvTranpose and Tanh computation, Output=Tanh(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.116 -->

#### 3.3.27 ConvTranposeSoftplus



Fused ConvTranpose and Softplus computation, Output=Softplus(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.116 -->

#### 3.3.28 ConvTranposeHardSigmoid



Fused ConvTranpose and HardSigmoid computation, Output=HardSigmoid(ConvTranpose(Input)).



<!-- PDF p.116 -->

#### 3.3.29 ConvTranposeHardSwish



Fused ConvTranpose and HardSwish computation, Output=HardSwish(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.116 -->

#### 3.3.30 ConvTranposeElu



Fused ConvTranpose and Elu computation, Output=Elu(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.116 -->

#### 3.3.31 ConvTranposeSwish



Fused ConvTranpose and Swish computation, Output=Swish(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.116 -->

#### 3.3.32 ConvTranposeMish



Fused ConvTranpose and Mish computation, Output=Mish(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.117 -->

#### 3.3.33 Div



Performs elementwise binary division (C=A/B), supporting multidirectional NumPy-style broadcasting.



**Inputs**


- A:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.
- B:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.


**Outputs**


- C:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:float16(Tensor)
- T2:float(constTensor)


<!-- PDF p.117 -->

#### 3.3.34 Expand



**Inputs**


- input1:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


Broadcasting constraints


- &#91;b,c,1,w&#93;‑&gt;&#91;b,c,h,w&#93;,h∈&#91;1,8192&#93;
- &#91;b,1,1,w&#93;‑&gt;&#91;b,c,h,w&#93;,h∈&#91;1,8192&#93;
- &#91;b,c,h,1&#93;‑&gt;&#91;b,c,h,w&#93;,w ∈&#91;1,8192&#93;
- &#91;b,1,h,1&#93;‑&gt;&#91;b,c,h,w&#93;,w ∈&#91;1,8192&#93;
- &#91;b,c,1,1&#93;‑&gt;&#91;b,c,h,w&#93;,h∈&#91;1,8192&#93;,w ∈&#91;1,8192&#93;


<!-- PDF p.118 -->

#### 3.3.35 GRU



Gated Recurrent Unit (GRU). GRU extensions and variants are named exGRU; parameters marked (extern) are exclusive to exGRU. The equations follow:



```text
f = Sigmoid; g = Tanh
r_t = f(x_t · W_r + h_{t-1} · R_r + Wb_r + Rb_r)
z_t = f(x_t · W_z + h_{t-1} · R_z + Wb_z + Rb_z)
h_t = g(x_t · W_h + (r_t ⊙ h_{t-1}) · R_h + Rb_h + Wb_h), (WRB = 0)
h_t = g(x_t · W_h + r_t ⊙ (h_{t-1} · R_h + Rb_h)) + Wb_h, (WRB = 1)
H_t = (1-z_t) ⊙ h_t + z_t ⊙ h_{t-1}
```



**Inputs**


- X:T1
  - shape:&#91;seq&#95;length,batch&#95;size,input&#95;size&#93;


```text
seqlength∈(0,8192]
```


- batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
- 


```text
inputsize∈(0,8192]
```


- 
- Quantization support
  - per‑layer
- W:T1
  - shape:&#91;num&#95;directions,4&#42;hidden&#95;size,input&#95;size&#93;


```text
inputsize∈(0,8192]
```


- 


```text
hiddensize∈(0,8192]
```


- 
- numdirections:1or2
- Quantization support
  - per‑layer
  - per‑channel
- R:T1
  - shape:&#91;num&#95;directions,4&#42;hidden&#95;size,hidden&#95;size&#93;


```text
hiddensize∈(0,8192]
```


- 
- numdirections:1or2
- Quantization support
  - per‑layer
  - per‑channel
- B:T2
  - shape:&#91;num&#95;directions,8&#42;hidden&#95;size&#93;


```text
hiddensize∈(0,8192]
```


- 
- numdirections:1or2
- Quantization support
  - per‑layer
  - per‑channel
- sequence&#95;lens:T3(optional)
  - shape:&#91;batch&#95;size&#93;; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
    - 
- initial&#95;h:T1(optional)
  - shape:&#91;num&#95;directions,batch&#95;size,hidden&#95;size&#93;
    - numdirections:1or2; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
    - 


```text
hiddensize∈(0,8192]
```


- 
- Quantization support
  - per‑layer


**Outputs**


- Y:T1
  - shape:&#91;seq&#95;length,num&#95;directions,batch&#95;size,hidden&#95;size&#93;


```text
seqlength∈(0,8192]
```


- 
- numdirections:1or2; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
- 


```text
hiddensize∈(0,8192]
```


- 
- Quantization support
  - per‑layer
- Y&#95;h:T1(optional)
  - shape:&#91;num&#95;directions,batch&#95;size,hidden&#95;size&#93;
    - numdirections:1or2; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
    - 


```text
hiddensize∈(0,8192]
```


- 
- Quantization support
  - per‑layer


**Attributes**


- linear&#95;before&#95;reset:int
  - Selects the LBR variant:1(T)or0(F).
- direction(extern):string
  - Specifies the GRU processing direction.
  - forward: processes GRU forwards.
  - reverse: processes GRU backwards.
  - bidirectional: processes GRU in both directions.
- sequence&#95;size(extern):int
  - Specifies the GRU input seqsize; unrestricted, but alignment to 4 is recommended.
- hidden&#95;size(extern):int
  - hiddensize within the GRU unit; unrestricted, but alignment to 8 is recommended.
- input&#95;layout(extern):int
  - Specifies a layout consistent with the meaning of the corresponding input shape.
  - The specified layout and the actual batch&#95;size, sequence&#95;size and hidden&#95;size of this op must be provided.
  - snc: the input shape for this layout is &#91;seqs,batches,input&#95;size&#93;.
  - (sn)c: the input shape for this layout is &#91;seqs&#42;batches,input&#95;size,1,1&#93;.
- output&#95;layout(extern):int
  - Specifies a layout consistent with the meaning of the corresponding output shape.
  - The specified layout and the actual batch&#95;size, sequence&#95;size, hidden&#95;size and directions of this op must be provided.
  - sbnc: the output shape for this layout is &#91;seqs,directions,batches,hidden&#95;size&#93;.
  - (sn)c: the output shape for this layout is &#91;seqsbatches,directionsinput&#95;size,1,1&#93;.


**Data-type constraints**


- T1:float16(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.120 -->

#### 3.3.36 Gather



Uses Indices to select entries of input X along the specified axis and concatenates them.



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
- Indices:T2
  - Indices of the elements to gather; rank =1.


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:int(Tensor)


**Attributes**


- axis:int(Tensor)
  - axis∈{0,1,2,3}
  - Specifies the input dimension accessed by Indices.


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.121 -->

#### 3.3.37 Hardmax



**Outputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;


```text
axis=1,height∗width<16384;
```


- axis=3/‑1,channel∗height&lt;16384; also subject to tranpose specification limits.
- 


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Attributes**


- axis:int
  - hardmax axis:1,3/‑1, corresponding to channel and width.


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.122 -->

#### 3.3.38 LSTM



Long Short-Term Memory (LSTM). LSTM extensions and variants are named exLSTM; parameters marked (extern) are exclusive to exLSTM. The equations follow:



```text
f = Sigmoid; g = Tanh; h = Tanh
i_t = f(x_t · W_i + h_{t-1} · R_i + Wb_i + Rb_i)
f_t = f(x_t · W_f + h_{t-1} · R_f + Wb_f + Rb_f)
c_t = f(x_t · W_c + h_{t-1} · R_c + Wb_c + Rb_c)
o_t = f(x_t · W_o + h_{t-1} · R_o + Wb_o + Rb_o)
C_t = f_t ⊙ C(t-1) + i_t ⊙ c_t
h_t = o_t ⊙ h(C_t)
```



**Inputs**


- X:T1
  - shape:&#91;seq&#95;length,batch&#95;size,input&#95;size&#93;


```text
seqlength∈(0,8192]
```


- batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
- 


```text
inputsize∈(0,8192]
```


- 
- Quantization support
  - per‑layer
- W:T2
  - shape:&#91;num&#95;directions,4&#42;hidden&#95;size,input&#95;size&#93;


```text
inputsize∈(0,8192]
```


- 


```text
hiddensize∈(0,8192]
```


- 
- numdirections:1or2
- Quantization support
  - per‑layer
  - per‑channel
- R:T2
  - shape:&#91;num&#95;directions,4&#42;hidden&#95;size,hidden&#95;size&#93;


```text
hiddensize∈(0,8192]
```


- 
- numdirections:1or2
- Quantization support
  - per‑layer
  - per‑channel
- B:T2
  - shape:&#91;num&#95;directions,8&#42;hidden&#95;size&#93;


```text
hiddensize∈(0,8192]
```


- 
- numdirections:1or2
- Quantization support
  - per‑layer
  - per‑channel
- sequence&#95;lens:T2(optional)
  - shape:&#91;batch&#95;size&#93;; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
    - 
- initial&#95;h:T1(optional)
  - shape:&#91;num&#95;directions,batch&#95;size,hidden&#95;size&#93;
    - numdirections:1or2; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
    - 


```text
hiddensize∈(0,8192]
```


- 
- Quantization support
  - per‑layer
- initial&#95;c:T1(optional)
  - shape:&#91;num&#95;directions,batch&#95;size,hidden&#95;size&#93;
    - numdirections:1or2; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
    - 


```text
hiddensize∈(0,8192]
```


- 
- Quantization support
  - per‑layer


**Outputs**


- Y:T1
  - shape:&#91;seq&#95;length,num&#95;directions,batch&#95;size,hidden&#95;size&#93;


```text
seqlength∈(0,8192]
```


- 
- numdirections:1or2; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
- 


```text
hiddensize∈(0,8192]
```


- 
- Quantization support
  - per‑layer
- Y&#95;h:T1(optional)
  - shape:&#91;num&#95;directions,batch&#95;size,hidden&#95;size&#93;
    - numdirections:1or2; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
    - 


```text
hiddensize∈(0,8192]
```


- 
- Quantization support
  - per‑layer
- Y&#95;c:T1(optional)
  - shape:&#91;num&#95;directions,batch&#95;size,hidden&#95;size&#93;
    - numdirections:1or2; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
    - 


```text
hiddensize∈(0,8192]
```


- 
- Quantization support
  - per‑layer


**Attributes**


- direction(extern):string
  - Specifies the LSTM processing direction.
  - forward: processes LSTM forwards.
  - reverse: processes LSTM backwards.
  - bidirectional: processes LSTM in both directions.
- sequence&#95;size(extern):int
  - Specifies the LSTM input seqsize; unrestricted, but alignment to 4 is recommended.
- hidden&#95;size(extern):int
  - hiddensize within the LSTM unit; unrestricted, but alignment to 8 is recommended.
- proj&#95;size(extern):int
  - proj&#95;size for projection; projsize∈&#91;0,hiddensize&#93;.
  - Currently restricted to 0; projection is not yet supported.
- input&#95;forget(extern):int
  - Selects the cifg variant:1(T)or0(F). Currently restricted to 0, so it is not yet supported.
- has&#95;projection(extern):int
  - projection variant:1(T)or0(F). Currently restricted to 0, so it is not yet supported.
- input&#95;layout(extern):int
  - Specifies a layout consistent with the meaning of the corresponding input shape.
  - The specified layout and the actual batch&#95;size, sequence&#95;size and hidden&#95;size of this op must be provided.
  - snc: the input shape for this layout is &#91;seqs,batches,input&#95;size&#93;.
  - (sn)c: the input shape for this layout is &#91;seqs&#42;batches,input&#95;size,1,1&#93;.
- output&#95;layout(extern):int
  - Specifies a layout consistent with the meaning of the corresponding output shape.
  - The specified layout and the actual batch&#95;size, sequence&#95;size, hidden&#95;size and directions of this op must be provided.
  - sbnc: the output shape for this layout is &#91;seqs,directions,batches,hidden&#95;size&#93;.
  - (sn)c: the output shape for this layout is &#91;seqsbatches,directionsinput&#95;size,1,1&#93;.


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)
- T3:int32(Tensor)
- T4:float(Scalar)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.125 -->

#### 3.3.39 Max



Computes the elementwise maximum of the input tensors.



**Inputs**


- A:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.
- B:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.


**Outputs**


- C:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer/per‑channel


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.126 -->

#### 3.3.40 Mul



Performs elementwise binary multiplication (C=A&#42;B), supporting multidirectional NumPy-style broadcasting.



**Inputs**


- A:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.
- B:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.


**Outputs**


- C:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(constTensor)


<!-- PDF p.126 -->

#### 3.3.41 MulRelu



Fused Mul and Relu computation,C=Relu(A&#42;B).



**Inputs**


- Same as Mul.


**Outputs**


- Same as Mul.


**Other support**


- Multi-core cooperation: supported.


<!-- PDF p.127 -->

#### 3.3.42 Pad



Given a data tensor (data), a tensor of beginning/end padding values for each axis (pads), a mode (mode) and a constant value (constant&#95;value), produces a padded tensor (output).



**Inputs**


- data:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
- pads:T2
  - shape : &#91;batch&#95;begin, channel&#95;begin, height&#95;begin, width&#95;begin, batch&#95;end, chan‑nel&#95;end,height&#95;end,width&#95;end&#93;
- constant&#95;value(optional):T3
  - shape:&#91;1&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:int64(Tensor)
- T3:float(Scalar),int8(Scalar),float16(Scalar)


**Attributes**


- mode:string (default constant)
  - Supported modes: constant,reflect.
    - constant: unrestricted.


```text
reflectchannel∈(0,8192],height∈(0,8192],width∈(0,8176]
```


- 


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.128 -->

#### 3.3.43 MaxPool



MaxPool consumes input tensor X and applies max pooling according to kernel size, stride size and pad lengths. It computes the maximum over subsets of the input tensor determined by the kernel, downsampling into output tensor Y for further processing. The output spatial shape depends on whether explicit padding (pads) or automatic padding (auto&#95;pad) is used. Only explicit padding is used here.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;


```text
channel∈(0,8192]
```


- 


```text
height∈(0,8192]
```


- 


```text
width∈(0,8192]
```


- 


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Attributes**


- kernel&#95;shape:int64(kernel&#95;h,kernel&#95;w)
  - kernel&#95;h∈(0,7&#93;
  - kernel&#95;w∈(0,7&#93;
- auto&#95;pad:string
  - Padding mode: only NOTSET is supported.
- ceil&#95;mode:int64
  - Computing output shape using ceil or floor: unsupported.
- strides:int64(strides&#95;h,strides&#95;w)
  - strides&#95;h∈(0,8&#93;
  - strides&#95;w∈(0,8&#93;
- count&#95;include&#95;pad:int64&#91;&#93;
  - count&#95;include&#95;pad, whether to include pad values in calculation:1.
- pad:int64(pad&#95;top,pad&#95;left,pad&#95;bottom,pad&#95;right)
  - pad&#95;top∈&#91;0,7&#93;
  - pad&#95;left∈&#91;0,7&#93;
  - pad&#95;bottom∈&#91;0,7&#93;
  - pad&#95;right∈&#91;0,7&#93;
- storage&#95;order:int64&#91;&#93;
  - Preferred storage order:0.


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)


<!-- PDF p.129 -->

#### 3.3.44 GlobalMaxPool



GlobalMaxPool takes input tensor X and applies max pooling to values within each channel. It is equivalent to MaxPool with kernel&#95;shape equal to the spatial dimensions of input.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;


```text
channel∈(0,8192]
```


- 


```text
height∈(0,7]
```


- 


```text
width∈(0,7]
```


- 


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Attributes**


- kernel&#95;shape:int64(kernel&#95;h,kernel&#95;w)
  - kernel&#95;h∈(0,7&#93;
  - kernel&#95;w∈(0,7&#93;
- auto&#95;pad:string
  - Padding mode: only NOTSET is supported.
- ceil&#95;mode:int64
  - Computing output shape using ceil or floor: unsupported.
- strides:int64(strides&#95;h,strides&#95;w)
  - strides&#95;h∈(0,8&#93;
  - strides&#95;w∈(0,8&#93;
- count&#95;include&#95;pad:int64&#91;&#93;
  - count&#95;include&#95;pad, whether to include pad values in calculation:1.
- pad:int64(pad&#95;top,pad&#95;left,pad&#95;bottom,pad&#95;right)
  - pad&#95;top∈&#91;0,7&#93;
  - pad&#95;left∈&#91;0,7&#93;
  - pad&#95;bottom∈&#91;0,7&#93;
  - pad&#95;right∈&#91;0,7&#93;


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)


<!-- PDF p.130 -->

#### 3.3.45 AveragePool



AveragePool consumes input tensor X and applies average pooling according to kernel size, stride size and pad lengths. It averages all values in subsets of the input tensor determined by the kernel and downsamples into output tensor Y for further processing. The output spatial shape depends on whether explicit padding (pads) or automatic padding (auto&#95;pad) is used. Only explicit padding is used here.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;


```text
channel∈(0,8192]
```


- 


```text
height∈(0,8192]
```


- 


```text
width∈(0,8192]
```


- 


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Attributes**


- kernel&#95;shape:int64(kernel&#95;h,kernel&#95;w)
  - kernel&#95;h∈(0,7&#93;
  - kernel&#95;w∈(0,7&#93;
- auto&#95;pad:string
  - Padding mode: only NOTSET is supported.
- ceil&#95;mode:int64
  - Computing output shape using ceil or floor: unsupported.
- strides:int64(strides&#95;h,strides&#95;w)
  - strides&#95;h∈(0,8&#93;
  - strides&#95;w∈(0,8&#93;
- count&#95;include&#95;pad:int64&#91;&#93;
  - count&#95;include&#95;pad, whether to include pad values in calculation:1.
- pad:int64(pad&#95;top,pad&#95;left,pad&#95;bottom,pad&#95;right)
  - pad&#95;top∈&#91;0,7&#93;
  - pad&#95;left∈&#91;0,7&#93;
  - pad&#95;bottom∈&#91;0,7&#93;
  - pad&#95;right∈&#91;0,7&#93;


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)


<!-- PDF p.131 -->

#### 3.3.46 GlobalAveragePool



GlobalAveragePool applies average pooling to values within each channel of input tensor X. This equals AveragePool with kernel&#95;shape equal to the spatial dimensions of the input tensor.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;


```text
channel∈(0,8192]
```


- 


```text
height∈(0,7]
```


- 


```text
width∈(0,7]
```


- 


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Attributes**


- kernel&#95;shape:int64(kernel&#95;h,kernel&#95;w)
  - kernel&#95;h∈(0,7&#93;
  - kernel&#95;w∈(0,7&#93;
- auto&#95;pad:string
  - Padding mode: only NOTSET is supported.
- ceil&#95;mode:int64
  - Computing output shape using ceil or floor: unsupported.
- strides:int64(strides&#95;h,strides&#95;w)
  - strides&#95;h∈(0,8&#93;
  - strides&#95;w∈(0,8&#93;
- count&#95;include&#95;pad:int64&#91;&#93;
  - count&#95;include&#95;pad, whether to include pad values in calculation:1.
- pad:int64(pad&#95;top,pad&#95;left,pad&#95;bottom,pad&#95;right)
  - pad&#95;top∈&#91;0,7&#93;
  - pad&#95;left∈&#91;0,7&#93;
  - pad&#95;bottom∈&#91;0,7&#93;
  - pad&#95;right∈&#91;0,7&#93;


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)


<!-- PDF p.132 -->

#### 3.3.47 Pow



```text
Z =XY
```



Exponentiation: takes input data (a tensor) and an exponent, and produces output data (a tensor).



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
- Y:T2
  - shape:&#91;1&#93;
    - Currently supports only 0,1,2,3,0.5,‑0.5.


**Outputs**


- Z:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:int8(Tensor),int32(Tensor),int64(Tensor),float16(Tensor),float(Tensor)


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.132 -->

#### 3.3.48 Relu



Sets negative input-tensor values to zero; positive values remain unchanged.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - None


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.133 -->

#### 3.3.49 Clip/ReLU6



Clips input-tensor values to &#91;0,6&#93;.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - None


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.133 -->

#### 3.3.50 PRelu



Scales negative input-tensor values by a learnable parameter; positive values remain unchanged.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer/per‑channel
  - Broadcasting support
    - None


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer/per‑channel


**Attributes**


- slope: PRelu coefficient.
  - Only a single scalar or coefficients along dimension C are supported.


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.134 -->

#### 3.3.51 LeakyRelu



Scales negative input-tensor values by a fixed ratio; positive values remain unchanged.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - None


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.135 -->

#### 3.3.52 Reshape



Returns a tensor of the specified shape without changing the input data or element count.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Attributes**


- shape:int
  - Specifies the output tensor shape.


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.135 -->

#### 3.3.53 Resize



Resizes the input tensor. In general, each output value is computed as a weighted average of a neighborhood (sampling locations) in the input tensor.



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
- roi(optional):T2
  - Not currently supported.
- scales(optional):T2
  - Array of scale factors along each dimension.
- sizes(optional):T3
  - Target size of the output tensor.


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)
- T3:int64(Tensor)


**Attributes**


- antialias:int (default 0)
  - Setting this is currently unsupported.
- axes:int&#91;&#93;
  - Setting this is currently unsupported.
- coordinate&#95;transformation&#95;mode:strings (default ”half&#95;pixel”)
  - Currently supports only half&#95;pixel, pytorch&#95;half&#95;pixel and align&#95;corners.
- cubic&#95;coeff&#95;a:float (default ‑0.75)
  - Setting this is currently unsupported.
- exclude&#95;outside:int (default 0)
  - Setting this is currently unsupported.
- extrapolation&#95;value:float (default 0)
  - Setting this is currently unsupported.
- keep&#95;aspect&#95;ratio&#95;policy:strings (default ”stretch”)
  - Setting this is currently unsupported.
- mode:strings (default ”nearest”)
  - Only nearest and linear are currently configurable.
- nearest&#95;mode:strings (default ”round&#95;prefer&#95;floor”)
  - Setting this is currently unsupported.


Support: currently only integer scaling in width and height is supported, with integer factors 2‑8. An input (1,c,1,1) can be enlarged to (1,c,h,w).



<!-- PDF p.136 -->

#### 3.3.54 Slice



Obtains a slice of the current vector using the same rules as NumPy slicing.



**Inputs**


- input&#95;tensor:T
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T:int8(Tensor),float16(Tensor)


**Attributes**


- starts:int(Tensor)
  - Slice start position: unrestricted.
- ends:int(Tensor)
  - Slice end position: unrestricted.
- axes:int(Tensor)
  - Slice-axis selection: any axis 0~3; multiple axes may be selected simultaneously.
- steps:int(Tensor)
  - Selects the step along each sliced axis.
  - When height&#42;width==1&amp;&amp;channel%subc==0&amp;&amp;starts&#91;1&#93;%subc==0&amp;&amp;ends&#91;1&#93;%subc==0&amp;&amp;steps&#91;1&#93;&lt;=subc, steps may differ from 1. Otherwise SliceOP runs on the NPU only when steps==&#91;1,1,1,1&#93;.


<!-- PDF p.137 -->

#### 3.3.55 Softmax



This operator computes normalized exponential values of the input:



```text
Softmax(input, axis) = exp(input - max(input, axis)) / Σ_axis exp(input - max(input, axis))
```



The “axis” attribute specifies the dimension along which Softmax is applied. The output tensor has the same shape and contains the corresponding input Softmax values.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;, subject to tranpose specification limits.


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Attributes**


- axis:int
  - softmax axis:1,3, corresponding to channel and width.


<!-- PDF p.138 -->

#### 3.3.56 exSoftmax13



This operator computes normalized exponential values of the input:



```text
exSoftmax13(input, axis) = exp(input - max(input, axis)) / Σ_axis exp(input - max(input, axis))
```



The “axis” attribute specifies the dimension along which Softmax is applied. The output tensor has the same shape and contains the corresponding input Softmax values.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;, subject to tranpose specification limits.


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Attributes**


- axis:int64
  - softmax axis:1,3, corresponding to channel and width.


<!-- PDF p.138 -->

#### 3.3.57 exSoftmaxMask



This operator computes normalized exponential values of the input:



```text
input(x, mast_t, mask_value) =
  x + (mast_t - 1) * inf   if mask_value = 0
  x + mast_t * (-inf)      elif mask_value = 1
exSoftmaxMask(input, axis) = exp(input - max(input, axis)) / Σ_axis exp(input - max(input, axis))
```



The “axis” attribute specifies the dimension along which Softmax is applied. The output tensor has the same shape and contains the corresponding input Softmax values.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;, subject to tranpose specification limits.
- mask(optional):T1
  - shape:&#91;1,channel,height,width&#93;


```text
channel∈(0,8192]
```


- 
- width:· axis=1, unrestricted;


```text
· axis=3/‑1,width∈(0,8192]
```



**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Attributes**


- axis:int64
  - softmax axis:1,3, corresponding to channel and width.
- mask&#95;value:int64
  - Values requiring masking:0,1.


<!-- PDF p.139 -->

#### 3.3.58 Split



Splits the vector along axis into num&#95;outputs vectors; split specifies their sizes along axis.



**Inputs**


- input&#95;tensor:T
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T
  - One or more output vectors, determined by num&#95;outputs.
  - shape: determined by the split.
  - Quantization support
    - per‑layer


**Data-type constraints**


- T:int8(Tensor),float16(Tensor)


**Attributes**


- axis:int
  - axis∈{0,1,2,3}
- num&#95;outputs:int
- split:int(Tensor)


<!-- PDF p.140 -->

#### 3.3.59 Sub


- Performs elementwise binary subtraction (C=A‑B), supporting multidirectional NumPy-style broadcasting.


**Inputs**


- A:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - &#91;b,c,1,1&#93;
    - &#91;scalar&#93;
- B:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - &#91;b,c,1,1&#93;
    - &#91;scalar&#93;


**Outputs**


- C:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(constTensor)


<!-- PDF p.140 -->

#### 3.3.60 Tile



Constructs a tensor by tiling the given tensor, like NumPy tile but without broadcasting.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
- repeats:T2
  - shape:&#91;batch,channel,height,width&#93;


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:int64(Tensor)


<!-- PDF p.141 -->

#### 3.3.61 Transpose



Transposes the input tensor.



**Inputs**


- X:T1
  - shape:&#91;n1,c1,h1,w1&#93;
    - See the attribute list for detailed constraints.
  - Quantization support
    - per‑layer


**Outputs**


- Y:T1,T2
  - shape:&#91;n2,c2,h2,w2&#93;
    - See the attribute list for detailed constraints.
  - Quantization support
    - per‑layer


**Attributes**


- perm, order of transposed axes: constraints for each perm follow (p=268435456,q=65536).
  - perm=&#91;0,1,2,3&#93;
    - Unrestricted
  - perm=&#91;0,1,3,2&#93;
    - T1:h1%16=0,h1&#42;w1&lt;16&#42;p,h1&#42;w1&lt;2&#42;q
    - T2:h1%8=0,h1&#42;w1&lt;8&#42;p,h1&#42;w1&lt;2&#42;q
  - perm=&#91;0,2,3,1&#93;
    - T1:c1&lt;8192,h1&#42;w1%8=0，w1&#42;c1&lt;p&#42;16
    - T2:c1&lt;8192,h1&#42;w1%8=0，w1&#42;c1&lt;p&#42;8
  - perm=&#91;0,2,1,3&#93;
    - T1:h1%16=0,h1&#42;w1&lt;16&#42;p,h1&#42;w1&lt;2&#42;q,c1&#42;w1&lt;p
    - T2:h1%8=0,h1&#42;w1&lt;8&#42;p,h1&#42;w1&lt;2&#42;q,c1&#42;w1&lt;p
  - perm=&#91;0,3,1,2&#93;
    - T1,T2:h1&#42;w1&lt;p,w1&lt;8192,h1&#42;c1&lt;p
  - perm=&#91;0,3,2,1&#93;
    - T1:h1%16=0,h1&#42;w1&lt;16&#42;p,h1&#42;w1&lt;2&#42;q,c1&lt;p&#42;16
    - T2:h1%8=0,h1&#42;w1&lt;8&#42;p,h1&#42;w1&lt;2&#42;q,c1&lt;p&#42;8
  - perm=&#91;1,0,2,3&#93;
    - T1:h1&#42;w1&lt;16&#42;p,n1&lt;8192,h1&#42;w1&lt;p
    - T2:h1&#42;w1&lt;8&#42;p,n1&lt;8192,h1&#42;w1&lt;p
  - perm=&#91;1,0,3,2&#93;
    - T1:h1%16=0,c1&#42;h1&#42;w1&lt;16&#42;p,h1&#42;w1&lt;2&#42;q
    - T2:h1%8=0,c1&#42;h1&#42;w1&lt;8&#42;p,h1&#42;w1&lt;2&#42;q
  - perm=&#91;1,2,0,3&#93;
    - T1:n1&#42;w1&lt;p&#42;16,c1&#42;h1&#42;w1&lt;p,w1%16=0
    - T2:n1&#42;w1&lt;p&#42;8,c1&#42;h1&#42;w1p,w1%8=0
  - perm=&#91;1,2,3,0&#93;
    - T1:h1&#42;w1&lt;p,n1&lt;p&#42;16,c1&#42;h1&#42;w1&lt;p&#42;16,n1&#42;w1&lt;p&#42;16
    - T2:h1&#42;w1&lt;p,n1&lt;p&#42;8,c1&#42;h1&#42;w1&lt;p&#42;8,n1&#42;w1&lt;p&#42;8
  - perm=&#91;1,3,0,2&#93;
    - T1:c1&#42;w1&lt;8192,n1&#42;h1&lt;p,w1%16=0
    - T2:c1&#42;w1&lt;8192,n1&#42;h1&lt;p,w1%8=0
  - perm=&#91;1,3,2,0&#93;
    - T1:c1&#42;h1&#42;w1&lt;p,n1&#42;h1&lt;p,w1&lt;8192,w1%16=0
    - T2:c1&#42;h1&#42;w1&lt;p,n1&#42;h1&lt;p,w1&lt;8192,w1%8=0
  - perm=&#91;2,1,0,3&#93;
    - T1,T2:c1&lt;8192,c1&#42;h1&#42;w1&lt;p,n1&#42;w1&lt;p
  - perm=&#91;2,1,3,0&#93;
    - T1:c1&#42;h1&#42;w1&lt;p,n1&#42;w1&lt;p&#42;16,c1&lt;8192,n1&#42;w1%4=0
    - T2:c1&#42;h1&#42;w1&lt;p,n1&#42;w1&lt;p&#42;8,c1&lt;8192,n1&#42;w1%4=0
  - perm=&#91;2,0,3,1&#93;
    - T1,T2:c1&lt;8192,c1&#42;h1&#42;w1&lt;p
  - perm=&#91;2,0,1,3&#93;
    - T1:n1&#42;c1&#42;h1&#42;w1&lt;p,h1&#42;w1%16=0
    - T2:n1&#42;c1&#42;h1&#42;w1&lt;p,h1&#42;w1%8=0
  - perm=&#91;2,3,1,0&#93;
    - T1:c1&#42;h1&#42;w1&lt;p,n1&#42;c1&lt;p,h1&#42;w1&lt;8192,h1&#42;w1%16=0
    - T2:c1&#42;h1&#42;w1&lt;p,n1&#42;c1&lt;p,h1&#42;w1&lt;8192,h1&#42;w1%8=0
  - perm=&#91;2,3,0,1&#93;
    - T1,T2:h1&#42;w1&lt;8192,n1&#42;c1&lt;p
  - perm=&#91;3,0,2,1&#93;
    - T1:h1&#42;w1&lt;p,n1&#42;c1&lt;8192,c1&#42;h1&lt;p,n1&#42;w1&lt;8192,n1&#42;w1%16=0
    - T2:h1&#42;w1&lt;p,n1&#42;c1&lt;8192,c1&#42;h1&lt;p,n1&#42;w1&lt;8192,n1&#42;w1%8=0
  - perm=&#91;3,0,1,2&#93;
    - T1:h1&#42;w1&lt;p,n1&#42;c1&lt;8192,c1&#42;h1&lt;p,n1&#42;w1&lt;8192,n1&#42;h1&#42;w1%16=0
    - T2:h1&#42;w1&lt;p,n1&#42;c1&lt;8192,c1&#42;h1&lt;p,n1&#42;w1&lt;8192,n1&#42;h1&#42;w1%8=0
  - perm=&#91;3,2,0,1&#93;
    - T1,T2:h1&#42;w1&lt;p,n1&#42;c1&lt;8192,n1&#42;c1&#42;w1&lt;p
  - perm=&#91;3,2,1,0&#93;
    - T1:c1&#42;h1&#42;w1&lt;p,h1&#42;w1&lt;8192,2&#42;h1&#42;w1&lt;q,n1&#42;c1&lt;p&#42;16,h1%16=0
    - T2:c1&#42;h1&#42;w1&lt;p,h1&#42;w1&lt;8192,2&#42;h1&#42;w1&lt;q,n1&#42;c1&lt;p&#42;8,h1%8=0
  - perm=&#91;3,1,0,2&#93;
    - T1,T2:h1&#42;w1&lt;p,c1&#42;w1&lt;8192,n1&#42;h1&lt;p
  - perm=&#91;3,1,2,0&#93;
    - T1,T2:h1&#42;w1&lt;p,n1&#42;c1&lt;8192,n1&#42;h1&lt;p,n1&#42;c1&#42;w1&lt;p


**Data-type constraints**


- T1:int8(Tensor)
- T2:int16(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.143 -->

#### 3.3.62 Sigmoid



Applies y=1/(1+exp(‑x)) elementwise to the input tensor to produce the output tensor.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


<!-- PDF p.144 -->

#### 3.3.63 Tanh



Computes the hyperbolic tangent of each input-tensor element.



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


<!-- PDF p.144 -->

#### 3.3.64 Softplus



Applies Softplus elementwise, y=ln(exp(x)+1).



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


<!-- PDF p.144 -->

#### 3.3.65 HardSigmoid



Applies y=max(0,min(1,alpha&#42;x+beta)) elementwise to the input tensor to produce the output tensor, where



```text
alpha=1/6，beta=0.5
```



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


<!-- PDF p.145 -->

#### 3.3.66 HardSwish



Applies HardSwish elementwise: y = x &#42; max(0, min(1, alpha &#42; x + beta)) = x &#42; HardSigmoid&lt;alpha,beta&gt;(x), where alpha=1/6,beta=0.5.



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


<!-- PDF p.145 -->

#### 3.3.67 Elu



Applies f(x)=alpha&#42;(exp(x)‑1.)forx&lt;0,f(x)=xforx&gt;=0 elementwise to produce the output tensor, with alpha=1.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


<!-- PDF p.146 -->

#### 3.3.68 exSwish



Applies the Sigmoid Linear Unit elementwise. Swish is also called SiLU: y=x&#42;sigmoid(x).



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


<!-- PDF p.146 -->

#### 3.3.69 exMish



Applies mish(x)=x&#42;tanh(softplus(x))=x&#42;tanh(ln(1+e^{x})) elementwise to the input tensor to produce the output tensor.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


<!-- PDF p.146 -->

#### 3.3.70 exGelu



Applies y =x∗Φ(x) elementwise to the input tensor to produce the output tensor. When Φ(x) is set to tanh,



```text
y = 0.5 * x * (1 + Tanh(sqrt(2/π) * (x + 0.044715 * x^3)))
```



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


<!-- PDF p.147 -->

#### 3.3.71 Where



Selects values from x&#95;tensor or y&#95;tensor according to mask&#95;tensor: True selects the corresponding x&#95;tensor value; otherwise the y&#95;tensor value.



**Inputs**


- mask&#95;tensor:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Broadcasting support
    - Supports broadcasting along any dimension.
  - Broadcasting constraints
    - Broadcasting constraints are the same as for Expand.
- x&#95;tensor:&#42;T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
  - Broadcasting constraints
    - Broadcasting constraints are the same as for Expand.
- y&#95;tensor:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
  - Broadcasting constraints
    - Broadcasting constraints are the same as for Expand.


**Outputs**


- output:T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:bool(Tensor)
- T2:int8(Tensor),float16(Tensor)


<!-- PDF p.148 -->

#### 3.3.72 exGlu



Gated Linear Unit function; a is the first half of the input matrix and b is the second half.



```text
GLU(a,b)=a⊗σ(b)
```



**Inputs**


- Input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Outputs**


- Output:T1
  - shape:&#91;batch,channel/2,height,width&#93;
  - Quantization support:per‑layer.


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Attributes**


- axis:int(default=1)
  - Dimension along which to split the input.
  - Constraint: only 1 is supported.


<!-- PDF p.148 -->

#### 3.3.73 exMatMul



Matrix multiplication



```text
Y =
  A · B + C   if c_type = "add"
  A · B * C   if c_type = "mul"
```



**Inputs**


- A:T1
  - shape:&#91;b,k,1,n&#93;
    - k ∈(0,8192&#93;
  - Quantization support
    - per‑layer
- B:T1
  - shape:&#91;b,k,1,m&#93;
  - Quantization support
    - per‑layer
- C(optional):T1,T2
  - shape:&#91;b,n,1,m&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.


**Outputs**


- Y:T1
  - shape:&#91;b,n,1,m&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)


**Attributes**


- c&#95;type:strings(default “add”)
  - Select add or mul to specify whether C is added or multiplied.


<!-- PDF p.149 -->

#### 3.3.74 exNorm



Applies normalization to input data. Currently supports LayerNormlization, RMSNormlization and MeanVarianceNormalization:



```text
LayerNorm(x) = (x - µ) / sqrt(σ^2 + ϵ) · W + B
RMSNorm(x) = x / sqrt(RMS^2 + ϵ) · W + B
MeanVarianceNorm(x) = (x - µ) / sqrt(Variance + ϵ) · W + B
```



Here x is the input vector. µ and σ2 are the mean and variance of the input vector:



```text
µ = (1/H) Σ_{i=1}^{H} x_i
σ^2 = (1/H) Σ_{i=1}^{H} (x_i - µ)^2
```



RMS is the root mean square of the input vector:



```text
RMS = sqrt((1/H) Σ_{i=1}^{H} (x_i)^2)
```



Variance is the equivalent variance of the input vector:



```text
Variance = (1/H) Σ_{i=1}^{H} (x_i)^2 - µ^2
```



ϵ is a small value preventing division by zero. W and B are optional parameters.



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
- W(optional):T1
  - shape:&#91;batch,channel,height,width&#93;
- B(optional):T1
  - shape:&#91;batch,channel,height,width&#93;


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;


**Data-type constraints**


- T1:float16(Tensor)


**Attributes**


- epsilon:float(default 1e‑05)
  - epsilon value used to prevent division by 0.
- mode:string
  - Supports three selectable Normalization modes: layer, rms and mean&#95;var.
- axes:int64&#91;&#93;(default &#91;1&#93;)
  - Normalization axes: currently only &#91;1&#93; and &#91;1,2,3&#93; are supported.


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.151 -->

#### 3.3.75 exSDPAttention



Computes scaled dot-product attention (SDPA) between query, key and value.



**Inputs**


- query:T1
  - shape:&#91;batch,channel,height,width&#93;


```text
channel∈(0,8192]
```


- 
- Quantization support
  - per‑layer
- key:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
- value:T1
  - shape:&#91;batch,channel,height,width&#93;


```text
channel∈(0,8192]
```


- 
- Quantization support
  - per‑layer
- mask(optional):T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Broadcasting along any dimension is supported by default.
    - With FA enabled, only &#91;b,c,1,1&#93;,&#91;1,c,1,1&#93; and &#91;1,c,h,w&#93; are supported.
- scale(optional):T3


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)


**Other support**


- FlashAttentionV2(FA): supported.
  - Based on https://arxiv.org/abs/2307.08691. Inner loops in cache accelerate execution and reduce bandwidth usage, but increase model size; choose whether to enable this according to the scenario and model.
  - RKNPU driver version&gt;=0.8.8
  - RKNPU Runtime library (librknnrt.so) version&gt;=2.0.0
  - Supported data type:float16.


<!-- PDF p.152 -->

#### 3.3.76 exWindow



exWindow derives from window&#95;partition and window&#95;reverse in swin&#95;transformer. In the original paper, input features are divided into non-overlapping windows of window&#95;size×window&#95;size. Input and output features must have a 4-dimensional shape, partitioned in both height and width. The PyTorch implementation follows:



```text
def window_partition(x, window_size):
  """
  Args:
    x: (B, C, H, W)
    window_size (int): window size
  Returns:
    windows: (B, C, num_windows*num_windows, window_size*window_size)
  """
  B, C, H, W = x.shape
  x = x.view(B, C, H // window_size, window_size, W // window_size, window_size)
  windows = x.permute(0, 1, 2, 4, 3, 5).contiguous().view(B, C, -1, window_size*window_size)
  return windows
def window_reverse(windows, window_size, H, W):
  """
  Args:
    windows: (B, C, num_windows*num_windows, window_size*window_size)
    window_size (int): Window size
    H (int): Height of image
    W (int): Width of image
  Returns:
    x: (B, C, H, W)
  """
  B,C,_,_ = windows.shape
  x = windows.view(B, C, H // window_size, W // window_size, window_size, window_size)
  x = x.permute(0, 1, 2, 4, 3, 5).contiguous().view(B, C, H, W)
  return x
```



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Attributes**


- mode:string
  - Supported modes:partition,reverse,partition&#95;num&#95;first.
    - partition: see the window&#95;partition implementation.
    - reverse: see the window&#95;reverse implementation.
    - partition&#95;num&#95;first differs from partition in that its H,W are divided according to num&#95;windows, whereas partition divides H,W according to window&#95;sizes.
- window&#95;sizes:listofints
  - 2-dimensional vector of window sizes, defining the height and width of each window. Attention calculation and feature extraction within each window use this size.
- num&#95;windows:listofints
  - 2-dimensional vector of window counts, defining how many windows the input feature height and width are divided into.


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.154 -->

### 3.4 RV1103/RV1106



<!-- PDF p.154 -->

#### 3.4.1 Add



Performs elementwise binary addition (C=A+B), supporting multidirectional NumPy-style broadcasting.



**Inputs**


- A:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.
- B:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.


**Outputs**


- C:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor)
- T2:float(constTensor)


<!-- PDF p.154 -->

#### 3.4.2 AddRelu



Fused Add and Relu computation, C=Relu(A+B).



**Inputs**


- Same as Add.


**Outputs**


- Same as Add.


**Other support**


- Multi-core cooperation: supported.


<!-- PDF p.155 -->

#### 3.4.3 BatchNormalization



Applies batch normalization to the input tensor as described in https://arxiv.org/abs/1502.03167.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Attributes**


- epsilon:float (default=1e‑5)
  - Real value added when dividing by the standard deviation to prevent division by 0.
  - epsilon∈(0,∞&#93;
- momentum:float
  - Moving-average parameter used during training.


<!-- PDF p.155 -->

#### 3.4.4 Concat



Concatenates a sequence of vectors along axis into one vector. All vector dimensions other than axis must match.



**Inputs**


- input&#95;tensor:T
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T:int8(Tensor),float16(Tensor)


**Attributes**


- axisint64
  - axis∈{0,1,2,3}


<!-- PDF p.156 -->

#### 3.4.5 Convolution



Convolution



**Inputs**


- input&#95;tensor:T1
  - shape:&#91;batch,channel,height,width&#93;
    - width: when dilated&#95;kernel&#95;h&gt;1, width&lt;16383. Additional limits apply to the first-layer input width; see the model-input description.
  - Quantization support
    - per‑layer
- weight:T1
  - shape:&#91;output&#95;channel,input&#95;channel,kernel&#95;h,kernel&#95;w&#93;


```text
kernel_h∈[1,31]
```


- 


```text
kernel_w∈[1,31]
```


- 
- Quantization support
  - per‑layer
  - per‑channel


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Attributes**


- strides:int(strides&#95;h,strides&#95;w)
  - stride&#95;h∈&#91;1,7&#93;
  - stride&#95;w∈&#91;1,7&#93;
- pads:int(pads&#95;top,pads&#95;left,pads&#95;bottom,pads&#95;right)
  - pads&#95;top∈&#91;0,15&#93;
  - pads&#95;left∈&#91;0,15&#93;
  - pads&#95;bottom∈&#91;0,15&#93;
  - pads&#95;right∈&#91;0,15&#93;
- group:int
- dilations:int(dilations&#95;h,dilations&#95;w)
  - dilations&#95;h∈&#91;1,31&#93;
  - dilations&#95;w∈&#91;1,31&#93;


**Data-type constraints**


- T1:int8(Tensor)


<!-- PDF p.157 -->

#### 3.4.6 DepthwiseConvolution



Depthwise separable convolution



**Inputs**


- input&#95;tensor:T1
  - shape:&#91;batch,channel,height,width&#93;
    - width: when dilated&#95;kernel&#95;h&gt;1, width&lt;16383. Additional limits apply to the first-layer input width; see the model-input description.
  - Quantization support
    - per‑layer
- weight:T1
  - shape:&#91;output&#95;channel,input&#95;channel,kernel&#95;h,kernel&#95;w&#93;


```text
kernel_h∈[1,8]
```


- 


```text
kernel_w∈[1,8]
```


- 
- Quantization support
  - per‑layer
  - per‑channel


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Attributes**


- strides:int(strides&#95;h,strides&#95;w)
  - stride&#95;h∈&#91;1,7&#93;
  - stride&#95;w∈&#91;1,7&#93;
- pads:int(pads&#95;top,pads&#95;left,pads&#95;bottom,pads&#95;right)
  - pads&#95;top∈&#91;0,15&#93;
  - pads&#95;left∈&#91;0,15&#93;
  - pads&#95;bottom∈&#91;0,15&#93;
  - pads&#95;right∈&#91;0,15&#93;
- group:int
- dilations:int(dilations&#95;h,dilations&#95;w)
  - dilations&#95;h∈&#91;1,32&#93;
  - dilations&#95;w∈&#91;1,32&#93;


**Data-type constraints**


- T1:int8(Tensor)


<!-- PDF p.158 -->

#### 3.4.7 ConvolutionRelu



Fused Convolution and Relu computation, Output=Relu(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.158 -->

#### 3.4.8 ConvolutionClip



Fused Convolution and Clip computation, Output=Clip(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.158 -->

#### 3.4.9 ConvolutionPRelu/LeakyRelu



Fused Convolution and PRelu/LeakyRelu computation, Output = PRelu(Conv(Input)) or Output =



LeakyRelu(Conv(Input))



Description and specification limits are the same as Convolution.



<!-- PDF p.158 -->

#### 3.4.10 ConvolutionAdd



Fused Convolution and Add computation, Output=Add(Conv(Input0),Input1).



Description and specification limits are the same as Convolution.



<!-- PDF p.158 -->

#### 3.4.11 ConvolutionSigmoid



Fused Convolution and Sigmoid computation, Output=Sigmoid(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.158 -->

#### 3.4.12 ConvolutionTanh



Fused Convolution and Tanh computation, Output=Tanh(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.159 -->

#### 3.4.13 ConvolutionSoftplus



Fused Convolution and Softplus computation, Output=Softplus(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.159 -->

#### 3.4.14 ConvolutionHardSigmoid



Fused Convolution and HardSigmoid computation, Output=HardSigmoid(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.159 -->

#### 3.4.15 ConvolutionHardSwish



Fused Convolution and HardSwish computation, Output=HardSwish(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.159 -->

#### 3.4.16 ConvolutionElu



Fused Convolution and Elu computation, Output=Elu(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.159 -->

#### 3.4.17 ConvolutionSwish



Fused Convolution and Swish computation, Output=Swish(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.159 -->

#### 3.4.18 ConvolutionMish



Fused Convolution and Mish computation, Output=Mish(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.159 -->

#### 3.4.19 ConvolutionAddRelu



Fused Convolution, Add and Relu computation, Output=Relu(Add(Conv(Input0),Input1)).



Description and specification limits are the same as Convolution.



<!-- PDF p.160 -->

#### 3.4.20 ConvTranspose



Transposed convolution



**Inputs**


- input&#95;tensor:T1
  - shape:&#91;batch,channel,height,width&#93;
    - width: when dilated&#95;kernel&#95;h&gt;1, width&lt;16383. In addition, the first-layer input


width is constrained; see model-input instructions.



```text
- **量化支持**
  - per-layer
```


- weight:T1
  - shape:&#91;output&#95;channel,input&#95;channel,kernel&#95;h,kernel&#95;w&#93;


```text
kernel_h∈[1,31]
```


- 


```text
kernel_w∈[1,31]
```


- 
- Quantization support
  - per‑layer
  - per‑channel


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Attributes**


- strides:int(strides&#95;h,strides&#95;w)
  - stride&#95;h∈&#91;1,8&#93;
  - stride&#95;w∈&#91;1,8&#93;
- pads:int(pads&#95;top,pads&#95;left,pads&#95;bottom,pads&#95;right). When setting pad, note that the following are unsupported: kernel&#95;h&#42;dilations&#95;h‑dilations&#95;h‑pads&#95;top&lt;0; kernel&#95;w&#42;dilations&#95;w‑dilations&#95;w‑pads&#95;left&lt;0; stride&#95;h&#42;(height‑1)‑pads&#95;top+1&lt;output&#95;h; stride&#95;w&#42;(width‑1)‑pads&#95;left+1&lt;output&#95;w.
  - pads&#95;top∈&#91;0,15&#93;
  - pads&#95;left∈&#91;0,15&#93;
  - pads&#95;bottom∈&#91;0,15&#93;
  - pads&#95;right∈&#91;0,15&#93;
- group:int
  - group: only 1 is supported; num&#95;output is supported if and only if num&#95;input=num&#95;output.
- dilations:int(dilations&#95;h,dilations&#95;w)
  - dilations&#95;h∈&#91;1,32&#93;
  - dilations&#95;w∈&#91;1,32&#93;
  - When dilation differs from (1,1), only kernel=(1,1) is supported.


**Data-type constraints**


- T1:int8(Tensor)


<!-- PDF p.161 -->

#### 3.4.21 ConvTranposeRelu



Fused ConvTranpose and Relu computation, Output=Relu(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.161 -->

#### 3.4.22 ConvTranposeClip



Fused ConvTranpose and Clip computation, Output=Clip(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.161 -->

#### 3.4.23 ConvTranposePRelu/LeakyRelu



Fused ConvTranpose and PRelu/LeakyRelu computation, Output=PRelu(ConvTranpose(Input)) or Output=



LeakyRelu(ConvTranpose(Input))



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.161 -->

#### 3.4.24 ConvTranposeAdd



Fused ConvTranpose and Add computation, Output=Add(ConvTranpose(Input0),Input1).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.161 -->

#### 3.4.25 ConvTranposeSigmoid



Fused ConvTranpose and Sigmoid computation, Output=Sigmoid(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.162 -->

#### 3.4.26 ConvTranposeTanh



Fused ConvTranpose and Tanh computation, Output=Tanh(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.162 -->

#### 3.4.27 ConvTranposeSoftplus



Fused ConvTranpose and Softplus computation, Output=Softplus(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.162 -->

#### 3.4.28 ConvTranposeHardSigmoid



Fused ConvTranpose and HardSigmoid computation, Output=HardSigmoid(ConvTranpose(Input)).



<!-- PDF p.162 -->

#### 3.4.29 ConvTranposeHardSwish



Fused ConvTranpose and HardSwish computation, Output=HardSwish(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.162 -->

#### 3.4.30 ConvTranposeElu



Fused ConvTranpose and Elu computation, Output=Elu(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.162 -->

#### 3.4.31 ConvTranposeSwish



Fused ConvTranpose and Swish computation, Output=Swish(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.162 -->

#### 3.4.32 ConvTranposeMish



Fused ConvTranpose and Mish computation, Output=Mish(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.163 -->

#### 3.4.33 Div



Performs elementwise binary division (C=A/B), supporting multidirectional NumPy-style broadcasting.



**Inputs**


- A:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.
- B:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.


**Outputs**


- C:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:float16(Tensor)
- T2:float(constTensor)


<!-- PDF p.163 -->

#### 3.4.34 Expand



Broadcasts the input tensor using the given shape and broadcasting rules, similar to numpy.array(input) &#42;numpy.ones(shape): dimensions are right-aligned; each pair of corresponding dimensions must be equal or one of them must be 1.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
- shape:T2
  - shape:&#91;batch,channel,height,width&#93;


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor)
- T2:int64(Tensor)


Broadcasting constraints


- &#91;b,c,1,w&#93;‑&gt;&#91;b,c,h,w&#93;,h∈&#91;1,8192&#93;
- &#91;b,1,1,w&#93;‑&gt;&#91;b,c,h,w&#93;,h∈&#91;1,8192&#93;
- &#91;b,c,h,1&#93;‑&gt;&#91;b,c,h,w&#93;,w ∈&#91;1,8192&#93;
- &#91;b,1,h,1&#93;‑&gt;&#91;b,c,h,w&#93;,w ∈&#91;1,8192&#93;
- &#91;b,c,1,1&#93;‑&gt;&#91;b,c,h,w&#93;,h∈&#91;1,8192&#93;,w ∈&#91;1,8192&#93;


<!-- PDF p.164 -->

#### 3.4.35 Hardmax



**Outputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;


```text
channel∗height∗width<=8192
```


- axis=1,height∗width&lt;16384, and height∗width equals 1 or is greater than 8;
- 
- axis=3/‑1,channel ∗ height &lt; 16384, and channel ∗ height equals 1 or is greater than 8; also subject to tranpose limits.


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Attributes**


- axis:int
  - hardmax axis:1,3/‑1, corresponding to channel and width.


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.165 -->

#### 3.4.36 LSTM



Long Short-Term Memory (LSTM). LSTM extensions and variants are named exLSTM; parameters marked (extern) are exclusive to exLSTM. The equations follow:



```text
f = Sigmoid; g = Tanh; h = Tanh
i_t = f(x_t · W_i + h_{t-1} · R_i + Wb_i + Rb_i)
f_t = f(x_t · W_f + h_{t-1} · R_f + Wb_f + Rb_f)
c_t = f(x_t · W_c + h_{t-1} · R_c + Wb_c + Rb_c)
o_t = f(x_t · W_o + h_{t-1} · R_o + Wb_o + Rb_o)
C_t = f_t ⊙ C(t-1) + i_t ⊙ c_t
h_t = o_t ⊙ h(C_t)
```



**Inputs**


- X:T1
  - shape:&#91;seq&#95;length,batch&#95;size,input&#95;size&#93;


```text
seqlength∈(0,8192]
```


- batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
- 


```text
inputsize∈(0,8192]
```


- 
- Quantization support
  - per‑layer
- W:T1
  - shape:&#91;num&#95;directions,4&#42;hidden&#95;size,input&#95;size&#93;


```text
inputsize∈(0,8192]
```


- 


```text
hiddensize∈(0,8192]
```


- 
- numdirections:1or2
- Quantization support
  - per‑layer
  - per‑channel
- R:T1
  - shape:&#91;num&#95;directions,4&#42;hidden&#95;size,hidden&#95;size&#93;


```text
hiddensize∈(0,8192]
```


- 
- numdirections:1or2
- Quantization support
  - per‑layer
  - per‑channel
- B:T2
  - shape:&#91;num&#95;directions,8&#42;hidden&#95;size&#93;


```text
hiddensize∈(0,8192]
```


- 
- numdirections:1or2
- Quantization support
  - per‑layer
  - per‑channel
- sequence&#95;lens:T3(optional)
  - shape:&#91;batch&#95;size&#93;; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
    - 
- initial&#95;h:T1(optional)
  - shape:&#91;num&#95;directions,batch&#95;size,hidden&#95;size&#93;
    - numdirections:1or2; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
    - 


```text
hiddensize∈(0,8192]
```


- 
- Quantization support
  - per‑layer
- initial&#95;c:T3(optional)
  - shape:&#91;num&#95;directions,batch&#95;size,hidden&#95;size&#93;
    - numdirections:1or2; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
    - 


```text
hiddensize∈(0,8192]
```


- 
- Quantization support
  - per‑layer


**Outputs**


- Y:T1
  - shape:&#91;seq&#95;length,num&#95;directions,batch&#95;size,hidden&#95;size&#93;


```text
seqlength∈(0,8192]
```


- 
- numdirections:1or2; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
- 


```text
hiddensize∈(0,8192]
```


- 
- Quantization support
  - per‑layer
- Y&#95;h:T1(optional)
  - shape:&#91;num&#95;directions,batch&#95;size,hidden&#95;size&#93;
    - numdirections:1or2; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
    - 


```text
hiddensize∈(0,8192]
```


- 
- Quantization support
  - per‑layer
- Y&#95;c:T1(optional)
  - shape:&#91;num&#95;directions,batch&#95;size,hidden&#95;size&#93;
    - numdirections:1or2; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
    - 


```text
hiddensize∈(0,8192]
```


- 
- Quantization support
  - per‑layer


**Attributes**


- direction(extern):string
  - Specifies the LSTM processing direction.
  - forward: processes LSTM forwards.
  - reverse: processes LSTM backwards.
  - bidirectional: processes LSTM in both directions.
- sequence&#95;size(extern):int
  - Specifies the LSTM input seqsize; unrestricted, but alignment to 4 is recommended.
- hidden&#95;size(extern):int
  - hiddensize within the LSTM unit; unrestricted, but alignment to 8 is recommended.
- proj&#95;size(extern):int
  - proj&#95;size for projection; projsize∈&#91;0,hiddensize&#93;.
  - Currently restricted to 0; projection is not yet supported.
- input&#95;forget(extern):int
  - Selects the cifg variant:1(T)or0(F). Currently restricted to 0, so it is not yet supported.
- has&#95;projection(extern):int
  - projection variant:1(T)or0(F). Currently restricted to 0, so it is not yet supported.
- input&#95;layout(extern):int
  - Specifies a layout consistent with the meaning of the corresponding input shape.
  - The specified layout and the actual batch&#95;size, sequence&#95;size and hidden&#95;size of this op must be provided.
  - snc: the input shape for this layout is &#91;seqs,batches,input&#95;size&#93;.
  - (sn)c: the input shape for this layout is &#91;seqs&#42;batches,input&#95;size,1,1&#93;.
- output&#95;layout(extern):int
  - Specifies a layout consistent with the meaning of the corresponding output shape.
  - The specified layout and the actual batch&#95;size, sequence&#95;size, hidden&#95;size and directions of this op must be provided.
  - sbnc: the output shape for this layout is &#91;seqs,directions,batches,hidden&#95;size&#93;.
  - (sn)c: the output shape for this layout is &#91;seqsbatches,directionsinput&#95;size,1,1&#93;.


**Data-type constraints**


- T1:int8(Tensor)
- T2:int32(Tensor)
- T3:int(Scalar)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.168 -->

#### 3.4.37 Max



Computes the elementwise maximum of the input tensors.



**Inputs**


- A:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.
- B:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.


**Outputs**


- C:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer/per‑channel


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.169 -->

#### 3.4.38 Min



Computes the elementwise minimum of the input tensors.



**Inputs**


- A:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.
- B:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.


**Outputs**


- C:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer/per‑channel


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.169 -->

#### 3.4.39 Mul



Performs elementwise binary multiplication (C=A&#42;B), supporting multidirectional NumPy-style broadcasting.



**Inputs**


- A:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.
- B:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.


**Outputs**


- C:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor)
- T2:float(constTensor)


<!-- PDF p.170 -->

#### 3.4.40 MulRelu



Fused Mul and Relu computation,C=Relu(A&#42;B).



**Inputs**


- Same as Mul.


**Outputs**


- Same as Mul.


**Other support**


- Multi-core cooperation: supported.


<!-- PDF p.170 -->

#### 3.4.41 Pad



Given a data tensor (data), a tensor of beginning/end padding values for each axis (pads), a mode (mode) and a constant value (constant&#95;value), produces a padded tensor (output).



**Inputs**


- data:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
- pads:T2
  - shape : &#91;batch&#95;begin, channel&#95;begin, height&#95;begin, width&#95;begin, batch&#95;end, chan‑nel&#95;end,height&#95;end,width&#95;end&#93;
- constant&#95;value(optional):T3
  - shape:&#91;1&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor)
- T2:int64(Tensor)
- T3:float(Scalar),int8(Scalar),float16(Scalar)


**Attributes**


- mode:string (default constant)
  - Supported modes: constant,reflect.
    - constant: unrestricted.


```text
reflectchannel∈(0,8192],height∈(0,8192],width∈(0,8176]
```


- 


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.171 -->

#### 3.4.42 MaxPool



MaxPool consumes input tensor X and applies max pooling according to kernel size, stride size and pad lengths. It computes the maximum over subsets of the input tensor determined by the kernel, downsampling into output tensor Y for further processing. The output spatial shape depends on whether explicit padding (pads) or automatic padding (auto&#95;pad) is used. Only explicit padding is used here.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;


```text
channel∈(0,8192]
```


- 


```text
height∈(0,8192]
```


- 


```text
width∈(0,8192]
```


- 


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Attributes**


- kernel&#95;shape:int64(kernel&#95;h,kernel&#95;w)
  - kernel&#95;h∈(0,7&#93;
  - kernel&#95;w∈(0,7&#93;
- auto&#95;pad:string
  - Padding mode: only NOTSET is supported.
- ceil&#95;mode:int64
  - Computing output shape using ceil or floor: unsupported.
- strides:int64(strides&#95;h,strides&#95;w)
  - strides&#95;h∈(0,8&#93;
  - strides&#95;w∈(0,8&#93;
- count&#95;include&#95;pad:int64&#91;&#93;
  - count&#95;include&#95;pad, whether to include pad values in calculation:1.
- pad:int64(pad&#95;top,pad&#95;left,pad&#95;bottom,pad&#95;right)
  - pad&#95;top∈&#91;0,7&#93;
  - pad&#95;left∈&#91;0,7&#93;
  - pad&#95;bottom∈&#91;0,7&#93;
  - pad&#95;right∈&#91;0,7&#93;
- storage&#95;order:int64&#91;&#93;
  - Preferred storage order:0.


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)


<!-- PDF p.172 -->

#### 3.4.43 GlobalMaxPool



GlobalMaxPool takes input tensor X and applies max pooling to values within each channel. It is equivalent to MaxPool with kernel&#95;shape equal to the spatial dimensions of input.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;


```text
channel∈(0,8192]
```


- 


```text
height∈(0,7]
```


- 


```text
width∈(0,7]
```


- 


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Attributes**


- kernel&#95;shape:int64(kernel&#95;h,kernel&#95;w)
  - kernel&#95;h∈(0,7&#93;
  - kernel&#95;w∈(0,7&#93;
- auto&#95;pad:string
  - Padding mode: only NOTSET is supported.
- ceil&#95;mode:int64
  - Computing output shape using ceil or floor: unsupported.
- strides:int64(strides&#95;h,strides&#95;w)
  - strides&#95;h∈(0,8&#93;
  - strides&#95;w∈(0,8&#93;
- count&#95;include&#95;pad:int64&#91;&#93;
  - count&#95;include&#95;pad, whether to include pad values in calculation:1.
- pad:int64(pad&#95;top,pad&#95;left,pad&#95;bottom,pad&#95;right)
  - pad&#95;top∈&#91;0,7&#93;
  - pad&#95;left∈&#91;0,7&#93;
  - pad&#95;bottom∈&#91;0,7&#93;
  - pad&#95;right∈&#91;0,7&#93;


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)


<!-- PDF p.173 -->

#### 3.4.44 AveragePool



AveragePool consumes input tensor X and applies average pooling according to kernel size, stride size and pad lengths. It averages all values in subsets of the input tensor determined by the kernel and downsamples into output tensor Y for further processing. The output spatial shape depends on whether explicit padding (pads) or automatic padding (auto&#95;pad) is used. Only explicit padding is used here.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;


```text
channel∈(0,8192]
```


- 


```text
height∈(0,8192]
```


- 


```text
width∈(0,8192]
```


- 


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Attributes**


- kernel&#95;shape:int64(kernel&#95;h,kernel&#95;w)
  - kernel&#95;h∈(0,7&#93;
  - kernel&#95;w∈(0,7&#93;
- auto&#95;pad:string
  - Padding mode: only NOTSET is supported.
- ceil&#95;mode:int64
  - Computing output shape using ceil or floor: unsupported.
- strides:int64(strides&#95;h,strides&#95;w)
  - strides&#95;h∈(0,8&#93;
  - strides&#95;w∈(0,8&#93;
- count&#95;include&#95;pad:int64&#91;&#93;
  - count&#95;include&#95;pad, whether to include pad values in calculation:1.
- pad:int64(pad&#95;top,pad&#95;left,pad&#95;bottom,pad&#95;right)
  - pad&#95;top∈&#91;0,7&#93;
  - pad&#95;left∈&#91;0,7&#93;
  - pad&#95;bottom∈&#91;0,7&#93;
  - pad&#95;right∈&#91;0,7&#93;


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)


<!-- PDF p.174 -->

#### 3.4.45 GlobalAveragePool



GlobalAveragePool applies average pooling to values within each channel of input tensor X. This equals AveragePool with kernel&#95;shape equal to the spatial dimensions of the input tensor.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;


```text
channel∈(0,8192]
```


- 


```text
height∈(0,7]
```


- 


```text
width∈(0,7]
```


- 


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Attributes**


- kernel&#95;shape:int64(kernel&#95;h,kernel&#95;w)
  - kernel&#95;h∈(0,7&#93;
  - kernel&#95;w∈(0,7&#93;
- auto&#95;pad:string
  - Padding mode: only NOTSET is supported.
- ceil&#95;mode:int64
  - Computing output shape using ceil or floor: unsupported.
- strides:int64(strides&#95;h,strides&#95;w)
  - strides&#95;h∈(0,8&#93;
  - strides&#95;w∈(0,8&#93;
- count&#95;include&#95;pad:int64&#91;&#93;
  - count&#95;include&#95;pad, whether to include pad values in calculation:1.
- pad:int64(pad&#95;top,pad&#95;left,pad&#95;bottom,pad&#95;right)
  - pad&#95;top∈&#91;0,7&#93;
  - pad&#95;left∈&#91;0,7&#93;
  - pad&#95;bottom∈&#91;0,7&#93;
  - pad&#95;right∈&#91;0,7&#93;


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)


<!-- PDF p.175 -->

#### 3.4.46 Pow



```text
Z =XY
```



Exponentiation: takes input data (a tensor) and an exponent, and produces output data (a tensor).



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
- Y:T2
  - shape:&#91;1&#93;
    - Currently supports only 0,1,2,3,0.5,‑0.5.


**Outputs**


- Z:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:int8(Tensor),int32(Tensor),int64(Tensor),float16(Tensor),float(Tensor)


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.176 -->

#### 3.4.47 Relu



Sets negative input-tensor values to zero; positive values remain unchanged.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - None


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.176 -->

#### 3.4.48 Clip/ReLU6



Clips input-tensor values to &#91;0,6&#93;.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - None


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.177 -->

#### 3.4.49 PRelu



Scales negative input-tensor values by a learnable parameter; positive values remain unchanged.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer/per‑channel
  - Broadcasting support
    - None


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer/per‑channel


**Attributes**


- slope: PRelu coefficient.
  - Only a single scalar or coefficients along dimension C are supported.


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.178 -->

#### 3.4.50 LeakyRelu



Scales negative input-tensor values by a fixed ratio; positive values remain unchanged.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - None


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.178 -->

#### 3.4.51 Reshape



Returns a tensor of the specified shape without changing the input data or element count.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Attributes**


- shape:int
  - Specifies the output tensor shape.


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.179 -->

#### 3.4.52 Resize



Resizes the input tensor. In general, each output value is computed as a weighted average of a neighborhood (sampling locations) in the input tensor.



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
- roi(optional):T2
  - Not currently supported.
- scales(optional):T2
  - Array of scale factors along each dimension.
- sizes(optional):T3
  - Target size of the output tensor.


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor)
- T2:float(Tensor)
- T3:int64(Tensor)


**Attributes**


- antialias:int (default 0)
  - Setting this is currently unsupported.
- axes:int&#91;&#93;
  - Setting this is currently unsupported.
- coordinate&#95;transformation&#95;mode:strings (default ”half&#95;pixel”)
  - Currently supports only half&#95;pixel, pytorch&#95;half&#95;pixel and align&#95;corners.
- cubic&#95;coeff&#95;a:float (default ‑0.75)
  - Setting this is currently unsupported.
- exclude&#95;outside:int (default 0)
  - Setting this is currently unsupported.
- extrapolation&#95;value:float (default 0)
  - Setting this is currently unsupported.
- keep&#95;aspect&#95;ratio&#95;policy:strings (default ”stretch”)
  - Setting this is currently unsupported.
- mode:strings (default ”nearest”)
  - Only nearest and linear are currently configurable.
- nearest&#95;mode:strings (default ”round&#95;prefer&#95;floor”)
  - Setting this is currently unsupported.


Support: currently only integer scaling in width and height is supported, with integer factors 2‑8. An input (1,c,1,1) can be enlarged to (1,c,h,w).



<!-- PDF p.180 -->

#### 3.4.53 Slice



Obtains a slice of the current vector using the same rules as NumPy slicing.



**Inputs**


- input&#95;tensor:T
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T:int8(Tensor),float16(Tensor)


**Attributes**


- starts:int(Tensor)
  - Slice start position: unrestricted.
- ends:int(Tensor)
  - Slice end position: unrestricted.
- axes:int(Tensor)
  - Slice-axis selection: any axis 0~3; multiple axes may be selected simultaneously.
- steps:int(Tensor)
  - Selects the step along each sliced axis.
  - When height&#42;width==1&amp;&amp;channel%subc==0&amp;&amp;starts&#91;1&#93;%subc==0&amp;&amp;ends&#91;1&#93;%subc==0&amp;&amp;steps&#91;1&#93;&lt;=subc, steps may differ from 1. Otherwise SliceOP runs on the NPU only when steps==&#91;1,1,1,1&#93;.


<!-- PDF p.181 -->

#### 3.4.54 Softmax



This operator computes normalized exponential values of the input:



```text
Softmax(input, axis) = exp(input - max(input, axis)) / Σ_axis exp(input - max(input, axis))
```



The “axis” attribute specifies the dimension along which Softmax is applied. The output tensor has the same shape and contains the corresponding input Softmax values.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;, subject to tranpose specification limits.


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Attributes**


- axis:int
  - softmax axis:1,3, corresponding to channel and width.


<!-- PDF p.181 -->

#### 3.4.55 exSoftmax13



This operator computes normalized exponential values of the input:



```text
exSoftmax13(input, axis) = exp(input - max(input, axis)) / Σ_axis exp(input - max(input, axis))
```



The “axis” attribute specifies the dimension along which Softmax is applied. The output tensor has the same shape and contains the corresponding input Softmax values.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;, subject to tranpose specification limits.


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Attributes**


- axis:int64
  - softmax axis:1,3, corresponding to channel and width.


<!-- PDF p.182 -->

#### 3.4.56 exSoftmaxMask



This operator computes normalized exponential values of the input:



```text
input(x, mast_t, mask_value) =
  x + (mast_t - 1) * inf   if mask_value = 0
  x + mast_t * (-inf)      elif mask_value = 1
exSoftmaxMask(input, axis) = exp(input - max(input, axis)) / Σ_axis exp(input - max(input, axis))
```



The “axis” attribute specifies the dimension along which Softmax is applied. The output tensor has the same shape and contains the corresponding input Softmax values.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;, subject to tranpose specification limits.
- mask(optional):T1
  - shape:&#91;1,channel,height,width&#93;


```text
channel∈(0,8192]
```


- 
- width:· axis=1, unrestricted;


```text
· axis=3/‑1,width∈(0,8192]
```



**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Attributes**


- axis:int64
  - softmax axis:1,3, corresponding to channel and width.
- mask&#95;value:int64
  - Values requiring masking:0,1.


<!-- PDF p.183 -->

#### 3.4.57 Split



Splits the vector along axis into num&#95;outputs vectors; split specifies their sizes along axis.



**Inputs**


- input&#95;tensor:T
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T
  - One or more output vectors, determined by num&#95;outputs.
  - shape: determined by the split.
  - Quantization support
    - per‑layer


**Data-type constraints**


- T:int8(Tensor),float16(Tensor)


**Attributes**


- axis:int
  - axis∈{0,1,2,3}
- num&#95;outputs:int
- split:int(Tensor)


<!-- PDF p.183 -->

#### 3.4.58 Sub


- Performs elementwise binary subtraction (C=A‑B), supporting multidirectional NumPy-style broadcasting.


**Inputs**


- A:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - &#91;b,c,1,1&#93;
    - &#91;scalar&#93;
- B:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - &#91;b,c,1,1&#93;
    - &#91;scalar&#93;


**Outputs**


- C:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor)
- T2:float(constTensor)


<!-- PDF p.184 -->

#### 3.4.59 Tile



Constructs a tensor by tiling the given tensor, like NumPy tile but without broadcasting.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
- repeats:T2
  - shape:&#91;batch,channel,height,width&#93;


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:int64(Tensor)


<!-- PDF p.184 -->

#### 3.4.60 Transpose



Transposes the input tensor.



**Inputs**


- X:T1
  - shape:&#91;n1,c1,h1,w1&#93;
    - See the attribute list for detailed constraints.
  - Quantization support
    - per‑layer


**Outputs**


- Y:T1,T2
  - shape:&#91;n2,c2,h2,w2&#93;
    - See the attribute list for detailed constraints.
  - Quantization support
    - per‑layer


**Attributes**


- perm, order of transposed axes: constraints for each perm follow (p=8192,q=2048).
  - perm=&#91;0,1,2,3&#93;
    - Unrestricted
  - perm=&#91;0,1,3,2&#93;
    - T1:h1%16=0,h1&#42;w1&lt;16&#42;p,h1&#42;w1&lt;2&#42;q
    - T2:h1%8=0,h1&#42;w1&lt;8&#42;p,h1&#42;w1&lt;2&#42;q
  - perm=&#91;0,2,3,1&#93;
    - T1:c1&lt;8192,h1&#42;w1%8=0，w1&#42;c1&lt;p&#42;16
    - T2:c1&lt;8192,h1&#42;w1%8=0，w1&#42;c1&lt;p&#42;8
  - perm=&#91;0,2,1,3&#93;
    - T1:h1%16=0,h1&#42;w1&lt;16&#42;p,h1&#42;w1&lt;2&#42;q,c1&#42;w1&lt;p
    - T2:h1%8=0,h1&#42;w1&lt;8&#42;p,h1&#42;w1&lt;2&#42;q,c1&#42;w1&lt;p
  - perm=&#91;0,3,1,2&#93;
    - T1,T2:h1&#42;w1&lt;p,w1&lt;8192,h1&#42;c1&lt;p
  - perm=&#91;0,3,2,1&#93;
    - T1:h1%16=0,h1&#42;w1&lt;16&#42;p,h1&#42;w1&lt;2&#42;q,c1&lt;p&#42;16
    - T2:h1%8=0,h1&#42;w1&lt;8&#42;p,h1&#42;w1&lt;2&#42;q,c1&lt;p&#42;8
  - perm=&#91;1,0,2,3&#93;
    - T1:h1&#42;w1&lt;16&#42;p,n1&lt;8192,h1&#42;w1&lt;p
    - T2:h1&#42;w1&lt;8&#42;p,n1&lt;8192,h1&#42;w1&lt;p
  - perm=&#91;1,0,3,2&#93;
    - T1:h1%16=0,c1&#42;h1&#42;w1&lt;16&#42;p,h1&#42;w1&lt;2&#42;q
    - T2:h1%8=0,c1&#42;h1&#42;w1&lt;8&#42;p,h1&#42;w1&lt;2&#42;q
  - perm=&#91;1,2,0,3&#93;
    - T1:n1&#42;w1&lt;p&#42;16,c1&#42;h1&#42;w1&lt;p,w1%16=0
    - T2:n1&#42;w1&lt;p&#42;8,c1&#42;h1&#42;w1p,w1%8=0
  - perm=&#91;1,2,3,0&#93;
    - T1:h1&#42;w1&lt;p,n1&lt;p&#42;16,c1&#42;h1&#42;w1&lt;p&#42;16,n1&#42;w1&lt;p&#42;16
    - T2:h1&#42;w1&lt;p,n1&lt;p&#42;8,c1&#42;h1&#42;w1&lt;p&#42;8,n1&#42;w1&lt;p&#42;8
  - perm=&#91;1,3,0,2&#93;
    - T1:c1&#42;w1&lt;8192,n1&#42;h1&lt;p,w1%16=0
    - T2:c1&#42;w1&lt;8192,n1&#42;h1&lt;p,w1%8=0
  - perm=&#91;1,3,2,0&#93;
    - T1:c1&#42;h1&#42;w1&lt;p,n1&#42;h1&lt;p,w1&lt;8192,w1%16=0
    - T2:c1&#42;h1&#42;w1&lt;p,n1&#42;h1&lt;p,w1&lt;8192,w1%8=0
  - perm=&#91;2,1,0,3&#93;
    - T1,T2:c1&lt;8192,c1&#42;h1&#42;w1&lt;p,n1&#42;w1&lt;p
  - perm=&#91;2,1,3,0&#93;
    - T1:c1&#42;h1&#42;w1&lt;p,n1&#42;w1&lt;p&#42;16,c1&lt;8192,n1&#42;w1%4=0
    - T2:c1&#42;h1&#42;w1&lt;p,n1&#42;w1&lt;p&#42;8,c1&lt;8192,n1&#42;w1%4=0
  - perm=&#91;2,0,3,1&#93;
    - T1,T2:c1&lt;8192,c1&#42;h1&#42;w1&lt;p
  - perm=&#91;2,0,1,3&#93;
    - T1:n1&#42;c1&#42;h1&#42;w1&lt;p,h1&#42;w1%16=0
    - T2:n1&#42;c1&#42;h1&#42;w1&lt;p,h1&#42;w1%8=0
  - perm=&#91;2,3,1,0&#93;
    - T1:c1&#42;h1&#42;w1&lt;p,n1&#42;c1&lt;p,h1&#42;w1&lt;8192,h1&#42;w1%16=0
    - T2:c1&#42;h1&#42;w1&lt;p,n1&#42;c1&lt;p,h1&#42;w1&lt;8192,h1&#42;w1%8=0
  - perm=&#91;2,3,0,1&#93;
    - T1,T2:h1&#42;w1&lt;8192,n1&#42;c1&lt;p
  - perm=&#91;3,0,2,1&#93;
    - T1:h1&#42;w1&lt;p,n1&#42;c1&lt;8192,c1&#42;h1&lt;p,n1&#42;w1&lt;8192,n1&#42;w1%16=0
    - T2:h1&#42;w1&lt;p,n1&#42;c1&lt;8192,c1&#42;h1&lt;p,n1&#42;w1&lt;8192,n1&#42;w1%8=0
  - perm=&#91;3,0,1,2&#93;
    - T1:h1&#42;w1&lt;p,n1&#42;c1&lt;8192,c1&#42;h1&lt;p,n1&#42;w1&lt;8192,n1&#42;h1&#42;w1%16=0
    - T2:h1&#42;w1&lt;p,n1&#42;c1&lt;8192,c1&#42;h1&lt;p,n1&#42;w1&lt;8192,n1&#42;h1&#42;w1%8=0
  - perm=&#91;3,2,0,1&#93;
    - T1,T2:h1&#42;w1&lt;p,n1&#42;c1&lt;8192,n1&#42;c1&#42;w1&lt;p
  - perm=&#91;3,2,1,0&#93;
    - T1:c1&#42;h1&#42;w1&lt;p,h1&#42;w1&lt;8192,2&#42;h1&#42;w1&lt;q,n1&#42;c1&lt;p&#42;16,h1%16=0
    - T2:c1&#42;h1&#42;w1&lt;p,h1&#42;w1&lt;8192,2&#42;h1&#42;w1&lt;q,n1&#42;c1&lt;p&#42;8,h1%8=0
  - perm=&#91;3,1,0,2&#93;
    - T1,T2:h1&#42;w1&lt;p,c1&#42;w1&lt;8192,n1&#42;h1&lt;p
  - perm=&#91;3,1,2,0&#93;
    - T1,T2:h1&#42;w1&lt;p,n1&#42;c1&lt;8192,n1&#42;h1&lt;p,n1&#42;c1&#42;w1&lt;p


**Data-type constraints**


- T1:int8(Tensor)
- T2:int16(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.187 -->

#### 3.4.61 Sigmoid



Applies y=1/(1+exp(‑x)) elementwise to the input tensor to produce the output tensor.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


<!-- PDF p.187 -->

#### 3.4.62 Tanh



Computes the hyperbolic tangent of each input-tensor element.



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


<!-- PDF p.188 -->

#### 3.4.63 Softplus



Applies Softplus elementwise, y=ln(exp(x)+1).



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


<!-- PDF p.188 -->

#### 3.4.64 HardSigmoid



Applies y=max(0,min(1,alpha&#42;x+beta)) elementwise to the input tensor to produce the output tensor, where



```text
alpha=1/6，beta=0.5
```



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


<!-- PDF p.188 -->

#### 3.4.65 HardSwish



Applies HardSwish elementwise: y = x &#42; max(0, min(1, alpha &#42; x + beta)) = x &#42; HardSigmoid&lt;alpha,beta&gt;(x), where alpha=1/6,beta=0.5.



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


<!-- PDF p.189 -->

#### 3.4.66 Elu



Applies f(x)=alpha&#42;(exp(x)‑1.)forx&lt;0,f(x)=xforx&gt;=0 elementwise to produce the output tensor, with alpha=1.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


<!-- PDF p.189 -->

#### 3.4.67 exSwish



Applies the Sigmoid Linear Unit elementwise. Swish is also called SiLU: y=x&#42;sigmoid(x).



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


<!-- PDF p.190 -->

#### 3.4.68 exMish



Applies mish(x)=x&#42;tanh(softplus(x))=x&#42;tanh(ln(1+e^{x})) elementwise to the input tensor to produce the output tensor.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


<!-- PDF p.190 -->

#### 3.4.69 exGelu



Applies y =x∗Φ(x) elementwise to the input tensor to produce the output tensor. When Φ(x) is set to tanh,



```text
y = 0.5 * x * (1 + Tanh(sqrt(2/π) * (x + 0.044715 * x^3)))
```



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


<!-- PDF p.191 -->

#### 3.4.70 Where



Selects values from x&#95;tensor or y&#95;tensor according to mask&#95;tensor: True selects the corresponding x&#95;tensor value; otherwise the y&#95;tensor value.



**Inputs**


- mask&#95;tensor:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Broadcasting support
    - Supports broadcasting along any dimension.
  - Broadcasting constraints
    - Broadcasting constraints are the same as for Expand.
- x&#95;tensor:&#42;T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
  - Broadcasting constraints
    - Broadcasting constraints are the same as for Expand.
- y&#95;tensor:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
  - Broadcasting constraints
    - Broadcasting constraints are the same as for Expand.


**Outputs**


- output:T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:bool(Tensor)
- T2:int8(Tensor),float16(Tensor)


<!-- PDF p.192 -->

#### 3.4.71 exGlu



Gated Linear Unit function; a is the first half of the input matrix and b is the second half.



```text
GLU(a,b)=a⊗σ(b)
```



**Inputs**


- Input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Outputs**


- Output:T1
  - shape:&#91;batch,channel/2,height,width&#93;
  - Quantization support:per‑layer.


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Attributes**


- axis:int(default=1)
  - Dimension along which to split the input.
  - Constraint: only 1 is supported.


<!-- PDF p.192 -->

#### 3.4.72 exMatMul



Matrix multiplication



```text
Y =
  A · B + C   if c_type = "add"
  A · B * C   if c_type = "mul"
```



**Inputs**


- A:T1
  - shape:&#91;b,k,1,n&#93;
    - k ∈(0,8192&#93;
  - Quantization support
    - per‑layer
- B:T1
  - shape:&#91;b,k,1,m&#93;
  - Quantization support
    - per‑layer
- C(optional):T1,T2
  - shape:&#91;b,n,1,m&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.


**Outputs**


- Y:T1
  - shape:&#91;b,n,1,m&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor)
- T2:float(Tensor)


**Attributes**


- c&#95;type:strings(default “add”)
  - Select add or mul to specify whether C is added or multiplied.


<!-- PDF p.193 -->

#### 3.4.73 exSDPAttention



Computes scaled dot-product attention (SDPA) between query, key and value.



**Inputs**


- query:T1
  - shape:&#91;batch,channel,height,width&#93;


```text
channel∈(0,8192]
```


- 
- Quantization support
  - per‑layer
- key:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
- value:T1
  - shape:&#91;batch,channel,height,width&#93;


```text
channel∈(0,8192]
```


- 
- Quantization support
  - per‑layer
- mask(optional):T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Broadcasting along any dimension is supported by default.
- scale(optional):T3


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)


<!-- PDF p.194 -->

#### 3.4.74 exWindow



exWindow derives from window&#95;partition and window&#95;reverse in swin&#95;transformer. In the original paper, input features are divided into non-overlapping windows of window&#95;size×window&#95;size. Input and output features must have a 4-dimensional shape, partitioned in both height and width. The PyTorch implementation follows:



```text
def window_partition(x, window_size):
  """
  Args:
    x: (B, C, H, W)
    window_size (int): window size
  Returns:
    windows: (B, C, num_windows*num_windows, window_size*window_size)
  """
  B, C, H, W = x.shape
  x = x.view(B, C, H // window_size, window_size, W // window_size, window_size)
  windows = x.permute(0, 1, 2, 4, 3, 5).contiguous().view(B, C, -1, window_size*window_size)
  return windows
def window_reverse(windows, window_size, H, W):
  """
  Args:
    windows: (B, C, num_windows*num_windows, window_size*window_size)
    window_size (int): Window size
    H (int): Height of image
    W (int): Width of image
  Returns:
    x: (B, C, H, W)
  """
  B,C,_,_ = windows.shape
  x = windows.view(B, C, H // window_size, W // window_size, window_size, window_size)
  x = x.permute(0, 1, 2, 4, 3, 5).contiguous().view(B, C, H, W)
  return x
```



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Attributes**


- mode:string
  - Supported modes:partition,reverse,partition&#95;num&#95;first.
    - partition: see the window&#95;partition implementation.
    - reverse: see the window&#95;reverse implementation.
    - partition&#95;num&#95;first differs from partition in that its H,W are divided according to num&#95;windows, whereas partition divides H,W according to window&#95;sizes.
- window&#95;sizes:listofints
  - 2-dimensional vector of window sizes, defining the height and width of each window. Attention calculation and feature extraction within each window use this size.
- num&#95;windows:listofints
  - 2-dimensional vector of window counts, defining how many windows the input feature height and width are divided into.


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.197 -->

### 3.5 RK3576/RV1126B



<!-- PDF p.197 -->

#### 3.5.1 Add



Performs elementwise binary addition (C=A+B), supporting multidirectional NumPy-style broadcasting.



**Inputs**


- A:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.
- B:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.


**Outputs**


- C:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(constTensor)


**Other support**


- Multi-core cooperation: supported on RK3576 / unsupported on RV1126B.


<!-- PDF p.198 -->

#### 3.5.2 AddRelu



Fused Add and Relu computation, C=Relu(A+B).



**Inputs**


- Same as Add.


**Outputs**


- Same as Add.


**Other support**


- Multi-core cooperation: supported on RK3576 / unsupported on RV1126B.


<!-- PDF p.198 -->

#### 3.5.3 BatchNormalization



Applies batch normalization to the input tensor as described in https://arxiv.org/abs/1502.03167.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Attributes**


- epsilon:float (default=1e‑5)
  - Real value added when dividing by the standard deviation to prevent division by 0.
  - epsilon∈(0,∞&#93;
- momentum:float
  - Moving-average parameter used during training.


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.199 -->

#### 3.5.4 Concat



Concatenates a sequence of vectors along axis into one vector. All vector dimensions other than axis must match.



**Inputs**


- input&#95;tensor:T
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T:int8(Tensor),float16(Tensor)


**Attributes**


- axisint64
  - axis∈{0,1,2,3}


<!-- PDF p.199 -->

#### 3.5.5 Convolution



Convolution



**Inputs**


- input&#95;tensor:T1
  - shape:&#91;batch,channel,height,width&#93;
    - width: when dilated&#95;kernel&#95;h&gt;1, width&lt;16383. Additional limits apply to the first-layer input width; see the model-input description.
  - Quantization support
    - per‑layer
- weight:T1
  - shape:&#91;output&#95;channel,input&#95;channel,kernel&#95;h,kernel&#95;w&#93;


```text
kernel_h∈[1,31]
```


- 


```text
kernel_w∈[1,31]
```


- 
- Quantization support
  - per‑layer
  - per‑channel


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Attributes**


- strides:int(strides&#95;h,strides&#95;w)
  - stride&#95;h∈&#91;1,7&#93;
  - stride&#95;w∈&#91;1,7&#93;
- pads:int(pads&#95;top,pads&#95;left,pads&#95;bottom,pads&#95;right)
  - pads&#95;top∈&#91;0,15&#93;
  - pads&#95;left∈&#91;0,15&#93;
  - pads&#95;bottom∈&#91;0,15&#93;
  - pads&#95;right∈&#91;0,15&#93;
- group:int
- dilations:int(dilations&#95;h,dilations&#95;w)
  - dilations&#95;h∈&#91;1,31&#93;
  - dilations&#95;w∈&#91;1,31&#93;


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: supported on RK3576 / unsupported on RV1126B.


<!-- PDF p.200 -->

#### 3.5.6 DepthwiseConvolution



Depthwise separable convolution



**Inputs**


- input&#95;tensor:T1
  - shape:&#91;batch,channel,height,width&#93;
    - width: when dilated&#95;kernel&#95;h&gt;1, width&lt;16383. Additional limits apply to the first-layer input width; see the model-input description.
  - Quantization support
    - per‑layer
- weight:T1
  - shape:&#91;output&#95;channel,input&#95;channel,kernel&#95;h,kernel&#95;w&#93;


```text
kernel_h∈[1,8]
```


- 


```text
kernel_w∈[1,8]
```


- 
- Quantization support
  - per‑layer
  - per‑channel


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Attributes**


- strides:int(strides&#95;h,strides&#95;w)
  - stride&#95;h∈&#91;1,7&#93;
  - stride&#95;w∈&#91;1,7&#93;
- pads:int(pads&#95;top,pads&#95;left,pads&#95;bottom,pads&#95;right)
  - pads&#95;top∈&#91;0,15&#93;
  - pads&#95;left∈&#91;0,15&#93;
  - pads&#95;bottom∈&#91;0,15&#93;
  - pads&#95;right∈&#91;0,15&#93;
- group:int
- dilations:int(dilations&#95;h,dilations&#95;w)
  - dilations&#95;h∈&#91;1,32&#93;
  - dilations&#95;w∈&#91;1,32&#93;


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: supported on RK3576 / unsupported on RV1126B.


<!-- PDF p.201 -->

#### 3.5.7 ConvolutionRelu



Fused Convolution and Relu computation, Output=Relu(Conv(Input)).



Description and specification limits are the same as Convolution.



**Other support**


- Multi-core cooperation: supported on RK3576 / unsupported on RV1126B.


<!-- PDF p.202 -->

#### 3.5.8 ConvolutionClip



Fused Convolution and Clip computation, Output=Clip(Conv(Input)).



Description and specification limits are the same as Convolution.



**Other support**


- Multi-core cooperation: supported on RK3576 / unsupported on RV1126B.


<!-- PDF p.202 -->

#### 3.5.9 ConvolutionPRelu/LeakyRelu



Fused Convolution and PRelu/LeakyRelu computation, Output = PRelu(Conv(Input)) or Output =



LeakyRelu(Conv(Input))



Description and specification limits are the same as Convolution.



**Other support**


- Multi-core cooperation: supported on RK3576 / unsupported on RV1126B.


<!-- PDF p.202 -->

#### 3.5.10 ConvolutionAdd



Fused Convolution and Add computation, Output=Add(Conv(Input0),Input1).



Description and specification limits are the same as Convolution.



**Other support**


- Multi-core cooperation: supported on RK3576 / unsupported on RV1126B.


<!-- PDF p.202 -->

#### 3.5.11 ConvolutionSigmoid



Fused Convolution and Sigmoid computation, Output=Sigmoid(Conv(Input)).



Description and specification limits are the same as Convolution.



**Other support**


- Multi-core cooperation: supported on RK3576 / unsupported on RV1126B.


<!-- PDF p.203 -->

#### 3.5.12 ConvolutionTanh



Fused Convolution and Tanh computation, Output=Tanh(Conv(Input)).



Description and specification limits are the same as Convolution.



**Other support**


- Multi-core cooperation: supported on RK3576 / unsupported on RV1126B.


<!-- PDF p.203 -->

#### 3.5.13 ConvolutionSoftplus



Fused Convolution and Softplus computation, Output=Softplus(Conv(Input)).



Description and specification limits are the same as Convolution.



**Other support**


- Multi-core cooperation: supported on RK3576 / unsupported on RV1126B.


<!-- PDF p.203 -->

#### 3.5.14 ConvolutionHardSigmoid



Fused Convolution and HardSigmoid computation, Output=HardSigmoid(Conv(Input)).



Description and specification limits are the same as Convolution.



**Other support**


- Multi-core cooperation: supported on RK3576 / unsupported on RV1126B.


<!-- PDF p.203 -->

#### 3.5.15 ConvolutionHardSwish



Fused Convolution and HardSwish computation, Output=HardSwish(Conv(Input)).



Description and specification limits are the same as Convolution.



**Other support**


- Multi-core cooperation: supported on RK3576 / unsupported on RV1126B.


<!-- PDF p.204 -->

#### 3.5.16 ConvolutionElu



Fused Convolution and Elu computation, Output=Elu(Conv(Input)).



Description and specification limits are the same as Convolution.



**Other support**


- Multi-core cooperation: supported on RK3576 / unsupported on RV1126B.


<!-- PDF p.204 -->

#### 3.5.17 ConvolutionSwish



Fused Convolution and Swish computation, Output=Swish(Conv(Input)).



Description and specification limits are the same as Convolution.



**Other support**


- Multi-core cooperation: supported on RK3576 / unsupported on RV1126B.


<!-- PDF p.204 -->

#### 3.5.18 ConvolutionMish



Fused Convolution and Mish computation, Output=Mish(Conv(Input)).



Description and specification limits are the same as Convolution.



**Other support**


- Multi-core cooperation: supported on RK3576 / unsupported on RV1126B.


<!-- PDF p.204 -->

#### 3.5.19 ConvolutionAddRelu



Fused Convolution, Add and Relu computation, Output=Relu(Add(Conv(Input0),Input1)).



Description and specification limits are the same as Convolution.



**Other support**


- Multi-core cooperation: supported on RK3576 / unsupported on RV1126B.


<!-- PDF p.205 -->

#### 3.5.20 ConvTranspose



Transposed convolution



**Inputs**


- input&#95;tensor:T1
  - shape:&#91;batch,channel,height,width&#93;
    - width: when dilated&#95;kernel&#95;h&gt;1, width&lt;16383. Additional limits apply to the first-layer input width; see the model-input description.
  - Quantization support
    - per‑layer
- weight:T1
  - shape:&#91;output&#95;channel,input&#95;channel,kernel&#95;h,kernel&#95;w&#93;


```text
kernel_h∈[1,31]
```


- 


```text
kernel_w∈[1,31]
```


- 
- Quantization support
  - per‑layer
  - per‑channel


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Attributes**


- strides:int(strides&#95;h,strides&#95;w)
  - stride&#95;h∈&#91;1,8&#93;
  - stride&#95;w∈&#91;1,8&#93;
- pads:int(pads&#95;top,pads&#95;left,pads&#95;bottom,pads&#95;right). When setting pad, note that the following are unsupported: kernel&#95;h&#42;dilations&#95;h‑dilations&#95;h‑pads&#95;top&lt;0; kernel&#95;w&#42;dilations&#95;w‑dilations&#95;w‑pads&#95;left&lt;0; stride&#95;h&#42;(height‑1)‑pads&#95;top+1&lt;output&#95;h; stride&#95;w&#42;(width‑1)‑pads&#95;left+1&lt;output&#95;w.
  - pads&#95;top∈&#91;0,15&#93;
  - pads&#95;left∈&#91;0,15&#93;
  - pads&#95;bottom∈&#91;0,15&#93;
  - pads&#95;right∈&#91;0,15&#93;
- group:int
  - group: only 1 is supported; num&#95;output is supported if and only if num&#95;input=num&#95;output.
- dilations:int(dilations&#95;h,dilations&#95;w)
  - dilations&#95;h∈&#91;1,32&#93;
  - dilations&#95;w∈&#91;1,32&#93;
  - When dilation differs from (1,1), only kernel=(1,1) is supported.


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.206 -->

#### 3.5.21 ConvTranposeRelu



Fused ConvTranpose and Relu computation, Output=Relu(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.206 -->

#### 3.5.22 ConvTranposeClip



Fused ConvTranpose and Clip computation, Output=Clip(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.206 -->

#### 3.5.23 ConvTranposePRelu/LeakyRelu



Fused ConvTranpose and PRelu/LeakyRelu computation, Output=PRelu(ConvTranpose(Input)) or Output=



LeakyRelu(ConvTranpose(Input))



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.206 -->

#### 3.5.24 ConvTranposeAdd



Fused ConvTranpose and Add computation, Output=Add(ConvTranpose(Input0),Input1).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.207 -->

#### 3.5.25 ConvTranposeSigmoid



Fused ConvTranpose and Sigmoid computation, Output=Sigmoid(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.207 -->

#### 3.5.26 ConvTranposeTanh



Fused ConvTranpose and Tanh computation, Output=Tanh(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.207 -->

#### 3.5.27 ConvTranposeSoftplus



Fused ConvTranpose and Softplus computation, Output=Softplus(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.207 -->

#### 3.5.28 ConvTranposeHardSigmoid



Fused ConvTranpose and HardSigmoid computation, Output=HardSigmoid(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.207 -->

#### 3.5.29 ConvTranposeHardSwish



Fused ConvTranpose and HardSwish computation, Output=HardSwish(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.207 -->

#### 3.5.30 ConvTranposeElu



Fused ConvTranpose and Elu computation, Output=Elu(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.207 -->

#### 3.5.31 ConvTranposeSwish



Fused ConvTranpose and Swish computation, Output=Swish(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.208 -->

#### 3.5.32 ConvTranposeMish



Fused ConvTranpose and Mish computation, Output=Mish(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.208 -->

#### 3.5.33 Div



Performs elementwise binary division (C=A/B), supporting multidirectional NumPy-style broadcasting.



**Inputs**


- A:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.
- B:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.


**Outputs**


- C:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:float16(Tensor)
- T2:float(constTensor)


**Other support**


- Multi-core cooperation: unsupported.


<!-- PDF p.209 -->

#### 3.5.34 Expand



Broadcasts the input tensor using the given shape and broadcasting rules, similar to numpy.array(input) &#42;numpy.ones(shape): dimensions are right-aligned; each pair of corresponding dimensions must be equal or one of them must be 1.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
- shape:T2
  - shape:&#91;batch,channel,height,width&#93;


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:int64(Tensor)


Broadcasting constraints


- &#91;b,c,1,w&#93;‑&gt;&#91;b,c,h,w&#93;,h∈&#91;1,8192&#93;
- &#91;b,1,1,w&#93;‑&gt;&#91;b,c,h,w&#93;,h∈&#91;1,8192&#93;
- &#91;b,c,h,1&#93;‑&gt;&#91;b,c,h,w&#93;,w ∈&#91;1,8192&#93;
- &#91;b,1,h,1&#93;‑&gt;&#91;b,c,h,w&#93;,w ∈&#91;1,8192&#93;
- &#91;b,c,1,1&#93;‑&gt;&#91;b,c,h,w&#93;,h∈&#91;1,8192&#93;,w ∈&#91;1,8192&#93;


**Other support**


- Multi-core cooperation: unsupported.


<!-- PDF p.209 -->

#### 3.5.35 GRU



Gated Recurrent Unit (GRU). GRU extensions and variants are named exGRU; parameters marked (extern) are exclusive to exGRU. The equations follow:



```text
f = Sigmoid; g = Tanh
r_t = f(x_t · W_r + h_{t-1} · R_r + Wb_r + Rb_r)
z_t = f(x_t · W_z + h_{t-1} · R_z + Wb_z + Rb_z)
h_t = g(x_t · W_h + (r_t ⊙ h_{t-1}) · R_h + Rb_h + Wb_h), (WRB = 0)
h_t = g(x_t · W_h + r_t ⊙ (h_{t-1} · R_h + Rb_h)) + Wb_h, (WRB = 1)
H_t = (1-z_t) ⊙ h_t + z_t ⊙ h_{t-1}
```



**Inputs**


- X:T1
  - shape:&#91;seq&#95;length,batch&#95;size,input&#95;size&#93;


```text
seqlength∈(0,8192]
```


- batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
- 


```text
inputsize∈(0,8192]
```


- 
- Quantization support
  - per‑layer
- W:T1
  - shape:&#91;num&#95;directions,4&#42;hidden&#95;size,input&#95;size&#93;


```text
inputsize∈(0,8192]
```


- 


```text
hiddensize∈(0,8192]
```


- 
- numdirections:1or2
- Quantization support
  - per‑layer
  - per‑channel
- R:T1
  - shape:&#91;num&#95;directions,4&#42;hidden&#95;size,hidden&#95;size&#93;


```text
hiddensize∈(0,8192]
```


- 
- numdirections:1or2
- Quantization support
  - per‑layer
  - per‑channel
- B:T2
  - shape:&#91;num&#95;directions,8&#42;hidden&#95;size&#93;


```text
hiddensize∈(0,8192]
```


- 
- numdirections:1or2
- Quantization support
  - per‑layer
  - per‑channel
- sequence&#95;lens:T3(optional)
  - shape:&#91;batch&#95;size&#93;; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
    - 
- initial&#95;h:T1(optional)
  - shape:&#91;num&#95;directions,batch&#95;size,hidden&#95;size&#93;
    - numdirections:1or2; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
    - 


```text
hiddensize∈(0,8192]
```


- 
- Quantization support
  - per‑layer


**Outputs**


- Y:T1
  - shape:&#91;seq&#95;length,num&#95;directions,batch&#95;size,hidden&#95;size&#93;


```text
seqlength∈(0,8192]
```


- 
- numdirections:1or2; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
- 


```text
hiddensize∈(0,8192]
```


- 
- Quantization support
  - per‑layer
- Y&#95;h:T1(optional)
  - shape:&#91;num&#95;directions,batch&#95;size,hidden&#95;size&#93;
    - numdirections:1or2; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
    - 


```text
hiddensize∈(0,8192]
```


- 
- Quantization support
  - per‑layer


**Attributes**


- linear&#95;before&#95;reset:int
  - Selects the LBR variant:1(T)or0(F).
- direction(extern):string
  - Specifies the GRU processing direction.
  - forward: processes GRU forwards.
  - reverse: processes GRU backwards.
  - bidirectional: processes GRU in both directions.
- sequence&#95;size(extern):int
  - Specifies the GRU input seqsize; unrestricted, but alignment to 4 is recommended.
- hidden&#95;size(extern):int
  - hiddensize within the GRU unit; unrestricted, but alignment to 8 is recommended.
- input&#95;layout(extern):int
  - Specifies a layout consistent with the meaning of the corresponding input shape.
  - The specified layout and the actual batch&#95;size, sequence&#95;size and hidden&#95;size of this op must be provided.
  - snc: the input shape for this layout is &#91;seqs,batches,input&#95;size&#93;.
  - (sn)c: the input shape for this layout is &#91;seqs&#42;batches,input&#95;size,1,1&#93;.
- output&#95;layout(extern):int
  - Specifies a layout consistent with the meaning of the corresponding output shape.
  - The specified layout and the actual batch&#95;size, sequence&#95;size, hidden&#95;size and directions of this op must be provided.
  - sbnc: the output shape for this layout is &#91;seqs,directions,batches,hidden&#95;size&#93;.
  - (sn)c: the output shape for this layout is &#91;seqsbatches,directionsinput&#95;size,1,1&#93;.


**Data-type constraints**


- T1:float16(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.212 -->

#### 3.5.36 Gather



Uses Indices to select entries of input X along the specified axis and concatenates them.



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
- Indices:T2
  - Indices of the elements to gather; rank =1.


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:int(Tensor)


**Attributes**


- axis:int(Tensor)
  - axis∈{0,1,2,3}
  - Specifies the input dimension accessed by Indices.


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.213 -->

#### 3.5.37 Hardmax



Computes hardmax activation for the input, following ONNX Hardmax‑13.



```text
Hardmax(input, axis) =
  1   if i = argmax(input, axis)
  0   otherwise
```



**Inputs**


- input:T
  - shape:&#91;batch,channel,height,width&#93;; when axis=1, height∗width∈&#91;1,16384);
    - When axis=3/‑1,channel∗height∈&#91;1,16384); also subject to tranpose limits.
    - 


**Outputs**


- output:T
  - shape:&#91;batch,channel,height,width&#93;


**Data-type constraints**


- T:int8(Tensor),float16(Tensor)


**Attributes**


- axis:int
  - hardmax axis:axis∈{−1,1,3}, corresponding to channel and width.


<!-- PDF p.213 -->

#### 3.5.38 LSTM



Long Short-Term Memory (LSTM). LSTM extensions and variants are named exLSTM; parameters marked (extern) are exclusive to exLSTM. The equations follow:



```text
f = Sigmoid; g = Tanh; h = Tanh
i_t = f(x_t · W_i + h_{t-1} · R_i + Wb_i + Rb_i)
f_t = f(x_t · W_f + h_{t-1} · R_f + Wb_f + Rb_f)
c_t = f(x_t · W_c + h_{t-1} · R_c + Wb_c + Rb_c)
o_t = f(x_t · W_o + h_{t-1} · R_o + Wb_o + Rb_o)
C_t = f_t ⊙ C(t-1) + i_t ⊙ c_t
h_t = o_t ⊙ h(C_t)
```



**Inputs**


- X:T1
  - shape:&#91;seq&#95;length,batch&#95;size,input&#95;size&#93;


```text
seqlength∈(0,8192]
```


- batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
- 


```text
inputsize∈(0,8192]
```


- 
- Quantization support
  - per‑layer
- W:T1
  - shape:&#91;num&#95;directions,4&#42;hidden&#95;size,input&#95;size&#93;


```text
inputsize∈(0,8192]
```


- 


```text
hiddensize∈(0,8192]
```


- 
- numdirections:1or2
- Quantization support
  - per‑layer
  - per‑channel
- R:T1
  - shape:&#91;num&#95;directions,4&#42;hidden&#95;size,hidden&#95;size&#93;


```text
hiddensize∈(0,8192]
```


- 
- numdirections:1or2
- Quantization support
  - per‑layer
  - per‑channel
- B:T2,T3
  - shape:&#91;num&#95;directions,8&#42;hidden&#95;size&#93;


```text
hiddensize∈(0,8192]
```


- 
- numdirections:1or2
- Quantization support
  - per‑layer
  - per‑channel
- sequence&#95;lens:T4,T5(optional)
  - shape:&#91;batch&#95;size&#93;; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
    - 
- initial&#95;h:T1(optional)
  - shape:&#91;num&#95;directions,batch&#95;size,hidden&#95;size&#93;
    - numdirections:1or2; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
    - 


```text
hiddensize∈(0,8192]
```


- 
- Quantization support
  - per‑layer
- initial&#95;c:T1(optional)
  - shape:&#91;num&#95;directions,batch&#95;size,hidden&#95;size&#93;
    - numdirections:1or2; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
    - 


```text
hiddensize∈(0,8192]
```


- 
- Quantization support
  - per‑layer


**Outputs**


- Y:T1
  - shape:&#91;seq&#95;length,num&#95;directions,batch&#95;size,hidden&#95;size&#93;


```text
seqlength∈(0,8192]
```


- 
- numdirections:1or2; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
- 


```text
hiddensize∈(0,8192]
```


- 
- Quantization support
  - per‑layer
- Y&#95;h:T1(optional)
  - shape:&#91;num&#95;directions,batch&#95;size,hidden&#95;size&#93;
    - numdirections:1or2; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
    - 


```text
hiddensize∈(0,8192]
```


- 
- Quantization support
  - per‑layer
- Y&#95;c:T1(optional)
  - shape:&#91;num&#95;directions,batch&#95;size,hidden&#95;size&#93;
    - numdirections:1or2; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
    - 


```text
hiddensize∈(0,8192]
```


- 
- Quantization support
  - per‑layer


**Attributes**


- direction(extern):string
  - Specifies the LSTM processing direction.
  - forward: processes LSTM forwards.
  - reverse: processes LSTM backwards.
  - bidirectional: processes LSTM in both directions.
- sequence&#95;size(extern):int
  - Specifies the LSTM input seqsize; unrestricted, but alignment to 4 is recommended.
- hidden&#95;size(extern):int
  - hiddensize within the LSTM unit; unrestricted, but alignment to 8 is recommended.
- proj&#95;size(extern):int
  - proj&#95;size for projection; projsize∈&#91;0,hiddensize&#93;.
  - Currently restricted to 0; projection is not yet supported.
- input&#95;forget(extern):int
  - Selects the cifg variant:1(T)or0(F). Currently restricted to 0, so it is not yet supported.
- has&#95;projection(extern):int
  - projection variant:1(T)or0(F). Currently restricted to 0, so it is not yet supported.
- input&#95;layout(extern):int
  - Specifies a layout consistent with the meaning of the corresponding input shape.
  - The specified layout and the actual batch&#95;size, sequence&#95;size and hidden&#95;size of this op must be provided.
  - snc: the input shape for this layout is &#91;seqs,batches,input&#95;size&#93;.
  - (sn)c: the input shape for this layout is &#91;seqs&#42;batches,input&#95;size,1,1&#93;.
- output&#95;layout(extern):int
  - Specifies a layout consistent with the meaning of the corresponding output shape.
  - The specified layout and the actual batch&#95;size, sequence&#95;size, hidden&#95;size and directions of this op must be provided.
  - sbnc: the output shape for this layout is &#91;seqs,directions,batches,hidden&#95;size&#93;.
  - (sn)c: the output shape for this layout is &#91;seqsbatches,directionsinput&#95;size,1,1&#93;.


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)
- T3:int32(Tensor)
- T4:float(Scalar)
- T5:int(Scalar)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.216 -->

#### 3.5.39 Max



Computes the elementwise maximum of the input tensors.



**Inputs**


- A:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.
- B:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.


**Outputs**


- C:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer/per‑channel


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.217 -->

#### 3.5.40 Greater



Computes Greater for input tensors A and B.



**Inputs**


- A:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.
- B:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.


**Outputs**


- C:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer/per‑channel


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.218 -->

#### 3.5.41 Min



Computes the elementwise minimum of the input tensors.



**Inputs**


- A:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.
- B:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.


**Outputs**


- C:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer/per‑channel


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.219 -->

#### 3.5.42 Mul



Performs elementwise binary multiplication (C=A&#42;B), supporting multidirectional NumPy-style broadcasting.



**Inputs**


- A:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.
- B:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.


**Outputs**


- C:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(constTensor)


**Other support**


- Multi-core cooperation: supported on RK3576 / unsupported on RV1126B.


<!-- PDF p.219 -->

#### 3.5.43 MulRelu



Fused Mul and Relu computation,C=Relu(A&#42;B).



**Inputs**


- Same as Mul.


**Outputs**


- Same as Mul.


**Other support**


- Multi-core cooperation: supported on RK3576 / unsupported on RV1126B.


<!-- PDF p.220 -->

#### 3.5.44 Pad



Given a data tensor (data), a tensor of beginning/end padding values for each axis (pads), a mode (mode) and a constant value (constant&#95;value), produces a padded tensor (output).



**Inputs**


- data:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
- pads:T2
  - shape : &#91;batch&#95;begin, channel&#95;begin, height&#95;begin, width&#95;begin, batch&#95;end, chan‑nel&#95;end,height&#95;end,width&#95;end&#93;
- constant&#95;value(optional):T3
  - shape:&#91;1&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:int64(Tensor)
- T3:float(Scalar),int8(Scalar),float16(Scalar)


**Attributes**


- mode:string (default constant)
  - Supported modes: constant,reflect.
    - constant: unrestricted.


```text
reflectchannel∈(0,8192],height∈(0,8192],width∈(0,8176]
```


- 


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.221 -->

#### 3.5.45 MaxPool



MaxPool consumes input tensor X and applies max pooling according to kernel size, stride size and pad lengths. It computes the maximum over subsets of the input tensor determined by the kernel, downsampling into output tensor Y for further processing. The output spatial shape depends on whether explicit padding (pads) or automatic padding (auto&#95;pad) is used. Only explicit padding is used here.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;


```text
channel∈(0,8192]
```


- 


```text
height∈(0,8192]
```


- 


```text
width∈(0,8192]
```


- 


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Attributes**


- kernel&#95;shape:int64(kernel&#95;h,kernel&#95;w)
  - kernel&#95;h∈(0,7&#93;
  - kernel&#95;w∈(0,7&#93;
- auto&#95;pad:string
  - Padding mode: only NOTSET is supported.
- ceil&#95;mode:int64
  - Computing output shape using ceil or floor: unsupported.
- strides:int64(strides&#95;h,strides&#95;w)
  - strides&#95;h∈(0,8&#93;
  - strides&#95;w∈(0,8&#93;
- count&#95;include&#95;pad:int64&#91;&#93;
  - count&#95;include&#95;pad, whether to include pad values in calculation:1.
- pad:int64(pad&#95;top,pad&#95;left,pad&#95;bottom,pad&#95;right)
  - pad&#95;top∈&#91;0,7&#93;
  - pad&#95;left∈&#91;0,7&#93;
  - pad&#95;bottom∈&#91;0,7&#93;
  - pad&#95;right∈&#91;0,7&#93;
- storage&#95;order:int64&#91;&#93;
  - Preferred storage order:0.


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)


<!-- PDF p.222 -->

#### 3.5.46 GlobalMaxPool



GlobalMaxPool takes input tensor X and applies max pooling to values within each channel. It is equivalent to MaxPool with kernel&#95;shape equal to the spatial dimensions of input.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;


```text
channel∈(0,8192]
```


- 


```text
height∈(0,8192]
```


- 


```text
width∈(0,8192]
```


- 


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Attributes**


- kernel&#95;shape:int64(kernel&#95;h,kernel&#95;w)
  - kernel&#95;h∈(0,7&#93;
  - kernel&#95;w∈(0,7&#93;
- auto&#95;pad:string
  - Padding mode: only NOTSET is supported.
- ceil&#95;mode:int64
  - Computing output shape using ceil or floor: unsupported.
- strides:int64(strides&#95;h,strides&#95;w)
  - strides&#95;h∈(0,8&#93;
  - strides&#95;w∈(0,8&#93;
- count&#95;include&#95;pad:int64&#91;&#93;
  - count&#95;include&#95;pad, whether to include pad values in calculation:1.
- pad:int64(pad&#95;top,pad&#95;left,pad&#95;bottom,pad&#95;right)
  - pad&#95;top∈&#91;0,7&#93;
  - pad&#95;left∈&#91;0,7&#93;
  - pad&#95;bottom∈&#91;0,7&#93;
  - pad&#95;right∈&#91;0,7&#93;


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)


<!-- PDF p.223 -->

#### 3.5.47 AveragePool



AveragePool consumes input tensor X and applies average pooling according to kernel size, stride size and pad lengths. It averages all values in subsets of the input tensor determined by the kernel and downsamples into output tensor Y for further processing. The output spatial shape depends on whether explicit padding (pads) or automatic padding (auto&#95;pad) is used. Only explicit padding is used here.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;


```text
channel∈(0,8192]
```


- 


```text
height∈(0,8192]
```


- 


```text
width∈(0,8192]
```


- 


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Attributes**


- kernel&#95;shape:int64(kernel&#95;h,kernel&#95;w)
  - kernel&#95;h∈(0,7&#93;
  - kernel&#95;w∈(0,7&#93;
- auto&#95;pad:string
  - Padding mode: only NOTSET is supported.
- ceil&#95;mode:int64
  - Computing output shape using ceil or floor: unsupported.
- strides:int64(strides&#95;h,strides&#95;w)
  - strides&#95;h∈(0,8&#93;
  - strides&#95;w∈(0,8&#93;
- count&#95;include&#95;pad:int64&#91;&#93;
  - count&#95;include&#95;pad, whether to include pad values in calculation:1.
- pad:int64(pad&#95;top,pad&#95;left,pad&#95;bottom,pad&#95;right)
  - pad&#95;top∈&#91;0,7&#93;
  - pad&#95;left∈&#91;0,7&#93;
  - pad&#95;bottom∈&#91;0,7&#93;
  - pad&#95;right∈&#91;0,7&#93;


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)


<!-- PDF p.224 -->

#### 3.5.48 GlobalAveragePool



GlobalAveragePool applies average pooling to values within each channel of input tensor X. This equals AveragePool with kernel&#95;shape equal to the spatial dimensions of the input tensor.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;


```text
channel∈(0,8192]
```


- 


```text
height∈(1,7]
```


- 


```text
width∈(1,7]
```


- 


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Attributes**


- kernel&#95;shape:int64(kernel&#95;h,kernel&#95;w)
  - kernel&#95;h∈(0,7&#93;
  - kernel&#95;w∈(0,7&#93;
- auto&#95;pad:string
  - Padding mode: only NOTSET is supported.
- ceil&#95;mode:int64
  - Computing output shape using ceil or floor: unsupported.
- strides:int64(strides&#95;h,strides&#95;w)
  - strides&#95;h∈(0,8&#93;
  - strides&#95;w∈(0,8&#93;
- count&#95;include&#95;pad:int64&#91;&#93;
  - count&#95;include&#95;pad, whether to include pad values in calculation:1.
- pad:int64(pad&#95;top,pad&#95;left,pad&#95;bottom,pad&#95;right)
  - pad&#95;top∈&#91;0,7&#93;
  - pad&#95;left∈&#91;0,7&#93;
  - pad&#95;bottom∈&#91;0,7&#93;
  - pad&#95;right∈&#91;0,7&#93;


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)


<!-- PDF p.225 -->

#### 3.5.49 Pow



```text
Z =XY
```



Exponentiation: takes input data (a tensor) and an exponent, and produces output data (a tensor).



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
- Y:T2
  - shape:&#91;1&#93;
    - Currently supports only 0,1,2,3,0.5,‑0.5.


**Outputs**


- Z:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:int8(Tensor),int32(Tensor),int64(Tensor),float16(Tensor),float(Tensor)


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.225 -->

#### 3.5.50 Relu



Sets negative input-tensor values to zero; positive values remain unchanged.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - None


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.226 -->

#### 3.5.51 Clip/ReLU6



Clips input-tensor values to &#91;0,6&#93;.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - None


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.226 -->

#### 3.5.52 PRelu



Scales negative input-tensor values by a learnable parameter; positive values remain unchanged.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer/per‑channel
  - Broadcasting support
    - None


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer/per‑channel


**Attributes**


- slope: PRelu coefficient.
  - Only a single scalar or coefficients along dimension C are supported.


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.227 -->

#### 3.5.53 LeakyRelu



Scales negative input-tensor values by a fixed ratio; positive values remain unchanged.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - None


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.228 -->

#### 3.5.54 Reshape



Returns a tensor of the specified shape without changing the input data or element count.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Attributes**


- shape:int
  - Specifies the output tensor shape.


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.228 -->

#### 3.5.55 Resize



Resizes the input tensor. In general, each output value is computed as a weighted average of a neighborhood (sampling locations) in the input tensor.



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
- roi(optional):T2
  - Not currently supported.
- scales(optional):T2
  - Array of scale factors along each dimension.
- sizes(optional):T3
  - Target size of the output tensor.


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)
- T3:int64(Tensor)


**Attributes**


- antialias:int (default 0)
  - Setting this is currently unsupported.
- axes:int&#91;&#93;
  - Setting this is currently unsupported.
- coordinate&#95;transformation&#95;mode:strings (default ”half&#95;pixel”)
  - Currently supports only half&#95;pixel, pytorch&#95;half&#95;pixel and align&#95;corners.
- cubic&#95;coeff&#95;a:float (default ‑0.75)
  - Setting this is currently unsupported.
- exclude&#95;outside:int (default 0)
  - Setting this is currently unsupported.
- extrapolation&#95;value:float (default 0)
  - Setting this is currently unsupported.
- keep&#95;aspect&#95;ratio&#95;policy:strings (default ”stretch”)
  - Setting this is currently unsupported.
- mode:strings (default ”nearest”)
  - Only nearest and linear are currently configurable.
- nearest&#95;mode:strings (default ”round&#95;prefer&#95;floor”)
  - Setting this is currently unsupported.


Support: currently only integer scaling in width and height is supported, with integer factors 2‑8. An input (1,c,1,1) can be enlarged to (1,c,h,w).


- Multi-core cooperation: unsupported.


<!-- PDF p.230 -->

#### 3.5.56 Slice



Obtains a slice of the current vector using the same rules as NumPy slicing.



**Inputs**


- input&#95;tensor:T
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T:int8(Tensor),float16(Tensor)


**Attributes**


- starts:int(Tensor)
  - Slice start position: unrestricted.
- ends:int(Tensor)
  - Slice end position: unrestricted.
- axes:int(Tensor)
  - Slice-axis selection: any axis 0~3; multiple axes may be selected simultaneously.
- steps:int(Tensor)
  - Selects the step along each sliced axis.
  - When height&#42;width==1&amp;&amp;channel%subc==0&amp;&amp;starts&#91;1&#93;%subc==0&amp;&amp;ends&#91;1&#93;%subc==0&amp;&amp;steps&#91;1&#93;&lt;=subc, steps may differ from 1. Otherwise SliceOP runs on the NPU only when steps==&#91;1,1,1,1&#93;.


<!-- PDF p.230 -->

#### 3.5.57 Softmax



This operator computes normalized exponential values of the input:



```text
Softmax(input, axis) = exp(input - max(input, axis)) / Σ_axis exp(input - max(input, axis))
```



The “axis” attribute specifies the dimension along which Softmax is applied. The output tensor has the same shape and contains the corresponding input Softmax values.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;, subject to tranpose specification limits.


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Attributes**


- axis:int64
  - softmax axis:1,3, corresponding to channel and width.


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.231 -->

#### 3.5.58 exSoftmax13



This operator computes normalized exponential values of the input:



```text
exSoftmax13(input, axis) = exp(input - max(input, axis)) / Σ_axis exp(input - max(input, axis))
```



The “axis” attribute specifies the dimension along which Softmax is applied. The output tensor has the same shape and contains the corresponding input Softmax values.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;, subject to tranpose specification limits.


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Attributes**


- axis:int64
  - softmax axis:1,3, corresponding to channel and width.


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.232 -->

#### 3.5.59 exSoftmaxMask



This operator computes normalized exponential values of the input:



```text
input(x, mast_t, mask_value) =
  x + (mast_t - 1) * inf   if mask_value = 0
  x + mast_t * (-inf)      elif mask_value = 1
exSoftmaxMask(input, axis) = exp(input - max(input, axis)) / Σ_axis exp(input - max(input, axis))
```



The “axis” attribute specifies the dimension along which Softmax is applied. The output tensor has the same shape and contains the corresponding input Softmax values.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;, subject to tranpose specification limits.
- mask(optional):T1
  - shape:&#91;1,channel,height,width&#93;


```text
channel∈(0,8192]
```


- 
- width:· axis=1, unrestricted;


```text
· axis=3/‑1,width∈(0,8192]
```



**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Attributes**


- axis:int64
  - softmax axis:1,3, corresponding to channel and width.
- mask&#95;value:int64
  - Values requiring masking:0,1.


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.233 -->

#### 3.5.60 Split



Splits the vector along axis into num&#95;outputs vectors; split specifies their sizes along axis.



**Inputs**


- input&#95;tensor:T
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T
  - One or more output vectors, determined by num&#95;outputs.
  - shape: determined by the split.
  - Quantization support
    - per‑layer


**Data-type constraints**


- T:int8(Tensor),float16(Tensor)


**Attributes**


- axis:int
  - axis∈{0,1,2,3}
- num&#95;outputs:int
- split:int(Tensor)


<!-- PDF p.233 -->

#### 3.5.61 Sub


- Performs elementwise binary subtraction (C=A‑B), supporting multidirectional NumPy-style broadcasting.


**Inputs**


- A:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - &#91;b,c,1,1&#93;
    - &#91;scalar&#93;
- B:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - &#91;b,c,1,1&#93;
    - &#91;scalar&#93;


**Outputs**


- C:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(constTensor)


**Other support**


- Multi-core cooperation: unsupported.


<!-- PDF p.234 -->

#### 3.5.62 Tile



Constructs a tensor by tiling the given tensor, like NumPy tile but without broadcasting.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
- repeats:T2
  - shape:&#91;batch,channel,height,width&#93;


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:int64(Tensor)


**Other support**


- Multi-core cooperation: unsupported.


<!-- PDF p.235 -->

#### 3.5.63 Transpose



Transposes the input tensor.



**Inputs**


- X:T1
  - shape:&#91;n1,c1,h1,w1&#93;
    - See the attribute list for detailed constraints.
  - Quantization support
    - per‑layer


**Outputs**


- Y:T1,T2
  - shape:&#91;n2,c2,h2,w2&#93;
    - See the attribute list for detailed constraints.
  - Quantization support
    - per‑layer


**Attributes**


- perm, order of transposed axes: constraints for each perm follow (p=268435456,q=65536).
  - perm=&#91;0,1,2,3&#93;
    - Unrestricted
  - perm=&#91;0,1,3,2&#93;
    - T1:h1%16=0,h1&#42;w1&lt;16&#42;p,h1&#42;w1&lt;2&#42;q
    - T2:h1%8=0,h1&#42;w1&lt;8&#42;p,h1&#42;w1&lt;2&#42;q
  - perm=&#91;0,2,3,1&#93;
    - T1:c1&lt;8192,h1&#42;w1%8=0，w1&#42;c1&lt;p&#42;16
    - T2:c1&lt;8192,h1&#42;w1%8=0，w1&#42;c1&lt;p&#42;8
  - perm=&#91;0,2,1,3&#93;
    - T1:h1%16=0,h1&#42;w1&lt;16&#42;p,h1&#42;w1&lt;2&#42;q,c1&#42;w1&lt;p
    - T2:h1%8=0,h1&#42;w1&lt;8&#42;p,h1&#42;w1&lt;2&#42;q,c1&#42;w1&lt;p
  - perm=&#91;0,3,1,2&#93;
    - T1,T2:h1&#42;w1&lt;p,w1&lt;8192,h1&#42;c1&lt;p
  - perm=&#91;0,3,2,1&#93;
    - T1:h1%16=0,h1&#42;w1&lt;16&#42;p,h1&#42;w1&lt;2&#42;q,c1&lt;p&#42;16
    - T2:h1%8=0,h1&#42;w1&lt;8&#42;p,h1&#42;w1&lt;2&#42;q,c1&lt;p&#42;8
  - perm=&#91;1,0,2,3&#93;
    - T1:h1&#42;w1&lt;16&#42;p,n1&lt;8192,h1&#42;w1&lt;p
    - T2:h1&#42;w1&lt;8&#42;p,n1&lt;8192,h1&#42;w1&lt;p
  - perm=&#91;1,0,3,2&#93;
    - T1:h1%16=0,c1&#42;h1&#42;w1&lt;16&#42;p,h1&#42;w1&lt;2&#42;q
    - T2:h1%8=0,c1&#42;h1&#42;w1&lt;8&#42;p,h1&#42;w1&lt;2&#42;q
  - perm=&#91;1,2,0,3&#93;
    - T1:n1&#42;w1&lt;p&#42;16,c1&#42;h1&#42;w1&lt;p,w1%16=0
    - T2:n1&#42;w1&lt;p&#42;8,c1&#42;h1&#42;w1p,w1%8=0
  - perm=&#91;1,2,3,0&#93;
    - T1:h1&#42;w1&lt;p,n1&lt;p&#42;16,c1&#42;h1&#42;w1&lt;p&#42;16,n1&#42;w1&lt;p&#42;16
    - T2:h1&#42;w1&lt;p,n1&lt;p&#42;8,c1&#42;h1&#42;w1&lt;p&#42;8,n1&#42;w1&lt;p&#42;8
  - perm=&#91;1,3,0,2&#93;
    - T1:c1&#42;w1&lt;8192,n1&#42;h1&lt;p,w1%16=0
    - T2:c1&#42;w1&lt;8192,n1&#42;h1&lt;p,w1%8=0
  - perm=&#91;1,3,2,0&#93;
    - T1:c1&#42;h1&#42;w1&lt;p,n1&#42;h1&lt;p,w1&lt;8192,w1%16=0
    - T2:c1&#42;h1&#42;w1&lt;p,n1&#42;h1&lt;p,w1&lt;8192,w1%8=0
  - perm=&#91;2,1,0,3&#93;
    - T1,T2:c1&lt;8192,c1&#42;h1&#42;w1&lt;p,n1&#42;w1&lt;p
  - perm=&#91;2,1,3,0&#93;
    - T1:c1&#42;h1&#42;w1&lt;p,n1&#42;w1&lt;p&#42;16,c1&lt;8192,n1&#42;w1%4=0
    - T2:c1&#42;h1&#42;w1&lt;p,n1&#42;w1&lt;p&#42;8,c1&lt;8192,n1&#42;w1%4=0
  - perm=&#91;2,0,3,1&#93;
    - T1,T2:c1&lt;8192,c1&#42;h1&#42;w1&lt;p
  - perm=&#91;2,0,1,3&#93;
    - T1:n1&#42;c1&#42;h1&#42;w1&lt;p,h1&#42;w1%16=0
    - T2:n1&#42;c1&#42;h1&#42;w1&lt;p,h1&#42;w1%8=0
  - perm=&#91;2,3,1,0&#93;
    - T1:c1&#42;h1&#42;w1&lt;p,n1&#42;c1&lt;p,h1&#42;w1&lt;8192,h1&#42;w1%16=0
    - T2:c1&#42;h1&#42;w1&lt;p,n1&#42;c1&lt;p,h1&#42;w1&lt;8192,h1&#42;w1%8=0
  - perm=&#91;2,3,0,1&#93;
    - T1,T2:h1&#42;w1&lt;8192,n1&#42;c1&lt;p
  - perm=&#91;3,0,2,1&#93;
    - T1:h1&#42;w1&lt;p,n1&#42;c1&lt;8192,c1&#42;h1&lt;p,n1&#42;w1&lt;8192,n1&#42;w1%16=0
    - T2:h1&#42;w1&lt;p,n1&#42;c1&lt;8192,c1&#42;h1&lt;p,n1&#42;w1&lt;8192,n1&#42;w1%8=0
  - perm=&#91;3,0,1,2&#93;
    - T1:h1&#42;w1&lt;p,n1&#42;c1&lt;8192,c1&#42;h1&lt;p,n1&#42;w1&lt;8192,n1&#42;h1&#42;w1%16=0
    - T2:h1&#42;w1&lt;p,n1&#42;c1&lt;8192,c1&#42;h1&lt;p,n1&#42;w1&lt;8192,n1&#42;h1&#42;w1%8=0
  - perm=&#91;3,2,0,1&#93;
    - T1,T2:h1&#42;w1&lt;p,n1&#42;c1&lt;8192,n1&#42;c1&#42;w1&lt;p
  - perm=&#91;3,2,1,0&#93;
    - T1:c1&#42;h1&#42;w1&lt;p,h1&#42;w1&lt;8192,2&#42;h1&#42;w1&lt;q,n1&#42;c1&lt;p&#42;16,h1%16=0
    - T2:c1&#42;h1&#42;w1&lt;p,h1&#42;w1&lt;8192,2&#42;h1&#42;w1&lt;q,n1&#42;c1&lt;p&#42;8,h1%8=0
  - perm=&#91;3,1,0,2&#93;
    - T1,T2:h1&#42;w1&lt;p,c1&#42;w1&lt;8192,n1&#42;h1&lt;p
  - perm=&#91;3,1,2,0&#93;
    - T1,T2:h1&#42;w1&lt;p,n1&#42;c1&lt;8192,n1&#42;h1&lt;p,n1&#42;c1&#42;w1&lt;p


**Data-type constraints**


- T1:int8(Tensor)
- T2:int16(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.237 -->

#### 3.5.64 Sigmoid



Applies y=1/(1+exp(‑x)) elementwise to the input tensor to produce the output tensor.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.237 -->

#### 3.5.65 Tanh



Computes the hyperbolic tangent of each input-tensor element.



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.238 -->

#### 3.5.66 Softplus



Applies Softplus elementwise, y=ln(exp(x)+1).



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.238 -->

#### 3.5.67 HardSigmoid



Applies y=max(0,min(1,alpha&#42;x+beta)) elementwise to the input tensor to produce the output tensor, where



```text
alpha=1/6，beta=0.5
```



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.239 -->

#### 3.5.68 HardSwish



Applies HardSwish elementwise: y = x &#42; max(0, min(1, alpha &#42; x + beta)) = x &#42; HardSigmoid&lt;alpha,beta&gt;(x), where alpha=1/6,beta=0.5.



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.239 -->

#### 3.5.69 Elu



Applies f(x)=alpha&#42;(exp(x)‑1.)forx&lt;0,f(x)=xforx&gt;=0 elementwise to produce the output tensor, with alpha=1.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.240 -->

#### 3.5.70 exSwish



Applies the Sigmoid Linear Unit elementwise. Swish is also called SiLU: y=x&#42;sigmoid(x).



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.240 -->

#### 3.5.71 exMish



Applies mish(x)=x&#42;tanh(softplus(x))=x&#42;tanh(ln(1+e^{x})) elementwise to the input tensor to produce the output tensor.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.241 -->

#### 3.5.72 exGelu



Applies y =x∗Φ(x) elementwise to the input tensor to produce the output tensor. When Φ(x) is set to tanh,



```text
y = 0.5 * x * (1 + Tanh(sqrt(2/π) * (x + 0.044715 * x^3)))
```



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.241 -->

#### 3.5.73 Where



Selects values from x&#95;tensor or y&#95;tensor according to mask&#95;tensor: True selects the corresponding x&#95;tensor value; otherwise the y&#95;tensor value.



**Inputs**


- mask&#95;tensor:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Broadcasting support
    - Supports broadcasting along any dimension.
  - Broadcasting constraints
    - Broadcasting constraints are the same as for Expand.
- x&#95;tensor:T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
  - Broadcasting constraints
    - Broadcasting constraints are the same as for Expand.
- y&#95;tensor:T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
  - Broadcasting constraints
    - Broadcasting constraints are the same as for Expand.


**Outputs**


- output:T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:bool(Tensor)
- T2:int8(Tensor),float16(Tensor)


<!-- PDF p.242 -->

#### 3.5.74 exGlu



Gated Linear Unit function; a is the first half of the input matrix and b is the second half.



```text
GLU(a,b)=a⊗σ(b)
```



**Inputs**


- Input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Outputs**


- Output:T1
  - shape:&#91;batch,channel/2,height,width&#93;
  - Quantization support:per‑layer.


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Attributes**


- axis:int(default=1)
  - Dimension along which to split the input.
  - Constraint: only 1 is supported.


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.243 -->

#### 3.5.75 exMatMul



Matrix multiplication



```text
Y =
  A · B + C   if c_type = "add"
  A · B * C   if c_type = "mul"
```



**Inputs**


- A:T1
  - shape:&#91;b,k,1,n&#93;
    - k ∈(0,8192&#93;
  - Quantization support
    - per‑layer
- B:T1
  - shape:&#91;b,k,1,m&#93;
  - Quantization support
    - per‑layer
- C(optional):T1,T2
  - shape:&#91;b,n,1,m&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.


**Outputs**


- Y:T1
  - shape:&#91;b,n,1,m&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)


**Attributes**


- c&#95;type:strings(default “add”)
  - Select add or mul to specify whether C is added or multiplied.


**Other support**


- Multi-core cooperation: unsupported.


<!-- PDF p.244 -->

#### 3.5.76 exNorm



Applies normalization to input data. Currently supports LayerNormlization, RMSNormlization and MeanVarianceNormalization:



```text
LayerNorm(x) = (x - µ) / sqrt(σ^2 + ϵ) · W + B
RMSNorm(x) = x / sqrt(RMS^2 + ϵ) · W + B
MeanVarianceNorm(x) = (x - µ) / sqrt(Variance + ϵ) · W + B
```



Here x is the input vector. µ and σ2 are the mean and variance of the input vector:



```text
µ = (1/H) Σ_{i=1}^{H} x_i
σ^2 = (1/H) Σ_{i=1}^{H} (x_i - µ)^2
```



RMS is the root mean square of the input vector:



```text
RMS = sqrt((1/H) Σ_{i=1}^{H} (x_i)^2)
```



Variance is the equivalent variance of the input vector:



```text
Variance = (1/H) Σ_{i=1}^{H} (x_i)^2 - µ^2
```



ϵ is a small value preventing division by zero. W and B are optional parameters.



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
- W(optional):T1
  - shape:&#91;batch,channel,height,width&#93;
- B(optional):T1
  - shape:&#91;batch,channel,height,width&#93;


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;


**Data-type constraints**


- T1:float16(Tensor)


**Attributes**


- epsilon:float(default 1e‑05)
  - epsilon value used to prevent division by 0.
- mode:string
  - Supports three selectable Normalization modes: layer, rms and mean&#95;var.
- axes:int64&#91;&#93;(default &#91;1&#93;)
  - Normalization axes: currently only &#91;1&#93; and &#91;1,2,3&#93; are supported.


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.245 -->

#### 3.5.77 exSDPAttention



Computes scaled dot-product attention (SDPA) between query, key and value.



**Inputs**


- query:T1
  - shape:&#91;batch,channel,height,width&#93;


```text
channel∈(0,8192]
```


- 
- Quantization support
  - per‑layer
- key:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
- value:T1
  - shape:&#91;batch,channel,height,width&#93;


```text
channel∈(0,8192]
```


- 
- Quantization support
  - per‑layer
- mask(optional):T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Broadcasting along any dimension is supported by default.
    - With FA enabled, only &#91;b,c,1,1&#93;,&#91;1,c,1,1&#93; and &#91;1,c,h,w&#93; are supported.
- scale(optional):T3


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)


**Other support**


- Multi-core cooperation: supported on RK3576 / unsupported on RV1126B.
- FlashAttentionV2(FA): supported.
  - Based on https://arxiv.org/abs/2307.08691. Inner loops in cache accelerate execution and reduce bandwidth usage, but increase model size; choose whether to enable this according to the scenario and model.
  - RKNPU driver version&gt;=0.9.7
  - RKNPU Runtime library (librknnrt.so) version&gt;=2.1.0
  - Supported data type:float16.


<!-- PDF p.246 -->

#### 3.5.78 exWindow



exWindow derives from window&#95;partition and window&#95;reverse in swin&#95;transformer. In the original paper, input features are divided into non-overlapping windows of window&#95;size×window&#95;size. Input and output features must have a 4-dimensional shape, partitioned in both height and width. The PyTorch implementation follows:



```text
def window_partition(x, window_size):
  """
  Args:
    x: (B, C, H, W)
    window_size (int): window size
  Returns:
    windows: (B, C, num_windows*num_windows, window_size*window_size)
  """
  B, C, H, W = x.shape
  x = x.view(B, C, H // window_size, window_size, W // window_size, window_size)
  windows = x.permute(0, 1, 2, 4, 3, 5).contiguous().view(B, C, -1, window_size*window_size)
  return windows
def window_reverse(windows, window_size, H, W):
  """
  Args:
    windows: (B, C, num_windows*num_windows, window_size*window_size)
    window_size (int): Window size
    H (int): Height of image
    W (int): Width of image
  Returns:
    x: (B, C, H, W)
  """
  B,C,_,_ = windows.shape
  x = windows.view(B, C, H // window_size, W // window_size, window_size, window_size)
  x = x.permute(0, 1, 2, 4, 3, 5).contiguous().view(B, C, H, W)
  return x
```



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)


**Attributes**


- mode:string
  - Supported modes:partition,reverse,partition&#95;num&#95;first.
    - partition: see the window&#95;partition implementation.
    - reverse: see the window&#95;reverse implementation.
    - partition&#95;num&#95;first differs from partition in that its H,W are divided according to num&#95;windows, whereas partition divides H,W according to window&#95;sizes.
- window&#95;sizes:listofints
  - 2-dimensional vector of window sizes, defining the height and width of each window. Attention calculation and feature extraction within each window use this size.
- num&#95;windows:listofints
  - 2-dimensional vector of window counts, defining how many windows the input feature height and width are divided into.


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.249 -->

### 3.6 RK2118



<!-- PDF p.249 -->

#### 3.6.1 Add



Performs elementwise binary addition (C=A+B), supporting multidirectional NumPy-style broadcasting.



**Inputs**


- A:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.
- B:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.


**Outputs**


- C:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:float16(Tensor)
- T2:float(constTensor)


<!-- PDF p.249 -->

#### 3.6.2 AddRelu



Fused Add and Relu computation, C=Relu(A+B).



**Inputs**


- Same as Add.


**Outputs**


- Same as Add.


<!-- PDF p.250 -->

#### 3.6.3 BatchNormalization



Applies batch normalization to the input tensor as described in https://arxiv.org/abs/1502.03167.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:float16(Tensor)


**Attributes**


- epsilon:float (default=1e‑5)
  - Real value added when dividing by the standard deviation to prevent division by 0.
  - epsilon∈(0,∞&#93;
- momentum:float
  - Moving-average parameter used during training.


<!-- PDF p.250 -->

#### 3.6.4 Concat



Concatenates a sequence of vectors along axis into one vector. All vector dimensions other than axis must match.



**Inputs**


- input&#95;tensor:T
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T:float16(Tensor)


**Attributes**


- axisint64
  - axis∈{0,1,2,3}


<!-- PDF p.251 -->

#### 3.6.5 Convolution



Convolution



**Inputs**


- input&#95;tensor:T1
  - shape:&#91;batch,channel,height,width&#93;
    - width: when dilated&#95;kernel&#95;h&gt;1, width&lt;16383. Additional limits apply to the first-layer input width; see the model-input description.
  - Quantization support
    - per‑layer
- weight:T1
  - shape:&#91;output&#95;channel,input&#95;channel,kernel&#95;h,kernel&#95;w&#93;


```text
kernel_h∈[1,31]
```


- 


```text
kernel_w∈[1,31]
```


- 
- Quantization support
  - per‑layer
  - per‑channel


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Attributes**


- strides:int(strides&#95;h,strides&#95;w)
  - stride&#95;h∈&#91;1,7&#93;
  - stride&#95;w∈&#91;1,7&#93;
- pads:int(pads&#95;top,pads&#95;left,pads&#95;bottom,pads&#95;right)
  - pads&#95;top∈&#91;0,15&#93;
  - pads&#95;left∈&#91;0,15&#93;
  - pads&#95;bottom∈&#91;0,15&#93;
  - pads&#95;right∈&#91;0,15&#93;
- group:int
- dilations:int(dilations&#95;h,dilations&#95;w)
  - dilations&#95;h∈&#91;1,31&#93;
  - dilations&#95;w∈&#91;1,31&#93;


**Data-type constraints**


- T1:float16(Tensor)


<!-- PDF p.252 -->

#### 3.6.6 DepthwiseConvolution



Depthwise separable convolution



**Inputs**


- input&#95;tensor:T1
  - shape:&#91;batch,channel,height,width&#93;
    - width: when dilated&#95;kernel&#95;h&gt;1, width&lt;16383. Additional limits apply to the first-layer input width; see the model-input description.
  - Quantization support
    - per‑layer
- weight:T1
  - shape:&#91;output&#95;channel,input&#95;channel,kernel&#95;h,kernel&#95;w&#93;


```text
kernel_h∈[1,8]
```


- 


```text
kernel_w∈[1,8]
```


- 
- Quantization support
  - per‑layer
  - per‑channel


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Attributes**


- strides:int(strides&#95;h,strides&#95;w)
  - stride&#95;h∈&#91;1,7&#93;
  - stride&#95;w∈&#91;1,7&#93;
- pads:int(pads&#95;top,pads&#95;left,pads&#95;bottom,pads&#95;right)
  - pads&#95;top∈&#91;0,15&#93;
  - pads&#95;left∈&#91;0,15&#93;
  - pads&#95;bottom∈&#91;0,15&#93;
  - pads&#95;right∈&#91;0,15&#93;
- group:int
- dilations:int(dilations&#95;h,dilations&#95;w)
  - dilations&#95;h∈&#91;1,32&#93;
  - dilations&#95;w∈&#91;1,32&#93;


**Data-type constraints**


- T1:float16(Tensor)


<!-- PDF p.253 -->

#### 3.6.7 ConvolutionRelu



Fused Convolution and Relu computation, Output=Relu(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.253 -->

#### 3.6.8 ConvolutionClip



Fused Convolution and Clip computation, Output=Clip(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.253 -->

#### 3.6.9 ConvolutionPRelu/LeakyRelu



Fused Convolution and PRelu/LeakyRelu computation, Output = PRelu(Conv(Input)) or Output =



LeakyRelu(Conv(Input))



Description and specification limits are the same as Convolution.



<!-- PDF p.253 -->

#### 3.6.10 ConvolutionAdd



Fused Convolution and Add computation, Output=Add(Conv(Input0),Input1).



Description and specification limits are the same as Convolution.



<!-- PDF p.253 -->

#### 3.6.11 ConvolutionSigmoid



Fused Convolution and Sigmoid computation, Output=Sigmoid(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.253 -->

#### 3.6.12 ConvolutionTanh



Fused Convolution and Tanh computation, Output=Tanh(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.254 -->

#### 3.6.13 ConvolutionSoftplus



Fused Convolution and Softplus computation, Output=Softplus(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.254 -->

#### 3.6.14 ConvolutionHardSigmoid



Fused Convolution and HardSigmoid computation, Output=HardSigmoid(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.254 -->

#### 3.6.15 ConvolutionHardSwish



Fused Convolution and HardSwish computation, Output=HardSwish(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.254 -->

#### 3.6.16 ConvolutionElu



Fused Convolution and Elu computation, Output=Elu(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.254 -->

#### 3.6.17 ConvolutionSwish



Fused Convolution and Swish computation, Output=Swish(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.254 -->

#### 3.6.18 ConvolutionMish



Fused Convolution and Mish computation, Output=Mish(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.255 -->

#### 3.6.19 ConvTranspose



Transposed convolution



**Inputs**


- input&#95;tensor:T1
  - shape:&#91;batch,channel,height,width&#93;
    - width: when dilated&#95;kernel&#95;h&gt;1, width&lt;16383. In addition, the first-layer input


width is constrained; see model-input instructions.



```text
- **量化支持**
  - per-layer
```


- weight:T1
  - shape:&#91;output&#95;channel,input&#95;channel,kernel&#95;h,kernel&#95;w&#93;


```text
kernel_h∈[1,31]
```


- 


```text
kernel_w∈[1,31]
```


- 
- Quantization support
  - per‑layer
  - per‑channel


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Attributes**


- strides:int(strides&#95;h,strides&#95;w)
  - stride&#95;h∈&#91;1,8&#93;
  - stride&#95;w∈&#91;1,8&#93;
- pads:int(pads&#95;top,pads&#95;left,pads&#95;bottom,pads&#95;right). When setting pad, note that the following are unsupported: kernel&#95;h&#42;dilations&#95;h‑dilations&#95;h‑pads&#95;top&lt;0; kernel&#95;w&#42;dilations&#95;w‑dilations&#95;w‑pads&#95;left&lt;0; stride&#95;h&#42;(height‑1)‑pads&#95;top+1&lt;output&#95;h; stride&#95;w&#42;(width‑1)‑pads&#95;left+1&lt;output&#95;w.
  - pads&#95;top∈&#91;0,15&#93;
  - pads&#95;left∈&#91;0,15&#93;
  - pads&#95;bottom∈&#91;0,15&#93;
  - pads&#95;right∈&#91;0,15&#93;
- group:int
  - group: only 1 is supported; num&#95;output is supported if and only if num&#95;input=num&#95;output.
- dilations:int(dilations&#95;h,dilations&#95;w)
  - dilations&#95;h∈&#91;1,32&#93;
  - dilations&#95;w∈&#91;1,32&#93;
  - When dilation differs from (1,1), only kernel=(1,1) is supported.


**Data-type constraints**


- T1:float16(Tensor)


<!-- PDF p.256 -->

#### 3.6.20 Div



Performs elementwise binary division (C=A/B), supporting multidirectional NumPy-style broadcasting.



**Inputs**


- A:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - &#91;b,c,1,1&#93;
    - &#91;scalar&#93;
- B:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - &#91;b,c,1,1&#93;
    - &#91;scalar&#93;


**Outputs**


- C:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:float16(Tensor)
- T2:float(constTensor)


<!-- PDF p.257 -->

#### 3.6.21 Expand



Broadcasts the input tensor using the given shape and broadcasting rules, similar to numpy.array(input) &#42;numpy.ones(shape): dimensions are right-aligned; each pair of corresponding dimensions must be equal or one of them must be 1.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
- shape:T2
  - shape:&#91;batch,channel,height,width&#93;


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:float16(Tensor)
- T2:int64(Tensor)


Broadcasting constraints


- &#91;b,c,1,w&#93;‑&gt;&#91;b,c,h,w&#93;,h∈&#91;1,8192&#93;
- &#91;b,1,1,w&#93;‑&gt;&#91;b,c,h,w&#93;,h∈&#91;1,8192&#93;
- &#91;b,c,h,1&#93;‑&gt;&#91;b,c,h,w&#93;,w ∈&#91;1,8192&#93;
- &#91;b,1,h,1&#93;‑&gt;&#91;b,c,h,w&#93;,w ∈&#91;1,8192&#93;
- &#91;b,c,1,1&#93;‑&gt;&#91;b,c,h,w&#93;,h∈&#91;1,8192&#93;,w ∈&#91;1,8192&#93;


<!-- PDF p.257 -->

#### 3.6.22 LSTM



Long Short-Term Memory (LSTM). LSTM extensions and variants are named exLSTM; parameters marked (extern) are exclusive to exLSTM. The equations follow:



```text
f = Sigmoid; g = Tanh; h = Tanh
i_t = f(x_t · W_i + h_{t-1} · R_i + Wb_i + Rb_i)
f_t = f(x_t · W_f + h_{t-1} · R_f + Wb_f + Rb_f)
c_t = f(x_t · W_c + h_{t-1} · R_c + Wb_c + Rb_c)
o_t = f(x_t · W_o + h_{t-1} · R_o + Wb_o + Rb_o)
C_t = f_t ⊙ C(t-1) + i_t ⊙ c_t
h_t = o_t ⊙ h(C_t)
```



**Inputs**


- X:T1
  - shape:&#91;seq&#95;length,batch&#95;size,input&#95;size&#93;


```text
seqlength∈(0,8192]
```


- batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
- 


```text
inputsize∈(0,8192]
```


- 
- Quantization support
  - per‑layer
- W:T1
  - shape:&#91;num&#95;directions,4&#42;hidden&#95;size,input&#95;size&#93;


```text
inputsize∈(0,8192]
```


- 


```text
hiddensize∈(0,8192]
```


- 
- numdirections:1or2
- Quantization support
  - per‑layer
  - per‑channel
- R:T1
  - shape:&#91;num&#95;directions,4&#42;hidden&#95;size,hidden&#95;size&#93;


```text
hiddensize∈(0,8192]
```


- 
- numdirections:1or2
- Quantization support
  - per‑layer
  - per‑channel
- B:T2
  - shape:&#91;num&#95;directions,8&#42;hidden&#95;size&#93;


```text
hiddensize∈(0,8192]
```


- 
- numdirections:1or2
- Quantization support
  - per‑layer
  - per‑channel
- sequence&#95;lens:T3(optional)
  - shape:&#91;batch&#95;size&#93;; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
    - 
- initial&#95;h:T1(optional)
  - shape:&#91;num&#95;directions,batch&#95;size,hidden&#95;size&#93;
    - numdirections:1or2; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
    - 


```text
hiddensize∈(0,8192]
```


- 
- Quantization support
  - per‑layer
- initial&#95;c:T1(optional)
  - shape:&#91;num&#95;directions,batch&#95;size,hidden&#95;size&#93;
    - numdirections:1or2; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
    - 


```text
hiddensize∈(0,8192]
```


- 
- Quantization support
  - per‑layer


**Outputs**


- Y:T1
  - shape:&#91;seq&#95;length,num&#95;directions,batch&#95;size,hidden&#95;size&#93;


```text
seqlength∈(0,8192]
```


- 
- numdirections:1or2; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
- 


```text
hiddensize∈(0,8192]
```


- 
- Quantization support
  - per‑layer
- Y&#95;h:T1(optional)
  - shape:&#91;num&#95;directions,batch&#95;size,hidden&#95;size&#93;
    - numdirections:1or2; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
    - 


```text
hiddensize∈(0,8192]
```


- 
- Quantization support
  - per‑layer
- Y&#95;c:T1(optional)
  - shape:&#91;num&#95;directions,batch&#95;size,hidden&#95;size&#93;
    - numdirections:1or2; batchsize∈(0,8192&#93;; values greater than 1 must be multiples of 4.
    - 


```text
hiddensize∈(0,8192]
```


- 
- Quantization support
  - per‑layer


**Attributes**


- direction(extern):string
  - Specifies the LSTM processing direction.
  - forward: processes LSTM forwards.
  - reverse: processes LSTM backwards.
  - bidirectional: processes LSTM in both directions.
- sequence&#95;size(extern):int
  - Specifies the LSTM input seqsize; unrestricted, but alignment to 4 is recommended.
- hidden&#95;size(extern):int
  - hiddensize within the LSTM unit; unrestricted, but alignment to 8 is recommended.
- proj&#95;size(extern):int
  - proj&#95;size for projection; projsize∈&#91;0,hiddensize&#93;.
  - Currently restricted to 0; projection is not yet supported.
- input&#95;forget(extern):int
  - Selects the cifg variant:1(T)or0(F). Currently restricted to 0, so it is not yet supported.
- has&#95;projection(extern):int
  - projection variant:1(T)or0(F). Currently restricted to 0, so it is not yet supported.
- input&#95;layout(extern):int
  - Specifies a layout consistent with the meaning of the corresponding input shape.
  - The specified layout and the actual batch&#95;size, sequence&#95;size and hidden&#95;size of this op must be provided.
  - snc: the input shape for this layout is &#91;seqs,batches,input&#95;size&#93;.
  - (sn)c: the input shape for this layout is &#91;seqs&#42;batches,input&#95;size,1,1&#93;.
- output&#95;layout(extern):int
  - Specifies a layout consistent with the meaning of the corresponding output shape.
  - The specified layout and the actual batch&#95;size, sequence&#95;size, hidden&#95;size and directions of this op must be provided.
  - sbnc: the output shape for this layout is &#91;seqs,directions,batches,hidden&#95;size&#93;.
  - (sn)c: the output shape for this layout is &#91;seqsbatches,directionsinput&#95;size,1,1&#93;.


**Data-type constraints**


- T1:float16(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.260 -->

#### 3.6.23 Max



Computes the elementwise maximum of the input tensors.



**Inputs**


- A:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.
- B:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.


**Outputs**


- C:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer/per‑channel


**Data-type constraints**


- T1:float16(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.261 -->

#### 3.6.24 Mul



Performs elementwise binary multiplication (C=A&#42;B), supporting multidirectional NumPy-style broadcasting.



**Inputs**


- A:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.
- B:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.


**Outputs**


- C:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:float16(Tensor)
- T2:float(constTensor)


<!-- PDF p.262 -->

#### 3.6.25 MulRelu



Fused Mul and Relu computation,C=Relu(A&#42;B).



**Inputs**


- Same as Mul.


**Outputs**


- Same as Mul.


**Other support**


- Multi-core cooperation: supported.


<!-- PDF p.262 -->

#### 3.6.26 Pad



Given a data tensor (data), a tensor of beginning/end padding values for each axis (pads), a mode (mode) and a constant value (constant&#95;value), produces a padded tensor (output).



**Inputs**


- data:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
- pads:T2
  - shape : &#91;batch&#95;begin, channel&#95;begin, height&#95;begin, width&#95;begin, batch&#95;end, chan‑nel&#95;end,height&#95;end,width&#95;end&#93;
- constant&#95;value(optional):T3
  - shape:&#91;1&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:float16(Tensor)
- T2:int64(Tensor)
- T3:float(Scalar),int8(Scalar),float16(Scalar)


**Attributes**


- mode:string (default constant)
  - Supported modes: constant,reflect.
    - constant: unrestricted.


```text
reflectchannel∈(0,8192],height∈(0,8192],width∈(0,8176]
```


- 


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.263 -->

#### 3.6.27 MaxPool



MaxPool consumes input tensor X and applies max pooling according to kernel size, stride size and pad lengths. It computes the maximum over subsets of the input tensor determined by the kernel, downsampling into output tensor Y for further processing. The output spatial shape depends on whether explicit padding (pads) or automatic padding (auto&#95;pad) is used. Only explicit padding is used here.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;


```text
channel∈(0,8192]
```


- 


```text
height∈(0,8192]
```


- 


```text
width∈(0,8192]
```


- 


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Attributes**


- kernel&#95;shape:int64(kernel&#95;h,kernel&#95;w)
  - kernel&#95;h∈(0,7&#93;
  - kernel&#95;w∈(0,7&#93;
  - Note: kernel&#95;h=1 and kernel&#95;w=1 together are unsupported.
- auto&#95;pad:string
  - Padding mode: only NOTSET is supported.
- ceil&#95;mode:int64
  - Computing output shape using ceil or floor: unsupported.
- strides:int64(strides&#95;h,strides&#95;w)
  - strides&#95;h∈(0,8&#93;
  - strides&#95;w∈(0,8&#93;
- count&#95;include&#95;pad:int64&#91;&#93;
  - count&#95;include&#95;pad, whether to include pad values in calculation:1.
- pad:int64(pad&#95;top,pad&#95;left,pad&#95;bottom,pad&#95;right)
  - pad&#95;top∈&#91;0,7&#93;
  - pad&#95;left∈&#91;0,7&#93;
  - pad&#95;bottom∈&#91;0,7&#93;
  - pad&#95;right∈&#91;0,7&#93;


**Data-type constraints**


- T1:float16(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)


<!-- PDF p.264 -->

#### 3.6.28 GlobalMaxPool



GlobalMaxPool takes input tensor X and applies max pooling to values within each channel. It is equivalent to MaxPool with kernel&#95;shape equal to the spatial dimensions of input.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;


```text
channel∈(0,8192]
```


- 


```text
height∈(0,7]
```


- 


```text
width∈(0,7]
```


- 


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Attributes**


- kernel&#95;shape:int64(kernel&#95;h,kernel&#95;w)
  - kernel&#95;h∈(0,7&#93;
  - kernel&#95;w∈(0,7&#93;. Note: kernel&#95;h=1 and kernel&#95;w=1 together are unsupported.
- auto&#95;pad:string
  - Padding mode: only NOTSET is supported.
- ceil&#95;mode:int64
  - Computing output shape using ceil or floor: unsupported.
- strides:int64(strides&#95;h,strides&#95;w)
  - strides&#95;h∈(0,8&#93;
  - strides&#95;w∈(0,8&#93;
- count&#95;include&#95;pad:int64&#91;&#93;
  - count&#95;include&#95;pad, whether to include pad values in calculation:1.
- pad:int64(pad&#95;top,pad&#95;left,pad&#95;bottom,pad&#95;right)
  - pad&#95;top∈&#91;0,7&#93;
  - pad&#95;left∈&#91;0,7&#93;
  - pad&#95;bottom∈&#91;0,7&#93;
  - pad&#95;right∈&#91;0,7&#93;


**Data-type constraints**


- T1:float16(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)


<!-- PDF p.265 -->

#### 3.6.29 AveragePool


- Unsupported (converted by the tool into convolution).


<!-- PDF p.265 -->

#### 3.6.30 GlobalAveragePool


- Unsupported (converted by the tool into convolution).


<!-- PDF p.265 -->

#### 3.6.31 Pow



```text
Z =XY
```



Exponentiation: takes input data (a tensor) and an exponent, and produces output data (a tensor).



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
- Y:T2
  - shape:&#91;1&#93;
    - Currently supports only 0,1,2,3,0.5,‑0.5.


**Outputs**


- Z:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:float16(Tensor)
- T2:int8(Tensor),int32(Tensor),int64(Tensor),float16(Tensor),float(Tensor)


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.266 -->

#### 3.6.32 Relu



Sets negative input-tensor values to zero; positive values remain unchanged.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Broadcasting support
    - None


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Data-type constraints**


- T1:float16(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.266 -->

#### 3.6.33 Clip/ReLU6



Clips input-tensor values to &#91;0,6&#93;.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Broadcasting support
    - None


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Data-type constraints**


- T1:float16(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.267 -->

#### 3.6.34 PRelu



Scales negative input-tensor values by a learnable parameter; positive values remain unchanged.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Broadcasting support
    - None


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Attributes**


- slope: PRelu coefficient.
  - Only a single scalar or coefficients along dimension C are supported.


**Data-type constraints**


- T1:float16(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.267 -->

#### 3.6.35 LeakyRelu



Scales negative input-tensor values by a fixed ratio; positive values remain unchanged.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Broadcasting support
    - None


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Data-type constraints**


- T1:float16(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.268 -->

#### 3.6.36 Reshape



Returns a tensor of the specified shape without changing the input data or element count.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:float16(Tensor)


**Attributes**


- shape:int
  - Specifies the output tensor shape.


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.268 -->

#### 3.6.37 Resize



Resizes the input tensor. In general, each output value is computed as a weighted average of a neighborhood (sampling locations) in the input tensor.



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
- roi(optional):T2
  - Not currently supported.
- scales(optional):T2
  - Array of scale factors along each dimension.
- sizes(optional):T3
  - Target size of the output tensor.


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:float16(Tensor)
- T2:float(Tensor)
- T3:int64(Tensor)


**Attributes**


- antialias:int (default 0)
  - Setting this is currently unsupported.
- axes:int&#91;&#93;
  - Setting this is currently unsupported.
- coordinate&#95;transformation&#95;mode:strings (default ”half&#95;pixel”)
  - Currently supports only half&#95;pixel, pytorch&#95;half&#95;pixel and align&#95;corners.
- cubic&#95;coeff&#95;a:float (default ‑0.75)
  - Setting this is currently unsupported.
- exclude&#95;outside:int (default 0)
  - Setting this is currently unsupported.
- extrapolation&#95;value:float (default 0)
  - Setting this is currently unsupported.
- keep&#95;aspect&#95;ratio&#95;policy:strings (default ”stretch”)
  - Setting this is currently unsupported.
- mode:strings (default ”nearest”)
  - Only nearest and linear are currently configurable.
- nearest&#95;mode:strings (default ”round&#95;prefer&#95;floor”)
  - Setting this is currently unsupported.


Support: currently only integer scaling in width and height is supported, with integer factors 2‑8. An input (1,c,1,1) can be enlarged to (1,c,h,w).



<!-- PDF p.270 -->

#### 3.6.38 Slice



Obtains a slice of the current vector using the same rules as NumPy slicing.



**Inputs**


- input&#95;tensor:T
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T:float16(Tensor)


**Attributes**


- starts:int(Tensor)
  - Slice start position: unrestricted.
- ends:int(Tensor)
  - Slice end position: unrestricted.
- axes:int(Tensor)
  - Slice-axis selection: any axis 0~3; multiple axes may be selected simultaneously.
- steps:int(Tensor)
  - Selects the step along each sliced axis.
  - When height&#42;width==1&amp;&amp;channel%subc==0&amp;&amp;starts&#91;1&#93;%subc==0&amp;&amp;ends&#91;1&#93;%subc==0&amp;&amp;steps&#91;1&#93;&lt;=subc, steps may differ from 1. Otherwise SliceOP runs on the NPU only when steps==&#91;1,1,1,1&#93;.


<!-- PDF p.270 -->

#### 3.6.39 Softmax



This operator computes normalized exponential values of the input:



```text
Softmax(input, axis) = exp(input - max(input, axis)) / Σ_axis exp(input - max(input, axis))
```



The “axis” attribute specifies the dimension along which Softmax is applied. The output tensor has the same shape and contains the corresponding input Softmax values.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;


```text
channel∈(0,8192]
```


- 
- width:· axis=1, unrestricted;


```text
· axis=3/‑1,width∈(0,8192]
```



Also subject to tranpose specification limits.



**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Data-type constraints**


- T1:float16(Tensor)


**Attributes**


- axis:int64
  - softmax axis:1,3, corresponding to channel and width.


<!-- PDF p.271 -->

#### 3.6.40 exSoftmax13



This operator computes normalized exponential values of the input:



```text
exSoftmax13(input, axis) = exp(input - max(input, axis)) / Σ_axis exp(input - max(input, axis))
```



The “axis” attribute specifies the dimension along which Softmax is applied. The output tensor has the same shape and contains the corresponding input Softmax values.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;


```text
channel∈(0,8192]
```


- 
- width:· axis=1, unrestricted;


```text
· axis=3/‑1,width∈(0,8192]
```



Also subject to tranpose specification limits.



**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Data-type constraints**


- T1:float16(Tensor)


**Attributes**


- axis:int64
  - softmax axis:1,3, corresponding to channel and width.


<!-- PDF p.272 -->

#### 3.6.41 exSoftmaxMask


- Not yet supported.


<!-- PDF p.272 -->

#### 3.6.42 Split



Splits the vector along axis into num&#95;outputs vectors; split specifies their sizes along axis.



**Inputs**


- input&#95;tensor:T
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T
  - One or more output vectors, determined by num&#95;outputs.
  - shape: determined by the split.
  - Quantization support
    - per‑layer


**Data-type constraints**


- T:float16(Tensor)


**Attributes**


- axis:int
  - axis∈{0,1,2,3}
- num&#95;outputs:int
- split:int(Tensor)


<!-- PDF p.272 -->

#### 3.6.43 Sub


- Performs elementwise binary subtraction (C=A‑B), supporting multidirectional NumPy-style broadcasting.


**Inputs**


- A:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - &#91;b,c,1,1&#93;
    - &#91;scalar&#93;
- B:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - &#91;b,c,1,1&#93;
    - &#91;scalar&#93;


**Outputs**


- C:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:float16(Tensor)
- T2:float(constTensor)


<!-- PDF p.273 -->

#### 3.6.44 Tile



Constructs a tensor by tiling the given tensor, like NumPy tile but without broadcasting.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
- repeats:T2
  - shape:&#91;batch,channel,height,width&#93;


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:int64(Tensor)


<!-- PDF p.274 -->

#### 3.6.45 Transpose



Transposes the input tensor.



**Inputs**


- X:T1
  - shape:&#91;n1,c1,h1,w1&#93;
    - See the attribute list for detailed constraints.
  - Quantization support
    - per‑layer


**Outputs**


- Y:T1
  - shape:&#91;n2,c2,h2,w2&#93;
    - See the attribute list for detailed constraints.
  - Quantization support
    - per‑layer


**Attributes**


- perm, order of transposed axes: constraints for each perm follow (p=268435456,q=65536).
  - perm=&#91;0,1,2,3&#93;
    - Unrestricted
  - perm=&#91;0,1,3,2&#93;
    - T1:h1%8=0,h1&#42;w1&lt;8&#42;p,h1&#42;w1&lt;2&#42;q
  - perm=&#91;0,2,3,1&#93;
    - T1:c1&lt;8192,h1&#42;w1%8=0，w1&#42;c1&lt;p&#42;8
  - perm=&#91;0,2,1,3&#93;
    - T1:h1%8=0,h1&#42;w1&lt;8&#42;p,h1&#42;w1&lt;2&#42;q,c1&#42;w1&lt;p
  - perm=&#91;0,3,1,2&#93;
    - T1:h1&#42;w1&lt;p,w1&lt;8192,h1&#42;c1&lt;p
  - perm=&#91;0,3,2,1&#93;
    - T1:h1%8=0,h1&#42;w1&lt;8&#42;p,h1&#42;w1&lt;2&#42;q,c1&lt;p&#42;8
  - perm=&#91;1,0,2,3&#93;
    - T1:h1&#42;w1&lt;8&#42;p,n1&lt;8192,h1&#42;w1&lt;p
  - perm=&#91;1,0,3,2&#93;
    - T1:h1%8=0,c1&#42;h1&#42;w1&lt;8&#42;p,h1&#42;w1&lt;2&#42;q
  - perm=&#91;1,2,0,3&#93;
    - T1:n1&#42;w1&lt;p&#42;8,c1&#42;h1&#42;w1p,w1%8=0
  - perm=&#91;1,2,3,0&#93;
    - T1:h1&#42;w1&lt;p,n1&lt;p&#42;8,c1&#42;h1&#42;w1&lt;p&#42;8,n1&#42;w1&lt;p&#42;8
  - perm=&#91;1,3,0,2&#93;
    - T1:c1&#42;w1&lt;8192,n1&#42;h1&lt;p,w1%8=0
  - perm=&#91;1,3,2,0&#93;
    - T1:c1&#42;h1&#42;w1&lt;p,n1&#42;h1&lt;p,w1&lt;8192,w1%8=0
  - perm=&#91;2,1,0,3&#93;
    - T1:c1&lt;8192,c1&#42;h1&#42;w1&lt;p,n1&#42;w1&lt;p
  - perm=&#91;2,1,3,0&#93;
    - T1:c1&#42;h1&#42;w1&lt;p,n1&#42;w1&lt;p&#42;8,c1&lt;8192,n1&#42;w1%4=0
  - perm=&#91;2,0,3,1&#93;
    - T1:c1&lt;8192,c1&#42;h1&#42;w1&lt;p
  - perm=&#91;2,0,1,3&#93;
    - T1:n1&#42;c1&#42;h1&#42;w1&lt;p,h1&#42;w1%8=0
  - perm=&#91;2,3,1,0&#93;
    - T1:c1&#42;h1&#42;w1&lt;p,n1&#42;c1&lt;p,h1&#42;w1&lt;8192,h1&#42;w1%8=0
  - perm=&#91;2,3,0,1&#93;
    - T1:h1&#42;w1&lt;8192,n1&#42;c1&lt;p
  - perm=&#91;3,0,2,1&#93;
    - T1:h1&#42;w1&lt;p,n1&#42;c1&lt;8192,c1&#42;h1&lt;p,n1&#42;w1&lt;8192,n1&#42;w1%8=0
  - perm=&#91;3,0,1,2&#93;
    - T1:h1&#42;w1&lt;p,n1&#42;c1&lt;8192,c1&#42;h1&lt;p,n1&#42;w1&lt;8192,n1&#42;h1&#42;w1%8=0
  - perm=&#91;3,2,0,1&#93;
    - T1:h1&#42;w1&lt;p,n1&#42;c1&lt;8192,n1&#42;c1&#42;w1&lt;p
  - perm=&#91;3,2,1,0&#93;
    - T1:c1&#42;h1&#42;w1&lt;p,h1&#42;w1&lt;8192,2&#42;h1&#42;w1&lt;q,n1&#42;c1&lt;p&#42;8,h1%8=0
  - perm=&#91;3,1,0,2&#93;
    - T1:h1&#42;w1&lt;p,c1&#42;w1&lt;8192,n1&#42;h1&lt;p
  - perm=&#91;3,1,2,0&#93;
    - T1:h1&#42;w1&lt;p,n1&#42;c1&lt;8192,n1&#42;h1&lt;p,n1&#42;c1&#42;w1&lt;p


**Data-type constraints**


- T1:int16(Tensor),float16(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.276 -->

#### 3.6.46 Sigmoid



Applies y=1/(1+exp(‑x)) elementwise to the input tensor to produce the output tensor.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:float16(Tensor)


<!-- PDF p.276 -->

#### 3.6.47 Tanh



Computes the hyperbolic tangent of each input-tensor element.



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Data-type constraints**


- T1:float16(Tensor)


<!-- PDF p.276 -->

#### 3.6.48 Softplus



Applies Softplus elementwise, y=ln(exp(x)+1).



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Data-type constraints**


- T1:float16(Tensor)


<!-- PDF p.277 -->

#### 3.6.49 HardSigmoid



Applies y=max(0,min(1,alpha&#42;x+beta)) elementwise to the input tensor to produce the output tensor, where



```text
alpha=1/6，beta=0.5
```



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:float16(Tensor)


<!-- PDF p.277 -->

#### 3.6.50 HardSwish



Applies HardSwish elementwise: y = x &#42; max(0, min(1, alpha &#42; x + beta)) = x &#42; HardSigmoid&lt;alpha,beta&gt;(x), where alpha=1/6,beta=0.5.



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Data-type constraints**


- T1:float16(Tensor)


<!-- PDF p.278 -->

#### 3.6.51 Elu



Applies f(x)=alpha&#42;(exp(x)‑1.)forx&lt;0,f(x)=xforx&gt;=0 elementwise to produce the output tensor, with alpha=1.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:float16(Tensor)


<!-- PDF p.278 -->

#### 3.6.52 exSwish



Applies the Sigmoid Linear Unit elementwise. Swish is also called SiLU: y=x&#42;sigmoid(x).



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Data-type constraints**


- T1:float16(Tensor)


<!-- PDF p.278 -->

#### 3.6.53 exMish



Applies mish(x)=x&#42;tanh(softplus(x))=x&#42;tanh(ln(1+e^{x})) elementwise to the input tensor to produce the output tensor.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:float16(Tensor)


<!-- PDF p.279 -->

#### 3.6.54 exGelu



Applies y =x∗Φ(x) elementwise to the input tensor to produce the output tensor. When Φ(x) is set to tanh,



```text
y = 0.5 * x * (1 + Tanh(sqrt(2/π) * (x + 0.044715 * x^3)))
```



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:float16(Tensor)


<!-- PDF p.279 -->

#### 3.6.55 Where



Selects values from x&#95;tensor or y&#95;tensor according to mask&#95;tensor: True selects the corresponding x&#95;tensor value; otherwise the y&#95;tensor value.



**Inputs**


- mask&#95;tensor:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Broadcasting support
    - Supports broadcasting along any dimension.
  - Broadcasting constraints
    - Broadcasting constraints are the same as for Expand.
- x&#95;tensor:&#42;T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
  - Broadcasting constraints
    - Broadcasting constraints are the same as for Expand.
- y&#95;tensor:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
  - Broadcasting constraints
    - Broadcasting constraints are the same as for Expand.


**Outputs**


- output:T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:bool(Tensor)
- T2:float16(Tensor)


<!-- PDF p.280 -->

#### 3.6.56 exConvStreaming



To reduce latency in speech models, the original convolution input is divided into time-frame segments. Each segment is convolved separately and the results are cached for subsequent time frames, enabling streaming audio processing.



**Inputs**


- input&#95;tensor:T1
  - shape:&#91;batch,channel,height,width&#93;
    - width: currently width=1 is supported.
  - Quantization support
    - per‑layer
- weight:T1
  - shape:&#91;output&#95;channel,input&#95;channel,kernel&#95;h,kernel&#95;w&#93;


```text
kernel_h∈[1,31]
```


- 


```text
kernel_w∈[1,31]
```


- 
- Quantization support
  - per‑layer
  - per‑channel


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Attributes**


- strides:int(strides&#95;h,strides&#95;w)
  - stride&#95;h∈&#91;1,7&#93;
  - stride&#95;w∈&#91;1,7&#93;
- pads:int(pads&#95;top,pads&#95;left,pads&#95;bottom,pads&#95;right)
  - pads&#95;top∈&#91;0,15&#93;
  - pads&#95;left∈&#91;0,15&#93;
  - pads&#95;bottom∈&#91;0,15&#93;
  - pads&#95;right∈&#91;0,15&#93;
- group:int
- dilations:int(dilations&#95;h,dilations&#95;w)
  - dilations&#95;h∈&#91;1,32&#93;
  - dilations&#95;w∈&#91;1,32&#93;


**Data-type constraints**


- T1:float16(Tensor)


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.281 -->

#### 3.6.57 exConvStreamingPRelu/LeakyRelu



Fused exConvStreaming and PRelu/LeakyRelu computation, Output = PRelu(exConvStreaming(Input)) or



```text
Output=
```



LeakyRelu(exConvStreaming(Input))



Description and limits are the same as exConvStreaming.



<!-- PDF p.282 -->

#### 3.6.58 exGlu



Gated Linear Unit function; a is the first half of the input matrix and b is the second half.



```text
GLU(a,b)=a⊗σ(b)
```



**Inputs**


- Input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Outputs**


- Output:T1
  - shape:&#91;batch,channel/2,height,width&#93;
  - Quantization support:per‑layer.


**Data-type constraints**


- T1:float16(Tensor)


**Attributes**


- axis:int(default=1)
  - Dimension along which to split the input.
  - Constraint: only 1 is supported.


<!-- PDF p.282 -->

#### 3.6.59 exMatMul



Matrix multiplication



```text
Y =
  A · B + C   if c_type = "add"
  A · B * C   if c_type = "mul"
```



**Inputs**


- A:T1
  - shape:&#91;b,k,1,n&#93;
    - k ∈(0,8192&#93;
  - Quantization support
    - per‑layer
- B:T1
  - shape:&#91;b,k,1,m&#93;
  - Quantization support
    - per‑layer
- C(optional):T1,T2
  - shape:&#91;b,n,1,m&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.


**Outputs**


- Y:T1
  - shape:&#91;b,n,1,m&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:float16(Tensor)
- T2:float(Tensor)


**Attributes**


- c&#95;type:strings(default “add”)
  - Select add or mul to specify whether C is added or multiplied.


<!-- PDF p.283 -->

#### 3.6.60 exWindow



exWindow derives from window&#95;partition and window&#95;reverse in swin&#95;transformer. In the original paper, input features are divided into non-overlapping windows of window&#95;size×window&#95;size. Input and output features must have a 4-dimensional shape, partitioned in both height and width. The PyTorch implementation follows:



```text
def window_partition(x, window_size):
  """
  Args:
    x: (B, C, H, W)
    window_size (int): window size
  Returns:
    windows: (B, C, num_windows*num_windows, window_size*window_size)
  """
  B, C, H, W = x.shape
  x = x.view(B, C, H // window_size, window_size, W // window_size, window_size)
  windows = x.permute(0, 1, 2, 4, 3, 5).contiguous().view(B, C, -1, window_size*window_size)
  return windows
def window_reverse(windows, window_size, H, W):
  """
  Args:
    windows: (B, C, num_windows*num_windows, window_size*window_size)
    window_size (int): Window size
    H (int): Height of image
    W (int): Width of image
  Returns:
    x: (B, C, H, W)
  """
  B,C,_,_ = windows.shape
  x = windows.view(B, C, H // window_size, W // window_size, window_size, window_size)
  x = x.permute(0, 1, 2, 4, 3, 5).contiguous().view(B, C, H, W)
  return x
```



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;


**Data-type constraints**


- T1:float16(Tensor)


**Attributes**


- mode:string
  - Supported modes:partition,reverse,partition&#95;num&#95;first.
    - partition: see the window&#95;partition implementation.
    - reverse: see the window&#95;reverse implementation.
    - partition&#95;num&#95;first differs from partition in that its H,W are divided according to num&#95;windows, whereas partition divides H,W according to window&#95;sizes.
- window&#95;sizes:listofints
  - 2-dimensional vector of window sizes, defining the height and width of each window. Attention calculation and feature extraction within each window use this size.
- num&#95;windows:listofints
  - 2-dimensional vector of window counts, defining how many windows the input feature height and width are divided into.


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.286 -->

### 3.7 RV1103B/RV1106B



<!-- PDF p.286 -->

#### 3.7.1 Add



Performs elementwise binary addition (C=A+B), supporting multidirectional NumPy-style broadcasting.



**Inputs**


- A:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.
- B:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.


**Outputs**


- C:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor)
- T2:float(constTensor)


<!-- PDF p.286 -->

#### 3.7.2 AddRelu



Fused Add and Relu computation, C=Relu(A+B).



**Inputs**


- Same as Add.


**Outputs**


- Same as Add.


**Other support**


- Multi-core cooperation: supported.


<!-- PDF p.287 -->

#### 3.7.3 BatchNormalization



Applies batch normalization to the input tensor as described in https://arxiv.org/abs/1502.03167.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor)


**Attributes**


- epsilon:float (default=1e‑5)
  - Real value added when dividing by the standard deviation to prevent division by 0.
  - epsilon∈(0,∞&#93;
- momentum:float
  - Moving-average parameter used during training.


<!-- PDF p.287 -->

#### 3.7.4 Concat



Concatenates a sequence of vectors along axis into one vector. All vector dimensions other than axis must match.



**Inputs**


- input&#95;tensor:T
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T:int8(Tensor)


**Attributes**


- axisint64
  - axis∈{0,1,2,3}


<!-- PDF p.288 -->

#### 3.7.5 Convolution



Convolution



**Inputs**


- input&#95;tensor:T1
  - shape:&#91;batch,channel,height,width&#93;
    - width: when dilated&#95;kernel&#95;h&gt;1, width&lt;16383. Additional limits apply to the first-layer input width; see the model-input description.
  - Quantization support
    - per‑layer
- weight:T1
  - shape:&#91;output&#95;channel,input&#95;channel,kernel&#95;h,kernel&#95;w&#93;


```text
kernel_h∈[1,31]
```


- 


```text
kernel_w∈[1,31]
```


- 
- Quantization support
  - per‑layer
  - per‑channel


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Attributes**


- strides:int(strides&#95;h,strides&#95;w)
  - stride&#95;h∈&#91;1,7&#93;
  - stride&#95;w∈&#91;1,7&#93;
- pads:int(pads&#95;top,pads&#95;left,pads&#95;bottom,pads&#95;right)
  - pads&#95;top∈&#91;0,15&#93;
  - pads&#95;left∈&#91;0,15&#93;
  - pads&#95;bottom∈&#91;0,15&#93;
  - pads&#95;right∈&#91;0,15&#93;
- group:int
- dilations:int(dilations&#95;h,dilations&#95;w)
  - dilations&#95;h∈&#91;1,31&#93;
  - dilations&#95;w∈&#91;1,31&#93;


**Data-type constraints**


- T1:int8(Tensor)


<!-- PDF p.289 -->

#### 3.7.6 DepthwiseConvolution



Depthwise separable convolution



**Inputs**


- input&#95;tensor:T1
  - shape:&#91;batch,channel,height,width&#93;
    - width: when dilated&#95;kernel&#95;h&gt;1, width&lt;16383. Additional limits apply to the first-layer input width; see the model-input description.
  - Quantization support
    - per‑layer
- weight:T1
  - shape:&#91;output&#95;channel,input&#95;channel,kernel&#95;h,kernel&#95;w&#93;


```text
kernel_h∈[1,8]
```


- 


```text
kernel_w∈[1,8]
```


- 
- Quantization support
  - per‑layer
  - per‑channel


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Attributes**


- strides:int(strides&#95;h,strides&#95;w)
  - stride&#95;h∈&#91;1,7&#93;
  - stride&#95;w∈&#91;1,7&#93;
- pads:int(pads&#95;top,pads&#95;left,pads&#95;bottom,pads&#95;right)
  - pads&#95;top∈&#91;0,15&#93;
  - pads&#95;left∈&#91;0,15&#93;
  - pads&#95;bottom∈&#91;0,15&#93;
  - pads&#95;right∈&#91;0,15&#93;
- group:int
- dilations:int(dilations&#95;h,dilations&#95;w)
  - dilations&#95;h∈&#91;1,32&#93;
  - dilations&#95;w∈&#91;1,32&#93;


**Data-type constraints**


- T1:int8(Tensor)


<!-- PDF p.290 -->

#### 3.7.7 ConvolutionRelu



Fused Convolution and Relu computation, Output=Relu(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.290 -->

#### 3.7.8 ConvolutionClip



Fused Convolution and Clip computation, Output=Clip(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.290 -->

#### 3.7.9 ConvolutionPRelu/LeakyRelu



Fused Convolution and PRelu/LeakyRelu computation, Output = PRelu(Conv(Input)) or Output =



LeakyRelu(Conv(Input))



Description and specification limits are the same as Convolution.



<!-- PDF p.290 -->

#### 3.7.10 ConvolutionAdd



Fused Convolution and Add computation, Output=Add(Conv(Input0),Input1).



Description and specification limits are the same as Convolution.



<!-- PDF p.290 -->

#### 3.7.11 ConvolutionSigmoid



Fused Convolution and Sigmoid computation, Output=Sigmoid(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.290 -->

#### 3.7.12 ConvolutionTanh



Fused Convolution and Tanh computation, Output=Tanh(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.291 -->

#### 3.7.13 ConvolutionSoftplus



Fused Convolution and Softplus computation, Output=Softplus(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.291 -->

#### 3.7.14 ConvolutionHardSigmoid



Fused Convolution and HardSigmoid computation, Output=HardSigmoid(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.291 -->

#### 3.7.15 ConvolutionHardSwish



Fused Convolution and HardSwish computation, Output=HardSwish(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.291 -->

#### 3.7.16 ConvolutionElu



Fused Convolution and Elu computation, Output=Elu(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.291 -->

#### 3.7.17 ConvolutionSwish



Fused Convolution and Swish computation, Output=Swish(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.291 -->

#### 3.7.18 ConvolutionMish



Fused Convolution and Mish computation, Output=Mish(Conv(Input)).



Description and specification limits are the same as Convolution.



<!-- PDF p.292 -->

#### 3.7.19 ConvTranspose



Transposed convolution



**Inputs**


- input&#95;tensor:T1
  - shape:&#91;batch,channel,height,width&#93;
    - width: when dilated&#95;kernel&#95;h&gt;1, width&lt;16383. In addition, the first-layer input


width is constrained; see model-input instructions.



```text
- **量化支持**
  - per-layer
```


- weight:T1
  - shape:&#91;output&#95;channel,input&#95;channel,kernel&#95;h,kernel&#95;w&#93;


```text
kernel_h∈[1,31]
```


- 


```text
kernel_w∈[1,31]
```


- 
- Quantization support
  - per‑layer
  - per‑channel


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Attributes**


- strides:int(strides&#95;h,strides&#95;w)
  - stride&#95;h∈&#91;1,8&#93;
  - stride&#95;w∈&#91;1,8&#93;
- pads:int(pads&#95;top,pads&#95;left,pads&#95;bottom,pads&#95;right). When setting pad, note that the following are unsupported: kernel&#95;h&#42;dilations&#95;h‑dilations&#95;h‑pads&#95;top&lt;0; kernel&#95;w&#42;dilations&#95;w‑dilations&#95;w‑pads&#95;left&lt;0; stride&#95;h&#42;(height‑1)‑pads&#95;top+1&lt;output&#95;h; stride&#95;w&#42;(width‑1)‑pads&#95;left+1&lt;output&#95;w.
  - pads&#95;top∈&#91;0,15&#93;
  - pads&#95;left∈&#91;0,15&#93;
  - pads&#95;bottom∈&#91;0,15&#93;
  - pads&#95;right∈&#91;0,15&#93;
- group:int
  - group: only 1 is supported; num&#95;output is supported if and only if num&#95;input=num&#95;output.
- dilations:int(dilations&#95;h,dilations&#95;w)
  - dilations&#95;h∈&#91;1,32&#93;
  - dilations&#95;w∈&#91;1,32&#93;
  - When dilation differs from (1,1), only kernel=(1,1) is supported.


**Data-type constraints**


- T1:int8(Tensor)


<!-- PDF p.293 -->

#### 3.7.20 ConvTranposeRelu



Fused ConvTranpose and Relu computation, Output=Relu(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.293 -->

#### 3.7.21 ConvTranposeClip



Fused ConvTranpose and Clip computation, Output=Clip(ConvTranpose(Input)).



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.293 -->

#### 3.7.22 ConvTranposePRelu/LeakyRelu



Fused ConvTranpose and PRelu/LeakyRelu computation, Output=PRelu(ConvTranpose(Input)) or Output=



LeakyRelu(ConvTranpose(Input))



Description and specification limits are the same as ConvTranspose.



<!-- PDF p.293 -->

#### 3.7.23 Div



Performs elementwise binary division (C=A/B), supporting multidirectional NumPy-style broadcasting.



**Inputs**


- A:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - &#91;b,c,1,1&#93;
    - &#91;scalar&#93;
- B:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - &#91;b,c,1,1&#93;
    - &#91;scalar&#93;


**Outputs**


- C:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:float16(Tensor)
- T2:float(constTensor)


<!-- PDF p.294 -->

#### 3.7.24 Expand



Broadcasts the input tensor using the given shape and broadcasting rules, similar to numpy.array(input) &#42;numpy.ones(shape): dimensions are right-aligned; each pair of corresponding dimensions must be equal or one of them must be 1.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
- shape:T2
  - shape:&#91;batch,channel,height,width&#93;


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor)
- T2:int64(Tensor)


Broadcasting constraints


- &#91;b,c,1,w&#93;‑&gt;&#91;b,c,h,w&#93;,h∈&#91;1,8192&#93;
- &#91;b,1,1,w&#93;‑&gt;&#91;b,c,h,w&#93;,h∈&#91;1,8192&#93;
- &#91;b,c,h,1&#93;‑&gt;&#91;b,c,h,w&#93;,w ∈&#91;1,8192&#93;
- &#91;b,1,h,1&#93;‑&gt;&#91;b,c,h,w&#93;,w ∈&#91;1,8192&#93;
- &#91;b,c,1,1&#93;‑&gt;&#91;b,c,h,w&#93;,h∈&#91;1,8192&#93;,w ∈&#91;1,8192&#93;


<!-- PDF p.295 -->

#### 3.7.25 Max



Computes the elementwise maximum of the input tensors.



**Inputs**


- A:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.
- B:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.


**Outputs**


- C:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer/per‑channel


**Data-type constraints**


- T1:int8(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.295 -->

#### 3.7.26 Mul



Performs elementwise binary multiplication (C=A&#42;B), supporting multidirectional NumPy-style broadcasting.



**Inputs**


- A:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.
- B:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.


**Outputs**


- C:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor)
- T2:float(constTensor)


<!-- PDF p.296 -->

#### 3.7.27 MulRelu



Fused Mul and Relu computation,C=Relu(A&#42;B).



**Inputs**


- Same as Mul.


**Outputs**


- Same as Mul.


**Other support**


- Multi-core cooperation: supported.


<!-- PDF p.296 -->

#### 3.7.28 Pad



Given a data tensor (data), a tensor of beginning/end padding values for each axis (pads), a mode (mode) and a constant value (constant&#95;value), produces a padded tensor (output).



**Inputs**


- data:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
- pads:T2
  - shape : &#91;batch&#95;begin, channel&#95;begin, height&#95;begin, width&#95;begin, batch&#95;end, chan‑nel&#95;end,height&#95;end,width&#95;end&#93;
- constant&#95;value(optional):T3
  - shape:&#91;1&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor)
- T2:int64(Tensor)
- T3:float(Scalar),int8(Scalar),float16(Scalar)


**Attributes**


- mode:string (default constant)
  - Supported modes: constant,reflect.
    - constant: unrestricted.


```text
reflectchannel∈(0,8192],height∈(0,8192],width∈(0,8176]
```


- 


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.297 -->

#### 3.7.29 MaxPool



MaxPool consumes input tensor X and applies max pooling according to kernel size, stride size and pad lengths. It computes the maximum over subsets of the input tensor determined by the kernel, downsampling into output tensor Y for further processing. The output spatial shape depends on whether explicit padding (pads) or automatic padding (auto&#95;pad) is used. Only explicit padding is used here.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;


```text
channel∈(0,8192]
```


- 


```text
height∈(0,7]
```


- 


```text
width∈(0,7]
```


- 


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Attributes**


- kernel&#95;shape:int64(kernel&#95;h,kernel&#95;w)
  - kernel&#95;h∈(0,7&#93;
  - kernel&#95;w∈(0,7&#93;
- auto&#95;pad:string
  - Padding mode: only NOTSET is supported.
- ceil&#95;mode:int64
  - Computing output shape using ceil or floor: unsupported.
- strides:int64(strides&#95;h,strides&#95;w)
  - strides&#95;h∈(0,8&#93;
  - strides&#95;w∈(0,8&#93;
- count&#95;include&#95;pad:int64&#91;&#93;
  - count&#95;include&#95;pad, whether to include pad values in calculation:1.
- pad:int64(pad&#95;top,pad&#95;left,pad&#95;bottom,pad&#95;right)
  - pad&#95;top∈&#91;0,7&#93;
  - pad&#95;left∈&#91;0,7&#93;
  - pad&#95;bottom∈&#91;0,7&#93;
  - pad&#95;right∈&#91;0,7&#93;


**Data-type constraints**


- T1:int8(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)


<!-- PDF p.298 -->

#### 3.7.30 GlobalMaxPool



GlobalMaxPool takes input tensor X and applies max pooling to values within each channel. It is equivalent to MaxPool with kernel&#95;shape equal to the spatial dimensions of input.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;


```text
channel∈(0,8192]
```


- 


```text
height∈(0,7]
```


- 


```text
width∈(0,7]
```


- 


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Attributes**


- kernel&#95;shape:int64(kernel&#95;h,kernel&#95;w)
  - kernel&#95;h∈(0,7&#93;
  - kernel&#95;w∈(0,7&#93;
- auto&#95;pad:string
  - Padding mode: only NOTSET is supported.
- ceil&#95;mode:int64
  - Computing output shape using ceil or floor: unsupported.
- strides:int64(strides&#95;h,strides&#95;w)
  - strides&#95;h∈(0,8&#93;
  - strides&#95;w∈(0,8&#93;
- count&#95;include&#95;pad:int64&#91;&#93;
  - count&#95;include&#95;pad, whether to include pad values in calculation:1.
- pad:int64(pad&#95;top,pad&#95;left,pad&#95;bottom,pad&#95;right)
  - pad&#95;top∈&#91;0,7&#93;
  - pad&#95;left∈&#91;0,7&#93;
  - pad&#95;bottom∈&#91;0,7&#93;
  - pad&#95;right∈&#91;0,7&#93;


**Data-type constraints**


- T1:int8(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)


<!-- PDF p.299 -->

#### 3.7.31 AveragePool


- Unsupported (converted by the tool into convolution).


<!-- PDF p.299 -->

#### 3.7.32 GlobalAveragePool


- Unsupported (converted by the tool into convolution).


<!-- PDF p.299 -->

#### 3.7.33 Relu



Sets negative input-tensor values to zero; positive values remain unchanged.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - None


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.300 -->

#### 3.7.34 Clip/ReLU6



Clips input-tensor values to &#91;0,6&#93;.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - None


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.301 -->

#### 3.7.35 PRelu



Scales negative input-tensor values by a learnable parameter; positive values remain unchanged.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer/per‑channel
  - Broadcasting support
    - None


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer/per‑channel


**Attributes**


- slope: PRelu coefficient.
  - Only a single scalar or coefficients along dimension C are supported.


**Data-type constraints**


- T1:int8(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.301 -->

#### 3.7.36 LeakyRelu



Scales negative input-tensor values by a fixed ratio; positive values remain unchanged.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - None


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.302 -->

#### 3.7.37 Reshape



Returns a tensor of the specified shape without changing the input data or element count.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor)


**Attributes**


- shape:int
  - Specifies the output tensor shape.


**Other support**


- Multi-core cooperation: not yet supported.


<!-- PDF p.302 -->

#### 3.7.38 Resize



Resizes the input tensor. In general, each output value is computed as a weighted average of a neighborhood (sampling locations) in the input tensor.



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
- roi(optional):T2
  - Not currently supported.
- scales(optional):T2
  - Array of scale factors along each dimension.
- sizes(optional):T3
  - Target size of the output tensor.


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor)
- T2:float(Tensor)
- T3:int64(Tensor)


**Attributes**


- antialias:int (default 0)
  - Setting this is currently unsupported.
- axes:int&#91;&#93;
  - Setting this is currently unsupported.
- coordinate&#95;transformation&#95;mode:strings (default ”half&#95;pixel”)
  - Currently supports only half&#95;pixel, pytorch&#95;half&#95;pixel and align&#95;corners.
- cubic&#95;coeff&#95;a:float (default ‑0.75)
  - Setting this is currently unsupported.
- exclude&#95;outside:int (default 0)
  - Setting this is currently unsupported.
- extrapolation&#95;value:float (default 0)
  - Setting this is currently unsupported.
- keep&#95;aspect&#95;ratio&#95;policy:strings (default ”stretch”)
  - Setting this is currently unsupported.
- mode:strings (default ”nearest”)
  - Only nearest and linear are currently configurable.
- nearest&#95;mode:strings (default ”round&#95;prefer&#95;floor”)
  - Setting this is currently unsupported.


Support: currently only integer scaling in width and height is supported, with integer factors 2‑8. An input (1,c,1,1) can be enlarged to (1,c,h,w).



<!-- PDF p.304 -->

#### 3.7.39 Slice



Obtains a slice of the current vector using the same rules as NumPy slicing.



**Inputs**


- input&#95;tensor:T
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T:int8(Tensor)


**Attributes**


- starts:int(Tensor)
  - Slice start position: unrestricted.
- ends:int(Tensor)
  - Slice end position: unrestricted.
- axes:int(Tensor)
  - Slice-axis selection: any axis 0~3; multiple axes may be selected simultaneously.
- steps:int(Tensor)
  - Selects the step along each sliced axis.
  - When height&#42;width==1&amp;&amp;channel%subc==0&amp;&amp;starts&#91;1&#93;%subc==0&amp;&amp;ends&#91;1&#93;%subc==0&amp;&amp;steps&#91;1&#93;&lt;=subc, steps may differ from 1. Otherwise SliceOP runs on the NPU only when steps==&#91;1,1,1,1&#93;.


<!-- PDF p.304 -->

#### 3.7.40 Softmax



This operator computes normalized exponential values of the input:



```text
Softmax(input, axis) = exp(input - max(input, axis)) / Σ_axis exp(input - max(input, axis))
```



The “axis” attribute specifies the dimension along which Softmax is applied. The output tensor has the same shape and contains the corresponding input Softmax values.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;, subject to tranpose specification limits.


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Data-type constraints**


- T1:int8(Tensor)


**Attributes**


- axis:int64
  - softmax axis:1,3, corresponding to channel and width.


<!-- PDF p.305 -->

#### 3.7.41 exSoftmax13



This operator computes normalized exponential values of the input:



```text
exSoftmax13(input, axis) = exp(input - max(input, axis)) / Σ_axis exp(input - max(input, axis))
```



The “axis” attribute specifies the dimension along which Softmax is applied. The output tensor has the same shape and contains the corresponding input Softmax values.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;, subject to tranpose specification limits.


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;


**Data-type constraints**


- T1:int8(Tensor)


**Attributes**


- axis:int64
  - softmax axis:1,3, corresponding to channel and width.


<!-- PDF p.305 -->

#### 3.7.42 exSoftmaxMask


- Not yet supported.


<!-- PDF p.306 -->

#### 3.7.43 Split



Splits the vector along axis into num&#95;outputs vectors; split specifies their sizes along axis.



**Inputs**


- input&#95;tensor:T
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T
  - One or more output vectors, determined by num&#95;outputs.
  - shape: determined by the split.
  - Quantization support
    - per‑layer


**Data-type constraints**


- T:int8(Tensor)


**Attributes**


- axis:int
  - axis∈{0,1,2,3}
- num&#95;outputs:int
- split:int(Tensor)


<!-- PDF p.306 -->

#### 3.7.44 Sub


- Performs elementwise binary subtraction (C=A‑B), supporting multidirectional NumPy-style broadcasting.


**Inputs**


- A:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - &#91;b,c,1,1&#93;
    - &#91;scalar&#93;
- B:T1,T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - &#91;b,c,1,1&#93;
    - &#91;scalar&#93;


**Outputs**


- C:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor)
- T2:float(constTensor)


<!-- PDF p.307 -->

#### 3.7.45 Tile



Constructs a tensor by tiling the given tensor, like NumPy tile but without broadcasting.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
- repeats:T2
  - shape:&#91;batch,channel,height,width&#93;


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor),float16(Tensor)
- T2:int64(Tensor)


<!-- PDF p.307 -->

#### 3.7.46 Transpose



Transposes the input tensor.



**Inputs**


- X:T1
  - shape:&#91;n1,c1,h1,w1&#93;
    - See the attribute list for detailed constraints.
  - Quantization support
    - per‑layer


**Outputs**


- Y:T1,T2
  - shape:&#91;n2,c2,h2,w2&#93;
    - See the attribute list for detailed constraints.
  - Quantization support
    - per‑layer


**Attributes**


- perm, order of transposed axes: constraints for each perm follow (p=268435456,q=65536).
  - perm=&#91;0,1,2,3&#93;
    - Unrestricted
  - perm=&#91;0,1,3,2&#93;
    - T1:h1%16=0,h1&#42;w1&lt;16&#42;p,h1&#42;w1&lt;2&#42;q
    - T2:h1%8=0,h1&#42;w1&lt;8&#42;p,h1&#42;w1&lt;2&#42;q
  - perm=&#91;0,2,3,1&#93;
    - T1:c1&lt;8192,h1&#42;w1%8=0，w1&#42;c1&lt;p&#42;16
    - T2:c1&lt;8192,h1&#42;w1%8=0，w1&#42;c1&lt;p&#42;8
  - perm=&#91;0,2,1,3&#93;
    - T1:h1%16=0,h1&#42;w1&lt;16&#42;p,h1&#42;w1&lt;2&#42;q,c1&#42;w1&lt;p
    - T2:h1%8=0,h1&#42;w1&lt;8&#42;p,h1&#42;w1&lt;2&#42;q,c1&#42;w1&lt;p
  - perm=&#91;0,3,1,2&#93;
    - T1,T2:h1&#42;w1&lt;p,w1&lt;8192,h1&#42;c1&lt;p
  - perm=&#91;0,3,2,1&#93;
    - T1:h1%16=0,h1&#42;w1&lt;16&#42;p,h1&#42;w1&lt;2&#42;q,c1&lt;p&#42;16
    - T2:h1%8=0,h1&#42;w1&lt;8&#42;p,h1&#42;w1&lt;2&#42;q,c1&lt;p&#42;8
  - perm=&#91;1,0,2,3&#93;
    - T1:h1&#42;w1&lt;16&#42;p,n1&lt;8192,h1&#42;w1&lt;p
    - T2:h1&#42;w1&lt;8&#42;p,n1&lt;8192,h1&#42;w1&lt;p
  - perm=&#91;1,0,3,2&#93;
    - T1:h1%16=0,c1&#42;h1&#42;w1&lt;16&#42;p,h1&#42;w1&lt;2&#42;q
    - T2:h1%8=0,c1&#42;h1&#42;w1&lt;8&#42;p,h1&#42;w1&lt;2&#42;q
  - perm=&#91;1,2,0,3&#93;
    - T1:n1&#42;w1&lt;p&#42;16,c1&#42;h1&#42;w1&lt;p,w1%16=0
    - T2:n1&#42;w1&lt;p&#42;8,c1&#42;h1&#42;w1p,w1%8=0
  - perm=&#91;1,2,3,0&#93;
    - T1:h1&#42;w1&lt;p,n1&lt;p&#42;16,c1&#42;h1&#42;w1&lt;p&#42;16,n1&#42;w1&lt;p&#42;16
    - T2:h1&#42;w1&lt;p,n1&lt;p&#42;8,c1&#42;h1&#42;w1&lt;p&#42;8,n1&#42;w1&lt;p&#42;8
  - perm=&#91;1,3,0,2&#93;
    - T1:c1&#42;w1&lt;8192,n1&#42;h1&lt;p,w1%16=0
    - T2:c1&#42;w1&lt;8192,n1&#42;h1&lt;p,w1%8=0
  - perm=&#91;1,3,2,0&#93;
    - T1:c1&#42;h1&#42;w1&lt;p,n1&#42;h1&lt;p,w1&lt;8192,w1%16=0
    - T2:c1&#42;h1&#42;w1&lt;p,n1&#42;h1&lt;p,w1&lt;8192,w1%8=0
  - perm=&#91;2,1,0,3&#93;
    - T1,T2:c1&lt;8192,c1&#42;h1&#42;w1&lt;p,n1&#42;w1&lt;p
  - perm=&#91;2,1,3,0&#93;
    - T1:c1&#42;h1&#42;w1&lt;p,n1&#42;w1&lt;p&#42;16,c1&lt;8192,n1&#42;w1%4=0
    - T2:c1&#42;h1&#42;w1&lt;p,n1&#42;w1&lt;p&#42;8,c1&lt;8192,n1&#42;w1%4=0
  - perm=&#91;2,0,3,1&#93;
    - T1,T2:c1&lt;8192,c1&#42;h1&#42;w1&lt;p
  - perm=&#91;2,0,1,3&#93;
    - T1:n1&#42;c1&#42;h1&#42;w1&lt;p,h1&#42;w1%16=0
    - T2:n1&#42;c1&#42;h1&#42;w1&lt;p,h1&#42;w1%8=0
  - perm=&#91;2,3,1,0&#93;
    - T1:c1&#42;h1&#42;w1&lt;p,n1&#42;c1&lt;p,h1&#42;w1&lt;8192,h1&#42;w1%16=0
    - T2:c1&#42;h1&#42;w1&lt;p,n1&#42;c1&lt;p,h1&#42;w1&lt;8192,h1&#42;w1%8=0
  - perm=&#91;2,3,0,1&#93;
    - T1,T2:h1&#42;w1&lt;8192,n1&#42;c1&lt;p
  - perm=&#91;3,0,2,1&#93;
    - T1:h1&#42;w1&lt;p,n1&#42;c1&lt;8192,c1&#42;h1&lt;p,n1&#42;w1&lt;8192,n1&#42;w1%16=0
    - T2:h1&#42;w1&lt;p,n1&#42;c1&lt;8192,c1&#42;h1&lt;p,n1&#42;w1&lt;8192,n1&#42;w1%8=0
  - perm=&#91;3,0,1,2&#93;
    - T1:h1&#42;w1&lt;p,n1&#42;c1&lt;8192,c1&#42;h1&lt;p,n1&#42;w1&lt;8192,n1&#42;h1&#42;w1%16=0
    - T2:h1&#42;w1&lt;p,n1&#42;c1&lt;8192,c1&#42;h1&lt;p,n1&#42;w1&lt;8192,n1&#42;h1&#42;w1%8=0
  - perm=&#91;3,2,0,1&#93;
    - T1,T2:h1&#42;w1&lt;p,n1&#42;c1&lt;8192,n1&#42;c1&#42;w1&lt;p
  - perm=&#91;3,2,1,0&#93;
    - T1:c1&#42;h1&#42;w1&lt;p,h1&#42;w1&lt;8192,2&#42;h1&#42;w1&lt;q,n1&#42;c1&lt;p&#42;16,h1%16=0
    - T2:c1&#42;h1&#42;w1&lt;p,h1&#42;w1&lt;8192,2&#42;h1&#42;w1&lt;q,n1&#42;c1&lt;p&#42;8,h1%8=0
  - perm=&#91;3,1,0,2&#93;
    - T1,T2:h1&#42;w1&lt;p,c1&#42;w1&lt;8192,n1&#42;h1&lt;p
  - perm=&#91;3,1,2,0&#93;
    - T1,T2:h1&#42;w1&lt;p,n1&#42;c1&lt;8192,n1&#42;h1&lt;p,n1&#42;c1&#42;w1&lt;p


**Data-type constraints**


- T1:int8(Tensor)
- T2:int16(Tensor)


**Other support**


- Multi-core cooperation: not currently supported.


<!-- PDF p.310 -->

#### 3.7.47 Sigmoid



Applies y=1/(1+exp(‑x)) elementwise to the input tensor to produce the output tensor.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor)


<!-- PDF p.310 -->

#### 3.7.48 Tanh



Computes the hyperbolic tangent of each input-tensor element.



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Data-type constraints**


- T1:int8(Tensor)


<!-- PDF p.311 -->

#### 3.7.49 Softplus



Applies Softplus elementwise, y=ln(exp(x)+1).



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Data-type constraints**


- T1:int8(Tensor)


<!-- PDF p.311 -->

#### 3.7.50 HardSigmoid



Applies y=max(0,min(1,alpha&#42;x+beta)) elementwise to the input tensor to produce the output tensor, where



```text
alpha=1/6，beta=
```


- (0) 5


**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor)


<!-- PDF p.312 -->

#### 3.7.51 HardSwish



Applies HardSwish elementwise, y = x &#42; max(0, min(1, alpha &#42; x + beta)) = x &#42; HardSigmoid&lt;alpha,beta&gt;(x), where alpha=1/6,



```text
beta=0.5
```



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Data-type constraints**


- T1:int8(Tensor)


<!-- PDF p.312 -->

#### 3.7.52 Elu



Applies f(x)=alpha&#42;(exp(x)‑1.)forx&lt;0,f(x)=xforx&gt;=0 elementwise to produce the output tensor, with alpha=1.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor)


<!-- PDF p.313 -->

#### 3.7.53 exSwish



Applies the Sigmoid Linear Unit elementwise. Swish is also called SiLU: y=x&#42;sigmoid(x).



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Data-type constraints**


- T1:int8(Tensor)


<!-- PDF p.313 -->

#### 3.7.54 exMish



Applies mish(x)=x&#42;tanh(softplus(x))=x&#42;tanh(ln(1+e^{x})) elementwise to the input tensor to produce the output tensor.



**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor)


<!-- PDF p.313 -->

#### 3.7.55 exGelu



Applies y =x∗Φ(x) elementwise to the input tensor to produce the output tensor. When Φ(x) is set to tanh,



```text
$y=
```


- (0) 5&#42;x&#42;(1+Tanh(\sqrt{\frac{2}{\pi}}&#42;(x+0.044715&#42;x^3)))$


**Inputs**


- input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Outputs**


- output:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor)


<!-- PDF p.314 -->

#### 3.7.56 Where



Selects values from x&#95;tensor or y&#95;tensor according to mask&#95;tensor: True selects the corresponding x&#95;tensor value; otherwise the y&#95;tensor value.



**Inputs**


- mask&#95;tensor:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Broadcasting support
    - Supports broadcasting along any dimension.
  - Broadcasting constraints
    - Broadcasting constraints are the same as for Expand.
- x&#95;tensor:&#42;T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
  - Broadcasting constraints
    - Broadcasting constraints are the same as for Expand.
- y&#95;tensor:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
  - Broadcasting constraints
    - Broadcasting constraints are the same as for Expand.


**Outputs**


- output:T2
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:bool(Tensor)
- T2:int8(Tensor)


<!-- PDF p.315 -->

#### 3.7.57 exGlu



Gated Linear Unit function; a is the first half of the input matrix and b is the second half.



```text
GLU(a,b)=a⊗σ(b)
```



**Inputs**


- Input:T1
  - shape:&#91;batch,channel,height,width&#93;
  - Quantization support:per‑layer.


**Outputs**


- Output:T1
  - shape:&#91;batch,channel/2,height,width&#93;
  - Quantization support:per‑layer.


**Data-type constraints**


- T1:int8(Tensor)


**Attributes**


- axis:int(default=1)
  - Dimension along which to split the input.
  - Constraint: only 1 is supported.


<!-- PDF p.315 -->

#### 3.7.58 exMatMul



Matrix multiplication



```text
Y =
  A · B + C   if c_type = "add"
  A · B * C   if c_type = "mul"
```



**Inputs**


- A:T1
  - shape:&#91;b,k,1,n&#93;
    - k ∈(0,8192&#93;
  - Quantization support
    - per‑layer
- B:T1
  - shape:&#91;b,k,1,m&#93;
  - Quantization support
    - per‑layer
- C(optional):T1,T2
  - shape:&#91;b,n,1,m&#93;
  - Quantization support
    - per‑layer
  - Broadcasting support
    - Supports broadcasting along any dimension.
    - Broadcasting constraints are the same as for Expand.


**Outputs**


- Y:T1
  - shape:&#91;b,n,1,m&#93;
  - Quantization support
    - per‑layer


**Data-type constraints**


- T1:int8(Tensor)
- T2:float(Tensor)


**Attributes**


- c&#95;type:strings(default “add”)
  - Select add or mul to specify whether C is added or multiplied.


<!-- PDF p.316 -->

#### 3.7.59 exWindow



exWindow derives from window&#95;partition and window&#95;reverse in swin&#95;transformer. In the original paper, input features are divided into non-overlapping windows of window&#95;size×window&#95;size. Input and output features must have a 4-dimensional shape, partitioned in both height and width. The PyTorch implementation follows:



```text
def window_partition(x, window_size):
  """
  Args:
    x: (B, C, H, W)
    window_size (int): window size
  Returns:
    windows: (B, C, num_windows*num_windows, window_size*window_size)
  """
  B, C, H, W = x.shape
  x = x.view(B, C, H // window_size, window_size, W // window_size, window_size)
  windows = x.permute(0, 1, 2, 4, 3, 5).contiguous().view(B, C, -1, window_size*window_size)
  return windows
def window_reverse(windows, window_size, H, W):
  """
  Args:
    windows: (B, C, num_windows*num_windows, window_size*window_size)
    window_size (int): Window size
    H (int): Height of image
    W (int): Width of image
  Returns:
    x: (B, C, H, W)
  """
  B,C,_,_ = windows.shape
  x = windows.view(B, C, H // window_size, W // window_size, window_size, window_size)
  x = x.permute(0, 1, 2, 4, 3, 5).contiguous().view(B, C, H, W)
  return x
```



**Inputs**


- X:T1
  - shape:&#91;batch,channel,height,width&#93;


**Outputs**


- Y:T1
  - shape:&#91;batch,channel,height,width&#93;


**Data-type constraints**


- T1:int8(Tensor)


**Attributes**


- mode:string
  - Supported modes:partition,reverse,partition&#95;num&#95;first.
    - partition: see the window&#95;partition implementation.
    - reverse: see the window&#95;reverse implementation.
    - partition&#95;num&#95;first differs from partition in that its H,W are divided according to num&#95;windows, whereas partition divides H,W according to window&#95;sizes.
- window&#95;sizes:listofints
  - 2-dimensional vector of window sizes, defining the height and width of each window. Attention calculation and feature extraction within each window use this size.
- num&#95;windows:listofints
  - 2-dimensional vector of window counts, defining how many windows the input feature height and width are divided into.


**Other support**


- Multi-core cooperation: not yet supported.
- 3566/3568 operator specifications
- 3588 operator specifications
- 3562 operator specifications
- 1103/1106 operator specifications
- 3576/RV1126B operator specifications
- 2118 operator specifications
- 1103B/1106B operator specifications


<!-- PDF p.319 -->

## CPU operator specifications



<!-- PDF p.319 -->

### 4.1 Note:


- RK2118 supports none of the CPU operators.
- RV1106/RV1103/RV1106B/RV1103B support only some of the CPU operators listed below.
  - Concat, DataConvert, Div, exLayerNorm, Exp, Gather, ReduceL2, ReduceMax, Reshape,ScatterND,Softmax


<!-- PDF p.319 -->

### 4.2 Add


- Description: addition.
- Constraints: unrestricted.


<!-- PDF p.319 -->

### 4.3 AveragePool


- Description: average pooling.
- Constraints: unrestricted.


<!-- PDF p.320 -->

### 4.4 ArgMin


- Description: index of the minimum value.
- Constraints: unrestricted.


<!-- PDF p.320 -->

### 4.5 ArgMax


- Description: index of the maximum value.
- Constraints: unrestricted.


<!-- PDF p.320 -->

### 4.6 BatchNormalization


- Description: batch normalization.
- Constraints: unrestricted.


<!-- PDF p.320 -->

### 4.7 Cast


- Description: data-type conversion.
- Specification constraints


SRC supports:float32/bool/int8/float16/int32/int64; DST supports:float32/int8/int32/float16.



<!-- PDF p.320 -->

### 4.8 Clip


- Description: clipping activation layer.
- Constraints: unrestricted.


<!-- PDF p.320 -->

### 4.9 Concat


- Description: concatenation.
- Constraints: axis supports only {0,1,2,3}.


<!-- PDF p.320 -->

### 4.10 Convolution


- Description: convolution.
- Constraints: unrestricted.


<!-- PDF p.321 -->

### 4.11 ConvTranspose/Deconvolution


- Description: transposed convolution.
- Constraints: unrestricted.


<!-- PDF p.321 -->

### 4.12 ConvTransposePad


- Description: combined OP.
- Constraints: unrestricted.


<!-- PDF p.321 -->

### 4.13 Cos


- Description: cosine function.
- Constraints: unrestricted.


<!-- PDF p.321 -->

### 4.14 DataConvert


- Description: data-type conversion.
- Constraints: only bool/int8/float type conversion is supported.


<!-- PDF p.321 -->

### 4.15 DepthToSpace


- Description: channel/spatial dimension conversion.
- Constraints: unrestricted.


<!-- PDF p.321 -->

### 4.16 Div


- Description: division.
- Constraints: unrestricted.


<!-- PDF p.321 -->

### 4.17 Equal


- Description: equality.
- Constraints: unrestricted.


<!-- PDF p.322 -->

### 4.18 Exp


- Description: exponential function.
- Constraints: unrestricted.


<!-- PDF p.322 -->

### 4.19 Flatten


- Description: flattening.
- Constraints: unrestricted.


<!-- PDF p.322 -->

### 4.20 Gather


- Description: gather operation.
- Constraints: unrestricted.


<!-- PDF p.322 -->

### 4.21 Greater


- Description: greater than.
- Constraints: unrestricted.


<!-- PDF p.322 -->

### 4.22 GreaterOrEqual


- Description: greater than or equal.
- Constraints: unrestricted.


<!-- PDF p.322 -->

### 4.23 GRU


- Description: gated recurrent unit.
- Constraints: unrestricted.


<!-- PDF p.322 -->

### 4.24 exGRU


- Description: gated recurrent unit.
- Constraints: unrestricted.
- Note: ONNX extension operator.


<!-- PDF p.323 -->

### 4.25 exHardSwish


- Description: activation function.
- Constraints: unrestricted.
- Note: ONNX extension operator.


<!-- PDF p.323 -->

### 4.26 InstanceNormalization


- Description: instance normalization.
- Constraints: unrestricted.


<!-- PDF p.323 -->

### 4.27 exLayerNorm


- Description: layer normalization.
- Constraints: unrestricted.
- Note: ONNX extension operator.


<!-- PDF p.323 -->

### 4.28 Less


- Description: less than.
- Constraints: unrestricted.


<!-- PDF p.323 -->

### 4.29 LessOrEqual


- Description: less than or equal.
- Constraints: unrestricted.


<!-- PDF p.323 -->

### 4.30 LogSoftmax


- Description: activation function.
- Constraints: batchsize supports only 1.


<!-- PDF p.323 -->

### 4.31 LpNormalization


- Description: Lp normalization.
- Constraints: unrestricted.


<!-- PDF p.324 -->

### 4.32 exLRN


- Description: local response normalization.
- Constraints: unrestricted.
- Note: ONNX extension operator.


<!-- PDF p.324 -->

### 4.33 MatMul


- Description: multidimensional matrix multiplication.
- Constraints: unrestricted (supports four-dimensional x four-dimensional and four-dimensional x three-dimensional computation).


<!-- PDF p.324 -->

### 4.34 Max


- Description: maximum value.
- Constraints: unrestricted.


<!-- PDF p.324 -->

### 4.35 MaxPool


- Description: max pooling.
- Constraints: unrestricted.


<!-- PDF p.324 -->

### 4.36 MaxRoiPool


- Description: regional max pooling.
- Constraints: unrestricted.


<!-- PDF p.324 -->

### 4.37 MaxUnpool


- Description: inverse max pooling.
- Constraints: unrestricted.


<!-- PDF p.324 -->

### 4.38 exMish


- Description: activation function.
- Constraints: unrestricted.
- Note: ONNX extension operator.


<!-- PDF p.325 -->

### 4.39 Min


- Description: minimum value.
- Constraints: unrestricted.


<!-- PDF p.325 -->

### 4.40 Mul


- Description: multiplication.
- Constraints: unrestricted.


<!-- PDF p.325 -->

### 4.41 Pad


- Description: padding.
- Constraints: unrestricted.


<!-- PDF p.325 -->

### 4.42 Pow


- Description: exponentiation.
- Constraints: unrestricted.


<!-- PDF p.325 -->

### 4.43 exProposal


- Description: region proposal network.
- Constraints: batchsize supports only 1.
- Note: ONNX extension operator.


<!-- PDF p.325 -->

### 4.44 ReduceMax


- Description: computes Max along specified dimensions.
- Constraints: output cannot exceed 4 dimensions.


<!-- PDF p.325 -->

### 4.45 ReduceMean


- Description: computes Mean along specified dimensions.
- Constraints: output cannot exceed 4 dimensions.


<!-- PDF p.326 -->

### 4.46 ReduceSum


- Description: computes Sum along specified dimensions.
- Constraints: output cannot exceed 4 dimensions.


<!-- PDF p.326 -->

### 4.47 ReduceMin


- Description: computes Min along specified dimensions.
- Constraints: output cannot exceed 4 dimensions.


<!-- PDF p.326 -->

### 4.48 Reorg


- Description: data rearrangement.
- Constraints: unrestricted.


<!-- PDF p.326 -->

### 4.49 Reshape


- Description: data reshaping.
- Constraints: unrestricted.


<!-- PDF p.326 -->

### 4.50 Resize


- Description: scales data in width and height.
- Constraints: supported interpolation methods are bilinear;nearest2d.


<!-- PDF p.326 -->

### 4.51 ReverseSequence


- Description: sequence reversal.
- Constraints: unrestricted.


<!-- PDF p.326 -->

### 4.52 exRMSNorm


- Description: root-mean-square normalization.
- Constraints: unrestricted.
- Note: ONNX extension operator.


<!-- PDF p.327 -->

### 4.53 RoiAlign


- Description: region-aligned pooling.
- Constraints: only AvgPoolMode is supported; batchsize supports only 1.


<!-- PDF p.327 -->

### 4.54 ScatterND


- Description: N-dimensional indexed data access.
- Constraints: unrestricted.


<!-- PDF p.327 -->

### 4.55 Sin


- Description: sine function.
- Constraints: unrestricted.


<!-- PDF p.327 -->

### 4.56 Slice


- Description: slicing.
- Constraints: batchsize supports only 1.


<!-- PDF p.327 -->

### 4.57 Softmax


- Description: activation function.
- Constraints: batchsize supports only 1.
- Note: consistent with ONNX OPSET11.


<!-- PDF p.327 -->

### 4.58 exSoftmax13


- Description: activation function.
- Constraints: batchsize supports only 1.
- Note: ONNX extension operator consistent with ONNX OPSET13.


<!-- PDF p.327 -->

### 4.59 SpaceToDetph


- Description: converts spatial dimensions into the channel dimension.
- Constraints: unrestricted.


<!-- PDF p.328 -->

### 4.60 Split


- Description: data splitting.
- Constraints: unrestricted.


<!-- PDF p.328 -->

### 4.61 Sqrt


- Description: square root.
- Constraints: unrestricted.


<!-- PDF p.328 -->

### 4.62 Squeeze


- Description: squeezes data dimensions.
- Constraints: unrestricted.


<!-- PDF p.328 -->

### 4.63 Sub


- Description: subtraction.
- Constraints: unrestricted.


<!-- PDF p.328 -->

### 4.64 Tanh


- Description: hyperbolic tangent.
- Constraints: unrestricted.


<!-- PDF p.328 -->

### 4.65 Tile


- Description: extends data by copying.
- Constraints: batchsize supports only 1; broadcasting is unsupported.


<!-- PDF p.328 -->

### 4.66 Transpose


- Description: transposition.
- Constraints: unrestricted.


<!-- PDF p.329 -->

### 4.67 Upsample


- Description: upsampling.
- Constraints: supported interpolation methods are bilinear;nearest2d.


<!-- PDF p.329 -->

### 4.68 Not


- Description: elementwise logical NOT.
- Constraints: unrestricted.


<!-- PDF p.329 -->

### 4.69 where


- Description: selects data by mask.
- Constraints: unrestricted.


<!-- PDF p.329 -->

### 4.70 Erf


- Description: error function.
- Constraints: unrestricted.


<!-- PDF p.329 -->

### 4.71 Floor


- Description: floor function.
- Constraints: unrestricted.


<!-- PDF p.329 -->

### 4.72 Mod


- Description: modulo function.
- Constraints: unrestricted.


<!-- PDF p.329 -->

### 4.73 exMeanVarianceNormalization


- Description: mean-variance normalization.
- Constraints: unrestricted.


<!-- PDF p.330 -->

### 4.74 And


- Description: AND function.
- Constraints: unrestricted.


<!-- PDF p.330 -->

### 4.75 GatherElements


- Description: element gathering.
- Constraints: unrestricted.


<!-- PDF p.330 -->

### 4.76 Log


- Description: Log function.
- Constraints: unrestricted.


<!-- PDF p.330 -->

### 4.77 exDataConvert


- Description: precision conversion.
- Constraints: unrestricted.


<!-- PDF p.330 -->

### 4.78 SpaceToDepth


- Description: dimension transformation.
- Constraints: unrestricted.


<!-- PDF p.330 -->

### 4.79 SoftmaxMask


- Description: activation function fusing where and softmax.
- Constraints: unrestricted.


<!-- PDF p.330 -->

### 4.80 TransposeReshape


- Description: combined OP.
- Constraints: unrestricted.


<!-- PDF p.331 -->

### 4.81 ReshapeTranspose


- Description: combined OP.
- Constraints: unrestricted.


<!-- PDF p.331 -->

### 4.82 ReduceL2


- Description: L2 norm along an axis.
- Constraints: unrestricted.


<!-- PDF p.331 -->

### 4.83 LayerNormalization


- Description: layer standardization.
- Constraints: unrestricted.


<!-- PDF p.331 -->

### 4.84 PassThrough


- Description: direct connection.
- Constraints: unrestricted.


<!-- PDF p.331 -->

### 4.85 Expand


- Description: tensor data replication or expansion.
- Constraints: unrestricted.


<!-- PDF p.331 -->

### 4.86 Sigmoid


- Description: activation function.
- Constraints: unrestricted.


<!-- PDF p.331 -->

### 4.87 Tanh


- Description: trigonometric function.
- Constraints: unrestricted.


<!-- PDF p.332 -->

### 4.88 Cos


- Description: trigonometric function.
- Constraints: unrestricted.


<!-- PDF p.332 -->

### 4.89 Sin


- Description: trigonometric function.
- Constraints: unrestricted.


<!-- PDF p.332 -->

### 4.90 exSwish


- Description: activation function.
- Constraints: unrestricted.


<!-- PDF p.332 -->

### 4.91 exGlu


- Description: activation function.
- Constraints: unrestricted.


<!-- PDF p.332 -->

### 4.92 exGelu


- Description: activation function.
- Constraints: unrestricted.


<!-- PDF p.332 -->

### 4.93 exWindow


- Description: exWindow derives from Swin‑Transformer window&#95;partition and window&#95;reverse.
- Constraints: unrestricted.


<!-- PDF p.332 -->

### 4.94 exNorm


- Description: with mode set to ‘pixel‘, exNorm uses PixelNorm. If mode is omitted, exNorm


uses LayerNorm by default.


- Constraints: unrestricted.


<!-- PDF p.333 -->

### 4.95 Round


- Description: data saturation.
- Constraints: unrestricted.


<!-- PDF p.333 -->

### 4.96 TopK


- Description: retrieves the top K values.
- Constraints: unrestricted.


<!-- PDF p.333 -->

### 4.97 exSwooshR


- Description: activation function.
- Constraints: unrestricted.


<!-- PDF p.333 -->

### 4.98 exSwooshL


- Description: activation function.
- Constraints: unrestricted.


<!-- PDF p.333 -->

### 4.99 OneHot


- Description: one-hot encoding.
- Constraints: unrestricted.


<!-- PDF p.335 -->

## Model input/output restrictions



<!-- PDF p.335 -->

### 5.1 Model input restrictions


- (1) These alignment constraints apply only to zero-copy APIs, not ordinary APIs.
- (2) Input-width alignment can be queried through the zero-copy API w&#95;stride attribute. Note: w&#95;stride cannot be changed.
- (3) Only input width has alignment requirements depending on channel; other dimensions are unrestricted.
- (4) If mean and scale are not needed, configure mean and scale as 0 and 1 respectively.
- (5) If channel&gt;4, mean/scale use only the first value, mean&#91;0&#93; and scale&#91;0&#93;, for all channels.
- (6) If the first layer is floating point, there is no quant operation.
- (7) RV1106/RV1103/RV1103B do not support CPU mean/scale/quant operations.
- (8) See Rockchip&#95;RKNPU&#95;User&#95;Guide&#95;RKNN&#95;SDK for detailed usage.


<!-- PDF p.336 -->

#### 5.1.1 RK3566/RK3568



![Chinese original: model-input alignment restrictions — PDF p.336](/docs/rockchip-rknn-compiler-operators/assets/cn-p336-1.png)

Editable transcription of the original (merged cells expanded):

| Platform | First-layer precision | Input dimensions | Configured first-layer input type | mean/scale/quant backend | width alignment (elements), channel=1,3,4 | width alignment (elements), channel≠1,3,4 | width limits, channel=1,3,4 | width limits, channel≠1,3,4 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
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
| --- | --- |
| A (1) | width &#42; dilation&#95;kernel&#95;h &lt; 1024 &#42; N |
| A (2) | width &lt;= 4096 |
| A / Convolution | N = 8 - CEIL((dilation&#95;kernel&#95;h &#42; dilation&#95;kernel&#95;w) / 128) |
| A / Depthwise Convolution | N = 8 - CEIL((dilation&#95;kernel&#95;h &#42; dilation&#95;kernel&#95;w) / 4096) |
| A / ConvTranspose/Deconvolution | N = 8 - CEIL((dilation&#95;kernel&#95;h &#42; dilation&#95;kernel&#95;w) / 128) |

| Condition | Formula |
| --- | --- |
| B (1) | width &#42; dilation&#95;kernel&#95;h &lt; 1024 &#42; N |
| B (2) | width &lt;= 4096 |
| B / Convolution | N = 8 - CEIL((dilation&#95;kernel&#95;h &#42; dilation&#95;kernel&#95;w) / 128) |
| B / Depthwise Convolution | N = 8 - CEIL((dilation&#95;kernel&#95;h &#42; dilation&#95;kernel&#95;w) / 4096) |
| B / ConvTranspose/Deconvolution | N = 8 - CEIL((dilation&#95;kernel&#95;h &#42; dilation&#95;kernel&#95;w) / 128) |



<!-- PDF p.336 -->

#### 5.1.2 RK3588



![Chinese original: model-input alignment restrictions — PDF p.336](/docs/rockchip-rknn-compiler-operators/assets/cn-p336-2.png)

Editable transcription of the original (merged cells expanded):

| Platform | First-layer precision | Input dimensions | Configured first-layer input type | mean/scale/quant backend | width alignment (elements), channel=1,3,4 | width alignment (elements), channel≠1,3,4 | width limits, channel=1,3,4 | width limits, channel≠1,3,4 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
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
| --- | --- |
| A (1) | width &#42; dilation&#95;kernel&#95;h &lt;= 2048 &#42; N |
| A (2) | width &lt;= 8192 |
| A / Convolution | N = 12 - MAX(CEIL((dilation&#95;kernel&#95;h &#42; dilation&#95;kernel&#95;w) / 128), 3) |
| A / Depthwise Convolution | N = 12 - MAX(CEIL((dilation&#95;kernel&#95;h &#42; dilation&#95;kernel&#95;w) / 2048), 3) |
| A / ConvTranspose/Deconvolution | N = 12 - MAX(CEIL((dilation&#95;kernel&#95;h &#42; dilation&#95;kernel&#95;w) / 128), 3) |

| Condition | Formula |
| --- | --- |
| B (1) | width &#42; dilation&#95;kernel&#95;h &lt;= 1024 &#42; N |
| B (2) | width &lt;= 8192 |
| B / Convolution | N = 12 - MAX(CEIL((dilation&#95;kernel&#95;h &#42; dilation&#95;kernel&#95;w) / 128), 3) |
| B / Depthwise Convolution | N = 12 - MAX(CEIL((dilation&#95;kernel&#95;h &#42; dilation&#95;kernel&#95;w) / 2048), 3) |
| B / ConvTranspose/Deconvolution | N = 12 - MAX(CEIL((dilation&#95;kernel&#95;h &#42; dilation&#95;kernel&#95;w) / 128), 3) |



<!-- PDF p.337 -->

#### 5.1.3 RV1103/RV1106



![Chinese original: model-input alignment restrictions — PDF p.337](/docs/rockchip-rknn-compiler-operators/assets/cn-p337-1.png)

Editable transcription of the original (merged cells expanded):

| Platform | First-layer precision | Input dimensions | Configured first-layer input type | mean/scale/quant backend | width alignment (elements), channel=1,3,4 | width alignment (elements), channel≠1,3,4 | width limits, channel=1,3,4 | width limits, channel≠1,3,4 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RV1103/RV1106 | int8 | 4 | uint8 | NPU | 16 | 1 | A | Unrestricted |

For each convolution type, width/kernel_h/kernel_w must satisfy both conditions below. N must be an integer from 1 to 7; convolutions outside that range are unsupported. N is computed below. The image spells dilation_kernel_h/w differently from dilated_kernel_h/w in the last chapter; the image spelling is preserved.

| Condition | Formula |
| --- | --- |
| A (1) | width &#42; dilation&#95;kernel&#95;h &lt;= 2048 &#42; N |
| A (2) | width &lt;= 4096 |
| A / Convolution | N = 8 - MAX(CEIL((dilation&#95;kernel&#95;h &#42; dilation&#95;kernel&#95;w) / 128), 2) |
| A / Depthwise Convolution | N = 8 - CEIL((dilation&#95;kernel&#95;h &#42; dilation&#95;kernel&#95;w) / 4096) |
| A / ConvTranspose/Deconvolution | N = 8 - MAX(CEIL((dilation&#95;kernel&#95;h &#42; dilation&#95;kernel&#95;w) / 128), 2) |

> The original header refers to note 9, but the supplied input notes list only 1–8. Note 9 was not found and is not invented.



<!-- PDF p.337 -->

#### 5.1.4 RK3562



![Chinese original: model-input alignment restrictions — PDF p.337](/docs/rockchip-rknn-compiler-operators/assets/cn-p337-2.png)

Editable transcription of the original (merged cells expanded):

| Platform | First-layer precision | Input dimensions | Configured first-layer input type | mean/scale/quant backend | width alignment (elements), channel=1,3,4 | width alignment (elements), channel≠1,3,4 | width limits, channel=1,3,4 | width limits, channel≠1,3,4 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
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
| --- | --- |
| A (1) | width &#42; dilation&#95;kernel&#95;h &lt;= 2048 &#42; N |
| A (2) | width &lt;= 4096 |
| A / Convolution | N = 8 - MAX(CEIL((dilation&#95;kernel&#95;h &#42; dilation&#95;kernel&#95;w) / 128), 2) |
| A / Depthwise Convolution | N = 8 - CEIL((dilation&#95;kernel&#95;h &#42; dilation&#95;kernel&#95;w) / 4096) |
| A / ConvTranspose/Deconvolution | N = 8 - MAX(CEIL((dilation&#95;kernel&#95;h &#42; dilation&#95;kernel&#95;w) / 128), 2) |

| Condition | Formula |
| --- | --- |
| B (1) | width &#42; dilation&#95;kernel&#95;h &lt;= 2048 &#42; N |
| B (2) | width &lt;= 4096 |
| B / Convolution | N = 8 - MAX(CEIL((dilation&#95;kernel&#95;h &#42; dilation&#95;kernel&#95;w) / 128), 2) |
| B / Depthwise Convolution | N = 8 - CEIL((dilation&#95;kernel&#95;h &#42; dilation&#95;kernel&#95;w) / 4096) |
| B / ConvTranspose/Deconvolution | N = 8 - MAX(CEIL((dilation&#95;kernel&#95;h &#42; dilation&#95;kernel&#95;w) / 128), 2) |



<!-- PDF p.338 -->

#### 5.1.5 RK3576/RV1126B



![Chinese original: model-input alignment restrictions — PDF p.338](/docs/rockchip-rknn-compiler-operators/assets/cn-p338-1.png)

Editable transcription of the original (merged cells expanded):

| Platform | First-layer precision | Input dimensions | Configured first-layer input type | mean/scale/quant backend | width alignment (elements), channel=1,3,4 | width alignment (elements), channel≠1,3,4 | width limits, channel=1,3,4 | width limits, channel≠1,3,4 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
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
| --- | --- |
| A (1) | width &#42; dilation&#95;kernel&#95;h &lt;= 2048 &#42; N |
| A (2) | width &lt;= 4096 |
| A / Convolution | N = 8 - MAX(CEIL((dilation&#95;kernel&#95;h &#42; dilation&#95;kernel&#95;w) / 128), 2) |
| A / Depthwise Convolution | N = 8 - CEIL((dilation&#95;kernel&#95;h &#42; dilation&#95;kernel&#95;w) / 2048) |
| A / ConvTranspose/Deconvolution | N = 8 - MAX(CEIL((dilation&#95;kernel&#95;h &#42; dilation&#95;kernel&#95;w) / 128), 2) |

| Condition | Formula |
| --- | --- |
| B (1) | width &#42; dilation&#95;kernel&#95;h &lt;= 2048 &#42; N |
| B (2) | width &lt;= 4096 |
| B / Convolution | N = 8 - MAX(CEIL((dilation&#95;kernel&#95;h &#42; dilation&#95;kernel&#95;w) / 128), 2) |
| B / Depthwise Convolution | N = 8 - MAX(CEIL((dilation&#95;kernel&#95;h &#42; dilation&#95;kernel&#95;w) / 2048), 3) |
| B / ConvTranspose/Deconvolution | N = 12 - MAX(CEIL((dilation&#95;kernel&#95;h &#42; dilation&#95;kernel&#95;w) / 128), 2) |



<!-- PDF p.338 -->

#### 5.1.6 RK2118



![Chinese original: model-input alignment restrictions — PDF p.338](/docs/rockchip-rknn-compiler-operators/assets/cn-p338-2.png)

Editable transcription of the original (merged cells expanded):

| Platform | First-layer precision | Input dimensions | Configured first-layer input type | mean/scale/quant backend | width alignment (elements), channel=1,3,4 | width alignment (elements), channel≠1,3,4 | width limits, channel=1,3,4 | width limits, channel≠1,3,4 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RK2118 | float16 | 4 | float16 | CPU | 4 | 1 | A | Unrestricted |
| RK2118 | float16 | Not 4-dimensional | float16 | CPU | 1 | 1 | A | Unrestricted |

For each convolution type, width/kernel_h/kernel_w must satisfy both conditions below. N must be an integer from 1 to 7; convolutions outside that range are unsupported. N is computed below. The image spells dilation_kernel_h/w differently from dilated_kernel_h/w in the last chapter; the image spelling is preserved.

| Condition | Formula |
| --- | --- |
| A (1) | width &#42; dilation&#95;kernel&#95;h &lt;= 2048 &#42; N |
| A (2) | width &lt;= 4096 |
| A / Convolution | N = 8 - MAX(CEIL((dilation&#95;kernel&#95;h &#42; dilation&#95;kernel&#95;w) / 128), 2) |
| A / Depthwise Convolution | N = 8 - CEIL((dilation&#95;kernel&#95;h &#42; dilation&#95;kernel&#95;w) / 4096) |
| A / ConvTranspose/Deconvolution | N = 8 - MAX(CEIL((dilation&#95;kernel&#95;h &#42; dilation&#95;kernel&#95;w) / 128), 2) |



<!-- PDF p.338 -->

#### 5.1.7 RV1103B



![Chinese original: model-input alignment restrictions — PDF p.338](/docs/rockchip-rknn-compiler-operators/assets/cn-p338-3.png)

Editable transcription of the original (merged cells expanded):

| Platform | First-layer precision | Input dimensions | Configured first-layer input type | mean/scale/quant backend | width alignment (elements), channel=1,3,4 | width alignment (elements), channel≠1,3,4 | width limits, channel=1,3,4 | width limits, channel≠1,3,4 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| RV1103B/RV1106B | int8 | 4 | uint8 | NPU | 8 | 1 | A | Unrestricted |
| RV1103B/RV1106B | int8 | 4 | int8 | NPU | 8 | 1 | A | Unrestricted |

For each convolution type, width/kernel_h/kernel_w must satisfy both conditions below. N must be an integer from 1 to 7; convolutions outside that range are unsupported. N is computed below. The image spells dilation_kernel_h/w differently from dilated_kernel_h/w in the last chapter; the image spelling is preserved.

| Condition | Formula |
| --- | --- |
| A (1) | width &#42; dilation&#95;kernel&#95;h &lt;= 2048 &#42; N |
| A (2) | width &lt;= 4096 |
| A / Convolution | N = 8 - MAX(CEIL((dilation&#95;kernel&#95;h &#42; dilation&#95;kernel&#95;w) / 128), 2) |
| A / Depthwise Convolution | N = 8 - CEIL((dilation&#95;kernel&#95;h &#42; dilation&#95;kernel&#95;w) / 4096) |
| A / ConvTranspose/Deconvolution | N = 8 - MAX(CEIL((dilation&#95;kernel&#95;h &#42; dilation&#95;kernel&#95;w) / 128), 2) |

> The original header refers to note 9, but the supplied input notes list only 1–8. Note 9 was not found and is not invented.



<!-- PDF p.339 -->

### 5.2 Model output restrictions


- (1) For an NHWC output tensor, alignment is required when output conversion is performed by the NPU; CPU conversion has no alignment requirement.
- (2) Output precision int8/float16 denotes the original output data type of the model’s last layer.
- (3) For NCHW output implemented on the NPU using a zero-copy interface, allocate output memory according to the queried size.
- (4) For NC1HWC2 output, allocate output memory according to the queried size.


<!-- PDF p.339 -->

#### 5.2.1 RK3566/RK3568



| Chip platform | Model output precision | Output dimensions | Output Layout setting | Channel alignment requirement | H&#42;W alignment requirement |
| --- | --- | --- | --- | --- | --- |
| RK3566<br>/RK3568 | int8 | 4 dimensions | NCHW | None | None |
| RK3566<br>/RK3568 | int8 | 4 dimensions | NHWC | Aligned to 8 | None |
| RK3566<br>/RK3568 | int8 | 4 dimensions | NC1HWC2 | Last layer convolution-type: aligned to 16; last layer non-convolution-type: aligned to 8. | H&#42;W aligned to 4 |
| RK3566<br>/RK3568 | int8 | 4 dimensions | UNDEFINE | None | None |
| RK3566<br>/RK3568 | float16 | 4 dimensions | NCHW | None | None |
| RK3566<br>/RK3568 | float16 | 4 dimensions | NHWC | Aligned to 4 |  |
| RK3566<br>/RK3568 | float16 | 4 dimensions | NC1HWC2 | Last layer convolution-type: aligned to 8; last layer non-convolution-type: aligned to 4. | H&#42;W aligned to 4 |
| RK3566<br>/RK3568 | float16 | 4 dimensions | UNDEFINE | None | None |
| RK3566<br>/RK3568 | Unrestricted | Not 4 dimensions | UNDEFINE | None | None |



<!-- PDF p.339 -->

#### 5.2.2 RK3588



| Chip platform | Model output precision | Output dimensions | Output Layout setting | Channel alignment requirement | H&#42;W alignment requirement |
| --- | --- | --- | --- | --- | --- |
| RK3588 | int8 | 4 dimensions | NCHW | None | None |
| RK3588 | int8 | 4 dimensions | NHWC | Aligned to 16 | None |
| RK3588 | int8 | 4 dimensions | NC1HWC2 | Last layer convolution-type: aligned to 32; last layer non-convolution-type: aligned to 16. | H&#42;W aligned to 4 |
| RK3588 | int8 | 4 dimensions | UNDEFINE | None | None |
| RK3588 | float16 | 4 dimensions | NCHW | None | None |
| RK3588 | float16 | 4 dimensions | NHWC | Aligned to 8 | None |
| RK3588 | float16 | 4 dimensions | NC1HWC2 | Last layer convolution-type: aligned to 16; last layer non-convolution-type: aligned to 8. | H&#42;W aligned to 4 |
| RK3588 | float16 | 4 dimensions | UNDEFINE | None | None |
| RK3588 | Unrestricted | Not 4 dimensions | UNDEFINE | None | None |



<!-- PDF p.340 -->

#### 5.2.3 RV1103/RV1106



| Chip platform | Model output precision | Output dimensions | Output Layout setting | Channel alignment requirement | H&#42;W alignment requirement |
| --- | --- | --- | --- | --- | --- |
| RV1103<br>/RV1106 | int8 | 4 dimensions | NC1HWC2 | Last layer convolution-type: aligned to 32; last layer non-convolution-type: aligned to 16. | H&#42;W aligned to 4 |
| RV1103<br>/RV1106 | int8 | 4 dimensions | NHWC | None | None |



<!-- PDF p.340 -->

#### 5.2.4 RK3562



| Chip platform | Model output precision | Output dimensions | Output Layout setting | Channel alignment requirement | H&#42;W alignment requirement |
| --- | --- | --- | --- | --- | --- |
| RK3562 | int8 | 4 dimensions | NCHW | None | None |
| RK3562 | int8 | 4 dimensions | NHWC | None | None |
| RK3562 | int8 | 4 dimensions | NC1HWC2 | Last layer convolution-type: aligned to 32; last layer non-convolution-type: aligned to 16. | H&#42;W aligned to 4 |
| RK3562 | int8 | 4 dimensions | UNDEFINE | None | None |
| RK3562 | float16 | 4 dimensions | NCHW | None | None |
| RK3562 | float16 | 4 dimensions | NHWC | None | None |
| RK3562 | float16 | 4 dimensions | NC1HWC2 | Last layer convolution-type: aligned to 16; last layer non-convolution-type: aligned to 8. | H&#42;W aligned to 4 |
| RK3562 | float16 | 4 dimensions | UNDEFINE | None | None |
| RK3562 | Unrestricted | Not 4 dimensions | UNDEFINE | None | None |



<!-- PDF p.340 -->

#### 5.2.5 RK3576/RV1126B



| Chip platform | Model output precision | Output dimensions | Output Layout setting | Channel alignment requirement | H&#42;W alignment requirement |
| --- | --- | --- | --- | --- | --- |
| RK3576/<br>RV1126B | int8 | 4 dimensions | NCHW | None | None |
| RK3576/<br>RV1126B | int8 | 4 dimensions | NHWC | None | None |
| RK3576/<br>RV1126B | int8 | 4 dimensions | NC1HWC2 | Last layer convolution-type: aligned to 32; last layer non-convolution-type: aligned to 16. | H&#42;W aligned to 4 |
| RK3576/<br>RV1126B | int8 | 4 dimensions | UNDEFINE | None | None |
| RK3576/<br>RV1126B | float16 | 4 dimensions | NCHW | None | None |
| RK3576/<br>RV1126B | float16 | 4 dimensions | NHWC | None | None |
| RK3576/<br>RV1126B | float16 | 4 dimensions | NC1HWC2 | Last layer convolution-type: aligned to 16; last layer non-convolution-type: aligned to 8. | H&#42;W aligned to 4 |
| RK3576/<br>RV1126B | float16 | 4 dimensions | UNDEFINE | None | None |
| RK3576/<br>RV1126B | Unrestricted | Not 4 dimensions | UNDEFINE | None | None |



<!-- PDF p.341 -->

#### 5.2.6 RK2118



| Chip platform | Model output precision | Output dimensions | Output Layout setting | Channel alignment requirement | H&#42;W alignment requirement |
| --- | --- | --- | --- | --- | --- |
| RK2118 | float16 | 4 dimensions | NC1HWC2 | Last layer convolution-type: aligned to 8; last layer non-convolution-type: aligned to 4. | H&#42;W aligned to 4 |
| RK2118 | float16 | 4 dimensions | NHWC | None | None |
| RK2118 | float16 | Not 4 dimensions | UNDEFINE | None | None |



<!-- PDF p.341 -->

#### 5.2.7 RV1103B/RV1106B



| Chip platform | Model output precision | Output dimensions | Output Layout setting | Channel alignment requirement | H&#42;W alignment requirement |
| --- | --- | --- | --- | --- | --- |
| RV1103B/<br>RV1106B | int8 | 4 dimensions | NC1HWC2 | Last layer convolution-type: aligned to 8; last layer non-convolution-type: aligned to 8. | H&#42;W aligned to 4 |
| RV1103B/<br>RV1106B | int8 | 4 dimensions | NHWC | None | None |



<!-- PDF p.343 -->

## Special notes



**Contents**


- Special notes
  - dilated&#95;kernel&#95;h
  - dilated&#95;kernel&#95;w


<!-- PDF p.343 -->

### 6.1 dilated&#95;kernel&#95;h



```text
dilated_kernel_h=kernel_h*dilations_h‑dilations_h+1
```



<!-- PDF p.343 -->

### 6.2 dilated&#95;kernel&#95;w



```text
dilated_kernel_w=kernel_w*dilations_w‑dilations_w+1
```



{% endraw %}
