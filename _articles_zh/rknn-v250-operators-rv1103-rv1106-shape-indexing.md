---
title: "RKNN2 V2.5.0 · RV1103/RV1106：形状、切片与转置"
description: "RKNN2 V2.5.0 · RV1103/RV1106：形状、切片与转置 · 完整算子参数与限制，按 V2.5.0 原稿整理。"
excerpt: "RKNN2 V2.5.0 · RV1103/RV1106：形状、切片与转置 · 完整算子参数与限制，按 V2.5.0 原稿整理。"
translation_key: "rknn-v250-operators-rv1103-rv1106-shape-indexing"
slug: "rknn-v250-operators-rv1103-rv1106-shape-indexing"
lang: "zh"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "NPU", "V2.5.0", "RV1103/RV1106"]
---

本文为 RKNN2 V2.5.0 对应平台的算子参考，供 ArmSoM 开发者选型与模型适配时查阅。不能据此认定所有 ArmSoM 板卡均支持这些算子；需按板卡 SoC、实际 Toolkit2、Runtime、NPU 驱动及 BSP 版本核对。原稿没有统一指定适用 Linux 内核，本文未进行 ArmSoM 硬件验证。

来源：本地中英文《RKNN2 算子支持与约束参考》V2.5.0。中文依中文稿；英俄德依英文稿。两稿分别为 374/384 页。各平台限制独立保留，不将一个平台的支持结论推广到另一个平台。英文稿 I/O 原图与输出表仍含中文，本文保留其来源并另附可编辑的本地化表格。ConvTranpose 等原稿拼写及 LSTM/GRU 原始公式保留；不要将本文公式视为 SDK 实现修正。

原稿页码: CN 198–211; EN 204–217.

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

**RKNN2 V2.5.0 · RV1103/RV1106：形状、切片与转置**

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

## Relu

将输入张量的负值设为零,正值保持不变

### 输入列表

- input:T1
    - shape:\[batch,channel,height,width\]
    - 量化支持
        - per-layer
    - 广播支持
        - 无

### 输出列表

- output:T1
    - shape:\[batch,channel,height,width\]
    - 量化支持
        - per-layer

### 数据类型约束

- T1:int8(Tensor),float16(Tensor)

### 其他支持

- 多核联合:暂不支持

## Clip/ReLU6

将输入张量的值裁剪到\[0,6\]范围内

### 输入列表

- input:T1
    - shape:\[batch,channel,height,width\]
    - 量化支持
        - per-layer
    - 广播支持
        - 无

### 输出列表

- output:T1
    - shape:\[batch,channel,height,width\]
    - 量化支持
        - per-layer

### 数据类型约束

- T1:int8(Tensor),float16(Tensor)

### 其他支持

- 多核联合:暂不支持

## PRelu

将输入张量的负值按可学习参数缩放,正值保持不变

### 输入列表

- input:T1
    - shape:\[batch,channel,height,width\]
    - 量化支持
        - per-layer/per-channel
    - 广播支持
        - 无

### 输出列表

- output:T1
    - shape:\[batch,channel,height,width\]
    - 量化支持
        - per-layer/per-channel

### 属性列表

- slope:PRelu系数
    - 仅支持单个标量或C维度系数

### 数据类型约束

- T1:int8(Tensor),float16(Tensor)

### 其他支持

- 多核联合:暂不支持

## LeakyRelu

将输入张量的负值按固定比例缩放,正值保持不变

### 输入列表

- input:T1
    - shape:\[batch,channel,height,width\]
    - 量化支持
        - per-layer
    - 广播支持
        - 无

### 输出列表

- output:T1
    - shape:\[batch,channel,height,width\]
    - 量化支持
        - per-layer

### 数据类型约束

- T1:int8(Tensor),float16(Tensor)

### 其他支持

- 多核联合:暂不支持

## Reshape

在不改变输入数据和元素数量的情况下,返回一个具有指定形状的张量。

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

### 属性列表

- shape:int
    - 指定输出张量的形状

### 其他支持

- 多核联合:尚不支持

## Resize

调整输入张量的大小。一般来说,它将输出张量中的每个值计算为输入张量中邻域(即采样位置)的加 权平均值

### 输入列表

- X:T1
    - shape:\[batch,channel,height,width\]
    - 量化支持
        - per-layer
- roi(optional):T2
    - 目前暂不支持
- scales(optional):T2
    - 沿每个维度的缩放比例数组
- sizes(optional):T3
    - 输出张量的目标大小

### 输出列表

- Y:T1
    - shape:\[batch,channel,height,width\]
    - 量化支持
        - per-layer

### 数据类型约束

- T1:int8(Tensor)
- T2:float(Tensor)
- T3:int64(Tensor)

### 属性列表

- antialias:int(默认值为0)
    - 目前不支持设置
- axes:int\[\]
    - 目前不支持设置
- coordinate\_transformation\_mode:strings(默认值为”half\_pixel”)
    - 目前仅支持half\_pixel,pytorch\_half\_pixel,align\_corners三种
- cubic\_coeff\_a:float(默认为-0.75)
    - 目前不支持设置
- exclude\_outside:int(默认值为0)
    - 目前不支持设置
- extrapolation\_value:float(默认为0)
    - 目前不支持设置
- keep\_aspect\_ratio\_policy:strings(默认值为”stretch”)
    - 目前不支持设置
- mode:strings(默认值为”nearest”)
    - 目前仅支持nearest和linear两种可配置
- nearest\_mode:strings(默认值为”round\_prefer\_floor”)
    - 目前不支持设置 支持说明 目前仅支持宽高方向的整数倍缩放,且缩放倍数为2-8的整数倍,如果是(1,c,1,1)则支持放大到(1,c,h, w)

## Slice

获得当前向量的一个切片,具体规则和numpy切片相同

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

- T:int8(Tensor),float16(Tensor)

### 属性列表

- starts:int(Tensor)
    - 切分的起始位置:无限制
- ends:int(Tensor)
    - 切分的终止位置:无限制
- axes:int(Tensor)
    - 选取切分的轴:支持任意0~3轴,支持同时多轴选择
- steps:int(Tensor)
    - 选取切分对应轴的步长
    - 当height\*width==1&amp;&amp;channel%subc==0&amp;&amp;starts\[1\]%subc==0&amp;&amp;ends\[1\]%subc==0&amp;&amp;steps\[1\]&lt;=subc时,steps可以不为1,否则只有steps==\[1,1,1,1\]时,才可 通过NPU运行SliceOP

## Softmax

该运算符计算给定输入的归一化指数值:

Softmax(input, axis) = exp(input − max(input, axis)) / Σ\_axis exp(input −max(input, axis))

“axis”属性表示Softmax执行的维度。输出张量具有相同的形状并包含相应输入的Softmax值。

### 输入列表

- input:T1
    - shape:\[batch,channel,height,width\]
        - 受限于transpose的规格限制

### 输出列表

- output:T1
    - shape:\[batch,channel,height,width\]

### 数据类型约束

- T1:int8(Tensor),float16(Tensor)

### 属性列表

- axis:int
    - 做softmax的轴:1,3,即channel和width方向

## exSoftmax13

该运算符计算给定输入的归一化指数值:

exSoftmax13(input, axis) = exp(input − max(input, axis)) / Σ\_axis exp(input −max(input, axis))

“axis”属性表示Softmax执行的维度。输出张量具有相同的形状并包含相应输入的Softmax值。

### 输入列表

- input:T1
    - shape:\[batch,channel,height,width\]
        - 受限于transpose的规格限制

### 输出列表

- output:T1
    - shape:\[batch,channel,height,width\]

### 数据类型约束

- T1:int8(Tensor),float16(Tensor)

### 属性列表

- axis:int64
    - 做softmax的轴:1,3,即channel和width方向

## exSoftmaxMask

该运算符计算给定输入的归一化指数值:

```text
input(x, mask_t, mask_value) =
    x + (mask_t - 1) * inf       if mask_value = 0
    x + mask_t * (-inf)          elif mask_value = 1
```

```text
exSoftmaxMask(input, axis) = exp(input - max(input, axis)) / Σ_axis(exp(input - max(input, axis)))
```

"axis"属性表示Softmax执行的维度。输出张量具有相同的形状并包含相应输入的Softmax值。

### 输入列表

- input:T1
    - shape:\[batch,channel,height,width\]
        - 受限于transpose的规格限制
- mask(optional):T1
    - shape:\[1,channel,height,width\]
        - channel∈(0,8192\]
        - width: · axis=1,无限制; · axis=3/-1,width∈(0,8192\]

### 输出列表

- output:T1
    - shape:\[batch,channel,height,width\]

### 数据类型约束

- T1:int8(Tensor),float16(Tensor)

### 属性列表

- axis:int64
    - 做softmax的轴:1,3,即channel和width方向
- mask\_value:int64
    - 需要mask的值:0,1

## Split

将向量沿着axis方向分成num\_outputs个向量,split用于指定切分后向量在axis方向上的大小

### 输入列表

- input\_tensor:T
    - shape:\[batch,channel,height,width\]
    - 量化支持
        - per-layer

### 输出列表

- output:T
    - 一或多个输出向量,由num\_outputs属性决定
    - shape:根据切分情况决定
    - 量化支持
        - per-layer

### 数据类型约束

- T:int8(Tensor),float16(Tensor)

### 属性列表

- axis:int
    - axis∈{0,1,2,3}
- num\_outputs:int
- split:int(Tensor)

## Sub

- 执行元素级二进制减法(C=A-B),支持多向Numpy样式的广播

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

- T1:int8(Tensor)
- T2:float(constTensor)

## Tile

通过平铺给定的张量构造张量,这与Numpy中的函数tile相同,但没有广播

### 输入列表

- input:T1
    - shape:\[batch,channel,height,width\]
    - 量化支持
        - per-layer
- repeats:T2
    - shape:\[batch,channel,height,width\]

### 输出列表

- output:T1
    - shape:\[batch,channel,height,width\]
    - 量化支持
        - per-layer

### 数据类型约束

- T1:int8(Tensor),float16(Tensor)
- T2:int64(Tensor)

## Transpose

对输入张量进行转置

### 输入列表

- X:T1
    - shape:\[n1,c1,h1,w1\]
        - 详细约束规则见属性列表
    - 量化支持
        - per-layer

### 输出列表

- Y:T1,T2
    - shape:\[n2,c2,h2,w2\]
        - 详细约束规则见属性列表
    - 量化支持
        - per-layer

### 属性列表

- perm转置的轴顺序: 不同perm参数限制如下:(其中p=8192,q=2048)
    - perm=\[0,1,2,3\]
        - 无限制
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

### 数据类型约束

- T1:int8(Tensor)
- T2:int16(Tensor),float16(Tensor)

### 其他支持

- 多核联合:暂不支持
{% endraw %}
