---
title: "RKNN2 V2.5.0 · RV1103B/RV1106B：循环网络、运算与池化"
description: "RKNN2 V2.5.0 · RV1103B/RV1106B：循环网络、运算与池化 · 完整算子参数与限制，按 V2.5.0 原稿整理。"
excerpt: "RKNN2 V2.5.0 · RV1103B/RV1106B：循环网络、运算与池化 · 完整算子参数与限制，按 V2.5.0 原稿整理。"
translation_key: "rknn-v250-operators-rv1103b-rv1106b-recurrent-pooling"
slug: "rknn-v250-operators-rv1103b-rv1106b-recurrent-pooling"
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

原稿页码: CN 324–331; EN 334–341.

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

[RKNN2 V2.5.0 · RV1103B/RV1106B：基础与卷积](/zh/articles/rknn-v250-operators-rv1103b-rv1106b-convolution/)

**RKNN2 V2.5.0 · RV1103B/RV1106B：循环网络、运算与池化**

[RKNN2 V2.5.0 · RV1103B/RV1106B：形状、切片与转置](/zh/articles/rknn-v250-operators-rv1103b-rv1106b-shape-indexing/)

[RKNN2 V2.5.0 · RV1103B/RV1106B：激活、归一化与扩展算子](/zh/articles/rknn-v250-operators-rv1103b-rv1106b-activations-extensions/)

[RKNN2 V2.5.0 · CPU 算子支持与约束](/zh/articles/rknn-v250-operators-cpu/)

[RKNN2 V2.5.0 · GPU 算子支持与约束](/zh/articles/rknn-v250-operators-gpu/)

[RKNN2 V2.5.0 · 模型输入输出、对齐与卷积限制](/zh/articles/rknn-v250-operators-model-io/)

</details>

{% raw %}

## Div

执行元素级二进制除法(C=A/B),支持多向Numpy样式的广播

### 输入列表

- A:T1,T2
    - shape:\[batch,channel,height,width\]
    - 量化支持
        - per-layer
    - 广播支持
        - \[b,c,1,1\]
        - \[scalar\]
- B:T1,T2
    - shape:\[batch,channel,height,width\]
    - 量化支持
        - per-layer
    - 广播支持
        - \[b,c,1,1\]
        - \[scalar\]

### 输出列表

- C:T1
    - shape:\[batch,channel,height,width\]
    - 量化支持
        - per-layer

### 数据类型约束

- T1:float16(Tensor)
- T2:float(constTensor)

## Expand

根据给定的 shape 和广播规则广播输入张量。广播规则类似于 numpy.array(input) \*numpy.ones(shape):维度右对齐;两个对应维度必须具有相同的值,或者其中一个等于1

### 输入列表

- input:T1
    - shape:\[batch,channel,height,width\]
    - 量化支持
        - per-layer
- shape:T2
    - shape:\[batch,channel,height,width\]

### 输出列表

- output:T1
    - shape:\[batch,channel,height,width\]
    - 量化支持
        - per-layer

### 数据类型约束

- T1:int8(Tensor)
- T2:int64(Tensor)

广播约束

- \[b,c,1,w\]-&gt;\[b,c,h,w\],h∈\[1,8192\]
- \[b,1,1,w\]-&gt;\[b,c,h,w\],h∈\[1,8192\]
- \[b,c,h,1\]-&gt;\[b,c,h,w\],w ∈\[1,8192\]
- \[b,1,h,1\]-&gt;\[b,c,h,w\],w ∈\[1,8192\]
- \[b,c,1,1\]-&gt;\[b,c,h,w\],h∈\[1,8192\],w ∈\[1,8192\]

## Max

计算输入张量的元素级最大值

### 输入列表

- A:T1
    - shape:\[batch,channel,height,width\]
    - 量化支持
        - per-layer
    - 广播支持
        - 支持任意维度广播操作
        - 广播约束同Expand算子
- B:T1
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
        - per-layer/per-channel

### 数据类型约束

- T1:int8(Tensor)

### 其他支持

- 多核联合:暂不支持

## Mul

执行元素级二进制乘法(C=A\*B),支持多向Numpy样式的广播

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

## MulRelu

Mul与Relu融合计算,C=Relu(A\*B)

### 输入列表

- 同Mul

### 输出列表

- 同Mul

### 其他支持

- 多核联合:支持

## Pad

给定一个包含要填充的数据的张量(data),包含轴的开始和结束填充数值的张量(pads),模式(mode),常 量数值(constant\_value),生成一个填充张量(output)

### 输入列表

- data:T1
    - shape:\[batch,channel,height,width\]
    - 量化支持
        - per-layer
- pads:T2
    - shape : \[batch\_begin, channel\_begin, height\_begin, width\_begin, batch\_end, channel\_end,height\_end,width\_end\]
- constant\_value(optional):T3
    - shape:\[1\]
    - 量化支持
        - per-layer

### 输出列表

- output:T1
    - shape:\[batch,channel,height,width\]
    - 量化支持
        - per-layer

### 数据类型约束

- T1:int8(Tensor)
- T2:int64(Tensor)
- T3:float(Scalar),int8(Scalar),float16(Scalar)

### 属性列表

- mode:string(默认值constant)
    - 支持模式:constant,reflect
        - constant无限制
        - reflectchannel∈(0,8192\],height∈(0,8192\],width∈(0,8176\]

### 其他支持

- 多核联合:尚不支持

## MaxPool

MaxPool消耗输入张量X并根据内核大小、步幅大小和pad长度在张量上应用最大池化。最大池化包括 根据内核大小计算输入张量子集的所有值的最大值,并将数据下采样到输出张量Y中以进行进一步处理。 输出空间形状的计算方式有所不同,具体取决于是否使用显式填充(在使用pads的情况下)或使用自 动填充(在使用auto\_pad的情况下)。仅使用显式填充

### 输入列表

- input:T1
    - shape:\[batch,channel,height,width\]
        - channel∈(0,8192\]
        - height∈(0,7\]
        - width∈(0,7\]

### 输出列表

- output:T1
    - shape:\[batch,channel,height,width\]

### 属性列表

- kernel\_shape:int64(kernel\_h,kernel\_w)
    - kernel\_h∈(0,7\]
    - kernel\_w∈(0,7\]
- auto\_pad:string
    - pad的方式:仅支持NOTSET
- ceil\_mode:int64
    - 使用ceil或floor的方式计算输出的shape:不支持
- strides:int64(strides\_h,strides\_w)
    - strides\_h∈(0,8\]
    - strides\_w∈(0,8\]
- count\_include\_pad:int64\[\]
    - count\_include\_pad是否包含pad数值进行计算:1
- pad:int64(pad\_top,pad\_left,pad\_bottom,pad\_right)
    - pad\_top∈\[0,7\]
    - pad\_left∈\[0,7\]
    - pad\_bottom∈\[0,7\]
    - pad\_right∈\[0,7\]

### 数据类型约束

- T1:int8(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)

## GlobalMaxPool

GlobalMaxPool使用输入张量X并对同一通道中的值应用最大池化。这相当于MaxPool的kernel\_shape 大小等于input的空间维度。

### 输入列表

- input:T1
    - shape:\[batch,channel,height,width\]
        - channel∈(0,8192\]
        - height∈(0,7\]
        - width∈(0,7\]

### 输出列表

- output:T1
    - shape:\[batch,channel,height,width\]

### 属性列表

- kernel\_shape:int64(kernel\_h,kernel\_w)
    - kernel\_h∈(0,7\]
    - kernel\_w∈(0,7\]
- auto\_pad:string
    - pad的方式:仅支持NOTSET
- ceil\_mode:int64
    - 使用ceil或floor的方式计算输出的shape:不支持
- strides:int64(strides\_h,strides\_w)
    - strides\_h∈(0,8\]
    - strides\_w∈(0,8\]
- count\_include\_pad:int64\[\]
    - count\_include\_pad是否包含pad数值进行计算:1
- pad:int64(pad\_top,pad\_left,pad\_bottom,pad\_right)
    - pad\_top∈\[0,7\]
    - pad\_left∈\[0,7\]
    - pad\_bottom∈\[0,7\]
    - pad\_right∈\[0,7\]

### 数据类型约束

- T1:int8(Tensor)
- T2:float(Tensor)
- T3:float(Scalar)

## AveragePool

- 不支持(工具端转换成卷积实现)

## GlobalAveragePool

- 不支持(工具端转换成卷积实现)
{% endraw %}
