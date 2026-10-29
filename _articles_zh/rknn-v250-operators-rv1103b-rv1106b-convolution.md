---
title: "RKNN2 V2.5.0 · RV1103B/RV1106B：基础与卷积"
description: "RKNN2 V2.5.0 · RV1103B/RV1106B：基础与卷积 · 完整算子参数与限制，按 V2.5.0 原稿整理。"
excerpt: "RKNN2 V2.5.0 · RV1103B/RV1106B：基础与卷积 · 完整算子参数与限制，按 V2.5.0 原稿整理。"
translation_key: "rknn-v250-operators-rv1103b-rv1106b-convolution"
slug: "rknn-v250-operators-rv1103b-rv1106b-convolution"
lang: "zh"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "NPU", "V2.5.0", "RV1103B/RV1106B"]
---

本文为 RKNN2 V2.5.0 对应平台的算子参考，供 ArmSoM 开发者选型与模型适配时查阅。不能据此认定所有 ArmSoM 板卡均支持这些算子；需按板卡 SoC、实际 Toolkit2、Runtime、NPU 驱动及 BSP 版本核对。原稿没有统一指定适用 Linux 内核，本文未进行 ArmSoM 硬件验证。

来源：本地中英文《RKNN2 算子支持与约束参考》V2.5.0。中文依中文稿；英俄德依英文稿。两稿分别为 374/384 页。各平台限制独立保留，不将一个平台的支持结论推广到另一个平台。英文稿 I/O 原图与输出表仍含中文，本文保留其来源并另附可编辑的本地化表格。ConvTranpose 等原稿拼写及 LSTM/GRU 原始公式保留；不要将本文公式视为 SDK 实现修正。

原稿页码: CN 317–324; EN 326–334.

[Rockchip RKNN2](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

<details markdown="1">
<summary>算子参考系列目录</summary>

[RKNN2 V2.5.0 · RK3566/RK3568：基础与卷积](/zh/articles/rknn-v250-operators-rk3566-rk3568-convolution/)

[RKNN2 V2.5.0 · RK3566/RK3568：循环网络、运算与池化](/zh/articles/rknn-v250-operators-rk3566-rk3568-recurrent-pooling/)

[RKNN2 V2.5.0 · RK3566/RK3568：形状、切片与转置](/zh/articles/rknn-v250-operators-rk3566-rk3568-shape-indexing/)

[RKNN2 V2.5.0 · RK3566/RK3568：激活、归一化与扩展算子](/zh/articles/rknn-v250-operators-rk3566-rk3568-activations-extensions/)

[RKNN2 V2.5.0 · RK3588：基础与卷积](/zh/articles/rknn-v250-operators-rk3588-convolution/)

[RKNN2 V2.5.0 · RK3588：循环网络、运算与池化](/zh/articles/rknn-v250-operators-rk3588-recurrent-pooling/)

[RKNN2 V2.5.0 · RK3588：形状、切片与转置](/zh/articles/rknn-v250-operators-rk3588-shape-indexing/)

[RKNN2 V2.5.0 · RK3588：激活、归一化与扩展算子](/zh/articles/rknn-v250-operators-rk3588-activations-extensions/)

[RKNN2 V2.5.0 · RK3562：基础与卷积](/zh/articles/rknn-v250-operators-rk3562-convolution/)

[RKNN2 V2.5.0 · RK3562：循环网络、运算与池化](/zh/articles/rknn-v250-operators-rk3562-recurrent-pooling/)

[RKNN2 V2.5.0 · RK3562：形状、切片与转置](/zh/articles/rknn-v250-operators-rk3562-shape-indexing/)

[RKNN2 V2.5.0 · RK3562：激活、归一化与扩展算子](/zh/articles/rknn-v250-operators-rk3562-activations-extensions/)

[RKNN2 V2.5.0 · RV1103/RV1106：基础与卷积](/zh/articles/rknn-v250-operators-rv1103-rv1106-convolution/)

[RKNN2 V2.5.0 · RV1103/RV1106：循环网络、运算与池化](/zh/articles/rknn-v250-operators-rv1103-rv1106-recurrent-pooling/)

[RKNN2 V2.5.0 · RV1103/RV1106：形状、切片与转置](/zh/articles/rknn-v250-operators-rv1103-rv1106-shape-indexing/)

[RKNN2 V2.5.0 · RV1103/RV1106：激活、归一化与扩展算子](/zh/articles/rknn-v250-operators-rv1103-rv1106-activations-extensions/)

[RKNN2 V2.5.0 · RK3576/RV1126B：基础与卷积](/zh/articles/rknn-v250-operators-rk3576-rv1126b-convolution/)

[RKNN2 V2.5.0 · RK3576/RV1126B：循环网络、运算与池化](/zh/articles/rknn-v250-operators-rk3576-rv1126b-recurrent-pooling/)

[RKNN2 V2.5.0 · RK3576/RV1126B：形状、切片与转置](/zh/articles/rknn-v250-operators-rk3576-rv1126b-shape-indexing/)

[RKNN2 V2.5.0 · RK3576/RV1126B：激活、归一化与扩展算子](/zh/articles/rknn-v250-operators-rk3576-rv1126b-activations-extensions/)

[RKNN2 V2.5.0 · RK2118：基础与卷积](/zh/articles/rknn-v250-operators-rk2118-convolution/)

[RKNN2 V2.5.0 · RK2118：循环网络、运算与池化](/zh/articles/rknn-v250-operators-rk2118-recurrent-pooling/)

[RKNN2 V2.5.0 · RK2118：形状、切片与转置](/zh/articles/rknn-v250-operators-rk2118-shape-indexing/)

[RKNN2 V2.5.0 · RK2118：激活、归一化与扩展算子](/zh/articles/rknn-v250-operators-rk2118-activations-extensions/)

**RKNN2 V2.5.0 · RV1103B/RV1106B：基础与卷积**

[RKNN2 V2.5.0 · RV1103B/RV1106B：循环网络、运算与池化](/zh/articles/rknn-v250-operators-rv1103b-rv1106b-recurrent-pooling/)

[RKNN2 V2.5.0 · RV1103B/RV1106B：形状、切片与转置](/zh/articles/rknn-v250-operators-rv1103b-rv1106b-shape-indexing/)

[RKNN2 V2.5.0 · RV1103B/RV1106B：激活、归一化与扩展算子](/zh/articles/rknn-v250-operators-rv1103b-rv1106b-activations-extensions/)

[RKNN2 V2.5.0 · CPU 算子支持与约束](/zh/articles/rknn-v250-operators-cpu/)

[RKNN2 V2.5.0 · GPU 算子支持与约束](/zh/articles/rknn-v250-operators-gpu/)

[RKNN2 V2.5.0 · 模型输入输出、对齐与卷积限制](/zh/articles/rknn-v250-operators-model-io/)

</details>

{% raw %}

## RV1103B/RV1106B

## Add

执行元素级二进制加法(C=A+B),支持多向Numpy样式的广播

### 输入列表

- A:T1,T2
    - shape:\[batch,channel,height,width\]
    - 量化支持
        - per-layer
    - 广播支持
        - 支持任意维度广播操作
        - 广播约束同Expand算子
- B:T1,T2
    - shape:\[batch,channel,height,width\]
    - 量化支持
        - per-layer
    - 广播支持
        - 支持任意维度广播操作
        - 广播约束同Expand算子

### 输出列表

- C:T1
    - shape:\[batch,channel,height,width\]
    - 量化支持
        - per-layer

### 数据类型约束

- T1:int8(Tensor)
- T2:float(constTensor)

## AddRelu

Add与Relu融合计算,C=Relu(A+B)

### 输入列表

- 同Add

### 输出列表

- 同Add

### 其他支持

- 多核联合:支持

## BatchNormalization

按照论文https://arxiv.org/abs/1502.03167中的描述对输入张量进行批量归一化计算

### 输入列表

- input:T1
    - shape:\[batch,channel,height,width\]
    - 量化支持
        - per-layer

### 输出列表

- output:T1
    - shape:\[batch,channel,height,width\]
    - 量化支持
        - per-layer

### 数据类型约束

- T1:int8(Tensor)

### 属性列表

- epsilon:float(默认值=1e-5)
    - 除以标准差时加上防止除0的实数
    - epsilon∈(0,∞\]
- momentum:float
    - 训练时的滑动平均参数

## Concat

将一系列向量在axis指定的方向上组合成一个向量,所有向量除axis指定的方向外大小必须相同

### 输入列表

- input\_tensor:T
    - shape:\[batch,channel,height,width\]
    - 量化支持
        - per-layer

### 输出列表

- output:T
    - shape:\[batch,channel,height,width\]
    - 量化支持
        - per-layer

### 数据类型约束

- T:int8(Tensor)

### 属性列表

- axisint64
    - axis∈{0,1,2,3}

## Convolution

卷积

### 输入列表

- input\_tensor:T1
    - shape:\[batch,channel,height,width\]
        - width: 当dilated\_kernel\_h&gt;1时,width&lt;16383。此外,对首层输入width存在限制,详见模型输入说明。
    - 量化支持
        - per-layer
- weight:T1
    - shape:\[output\_channel,input\_channel,kernel\_h,kernel\_w\]
        - kernel\_h∈\[1,31\]
        - kernel\_w∈\[1,31\]
    - 量化支持
        - per-layer
        - per-channel

### 输出列表

- output:T1
    - shape:\[batch,channel,height,width\]
    - 量化支持
        - per-layer

### 属性列表

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

### 数据类型约束

- T1:int8(Tensor)

## Depthwise Convolution

深度可分离卷积

### 输入列表

- input\_tensor:T1
    - shape:\[batch,channel,height,width\]
        - width: 当dilated\_kernel\_h&gt;1时,width&lt;16383。此外,对首层输入width存在限制,详见模型输入说明。
    - 量化支持
        - per-layer
- weight:T1
    - shape:\[output\_channel,input\_channel,kernel\_h,kernel\_w\]
        - kernel\_h∈\[1,8\]
        - kernel\_w∈\[1,8\]
    - 量化支持
        - per-layer
        - per-channel

### 输出列表

- output:T1
    - shape:\[batch,channel,height,width\]
    - 量化支持
        - per-layer

### 属性列表

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

### 数据类型约束

- T1:int8(Tensor)

## ConvolutionRelu

Convolution与Relu融合计算,Output=Relu(Conv(Input)) 说明及规格限制同Convolution

## ConvolutionClip

Convolution与Clip融合计算,Output=Clip(Conv(Input)) 说明及规格限制同Convolution

## ConvolutionPRelu/LeakyRelu

Convolution 与 PRelu/LeakyRelu 融合计算, Output = PRelu(Conv(Input)) 或者 Output =LeakyRelu(Conv(Input)) 说明及规格限制同Convolution

## ConvolutionAdd

Convolution与Add融合计算,Output=Add(Conv(Input0),Input1) 说明及规格限制同Convolution

## ConvolutionSigmoid

Convolution与Sigmoid融合计算,Output=Sigmoid(Conv(Input)) 说明及规格限制同Convolution

## ConvolutionTanh

Convolution与Tanh融合计算,Output=Tanh(Conv(Input)) 说明及规格限制同Convolution

## ConvolutionSoftplus

Convolution与Softplus融合计算,Output=Softplus(Conv(Input)) 说明及规格限制同Convolution

## ConvolutionHardSigmoid

Convolution与HardSigmoid融合计算,Output=HardSigmoid(Conv(Input)) 说明及规格限制同Convolution

## ConvolutionHardSwish

Convolution与HardSwish融合计算,Output=HardSwish(Conv(Input)) 说明及规格限制同Convolution

## ConvolutionElu

Convolution与Elu融合计算,Output=Elu(Conv(Input)) 说明及规格限制同Convolution

## ConvolutionSwish

Convolution与Swish融合计算,Output=Swish(Conv(Input)) 说明及规格限制同Convolution

## ConvolutionMish

Convolution与Mish融合计算,Output=Mish(Conv(Input)) 说明及规格限制同Convolution

## ConvTranspose

转置卷积

### 输入列表

- input\_tensor:T1
    - shape:\[batch,channel,height,width\]
        - width: 当dilated\_kernel\_h&gt;1时,width&lt;16383。此外,对首层输入width存在限制,详见模型输入说明。
- 量化支持
    - per-layer
- weight:T1
    - shape:\[output\_channel,input\_channel,kernel\_h,kernel\_w\]
        - kernel\_h∈\[1,31\]
        - kernel\_w∈\[1,31\]
    - 量化支持
        - per-layer
        - per-channel

### 输出列表

- output:T1
    - shape:\[batch,channel,height,width\]
    - 量化支持
        - per-layer

### 属性列表

- strides:int(strides\_h,strides\_w)
    - stride\_h∈\[1,8\]
    - stride\_w∈\[1,8\]
- pads:int(pads\_top,pads\_left,pads\_bottom,pads\_right) 设置pad时注意: 不支持kernel\_hdilations\_h-dilations\_h-pads\_top&lt;0 不支持kernel\_wdilations\_w-dilations\_w-pads\_left&lt;0 不支持stride\_h(height-1)-pads\_top+1&lt;output\_h 不支持stride\_w(width-1)-pads\_left+1&lt;output\_w
    - pads\_top∈\[0,15\]
    - pads\_left∈\[0,15\]
    - pads\_bottom∈\[0,15\]
    - pads\_right∈\[0,15\]
- group:int
    - group:仅支持1,当且仅当num\_input=num\_output时支持num\_output
- dilations:int(dilations\_h,dilations\_w)
    - dilations\_h∈\[1,32\]
    - dilations\_w∈\[1,32\]
    - 当dilation不等于(1,1)时,只支持kernel=(1,1)

### 数据类型约束

- T1:int8(Tensor)

## ConvTranposeRelu

ConvTranpose与Relu融合计算,Output=Relu(ConvTranpose(Input)) 说明及规格限制同ConvTranspose

## ConvTranposeClip

ConvTranpose与Clip融合计算,Output=Clip(ConvTranpose(Input)) 说明及规格限制同ConvTranspose

## ConvTranposePRelu/LeakyRelu

ConvTranpose与PRelu/LeakyRelu融合计算,Output=PRelu(ConvTranpose(Input))或者Output=LeakyRelu(ConvTranpose(Input)) 说明及规格限制同ConvTranspose

{% endraw %}
