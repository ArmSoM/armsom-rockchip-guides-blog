---
title: "RKNN2 V2.5.0 · RK3566/RK3568：激活、归一化与扩展算子"
description: "RKNN2 V2.5.0 · RK3566/RK3568：激活、归一化与扩展算子 · 完整算子参数与限制，按 V2.5.0 原稿整理。"
excerpt: "RKNN2 V2.5.0 · RK3566/RK3568：激活、归一化与扩展算子 · 完整算子参数与限制，按 V2.5.0 原稿整理。"
translation_key: "rknn-v250-operators-rk3566-rk3568-activations-extensions"
slug: "rknn-v250-operators-rk3566-rk3568-activations-extensions"
lang: "zh"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "NPU", "V2.5.0", "RK3566/RK3568"]
---

本文为 RKNN2 V2.5.0 对应平台的算子参考，供 ArmSoM 开发者选型与模型适配时查阅。不能据此认定所有 ArmSoM 板卡均支持这些算子；需按板卡 SoC、实际 Toolkit2、Runtime、NPU 驱动及 BSP 版本核对。原稿没有统一指定适用 Linux 内核，本文未进行 ArmSoM 硬件验证。

来源：本地中英文《RKNN2 算子支持与约束参考》V2.5.0。中文依中文稿；英俄德依英文稿。两稿分别为 374/384 页。各平台限制独立保留，不将一个平台的支持结论推广到另一个平台。英文稿 I/O 原图与输出表仍含中文，本文保留其来源并另附可编辑的本地化表格。ConvTranpose 等原稿拼写及 LSTM/GRU 原始公式保留；不要将本文公式视为 SDK 实现修正。

原稿页码: CN 58–69; EN 60–71.

[Rockchip RKNN2](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

<details markdown="1">
<summary>算子参考系列目录</summary>

[RKNN2 V2.5.0 · RK3566/RK3568：基础与卷积](/zh/articles/rknn-v250-operators-rk3566-rk3568-convolution/)

[RKNN2 V2.5.0 · RK3566/RK3568：循环网络、运算与池化](/zh/articles/rknn-v250-operators-rk3566-rk3568-recurrent-pooling/)

[RKNN2 V2.5.0 · RK3566/RK3568：形状、切片与转置](/zh/articles/rknn-v250-operators-rk3566-rk3568-shape-indexing/)

**RKNN2 V2.5.0 · RK3566/RK3568：激活、归一化与扩展算子**

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

[RKNN2 V2.5.0 · RV1103B/RV1106B：循环网络、运算与池化](/zh/articles/rknn-v250-operators-rv1103b-rv1106b-recurrent-pooling/)

[RKNN2 V2.5.0 · RV1103B/RV1106B：形状、切片与转置](/zh/articles/rknn-v250-operators-rv1103b-rv1106b-shape-indexing/)

[RKNN2 V2.5.0 · RV1103B/RV1106B：激活、归一化与扩展算子](/zh/articles/rknn-v250-operators-rv1103b-rv1106b-activations-extensions/)

[RKNN2 V2.5.0 · CPU 算子支持与约束](/zh/articles/rknn-v250-operators-cpu/)

[RKNN2 V2.5.0 · GPU 算子支持与约束](/zh/articles/rknn-v250-operators-gpu/)

[RKNN2 V2.5.0 · 模型输入输出、对齐与卷积限制](/zh/articles/rknn-v250-operators-model-io/)

</details>

{% raw %}

## Sigmoid

给定输入张量,函数y=1/(1+exp(-x))按元素应用于输入张量,得到输出张量

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

- T1:int8(Tensor),float16(Tensor)

## Tanh

计算给定输入张量单元的双曲正切

### 输入列表

- X:T1
    - shape:\[batch,channel,height,width\]
    - 量化支持:per-layer

### 输出列表

- Y:T1
    - shape:\[batch,channel,height,width\]
    - 量化支持:per-layer

### 数据类型约束

- T1:int8(Tensor),float16(Tensor)

## Softplus

按元素应用Softplus函数,y=ln(exp(x)+1)

### 输入列表

- X:T1
    - shape:\[batch,channel,height,width\]
    - 量化支持:per-layer

### 输出列表

- Y:T1
    - shape:\[batch,channel,height,width\]
    - 量化支持:per-layer

### 数据类型约束

- T1:int8(Tensor),float16(Tensor)

## HardSigmoid

给定输入张量,函数y=max(0,min(1,alpha\*x+beta))按元素应用于输入张量,得到输出张量,这里alpha=1/6,beta=0.5

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

- T1:int8(Tensor),float16(Tensor)

## HardSwish

按元素应用 HardSwish 函数, y = x \* max(0, min(1, alpha \* x + beta)) = x \* HardSigmoid(x),这里alpha=1/6,beta=0.5

### 输入列表

- X:T1
    - shape:\[batch,channel,height,width\]
    - 量化支持:per-layer

### 输出列表

- Y:T1
    - shape:\[batch,channel,height,width\]
    - 量化支持:per-layer

### 数据类型约束

- T1:int8(Tensor),float16(Tensor)

## Elu

给定输入张量,函数f(x)=alpha\*(exp(x)-1.)forx&lt;0,f(x)=xforx&gt;=0按元素应用于输入张量,得到 输出张量,这里alpha=1

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

- T1:int8(Tensor),float16(Tensor)

## exSwish

按元素应用Sigmoid线性单元函数,Swish函数也称为SiLU函数,y=x\*sigmoid(x)

### 输入列表

- X:T1
    - shape:\[batch,channel,height,width\]
    - 量化支持:per-layer

### 输出列表

- Y:T1
    - shape:\[batch,channel,height,width\]
    - 量化支持:per-layer

### 数据类型约束

- T1:int8(Tensor),float16(Tensor)

## exMish

给定输入张量,函数mish(x)=xtanh(softplus(x))=xtanh(ln(1+e^{x}))按元素应用于输入张量,得 到输出张量

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

- T1:int8(Tensor),float16(Tensor)

## exGelu

给定输入张量，函数 y=x\*Φ(x) 按元素应用于输入张量，得到输出张量。当 Φ(x) 设置为 tanh 时：y=0.5\*x\*(1+Tanh(sqrt(2/π)\*(x+0.044715\*x^3)))。

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

- T1:int8(Tensor),float16(Tensor)

## exSwooshR

给定输入张量,按论文https://arxiv.org/abs/2310.11230给定的下列函数,按元素应用于输入张量,得 到输出张量 SwooshR(x)=log(1+exp(x-1))-0.08x-0.313261687

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

- T1:int8(Tensor),float16(Tensor)

## exSwooshL

给定输入张量,按论文https://arxiv.org/abs/2310.11230给定的下列函数,按元素应用于输入张量,得 到输出张量 SwooshL(x)=log(1+exp(x-4))-0.08x-0.035

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

- T1:int8(Tensor),float16(Tensor)

## Where

根据mask\_tensor获取x\_tensor或y\_tensor的值,当mask\_tensor位置为True时,取x\_tensor对 应位置的值,否则取y\_tensor的值。

### 输入列表

- mask\_tensor:T1
    - shape:\[batch,channel,height,width\]
    - 广播支持
        - 支持任意维度广播操作
    - 广播约束
        - 广播约束同Expand算子
- x\_tensor:\*T2
    - shape:\[batch,channel,height,width\]
    - 量化支持
        - per-layer
    - 广播支持
        - 支持任意维度广播操作
    - 广播约束
        - 广播约束同Expand算子
- y\_tensor:T1
    - shape:\[batch,channel,height,width\]
    - 量化支持
        - per-layer
    - 广播支持
        - 支持任意维度广播操作
    - 广播约束
        - 广播约束同Expand算子

### 输出列表

- output:T2
    - shape:\[batch,channel,height,width\]
    - 量化支持
        - per-layer

### 数据类型约束

- T1:bool(Tensor)
- T2:int8(Tensor),float16(Tensor)

## exGlu

门控线性单元(GatedLinearUnit)函数,其中a是输入矩阵的前一半,b是后一半 GLU(a,b)=a⊗σ(b)

### 输入列表

- Input:T1
    - shape:\[batch,channel,height,width\]
    - 量化支持:per-layer

### 输出列表

- Output:T1
    - shape:\[batch,channel/2,height,width\]
    - 量化支持:per-layer

### 数据类型约束

- T1:int8(Tensor),float16(Tensor)

### 属性列表

- axis:int(默认值=1)
    - 分割输入的维度
    - 约束:仅支持1

## exMatMul

矩阵乘法操作

```text
Y = A·B + C    if c_type = "add"
Y = A·B * C    if c_type = "mul"
```

### 输入列表

- A:T1
    - shape:\[b,k,1,n\]
        - k ∈(0,8192\]
    - 量化支持
        - per-layer
- B:T1
    - shape:\[b,k,1,m\]
    - 量化支持
        - per-layer
- C(optional):T1,T2
    - shape:\[b,n,1,m\]
    - 量化支持
        - per-layer
    - 广播支持
        - 支持任意维度广播操作
        - 广播约束同Expand算子

### 输出列表

- Y:T1
    - shape:\[b,n,1,m\]
    - 量化支持
        - per-layer

### 数据类型约束

- T1:int8(Tensor),float16(Tensor)
- T2:float(Tensor)

### 属性列表

- c\_type:strings(默认值“add”)
    - 支持add和mul可选,表示C是做加法还是乘法

## exNorm

对输入数据进行各种归一化操作,目前支持LayerNormalization、RMSNormalization和MeanVarianceNormalization三种:

```text
LayerNorm(x) = ((x - μ) / sqrt(σ^2 + ε)) * W + B
```

```text
RMSNorm(x) = (x / sqrt(RMS^2 + ε)) * W + B
```

```text
MeanVarianceNorm(x) = ((x - μ) / sqrt(Variance + ε)) * W + B
```

其中: x是输入向量。 μ和σ2分别是输入向量的均值和方差:

```text
μ = (1/H) * Σ[i=1..H](x_i)
```

```text
σ^2 = (1/H) * Σ[i=1..H]((x_i - μ)^2)
```

RMS是输入向量均方根:

```text
RMS = sqrt((1/H) * Σ[i=1..H](x_i^2))
```

Variance是输入向量的等效方差:

```text
Variance = (1/H) * Σ[i=1..H](x_i^2) - μ^2
```

ε是一个很小的数,用于防止除零操作。 W 和B是可选择的参数。

### 输入列表

- X:T1
    - shape:\[batch,channel,height,width\]
- W(optional):T1
    - shape:\[batch,channel,height,width\]
- B(optional):T1
    - shape:\[batch,channel,height,width\]

### 输出列表

- Y:T1
    - shape:\[batch,channel,height,width\]

### 数据类型约束

- T1:float16(Tensor)

### 属性列表

- epsilon:float(默认值1e-05)
    - 用来防止除0的epsilon数值
- mode:string
    - 支持layer、rms和mean\_var三种Normalization模式可选
- axes:int64\[\](默认值\[1\])
    - 归一化轴,目前只支持\[1\]和\[1,2,3\]

### 其他支持

- 多核联合:尚不支持

## exWindow

exWindow来源于swin\_transformer的window\_partition和window\_reverse操作。 原论文中输入特征被划分为多个不重叠的窗口,每个窗口的大小为window\_size× window\_size。要求输入和输出特征都为4维shape,在高和宽方向上都进行划分。 pytorch实现的计算方法如下:

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

### 输入列表

- X:T1
    - shape:\[batch,channel,height,width\]

### 输出列表

- Y:T1
    - shape:\[batch,channel,height,width\]

### 数据类型约束

- T1:int8(Tensor),float16(Tensor)

### 属性列表

- mode:string
    - 支持模式:partition,reverse,partition\_num\_first
        - partition:参考window\_partition实现;
        - reverse:参考window\_reverse实现;
        - partition\_num\_first: 与 partition 的区别在于,partition\_num\_first 的 H,W 按照num\_windows进行划分,而partition的H,W按照window\_sizes进行划分。
- window\_sizes:listofints
    - 2维向量,窗口的大小。定义了每个窗口的高度和宽度。窗口内的注意力计算和特征提取都是 基于这个大小。
- num\_windows:listofints
    - 2维向量,窗口的数量。定义了输入特征的高度和宽度被划分为多少个窗口。

### 其他支持

- 多核联合:尚不支持
{% endraw %}
