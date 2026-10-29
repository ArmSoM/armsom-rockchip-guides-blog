# RKNN V2.5.0 API 分篇校对记录

## 范围

- 03 Toolkit Python API：中文 27 页、英文 29 页，拆为 7 篇，每篇中英俄德，共 28 页文章。
- 05 Runtime C API：中文 43 页、英文 45 页，拆为 11 篇，每篇中英俄德，共 44 页文章。
- 合计 18 个分篇、72 个 Markdown。CN/EN 分别依据各自原稿；RU/DE 完整翻译英文。
- Toolkit 技术单元 CN 0–170、EN 0–173；Runtime CN 0–466、EN 0–488，每种语言连续覆盖一次。PDF 前言、免责声明、读者对象、修订记录等指定非技术部分不入文章；正文的 API 迁移技术内容保留。

## 版本和差异

本批始终以 V2.5.0 对应原文为准。旧 V2.3.2 译文只在规范化空白后的原句完全相同时复用；新参数、新章节重新翻译，未混入旧版本字段。Toolkit 的 codegen 完整章节、新版 quantized_dtype 限制、memory_plan_strategy、compute_order 均保留。Runtime 的内存所有权、生命周期、加密 key envelope/相关错误码、迁移替代接口完整保留。

同版本中文/英文页数及编排不同，四语按相同主题边界关联，不按页码强行拼接。Toolkit 的 Ubuntu20.04 与 Debian11 Python 单元中文 3.8/3.9、英文 3.8/3.8，ARM64 环境表的 Debian 表头标注 x64，保留并提示核实。示例 SDK 1.5.2 日志是原厂历史示例，不称 V2.5.0 或 ArmSoM 实测。

Runtime 章节编号从 3 跳到 5；查询编号重复或不连续，保留来源可追溯性，不据此删除章节。rknn_init 参数表仍称 extend 禁用，但结构体包含 user_key 与共享权重字段；原生动态输出查询文字与示例枚举不同；native NHWC/NC1HWC2 若干说明混称输入输出；均在文章说明，需按目标 SDK 头文件核对。RK2118 引用名称仍为 RKNN3_RK2118_Quick_Start.pdf，当前配套目录为 RKNN2 快速入门，注明而不伪改原文。

## 提取修复

- 英文 Runtime p9 的 outputs / is_prealloc / rknn_outputs_release 生命周期段误识别为空表，依原页面恢复完整可编辑文字并翻译。
- 中文 Runtime p27 的 rknn_set_io_mem 内存来源段和 native 属性查询第 1 条被行内底纹误判为表格，已按原文恢复全部说明。
- 英文 Runtime p18 查询表恢复为三列可编辑表格；跨页 API 参数表/结构体表合并并保留全部行。
- 英文 Runtime p38 将误入表末行的 rknn_input 恢复为小标题。
- 合并跨页段落、拆开的章节标题、中文 rknn_init 接口误并入标题的正文；标准化提取产生的部首字形。
- C++ 目录树及 zero-copy 示例换行续接的注释恢复单行；未改变代码标识符、常量、命令参数。
- API 参数行合并单元格恢复为重复标签；尖括号转义，避免网页吞掉类型/路径。

## 配图

Toolkit 原稿没有技术插图，全部参数表和代码均为文字，不虚构配图。Runtime 两份 PDF 各有两张技术流程图：CN p12/p13 供中文，EN p11/p12 供英俄德。独立图片位于 assets/images/rknn-v250/apis/runtime/cn 与 en；图形已目视核对，无标签缺失，按原比例显示。

## 已执行验证

- 72 文件实际存在，四语 translation_key/slug 与本地路径完整关联。
- 每种语言完整覆盖各自源技术单元，未翻译文本检测为 0。
- 英俄德全部代码块逐字比较一致；只执行了记录的换行修复。
- 所有 Python 示例静态语法检查通过（未运行 API）；英文 C 示例续行未检测到游离英文说明。
- 配图路径存在，四语系列互链完整；原始 PDF 哈希记录于 QA.json。
- 目视检查错误提取页及末章：Runtime EN p9、p18、p38、p45，CN p27；Toolkit C++ 生成、输出及运行章节。

## 尚未完成

本子任务未运行 Jekyll、浏览器验收、SEO/sitemap/canonical/hreflang 构建结果验收，交主任务统一完成。未执行硬件测试、未 commit、未 push、未发布。既有站点文件及原始 PDF 未修改。

## 分篇清单

- rknn-v250-toolkit-api-requirements-lifecycle：原稿页 5–7；四语对应同一 translation_key。
- rknn-v250-toolkit-api-configuration：原稿页 8–10；四语对应同一 translation_key。
- rknn-v250-toolkit-api-model-loading：原稿页 11–13；四语对应同一 translation_key。
- rknn-v250-toolkit-api-build-quantize-export：原稿页 14–16；四语对应同一 translation_key。
- rknn-v250-toolkit-api-runtime-inference：原稿页 17–20；四语对应同一 translation_key。
- rknn-v250-toolkit-api-evaluation-query：原稿页 21–24；四语对应同一 translation_key。
- rknn-v250-toolkit-api-cpp-codegen：原稿页 25–27；四语对应同一 translation_key。
- rknn-v250-runtime-api-overview-linking：原稿页 7–8；四语对应同一 translation_key。
- rknn-v250-runtime-api-conventions-zero-copy：原稿页 9–13；四语对应同一 translation_key。
- rknn-v250-runtime-api-device-context：原稿页 14–17；四语对应同一 translation_key。
- rknn-v250-runtime-api-query：原稿页 17–22；四语对应同一 translation_key。
- rknn-v250-runtime-api-inference：原稿页 22–24；四语对应同一 translation_key。
- rknn-v250-runtime-api-tensor-memory：原稿页 24–28；四语对应同一 translation_key。
- rknn-v250-runtime-api-matmul：原稿页 28–33；四语对应同一 translation_key。
- rknn-v250-runtime-api-custom-operators：原稿页 33–34；四语对应同一 translation_key。
- rknn-v250-runtime-api-types-common：原稿页 35–39；四语对应同一 translation_key。
- rknn-v250-runtime-api-types-matmul：原稿页 39–40；四语对应同一 translation_key。
- rknn-v250-runtime-api-types-custom-migration：原稿页 40–43；四语对应同一 translation_key。

## 独立复核补充：内存接口参数表

- `rknn_create_mem_from_fd` 的中文原稿 p25 把参数写为 `void virt_addr`，星号位于说明句末；英文原稿 p26 为 `void *virt_addr`。已核对 PDF 文本位置，这不是编辑时推断出来的类型。四语页面保留各自来源表达，表后新增本地化差异提示，要求按实际 V2.5.0 SDK 头文件核对。
- 英文 p26 提取表中的首列 `Description Parameter` 被整体重复到所有参数行。现将英俄德三语的描述行标为“描述”，后续五行标为“参数”，完整保留参数名、类型和说明；中文原有标签正确，无需改动。
- 只读复核检查了 72 篇文章的表格列数、340 个代码块和 8 个图片引用；代码经去空白后与提取源一致，Python 示例语法通过。以上两项修复不修改任何代码块或 PDF。
- 可重复后处理：`work/rknn-v250/apis/postprocess-tensor-memory.py`。重跑 API render.py 或重建校对记录后，运行此脚本可恢复修复；脚本通过标记替换避免重复注释。
