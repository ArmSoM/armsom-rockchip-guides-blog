---
title: "RKNN2 SDK V2.5.0 · Runtime 生命周期、布局与内存"
description: "RKNN2 SDK V2.5.0 · Runtime 生命周期、布局与内存 · 完整开发指南系列"
excerpt: "Runtime 生命周期、布局与内存"
translation_key: "rknn-v250-sdk-guide-runtime-basics"
slug: "rknn-v250-sdk-guide-runtime-basics"
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

**RKNN2 SDK V2.5.0 · 7/22**

[1. 软件栈与核心概念](/zh/articles/rknn-v250-sdk-guide-overview/)

[2. 开发环境、版本与连板准备](/zh/articles/rknn-v250-sdk-guide-environment/)

[3. 开发流程与接口选择](/zh/articles/rknn-v250-sdk-guide-workflow/)

[4. 模型转换与 ONNX 编辑](/zh/articles/rknn-v250-sdk-guide-conversion/)

[5. 量化、混合量化与 QAT](/zh/articles/rknn-v250-sdk-guide-quantization/)

[6. 推理、精度、性能与内存评估](/zh/articles/rknn-v250-sdk-guide-evaluation/)

**Runtime 生命周期、布局与内存**

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

[19. 精度问题诊断](/zh/articles/rknn-v250-sdk-guide-accuracy/)

[20. 性能分析与网络优化](/zh/articles/rknn-v250-sdk-guide-performance/)

[21. 内存分析、共享与复用](/zh/articles/rknn-v250-sdk-guide-memory/)

[22. 常见问题、错误处理与参考资源](/zh/articles/rknn-v250-sdk-guide-faq/)

{% raw %}

**3. 板端部署**

## 3.1 Runtime部署基础

本节阐述 RKNN Runtime 的基础概念,是进行板端部署(使用 C API 或 Toolkit Lite)的前提。内容涵盖模型和上下文生命周期、张量与数据排列格式、输入输出内存、同步与异步推理,以及错误处理与资源释放规范。

### 3.1.1 模型和上下文生命周期

rknn_context 是 RKNN Runtime 的核心句柄(handle),代表一个运行时上下文实例,所有模型加载、属性查询和推理操作均基于该句柄进行。板端部署时,应严格遵循"创建 → 使用 → 销毁"的生命周期管理规范,以避免资源泄漏或运行时异常。

创建:通过 rknn_init() 初始化上下文并加载 RKNN 模型。初始化成功后,模型权重与运行所需的内部内存已就绪。

使用:初始化完成后,可通过 rknn_query() 查询模型输入输出属性,并通过通用 API( rknn_inputs_set() / rknn_run() / rknn_outputs_get() )或零拷贝 API( rknn_set_io_mem() + rknn_run() )反复执行推理,句柄保持不变。RK3588 / RK3576 平台可在推理前通过 rknn_set_core_mask() 指定模型运行的 NPU 核心,详见4.1.2 NPU多核。

销毁:推理任务全部完成后,通过 rknn_destroy() 销毁上下文,释放模型占用的全部内存资源。销毁后句柄不可再使用。

### 3.1.2 张量和数据排列格式

RKNN 模型的输入输出通过张量(Tensor)管理。板端部署前需通过 rknn_query() 查询张量属性( rknn_tensor_attr ),包含张量名称、shape、数据类型(dtype)、数据布局(layout)、量化参数(qnt_type / qnt_info)等信息,再据此组织输入数据和解析输出数据。

数据类型(dtype):包括 FP32 / FP16 / INT8 / INT16 / UINT8 等,由模型转换时的量化配置决定,量化模型默认为 INT8(非对称量化)。

数据布局(layout):主要有 NCHW 、 NHWC 、 NC1HWC2 、 UNDEFINE 四种,其中 NC1HWC2 为RKNPU 硬件专用的内存排布格式,详见下文。

目前RKNN的数据排列格式主要有以下四种, NHWC 、 NCHW 、 NC1HWC2 、 UNDEFINE 。

其中 NHWC 和 NCHW 的数据排布为深度学习常见数据排列方式,本章节不做额外说明,重点讲述RKNPU硬件专用的 NC1HWC2 数据格式的存储以及转换。

![图3-1 RKNPU NC1HWC2数据排布与存储 ](/assets/images/rknn-v250/sdk-guide/cn/p056-figure-01.png)

图3-1 RKNPU NC1HWC2数据排布与存储

如图3-1所示, 数字0代表一笔数据,即一次存放C2个数据,其中C2是由平台决定的,不同硬件平台的C2的规则约束由表3-1所示,C1为C/C2的上取整值。 NC1HWC2 数据存放的顺序与图中数值增⻓的顺序一致,先存放0-15的数据,再存放16-31的数据。以RK3568平台为例,当feature为(1,13,4,4)的int8数据,对应的NC1HWC2 为(1,2,4,4,8),此时C2为8,C1为2,feature在内存中在16-31排放的数据中,对应的每个C2数据块只有前5个数据有效,剩下的3个数据是额外补的对齐数据。

表3-1 不同硬件平台对应的C2值

|  | RK2118 | RK3566/RK3568 | RK3588/RK3576/RV1126B | RV1103B/RV1106B | RV1103/RV1106 | RK3562 |
| --- | --- | --- | --- | --- | --- | --- |
| int8 | / | 8 | 16 | 8 | 16 | 16 |
| float16 | 4 | 4 | 8 | / | 8 | 8 |

接下来重点介绍 NC1HWC2 数据排列转 NCHW 和 NHWC 数据在内存中的变化过程。

以feature (1, 13, 2, 2) RK3568为例,数据在内存排布中的转换,根据前文的对齐要求可知feature(1, 13, 2,

2) 对应的 NC1HWC2 为(1, 2, 2, 2,8) , NC1HWC2 的存储如下图所示,红色部分为额外对齐的无效数据。

![图3-2 NC1HWC2数据排布展开 ](/assets/images/rknn-v250/sdk-guide/cn/p056-figure-02.png)

图3-2 NC1HWC2数据排布展开

移除无效数据转成 NCHW 即 (1, 13, 2, 2)数据,在内存中的排布如下:

![图3-3 NCHW 数据排布 ](/assets/images/rknn-v250/sdk-guide/cn/p057-figure-01.png)

图3-3 NCHW 数据排布

移除无效数据转成 NHWC 即 (1, 2, 2, 13)数据,在内存中的排布如下:

![图3-4 NHWC 数据排布 ](/assets/images/rknn-v250/sdk-guide/cn/p057-figure-02.png)

图3-4 NHWC 数据排布

转换示例代码:

NC1HWC2 转 NCHW :以int8数据排列的 NC1HWC2 转成int8数据排列的 NCHW 如下所示:

```text
/*
 *src: 表示NC1HWC2输入tensor的地址
 *dst: 表示NCHW输出tensor的地址
 *dims: 表示NC1HWC2的shape信息
 *channel: 表示NCHW输入的C的值
 * h : 表示NCHW的h的值
 * w: 表示NCHW的w的值
 */
int NC1HWC2_to_NCHW(const int8_t* src, int8_t* dst, int* dims, int channel, int h, int w)
{
 int batch = dims[0];
 int C1 = dims[1];
 int C2 = dims[4];
 int hw_src = dims[2] * dims[3];
 int hw_dst = h * w;
 for (int i = 0; i < batch; i++) {
  src = src + i * C1 * hw_src * C2;
  dst = dst + i * channel * hw_dst;
  for (int c = 0; c < channel; ++c) {
   int plane = c / C2;
   const int8_t* src_c = plane * hw_src * C2 + src;
   int offset = c % C2;
   for (int cur_h = 0; cur_h < h; ++cur_h)
    for (int cur_w = 0; cur_w < w; ++cur_w) {
     int cur_hw = cur_h * w + cur_w;
     dst[c * hw_dst + cur_h * w + cur_w] = src_c[C2 * cur_hw + offset];
    }
  }
 }
 return 0;
}
```

NC1HWC2转NHWC:以int8数据排列的NC1HWC2转成int8数据排列的NHWC如下所示:

```text
/*
 *src: 表示NC1HWC2输入tensor的地址
 *dst: 表示NCHW输出tensor的地址
 *dims: 表示NC1HWC2的shape信息
 *channel: 表示NHWC输入的C的值
 * h : 表示NCHW的h的值
 * w: 表示NCHW的w的值
 */
int NC1HWC2_to_NHWC(const int8_t* src, int8_t* dst, int* dims, int channel, int h,
int w)
{
  int batch = dims[0];
  int C1 = dims[1];
  int C2 = dims[4];
  int hw_src = dims[2] * dims[3];
  int hw_dst = h * w;
  for (int i = 0; i < batch; i++) {
    src = src + i * C1 * hw_src * C2;
    dst = dst + i * channel * hw_dst;
    for (int cur_h = 0; cur_h < h; ++cur_h) {
      for (int cur_w = 0; cur_w < w; ++cur_w) {
       int cur_hw = cur_h * dims[3] + cur_w;
       for (int c = 0; c < channel; ++c) {
         int plane = c / C2;
         const auto* src_c = plane * hw_src * C2 + src;
         int offset = c % C2;
         dst[cur_h * w * channel + cur_w * channel + c] = src_c[C2 * cur_hw + offset];
       }
      }
    }
  }
  return 0;
}
```

### 3.1.3 输入输出内存

RKNN Runtime 中,模型的输入输出数据通过内存对象传递,分为通用 API 和零拷贝 API 两种方式,两者的内存管理方式不同:

通用 API(内部拷贝方式):输入数据缓冲区由用戶自行准备( rknn_input 的 buf 成员指向用戶内存),调用 rknn_inputs_set() 时由 Runtime 将数据拷贝到模型输入;推理完成后通过rknn_outputs_get() 获取输出(Runtime 分配输出内存并拷贝结果),使用完毕后必须调用rknn_outputs_release() 释放该部分输出内存。输入输出的类型转换、布局转换和归一化均在Runtime 内部完成,使用简单,适用于大多数场景。

零拷贝 API:通过 rknn_create_mem() 分配 NPU 可直接访问的输入输出内存(或通过rknn_create_mem_from_fd() / rknn_create_mem_from_phys() 使用外部分配的物理内存),并通过 rknn_set_io_mem() 将内存绑定到张量,NPU 直接读写该内存,省去了通用 API 内部的数据拷贝开销,性能更优。要求内存大小、数据类型和布局与张量属性严格对齐。

选择建议:常规部署或对性能要求不高时使用通用 API,简单可靠;追求极致性能(消除输入输出拷贝耗时)时使用零拷贝 API,详见3.1.6 RKNN Runtime零拷贝调用。

内存释放规范:

1. 通用 API 的输出内存在后处理使用完毕后通过 rknn_outputs_release() 释放;零拷贝 API 的输入输出内存通过 rknn_destroy_mem() 释放。

2. 内存释放必须在上下文销毁( rknn_destroy() )之前完成,否则可能导致资源泄漏。

3. 已释放的内存不可再使用,否则会导致未定义行为。

### 3.1.4 同步与异步推理

RKNN Runtime 提供的推理接口 rknn_run() 为同步阻塞式调用:调用后当前线程阻塞,直到 NPU 完成本次推理后返回,推理完成后即可获取输出结果,无需额外的同步操作。

RKNN Runtime 当前版本未提供异步推理接口。若需要在推理期间并行处理其他任务(如下一帧数据的采集和预处理),可在应用层通过多线程自行封装:例如使用独立的推理线程调用 rknn_run() ,主线程同时进行数据预处理,通过队列在生产者与消费者之间传递任务,实现流水线并行,提升整体吞吐。

注意:多个线程不可以同时对同一个上下文调用 rknn_run() 。多线程并发推理场景应参考 5.3.4 多线程复用上下文,通过 rknn_dup_context() 为每个线程创建独立的上下文。

### 3.1.5 错误处理和资源释放

错误处理

RKNN C API 的接口返回值为 int 类型状态码, RKNN_SUCCESS (0)表示成功,负值表示错误。板端部署时应对每个接口调用检查返回值,出错时不应继续执行后续操作,需跳转到资源清理流程后退出,避免在异常状态下执行导致未定义行为。

完整的错误码定义见《05_RKNN2_Runtime_C_API_参考_V2.5.0》。实际排查时可结合日志定位问题:运行应用前设置环境变量 RKNN_LOG_LEVEL=5 可输出详细的逐层调试信息,常见错误的分析和处理见 5.4 常见问题与错误处理。

初始化阶段的错误处理示例(出错时跳转到清理流程):

```text
int ret = rknn_init(&ctx, model, model_len, 0, NULL);
if (ret != RKNN_SUCCESS) {
    printf("rknn_init failed! ret=%d\n", ret);
    goto out;
}
```

资源释放

板端部署中的各类资源需按正确顺序释放,避免资源泄漏。推荐使用 goto 统一跳转到清理流程,确保正常路径和错误路径都能正确释放资源。

通用 API:释放顺序为先调用 rknn_outputs_release() 释放输出数据内存,再调用rknn_destroy() 销毁上下文。

```text
out:
    // 释放输出数据内存(通用 API)
    rknn_outputs_release(ctx, io_num.n_output, outputs);
    // 销毁上下文
    if (ctx) rknn_destroy(ctx);
```

零拷贝 API:释放顺序为先调用 rknn_destroy_mem() 逐个释放输入输出内存,再销毁上下文。

```text
out:
    // 释放输入输出内存(零拷⻉ API,input_mems/output_mems为rknn_create_mem()返回的 rknn_tensor_mem指针)
    for (int i = 0; i < io_num.n_input; i++) {
       rknn_destroy_mem(ctx, input_mems[i]);
    }
    for (int i = 0; i < io_num.n_output; i++) {
       rknn_destroy_mem(ctx, output_mems[i]);
    }
    // 销毁上下文
    if (ctx) rknn_destroy(ctx);
```

说明:上下文销毁后,基于该上下文分配的所有资源均不可再访问。确保所有资源在上下文销毁前已释放完毕。

{% endraw %}
