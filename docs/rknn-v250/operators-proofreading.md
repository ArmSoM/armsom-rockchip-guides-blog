# RKNN2 V2.5.0 算子参考：校对与覆盖记录

## 交付范围

31 个拆分主题 × 中文、英文、俄文、德文，共 124 篇文章。七组 NPU 平台分别按基础与卷积、循环网络/运算/池化、形状/切片/转置、激活/归一化/扩展算子拆分；CPU、GPU、模型 I/O 各成一篇。只生成本地文件，未构建、commit、push 或发布。

## 来源与版本

- 中文原稿 374 页，技术正文为 PDF 第 22–374 页。
- 英文原稿 384 页，技术正文为 PDF 第 23–384 页。
- 封面、免责声明、读者对象、修订记录与目录不作为技术文章正文；保留 V2.5.0 标识与来源链接。
- 中文依中文稿，英俄德依英文稿；对齐后技术结构一致，数值核对未发现数值变更（四维/4D 等表达差异除外）。
- 英文稿 I/O 原图和输出表自身仍为中文标注。英文、俄文、德文使用英文 PDF 内原图，另附相应语言的可编辑表格，没有宣称原图已译为英文。

## 提取、校对与翻译处理

- CN 9,658 个技术单元；EN 9,667 个，合并 9 处被页边界拆开的 GRU、LSTM、Resize、exWindow 段落后，与中文逐项对应。
- 对照原始页面恢复归一化分数、根号、平方、求和上下标，Hardmax/exMatMul/exSoftmaxMask 分段公式，GELU/Pow 幂次。公式采用可复制文本记法。
- 保留 7 张中文原图和 7 张英文稿原图；逐格恢复 7 张输入约束矩阵、7 张输出约束表。合并单元格展开，恢复提取时为空的芯片、精度、维度列；UNDE-/FINE 合并为 UNDEFINE。
- 恢复嵌套列表、属性/输入/输出标题，去掉 PDF 偏旁编码造成的乱码。hidden_size、channel_end 的断行连字符已修复。
- 7 处 window_partition/window_reverse 示例恢复 PDF 折行，逐处经 Python 语法解析。代码、数值及标识符不作本地化改写。
- 复用旧版译文仅限中文原文经空白/字形规范化后完全匹配且已核对当前英文含义的 282 个唯一句段；新增或合并的 76 个唯一句段完整补译俄德。不同平台的相同句段复用译文，不以平台摘要代替参数。

## 原稿疑点与保留策略

1. ConvTranpose 系列标题在两稿中都有拼写问题；英文公式多用 ConvTranspose，中文有 ConvTranpose。按各稿保留，并在文章开头提示，不擅自修改算子 API 标识。
2. ConvTranspose pads 条件中原稿直接印出 kernel_hdilations_h、kernel_wdilations_w、stride_h(height-1) 等连接写法。未猜补乘号。执行或移植时须核对对应 SDK。
3. GRU 的 WRB=1 公式将 Wb_h 放在 g(...) 外侧，LSTM c_t 公式使用 f 而不是 g；GRU 权重形状和若干 (sn)c 布局串也可能需要结合 SDK 核实。保留原始表达，不把编辑稿当作实现修正。
4. 部分英文 Slice 条件含 “% when subc” 的不自然文本；英文正文保留原稿描述，俄德采用对应中文条件的已有译法。这是源稿表达差异，不宣称已验证 SDK 行为。
5. 输入矩阵 RV1103/RV1106、RV1103B/RV1106B 表头提到注释 9，但模型输入说明仅列 1–8。文章已在表后指出，没有补造注释。
6. 输入图中的 dilation_kernel_h/w 与最后章节定义 dilated_kernel_h/w 拼写不同，各处保留。
7. 所有平台适用说明均为平台参考；没有进行 ArmSoM 硬件测试，也没有验证统一 BSP/内核版本。

## 已完成的文件检查

- 31 个分段连续覆盖全部 9,658 个对齐单元，首章至最终 dilated_kernel_w 定义都包含。
- 四语各 31 文件，translation_key/slug 成组一致，同语言系列链接完整。
- 图像引用均存在；七张输入矩阵和七张输出矩阵恢复为可编辑表格。
- 四语对应文章标题数、Python 示例数一致；代码围栏及 Liquid raw 块闭合。
- 正文未残留提取私用字形或替代字符；俄德未出现长段英文占位。
- 原始文件没有写入；SHA256 记录见 operators-qa.json。

## 待主任务统一完成

Jekyll 构建、实际页面访问、窄屏横向滚动、目录跳转及高亮、搜索、sitemap、canonical、hreflang 与 robots 验证由主任务统一执行。此记录不将文件检查等同于网站验收或硬件验证。

## 分篇覆盖

| 主题 slug | CN PDF 页 | EN PDF 页 | 对齐单元（含端点） |
|---|---:|---:|---:|
| rknn-v250-operators-rk3566-rk3568-convolution | 22–30 | 23–32 | 0–228 |
| rknn-v250-operators-rk3566-rk3568-recurrent-pooling | 30–48 | 32–50 | 229–755 |
| rknn-v250-operators-rk3566-rk3568-shape-indexing | 48–58 | 50–60 | 756–1045 |
| rknn-v250-operators-rk3566-rk3568-activations-extensions | 58–69 | 60–71 | 1046–1328 |
| rknn-v250-operators-rk3588-convolution | 69–79 | 71–82 | 1329–1592 |
| rknn-v250-operators-rk3588-recurrent-pooling | 79–97 | 82–100 | 1593–2146 |
| rknn-v250-operators-rk3588-shape-indexing | 97–110 | 100–113 | 2147–2518 |
| rknn-v250-operators-rk3588-activations-extensions | 110–125 | 113–128 | 2519–2901 |
| rknn-v250-operators-rk3562-convolution | 125–134 | 128–138 | 2902–3129 |
| rknn-v250-operators-rk3562-recurrent-pooling | 134–151 | 138–155 | 3130–3646 |
| rknn-v250-operators-rk3562-shape-indexing | 151–163 | 155–168 | 3647–4007 |
| rknn-v250-operators-rk3562-activations-extensions | 163–175 | 168–180 | 4008–4302 |
| rknn-v250-operators-rv1103-rv1106-convolution | 175–184 | 180–189 | 4303–4530 |
| rknn-v250-operators-rv1103-rv1106-recurrent-pooling | 184–198 | 189–204 | 4531–4968 |
| rknn-v250-operators-rv1103-rv1106-shape-indexing | 198–211 | 204–217 | 4969–5329 |
| rknn-v250-operators-rv1103-rv1106-activations-extensions | 211–220 | 217–227 | 5330–5583 |
| rknn-v250-operators-rk3576-rv1126b-convolution | 220–230 | 227–237 | 5584–5847 |
| rknn-v250-operators-rk3576-rv1126b-recurrent-pooling | 230–250 | 237–258 | 5848–6445 |
| rknn-v250-operators-rk3576-rv1126b-shape-indexing | 250–263 | 258–271 | 6446–6817 |
| rknn-v250-operators-rk3576-rv1126b-activations-extensions | 263–278 | 271–286 | 6818–7202 |
| rknn-v250-operators-rk2118-convolution | 278–285 | 286–293 | 7203–7402 |
| rknn-v250-operators-rk2118-recurrent-pooling | 285–296 | 293–305 | 7403–7734 |
| rknn-v250-operators-rk2118-shape-indexing | 296–307 | 305–316 | 7735–8043 |
| rknn-v250-operators-rk2118-activations-extensions | 307–317 | 316–326 | 8044–8303 |
| rknn-v250-operators-rv1103b-rv1106b-convolution | 317–324 | 326–334 | 8304–8511 |
| rknn-v250-operators-rv1103b-rv1106b-recurrent-pooling | 324–331 | 334–341 | 8512–8717 |
| rknn-v250-operators-rv1103b-rv1106b-shape-indexing | 332–343 | 341–353 | 8718–9057 |
| rknn-v250-operators-rv1103b-rv1106b-activations-extensions | 343–352 | 353–362 | 9058–9285 |
| rknn-v250-operators-cpu | 353–366 | 363–376 | 9286–9596 |
| rknn-v250-operators-gpu | 367–367 | 377–377 | 9597–9609 |
| rknn-v250-operators-model-io | 368–374 | 378–384 | 9610–9657 |
