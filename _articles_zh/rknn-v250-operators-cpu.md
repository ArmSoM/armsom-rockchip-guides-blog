---
title: "RKNN2 V2.5.0 · CPU 算子支持与约束"
description: "RKNN2 V2.5.0 · CPU 算子支持与约束 · 完整算子参数与限制，按 V2.5.0 原稿整理。"
excerpt: "RKNN2 V2.5.0 · CPU 算子支持与约束 · 完整算子参数与限制，按 V2.5.0 原稿整理。"
translation_key: "rknn-v250-operators-cpu"
slug: "rknn-v250-operators-cpu"
lang: "zh"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "NPU", "V2.5.0", "RKNN2"]
---

本文为 RKNN2 V2.5.0 对应平台的算子参考，供 ArmSoM 开发者选型与模型适配时查阅。不能据此认定所有 ArmSoM 板卡均支持这些算子；需按板卡 SoC、实际 Toolkit2、Runtime、NPU 驱动及 BSP 版本核对。原稿没有统一指定适用 Linux 内核，本文未进行 ArmSoM 硬件验证。

来源：本地中英文《RKNN2 算子支持与约束参考》V2.5.0。中文依中文稿；英俄德依英文稿。两稿分别为 374/384 页。各平台限制独立保留，不将一个平台的支持结论推广到另一个平台。英文稿 I/O 原图与输出表仍含中文，本文保留其来源并另附可编辑的本地化表格。ConvTranpose 等原稿拼写及 LSTM/GRU 原始公式保留；不要将本文公式视为 SDK 实现修正。

原稿页码: CN 353–366; EN 363–376.

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

[RKNN2 V2.5.0 · RV1103B/RV1106B：循环网络、运算与池化](/zh/articles/rknn-v250-operators-rv1103b-rv1106b-recurrent-pooling/)

[RKNN2 V2.5.0 · RV1103B/RV1106B：形状、切片与转置](/zh/articles/rknn-v250-operators-rv1103b-rv1106b-shape-indexing/)

[RKNN2 V2.5.0 · RV1103B/RV1106B：激活、归一化与扩展算子](/zh/articles/rknn-v250-operators-rv1103b-rv1106b-activations-extensions/)

**RKNN2 V2.5.0 · CPU 算子支持与约束**

[RKNN2 V2.5.0 · GPU 算子支持与约束](/zh/articles/rknn-v250-operators-gpu/)

[RKNN2 V2.5.0 · 模型输入输出、对齐与卷积限制](/zh/articles/rknn-v250-operators-model-io/)

</details>

{% raw %}

## CPU OPs 规格介绍

## 注:

- RK2118不支持所有CPU 算子
- RV1106/RV1103/RV1106B/RV1103B仅支持部分CPU 算子如下
    - Concat, DataConvert, Div, exLayerNorm, Exp, Gather, ReduceL2, ReduceMax, Reshape,ScatterND,Softmax,Pow

## Add

- 描述:加法操作
- 规格约束:无限制

## AveragePool

- 描述:平均池化
- 规格约束:无限制

## ArgMin

- 描述:取最小值的index
- 规格约束:无限制

## ArgMax

- 描述:取最大值的index
- 规格约束:无限制

## BatchNormalization

- 描述:批量归一化
- 规格约束:无限制

## Cast

- 描述:数据类型转换
- 规格约束: SRC支持:float32/bool/int8/float16/int32/int64 DST支持:float32/int8/int32/float16

## Clip

- 描述:数据截断激活层
- 规格约束:无限制

## Concat

- 描述:合并操作
- 规格约束:axis仅支持{0,1,2,3}

## Convolution

- 描述:卷积操作
- 规格约束:无限制

## ConvTranspose/Deconvolution

- 描述:转置卷积
- 规格约束:无限制

## ConvTransposePad

- 描述:组合OP
- 规格约束:无限制

## Cos

- 描述:余弦函数
- 规格约束:无限制

## DataConvert

- 描述:数据类型转换
- 规格约束:仅支持bool/int8/float类型转换

## DepthToSpace

- 描述:通道方向空间方向转换
- 规格约束:无限制

## Div

- 描述:除法操作
- 规格约束:无限制

## Equal

- 描述:等于
- 规格约束:无限制

## Exp

- 描述:指数函数
- 规格约束:无限制

## Flatten

- 描述:拉平操作
- 规格约束:无限制

## Gather

- 描述:聚集操作
- 规格约束:无限制

## Greater

- 描述:大于
- 规格约束:无限制

## GreaterOrEqual

- 描述:大等于
- 规格约束:无限制

## GRU

- 描述:门控循环单元
- 规格约束:无限制

## exGRU

- 描述:门控循环单元
- 规格约束:无限制
    - 说明:ONNX扩展算子

## exHardSwish

- 描述:激活函数
- 规格约束:无限制
    - 说明:ONNX扩展算子

## InstanceNormalization

- 描述:单例归一化
- 规格约束:无限制

## exLayerNorm

- 描述:层归一化
- 规格约束:无限制
    - 说明:ONNX扩展算子

## Less

- 描述:小于
- 规格约束:无限制

## LessOrEqual

- 描述:小等于
- 规格约束:无限制

## LogSoftmax

- 描述:激活函数
- 规格约束:batchsize仅支持1

## LpNormalization

- 描述:Lp归一化
- 规格约束:无限制

## exLRN

- 描述:局部响应归一化
- 规格约束:无限制
    - 说明:ONNX扩展算子

## MatMul

- 描述:多维矩阵相乘
- 规格约束:无限制(支持四维x四维、四维x三维计算)

## Max

- 描述:取最大值
- 规格约束:无限制

## MaxPool

- 描述:最大池化
- 规格约束:无限制

## MaxRoiPool

- 描述:区域最大池化
- 规格约束:无限制

## MaxUnpool

- 描述:反向最大池化
- 规格约束:无限制

## exMish

- 描述:激活函数
- 规格约束:无限制
    - 说明:ONNX扩展算子

## Min

- 描述:取最小值
- 规格约束:无限制

## Mul

- 描述:乘法
- 规格约束:无限制

## Pad

- 描述:填充
- 规格约束:无限制

## Pow

- 描述:指数计算
- 规格约束:无限制

## exProposal

- 描述:区域提议网络
- 规格约束:batchsize仅支持1
    - 说明:ONNX扩展算子

## ReduceMax

- 描述:沿指定维度计算Max
- 规格约束:输出维度不能超过4维

## ReduceMean

- 描述:沿指定维度计算Mean
- 规格约束:输出维度不能超过4维

## ReduceSum

- 描述:沿指定维度计算Sum
- 规格约束:输出维度不能超过4维

## ReduceMin

- 描述:沿指定维度计算Min
- 规格约束:输出维度不能超过4维

## Reorg

- 描述:数据重排
- 规格约束:无限制

## Reshape

- 描述:数据形状改变
- 规格约束:无限制

## Resize

- 描述:数据宽高方向缩放
- 规格约束:支持插值方式bilinear;nearest2d

## ReverseSequence

- 描述:序列翻转
- 规格约束:无限制

## exRMSNorm

- 描述:均方根归一化
- 规格约束:无限制
    - 说明:ONNX扩展算子

## RoiAlign

- 描述:区域对齐池化
- 规格约束:仅支持AvgPoolMode,batchsize仅支持1

## ScatterND

- 描述:N维索引取数
- 规格约束:无限制

## Sin

- 描述:正弦函数
- 规格约束:无限制

## Slice

- 描述:切片操作
- 规格约束:batchsize仅支持1

## Softmax

- 描述:激活函数
- 规格约束:batchsize仅支持1
    - 说明:与ONNXOPSET11规范一致

## exSoftmax13

- 描述:激活函数
- 规格约束:batchsize仅支持1
    - 说明:ONNX扩展算子,与ONNXOPSET13规范一致

## SpaceToDetph

- 描述:空间方向向通道方向转换
- 规格约束:无限制

## Split

- 描述:拆分数据
- 规格约束:无限制

## Sqrt

- 描述:求平方根
- 规格约束:无限制

## Squeeze

- 描述:压缩数据维度
- 规格约束:无限制

## Sub

- 描述:减法
- 规格约束:无限制

## Tanh

- 描述:双曲正切函数
- 规格约束:无限制

## Tile

- 描述:扩充拷贝数据
- 规格约束:batchsize仅支持1,不支持broadcasting

## Transpose

- 描述:转置计算
- 规格约束:无限制

## Upsample

- 描述:上采样
- 规格约束:支持插值方式bilinear;nearest2d

## Not

- 描述:按元素取非
- 规格约束:无限制

## where

- 描述:通过mask取数
- 规格约束:无限制

## Erf

- 描述:误差函数
- 规格约束:无限制

## Floor

- 描述:向下取整函数
- 规格约束:无限制

## Mod

- 描述:取模函数
- 规格约束:无限制

## exMeanVarianceNormalization

- 描述:均方差归一化函数
- 规格约束:无限制

## And

- 描述:与函数
- 规格约束:无限制

## GatherElements

- 描述:元素收集函数
- 规格约束:无限制

## Log

- 描述:Log函数
- 规格约束:无限制

## exDataConvert

- 描述:精度转换
- 规格约束:无限制

## SpaceToDepth

- 描述:维度变换
- 规格约束:无限制

## SoftmaxMask

- 描述:where融合softmax的激活函数
- 规格约束:无限制

## TransposeReshape

- 描述:组合OP
- 规格约束:无限制

## ReshapeTranspose

- 描述:组合OP
- 规格约束:无限制

## ReduceL2

- 描述:沿某一轴的L2范数
- 规格约束:无限制

## LayerNormalization

- 描述:层标准化
- 规格约束:无限制

## PassThrough

- 描述:直接连接
- 规格约束:无限制

## Expand

- 描述:张量数据复制或扩展
- 规格约束:无限制

## Sigmoid

- 描述:激活函数
- 规格约束:无限制

## Tanh

- 描述:三角函数
- 规格约束:无限制

## Cos

- 描述:三角函数
- 规格约束:无限制

## Sin

- 描述:三角函数
- 规格约束:无限制

## exSwish

- 描述:激活函数
- 规格约束:无限制

## exGlu

- 描述:激活函数
- 规格约束:无限制

## exGelu

- 描述:激活函数
- 规格约束:无限制

## exWindow

- 描述:exWindow来源于Swin-Transformer的window\_partition和window\_reverse操作
- 规格约束:无限制

## exNorm

- 描述:当mode设置为‘pixel‘时,exNorm将使用PixelNorm进行归一化。mode缺省时,exNorm 默认使用LayerNorm进行归一化。
- 规格约束:无限制

## Round

- 描述:数据饱和
- 规格约束:无限制

## TopK

- 描述:获取数值排行前K个数据
- 规格约束:无限制

## exSwooshR

- 描述:激活函数
- 规格约束:无限制

## exSwooshL

- 描述:激活函数
- 规格约束:无限制

## OneHot

- 描述:独热编码
- 规格约束:无限制

## Cumsum

- 描述:指定维度上进行累加
- 规格约束:无限制
{% endraw %}
