# 093 RKNN-Toolkit2 API V2.3.2 校对记录

## 来源及范围

- 中文22页，`03_Rockchip_RKNPU_API_Reference_RKNN_Toolkit2_V2.3.2_CN.pdf`，SHA256 `5d9ab27f604ee1ad3ec235d822cf2acdc4cbd57f69c14adb0f9b98a8c4cceab3`。
- 英文25页，对应EN文件，SHA256 `83227bc0f417e4ab4734dc3b3be4ca62b8ec1a1a95a18ac75274bb817dfc1e3d`。两稿 RK-YH-YF-412、V2.3.2。原PDF不修改。
- 中文忠实中文稿；英文忠实英文稿，俄德完整翻译英文正文与表格。移除封面日期/密级、声明、联系、读者对象和文档修订表，保留技术版本、依赖、所有API、参数/限制、示例与原代码注释。
- 两稿无技术图；没有把表格截图当正文，也不伪造英文配图。全部内容均可编辑，代码可复制。

## 逐章覆盖

| 章节 | 中文页 | 英文页 | 校对范围 |
| --- | --- | --- | --- |
| 1 要求 | 4–5 | 4–5 | 全11类芯片、x64/ARM64系统/Python表、6框架兼容表、7项框架注释 |
| 2.1–2.2 | 6–9 | 6–10 | 初始化/释放、verbose、config全部长参数、默认值/类型/例子/限制 |
| 2.3 | 9–12 | 10–13 | Caffe、TensorFlow、TF Lite、ONNX、DarkNet、PyTorch全部加载接口与例子 |
| 2.4–2.8 | 12–16 | 14–18 | build/export/load、runtime、core_mask、fallback、inference参数及top-5输出 |
| 2.9–2.12 | 16–19 | 18–21 | 性能/内存/版本输出、混合量化两阶段全部参数/输入文件/返回值 |
| 2.13–2.17 | 19–22 | 22–25 | 精度分析、设备、加密、自定义算子完整class、C++部署生成，最后页codegen示例 |

已通览中英全部47页联系图，进一步核对长API表、跨页代码和末页。每稿30个技术标题；全部27个原生代码块保留。英文35个、中文33个表块按各源恢复，不能把跨源表块数差异当作内容删减。

## 表格与排版

- config等连续同API跨页表块合并，删除重复API表头但不删除参数；原合并单元格的空白分类标签用前一有效标签展开，以便逐行复制、阅读和本地化。
- RU/DE 35个源表块逐格完整翻译；表头/自然说明本地化，参数名、类型、默认值、版本、公式和模型名字保留。表格行列与技术标识/数字比对无缺失。
- `<model_name>`等占位符转义为可见文字，表内竖线转义防破列；代码围栏内不作这些改写。
- URL `src/ caffe/proto`、后缀`.quantization. cfg`为视觉断行，连接成完整路径；其余API路径/参数不猜改。代码Python缩进由字符几何恢复；图中无额外代码，所有例子原本就是文本。

## 保留的源差异与疑点

1. Ubuntu20.04的Python列：CN `3.8 / 3.9`，EN `3.8 / 3.8`。EN/RU/DE保留英文表，正文四语并列说明差异，不以中文静默改英文。
2. ARM64运行环境表中 Debian10/11/12 却标 `(x64)`，两稿均如此。只能视为来源疑点，实际主机包架构需确认。
3. V2.3.2正文SDK输出含API 1.5.2、rknn_server 1.5.2及rknnrt 1.5.3b13；是来源历史输出，非本文测试或强制推荐版本。
4. 文本路径 `example/tfilte/mobilenet_v1` 拼作tfilte，保留并注明；DarkNet示例注释称yolov3-tiny，weight却为`./yolov3.weights`，不猜替换文件名。
5. `op_target`代码样例使用弯引号；`inputs_pass_through`自然说明含variance措辞；`auto_hybrid`关于阈值below的方向；`None`尾部空格等按来源保留，复制执行前核对对应SDK。
6. 英文标题/说明把quantization accuracy写作Quantitative accuracy；中文为量化精度分析，俄德按技术含义译为量化精度，并保留英文原文于英文版及此记录，不改变API `accuracy_analysis`。
7. 框架支持、ARM64仅PyTorch/ONNX、DarkNet提交810d7f7、Caffe提交828dd10等均为来源快照，不宣称为当前最新兼容性。PyTorch同版本导出/转换建议、TFLite schema不兼容风险全部保留。
8. 内存示例3.53MiB/1.67MiB/473.00KiB/5.66MiB/4.09MiB、top-5置信分数、设备ID均为原文示例，不是ArmSoM实测。版本函数中驱动/Runtime差异保持原样。

## 适配与验证边界

不保证所有ArmSoM板卡支持全部API；需匹配实际板卡、SoC、SDK/BSP、NPU驱动、Runtime/Server/Toolkit2、Python和框架。原文未提供具体板卡内核组合，标为平台参考。未执行代码、模型下载、安装或硬件性能测试。

四语源文件与此记录实际保存至仓库。统一构建、真实页面、TOC、搜索/分类、sitemap/canonical/hreflang、robots和窄屏验收由主代理合并五篇后完成，本记录不提前声称通过。未commit、push或发布，未操作Search Console/DNS；没有收录/排名承诺。
