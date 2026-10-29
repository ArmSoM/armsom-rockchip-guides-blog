---
title: "RKNN2 SDK V2.5.0 · 模型加密部署"
description: "RKNN2 SDK V2.5.0 · 模型加密部署 · 完整开发指南系列"
excerpt: "模型加密部署"
translation_key: "rknn-v250-sdk-guide-encryption"
slug: "rknn-v250-sdk-guide-encryption"
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

**RKNN2 SDK V2.5.0 · 18/22**

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

**模型加密部署**

[19. 精度问题诊断](/zh/articles/rknn-v250-sdk-guide-accuracy/)

[20. 性能分析与网络优化](/zh/articles/rknn-v250-sdk-guide-performance/)

[21. 内存分析、共享与复用](/zh/articles/rknn-v250-sdk-guide-memory/)

[22. 常见问题、错误处理与参考资源](/zh/articles/rknn-v250-sdk-guide-faq/)

{% raw %}

### 4.2.2 模型加密部署

RKNN SDK 支持离线加密RKNN模型, 并在运行时进行解密。

模型加密只是模型保护的一部分,无法完全杜绝被破解的⻛险,建议用戶尽量避免模型被第三方直接接触,并在系统层面做好整体防护。

注意:原有的 rknn.export_encrypted_rknn_model() / crypt_level 方案依旧能兼容,但不再推荐使用。请使用本节介绍的混合加密方案。

本方案采用 混合加密架构(Hybrid Encryption):

AES-256-CTR:对称加密,用于加密模型文件本体(高性能,支持随机访问解密),仅支持256bit

RSA-OAEP:非对称加密,用于保护 AES 密钥(安全密钥分发)

密钥体系:

| 密钥 | 类型 | 持有者 | 用途 |
| --- | --- | --- | --- |
| 用戶密钥 | AES-256 对称密钥 | 用戶生成 | 加密/解密模型文件本体 |
| RK 密钥对 | RSA-2048 非对称密钥对 | RK 预置 | 公钥加密用戶密钥;芯片内置私钥解密用戶密钥 |

加密文件格式:

| 偏移 | ⻓度 | 内容 |
| --- | --- | --- |
| 0 – 63 | 64 字节 | RKNN 文件头(明文),其中 offset 24–47 写入 RKCE 加密指示符 |
| 64+ | body | AES-256-CTR 加密的模型本体 |

密钥信封文件( user_key_iv.enc )格式为 RKKE 头(16字节) + RSA-OAEP(AES key ‖ AES IV) 。

#### 4.2.2.1 PC/服务器端加密

具体转换脚本,示例和RK公钥,参考rknpu2工程下的加密示例:rknpu2/examples/rknn_encrypt_demo ,

使用 rknn_model_encrypt.py 对已转换好的 .rknn 模型进行加密:

```text
python3 rknn_model_encrypt.py --model model.rknn \
                                --rk-pubkey rk_public_key.pem \
                                [--output-dir ./encrypted] \
                                [--aes-bits 256]
```

输出文件:

| 文件 | 说明 |
| --- | --- |
| model.rknn | 加密后的模型(RKNN 头明文 + RKCE 指示符 + AES-CTR 密文体) |
| model_key.bin | RSA-OAEP 加密的密钥信封(带 RKKE 头),部署时随模型一起下发 |

公钥获取: rk_public_key.pem 由 Rockchip 提供,用戶密钥由 RK 公钥加密后,只有芯片内置的RSA 私钥 可以解密。

#### 4.2.2.2 板端加载加密模型

运行时通过 rknn_init_extend.user_key 传入密钥信封, rknn_init() 内部自动完成解密,后续推理流程与普通模型完全一致。加密模型既可以从文件路径加载(size 传 0),也可以读入内存后以 buffer 方式加载。

```text
#include "rknn_api.h"

/* 1. 将密钥信封读入内存 */
size_t key_env_size = 0;
void* key_env = load_file("model_key.bin", &key_env_size);
if (!key_env) {
    printf("load key envelope failed!\n");
    return -1;
}

/* 2. 通过 rknn_init_extend.user_key 传入密钥信封 */
rknn_init_extend init_ext;
rknn_decrypt_key_mem key_mem;
memset(&init_ext, 0, sizeof(rknn_init_extend));
key_mem.key_data = key_env;
key_mem.key_size = (uint32_t)key_env_size;
init_ext.user_key = &key_mem;

/* 3. rknn_init 内部自动解密,后续用法与普通模型相同 */
rknn_context ctx = 0;
int ret = rknn_init(&ctx, (void*)"model.rknn", 0, 0, &init_ext);
if (ret < 0) {
    if (ret == RKNN_ERR_KEY_INVALID)
       printf("密钥信封无效 / RSA 解包失败\n");
    else if (ret == RKNN_ERR_DECRYPT_FAILED)
       printf("AES-CTR 模型本体解密失败\n");
    else if (ret == RKNN_ERR_SOC_BIND_FAILED)
       printf("当前 SoC 不在绑定的平台列表内\n");
    memset(key_env, 0, key_env_size);
    free(key_env);
    return -1;
}

/* 4. rknn_init 返回后即可释放用戶侧的密钥内存 */
memset(key_env, 0, key_env_size);
free(key_env);

/* 5. 后续按普通模型流程推理:rknn_query / rknn_inputs_set / rknn_run / ... */
```

内存归属: rknn_decrypt_key_mem 结构体及 key_data 指向的缓冲区由调用方拥有。运行时在rknn_init() 内部拷贝密钥信封,调用方在 rknn_init() 返回后即可释放。建议释放前将密钥内存清零( memset 为 0),以减少密钥泄露⻛险。

支持平台:RK3562/RK3566/RK3568/RK3576/RK3588/RV1126B/RV1106/RV1103B

#### 4.2.2.3 加密模型与内存外部分配/复用的兼容性

加密模型在初始化上下文时,仅兼容Internal内存复用(Internal内存外部分配)场景:使用RKNN_FLAG_INTERNAL_ALLOC_OUTSIDE 标志初始化,并通过 rknn_set_internal_mem() 接口设置Internal内存,多个模型可复用同一块Internal内存,具体用法见9.3 Internal内存复用章节。

加密模型不兼容以下功能:

权重共享:不支持带 RKNN_FLAG_SHARE_WEIGHT_MEM 标志的初始化。

权重外部分配:不支持通过 rknn_set_weight_mem() 接口设置外部权重内存。

上下文复用:不支持 rknn_dup_context() 接口的上下文复用。

{% endraw %}
