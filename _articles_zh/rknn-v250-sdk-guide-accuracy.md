---
title: "RKNN2 SDK V2.5.0 · 精度问题诊断"
description: "RKNN2 SDK V2.5.0 · 精度问题诊断 · 完整开发指南系列"
excerpt: "精度问题诊断"
translation_key: "rknn-v250-sdk-guide-accuracy"
slug: "rknn-v250-sdk-guide-accuracy"
lang: "zh"
date: "2026-10-29"
author: "ArmSoM Editorial · Rockchip source documentation"
category: "ai"
products: []
reference_products: []
tags: ["RKNN", "Toolkit2", "V2.5.0", "NPU"]
---

平台参考：本文来自 Rockchip RKNN2 SDK V2.5.0 开发指南，涵盖源文明确列出的 SoC、Linux/Android Runtime 和对应 Toolkit。具体功能仅适用于各节列出的芯片、SDK、驱动和内核条件，不能据此推定所有 ArmSoM 板卡支持。部署前需核对实际 ArmSoM 板卡的 BSP、NPU 驱动、Runtime 与模型版本。本篇未进行 ArmSoM 硬件验证；日志、性能数字和示例均来自原稿。

来源与校对：中文遵循中文 V2.5.0（182 页），英文、俄文和德文遵循英文 V2.5.0（208 页）；保留各稿技术信息，不将旧版内容补充为新版事实。中文配图取自中文 PDF，英俄德配图取自英文 PDF，含独立提取的矢量流程图。保留原章节和公式编号。原稿部分交叉引用仍指向旧章号，动态 Shape 容量示例写作“1224+140=264”等、TP_NORM 支持说明有矛盾、init()/rknn.val_perf() 等名称与后文 API 不一致；原始信息保留，执行前以实际 V2.5.0 SDK 头文件及 API 手册核对。各部分均保留代码和参数，提取造成的跨页换行与表格续行已整理。

[Rockchip RKNN2 SDK V2.5.0](https://github.com/airockchip/rknn-toolkit2/tree/master/doc)

**RKNN2 SDK V2.5.0 · 19/22**

[1. 软件栈与核心概念](/zh/articles/rknn-v250-sdk-guide-overview/)

[2. 开发环境、版本与连板准备](/zh/articles/rknn-v250-sdk-guide-environment/)

[3. 开发流程与接口选择](/zh/articles/rknn-v250-sdk-guide-workflow/)

[4. 模型转换与 ONNX 编辑](/zh/articles/rknn-v250-sdk-guide-conversion/)

[5. 量化、混合量化与 QAT](/zh/articles/rknn-v250-sdk-guide-quantization/)

[6. 推理、精度、性能与内存评估](/zh/articles/rknn-v250-sdk-guide-evaluation/)

[7. Runtime 生命周期、布局与内存](/zh/articles/rknn-v250-sdk-guide-runtime-basics/)

[8. 零拷贝接口与输入输出约束](/zh/articles/rknn-v250-sdk-guide-zero-copy/)

[9. C API 部署与代码生成](/zh/articles/rknn-v250-sdk-guide-c-deployment/)

[10. Toolkit Lite2 Python 部署](/zh/articles/rknn-v250-sdk-guide-lite-deployment/)

[11. Matmul API 与矩阵布局](/zh/articles/rknn-v250-sdk-guide-matmul/)

[12. NPU 多核配置与性能](/zh/articles/rknn-v250-sdk-guide-multicore/)

[13. 动态 Shape 模型与部署](/zh/articles/rknn-v250-sdk-guide-dynamic-shape/)

[14. 多 Batch 推理](/zh/articles/rknn-v250-sdk-guide-multi-batch/)

[15. RK3588/RK3576 NPU SRAM](/zh/articles/rknn-v250-sdk-guide-sram/)

[16. 缓存一致性与稀疏化推理](/zh/articles/rknn-v250-sdk-guide-cache-sparsity/)

[17. 自定义算子：Python 与 C API](/zh/articles/rknn-v250-sdk-guide-custom-operators/)

[18. 模型加密部署](/zh/articles/rknn-v250-sdk-guide-encryption/)

**精度问题诊断**

[20. 性能分析与网络优化](/zh/articles/rknn-v250-sdk-guide-performance/)

[21. 内存分析、共享与复用](/zh/articles/rknn-v250-sdk-guide-memory/)

[22. 常见问题、错误处理与参考资源](/zh/articles/rknn-v250-sdk-guide-faq/)

{% raw %}

**5. 问题诊断与优化**

## 5.1 精度问题诊断

模型精度问题排查一般从两个方面进行,一是模拟器精度排查,二是板端Runtime精度排查。模拟器推理结果正确是板端Runtime推理正确的前提,所以需优先保证模拟器推理结果正确,再进行板端Runtime精度问题的排查。整体遵循"模拟器FP16精度 → 模拟器量化精度 → 连板精度 → Runtime精度"的递进排查流程,前一级正确是后一级正确的前提。

因此本章节将针对模拟器精度排查以及Runtime精度排查两个方面给出排查建议以及处理方案。下图为具体排查步骤:

![图5-1 精度排查步骤 ](/assets/images/rknn-v250/sdk-guide/cn/p138-figure-01.png)

图5-1 精度排查步骤

模拟器精度排查,主要分为模拟器FP16精度和模拟器量化精度排查两个子步骤(上图深色框部分)。

Runtime精度排查,主要分为连板精度和Runtime精度排查两个子步骤(上图浅色框部分)。

判断精度可以使用余弦距离作为基本的判断依据,但最终量化对精度的影响仍需要在数据集上验证。

### 5.1.1 模拟器精度排查

模拟器推理结果正确是板端Runtime推理正确的前提,所以需优先保证模拟器推理结果正确。

RKNN-Toolkit2上的模拟器推理根据模型是否量化分为FP16推理和量化推理。FP16推理结果正确是量化推理的结果正确的前提,因此当存在量化推理精度问题时,优先验证FP16推理的正确性,再排查量化推理的精度问题。

#### 5.1.1.1 模拟器FP16精度

RKNPU目前不支持FP32的计算方式,因此模拟器在不开启量化的情况下,默认是FP16的运算类型,所以只需要在使用rknn.build()接口时,将do_quantization参数设置为False,即可以将原始模型转换为FP16的RKNN模型,接着调用rknn.init_runtime(target=None)和rknn.inference()接口进行FP16模拟推理并获取输出结果。

如果FP16推理输出结果错误,则可以进行以下排查:

配置错误

模型的配置信息主要集中在rknn.config()接口里,同时在其他的API里也有少数的配置信息可能影响FP16的精度,主要参数如下:

mean_values / std_values:模型的归一化参数,一般原始模型的输入归一化操作是放在模型的输入预处理里实现的,但RKNN模型在推理时可以包含该归一化的操作(在开启量化后,对量化校正集也会先进行归一化操作),因此在原始模型有归一化步骤时,要确保该参数和原始模型使用的归一化参数一致。

input_size_list:rknn.load_tensorflow()、rknn.load_pytorch()和rknn.load_onnx()接口的输入节点shape信息,如果配置错误会导致错误的推理结果。

inputs / outputs:rknn.load_tensorflow()和rknn.load_onnx()接口的输入和输出节点名称,如果配置错误会导致错误的推理结果。

inference接口参数:rknn.inference()接口的输入参数,主要包括 inputs 和 data_format。

一般在Python环境下,图像数据都是通过cv2.imread()读取的,此时需要注意cv2.imread()读取的

图像格式为BGR,如果原始模型的输入为 BGR(如大部分的caffe模型),则不需要做RGB顺序的调整;而如果原始模型的输入为RGB,则需要调用cv2.cvtColor(img, cv2.COLOR_BGR2RGB)将图像数据转为RGB;另外,通过cv2.imread()读取的图像的shape维度为3维,但是一般模型的输入shape为4维, 因此还需要调用np.expand_dims(img, 0)将输入shape扩为4维; 之后才可以传给rknn.inference()接口进行推理。通过cv2.imread()读取的图像的layout为NHWC,data_format的默认值也是NHWC,因此不需要设置data_format参数。

如果模型的输入数据不是通过cv2.imread()读取,此时必须清楚知道输入数据的layout并设置正确的data_format参数,同时也要确保输入数据的shape和原始模型一致。如果输入数据是图像数据,也要确保其RGB顺序与原始模型一致。

参数配置的检查是很重要的环节,是很多用戶出现FP16推理输出结果错误的主要原因。具体排查步骤如下:

a. 使用原始模型在原始推理框架下进行推理,并将推理结果保存下来。

b. 使用RKNN-Toolkit2对原始模型进行转换并推理,此时需要使用与前一步骤里同样的输入数据,并设置FP16的推理方式(rknn.build() 的 do_quantization 设为 False),同时rknn.init_runtime()的target参数设为None,以调用RKNN-Toolkit2的模拟器进行推理,同样将推理的结果保存下来。

c. 对比两次推理的结果,如果结果较为一致(可以用余弦距离来判断一致性),说明上述的配置都没有问题。

d. 如果结果不一致,检查上述参数是否正确。

如果确认上述参数配置无误,结果仍然不一致,则有可能是模型中间的Tensor超出FP16表达范围导致。

超出FP16表达范围

模型的中间Tensor在由FP32转为FP16后,可能会出现运算溢出的问题。因为一般模型的推理数据类型是FP32,如果推理时模型中的Tensor有数值超过FP16表达范围(-65504〜65504),则该Tensor就会溢出,导致模型推理结果异常。

对于溢出问题,可以通过调用rknn.accuracy_analysis(..., target=None)接口(参考精度评估章节)进行模拟器FP16精度分析,如果分析结果中的simulator_error的entire列或single列出现异常值(出现‘inf’等的字样),则可能出现了FP16溢出。此时可以尝试修改模型结构来保证模型中的所有Tensor不会出现FP16溢出(如添加一些BN层等)。

如果确认上述参数配置无误,并且也不是FP16溢出,但结果仍然不一致,则可能是模拟器内部实现问题,请将该模型的复现文件提供给瑞芯微NPU团队进行分析解决。

#### 5.1.1.2 模拟器量化精度

在排除FP16精度问题后,就可以对模型进行量化(使用rknn.build()接口时,将do_quantization参数设置为True),然后通过调用rknn.accuracy_analysis(..., target=None)接口(参考精度评估章节)进行模拟器量化精度分析。

如果在分析结果中,发现simulator_error的entire列精度下降的比较厉害,并且simulator_error的single没有发现有哪层精度下降特别多的情况,则主要从以下几个方面进行排查:

配置错误

与FP16推理的配置问题类似,错误的配置也会导致量化推理精度问题,因此在保证FP16推理正确的配置基础上,仍然要对以下量化配置参数进行检查。

quant_img_RGB2BGR:表示在加载量化图像时是否需要先做RGB2BGR的操作,一般用于caffe模型,更多详细信息见 quant_img_RGB2BGR参数说明,该参数务必和训练时的图像通道顺序保持一致,在配置错误时也会导致量化精度下降比较多。

optimization_level:优化等级的选择,默认为3,表示速度优先,这种情况下会开启一些对提升性能有益,但却会略微影响到精度的优化规则,将该配置调小(如改为0),则会禁用这些优化规则。

dataset:rknn.build()接口的量化校正集配置,用于在量化过程中,计算每个Tensor合适的量化参数(scale / zero_point)。如果选择了和实际部署场景差异较大的校正集,则可能会出现精度下降的问题,此外校正集的数量过多或过少都会影响精度(一般选择20〜200张)。

具体检查量化参数配置问题,一般可按如下步骤进行:

a. 直接进行量化推理,然后检查推理的结果与原始模型在原始推理框架下推理的结果进行比较,如果结果差异不是很大,则可以认为quant_img_RGB2BGR和dataset参数基本无误。

b. 如果结果差异还是很明显:

如原始模型输入的图像格式是BGR(多见于caffe的模型),此时可以修改quant_img_RGB2BGR为True,关于模型输入的RGB顺序,其实从前面FP16推理精度验证步骤的输入数据的处理代码中可以得知输入数据的RGB顺序。

可以先使用一张图像进行量化(dataset.txt中只留一行),推理时也使用这张图像进行推理,如果此时单张图像的精度提升较多,则说明先前使用的量化校正集选择不佳,可以重新选择与部署场景较吻合的图片(如果提升并不明显,则可能不是dataset的问题)。

如原先只使用一张图像进行量化(dataset.txt中只有一行),此时可以尝试使用更多的图像进行量化,可以提高到20〜200张左右。

经过上述配置排查之后,应该不会出现量化结果完全错误的情况,如果出现完全错误的情况,请重新检查上述的配置。在确认配置无误的情况下,如果模型的精度还是不够,可以尝试修改量化方法和算法等相关配置。

量化方法和量化算法

有些模型本身对量化并不友好,此时可以尝试切换不同的量化方法和量化算法。量化方法主要有layer、channel和group三种(group仅对线性层有效,见2.2.1.3 量化粒度),可通过rknn.config()接口里的quantized_method参数进行设置(默认是channel)。量化算法主要有normal、kl_divergence、mmse和gdq四种(见2.2.3.2 内部量化算法),可通过rknn.config()接口里的quantized_algorithm参数进行设置(默认是normal)。步骤如下:

a. 如原先使用的是layer的量化方法,可以改为channel的量化方法,一般情况下,channel的量化方法精度比layer的量化方法精度会高许多。

b. 如量化方法已经是channel,但精度还是无法满足要求,此时可以将量化算法由normal改为kl_divergence或mmse,这种方式会导致量化的时间大幅增加,但会带来比normal更好的精度表现,同时运行时的性能并不会受到影响。

量化算法的特点与推荐校正数据量总结如下:

| 量化算法 | 特点 | 推荐校正数据量 |
| --- | --- | --- |
| normal(默认) | 常规校正,速度快 | 20~100 张 |
| kl_divergence | feature分布不均匀时改善较好,耗时略高于normal | 20~100 张 |
| mmse | 迭代搜索量化范围,精度通常更高,但耗时与内存大幅增加 | 20~50 张 |
| gdq | 仅在w4a16和w8a16下有效,能有效提高权重量化精度 | 200 张以上 |

建议先用normal,精度不佳再尝试kl_divergence、mmse或gdq;量化算法仅影响模型转换阶段,不影响板端运行性能。

如果使用上述方法后,从分析结果中仍然发现simulator_error的entire列精度还是不好,并且simulator_error的single列有部分层精度掉的比较多,这可能是这些层的权重数值分布不好,导致量化后会出现精度下降较多的情况。如:Conv的weight的分布很不均匀的情况下,此时可以考虑使用混合量化来进一步提高模型精度。步骤如下:

a. 先使用精度分析接口对精度进行分析,找出造成精度下降比较多的层,记录对应层的输出Tensorname。(这边需要注意的是,因为误差是会逐层累积的,所以越前面的层对最终的精度影响也会越大,因此不仅要考虑simulator_error的single列的精度损失情况,也要考虑层在模型中的位置)

b. 使用混合量化的方法,将上个步骤获取的Tensor name写入混合量化的配置文件中(参考混合量化章节)。

c. 完成混合量化的步骤,并测试精度情况(可以继续使用精度分析接口来看精度变化情况)。

一般经过混合量化之后,模型的精度是可以提高的,如果提高不明显或不够,则可以尝试将更多的层进行混合量化,但是同时也会造成推理性能下降,因此混合量化需要用戶自行权衡精度和速度。还有一种特殊方式是,当精度下降的Op处于最后一层时,也可以选择将该层Op的运行放在后处理中进行,同样会有效避免该层的精度问题。

QAT量化感知训练

如果混合量化后精度还是不够,或者精度够但因混合量化而导致性能达不到要求,此时可以尝试使用量化感知训练重新训练模型,并导出带有量化参数的模型(如onnx/pt/pb/tflite格式), 有关量化感知训练更多内容,请参考量化感知训练章节。

### 5.1.2 Runtime精度排查

在模拟器精度正常的情况下,仍可能在板端C API部署时出现推理结果异常。出现这种问题的原因一般有三种,第一种是板端的Runtime的bug导致;第二种是调用RKNPU2的C API编程时接口没有正确使用导致;第三种是模型的前后处理不正确导致。

当遇到这种问题时,可以先通过连板功能快速排查是否是板端Runtime的bug导致,如果连板没有问题,再排查C API部署的问题。

#### 5.1.2.1 连板精度

1. 在配置好连板调试环境的情况下(连板调试环境配置方法参考设备端NPU环境准备章节),将开发板通过USB连接到电脑上,然后使用RKNN-Toolkit2进行连板推理(设置rknn.init_runtime()的target参数,如target='rk3566'),并检查推理结果是否大致正确(因为模拟器并没有严格模拟NPU硬件,所以结果可能与模拟器并没有完全一致)。

2. 如果上述步骤里的推理结果与模拟器推理结果差异较大,则可以初步确定板端的Runtime存在bug,此时可以使用精度分析的接口(参考精度评估章节)进行连板精度分析(调用rknn.accuracy_analysis()接口,并设置target参数即可,如target='rk3566'),精度分析完后会输出每层的分析结果。

3. 检查分析结果中的runtime_error的single_sim列,如其cos余弦距离偏低或euc欧氏距离偏高(显示⻩色或红色),从而导致runtime_error的entire列与simulator_error的entire列差异越来越大,则可能Runtime在实现该层时有出现精度丢失或异常的问题,此时可以将该分析结果以及复现的模型反馈给瑞芯微NPU团队进行修复。

#### 5.1.2.2 RUNTIME精度

如果连板精度没有问题,但精度仍然有问题,则问题可能出在用戶调用RKNN的C API进行编程的C/C++代码本身,这时用戶需要仔细检验下RKNN的C API的接口配置等是否配置正确,以及模型的前处理和后处理流程是否正确(需要与模拟器端的流程完全一致)。可以按照以下步骤查看:

**1. 检查输入配置和数据**

查看C API的输入是否配置正确。例如,RKNN-Toolkit2在转换RKNN模型时已经配置均值和方差,则在C/C++代码中不需要做归一化。对于3通道的输入,通道顺序与模型训练时设置的输入通道一致;对于四维输入形状,fmt=NHWC;对于非四维输入,fmt=UNDEFINED。若使用通用API,输入buffer的size等于输入Tensor元素个数*每个元素的字节数,若使用零拷贝API,rknn_create_mem接口创建的内存大小以及输入数据格式参考《RKNN Runtime零拷贝调用》章节。

在确认配置正确后,需查看输入层的数据,可以在应用运行前设置RKNN_LOG_LEVEL=5,然后再运行应用,推理时逐层的结果会以numpy格式文件保存在/data/dumps(Android系统)或/userdata/dumps(Linux系统)目录下。查看包含InputOperator字段的numpy文件是否符合预期,如果使用通用API,它是输入归一化的结果;如果使用零拷贝API,它是未归一化前的数据。

**2. 检查输出配置和数据**

在确保输入正确后,查看代码中输出是否配置正确。例如,如果使用通用API,当设置want_float=1后,输出是float32类型结果,当设置want_float=0后,输出是量化数据类型或者float16类型(非量化数据类型)。如果使用零拷贝API,rknn_create_mem()接口创建的内存大小以及输入数据格式参考《RKNNRuntime零拷贝调用》章节。

查看输出层的数据,同样在上述逐层numpy文件生成后,打开包含OutputOperator字段的numpy文件,查看数据是否正确。如果确认输入结果正确,输出仍然错误,可能Runtime在特定的输入/输出类型处理上有问题,此时可以将该分析结果以及复现的模型反馈给瑞芯微NPU团队进行修复。

{% endraw %}
