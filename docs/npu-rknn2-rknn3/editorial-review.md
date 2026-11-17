# ArmSoM NPU 开发入门校对记录

日期：2026-11-17。文章键：`rockchip-npu-rknn2-rknn3-getting-started`。

## 来源与范围

- 用户提供《RK 平台 NPU 开发快速入门：RK3588 与 RK3572》长截图，署名 RK软件开发-吴工，日期 2026-11-14。原文入口：https://mp.weixin.qq.com/s/67VJOwm3z00N_u6xIudwdA 。
- 截图实际尺寸 1281 × 16384，止于 §3.3 YOLOv5 的起始下载命令。网页读取失败，因此不声称获得原文全部内容。原图 SHA-256：`9c05ba6fd69672f3fdd5049323e0fb9ee8ddeeb8304343ff530f52eba8f968c9`，原图未修改。
- 文章采用 ArmSoM 原创说明、流程与示例组合；后续部署步骤来自官方文档和公开示例，没有把缺失截图内容猜写成原文。
- 中、英、俄、德完整对应；15 个二/三级标题、11 个 Bash 代码块。命令、路径、参数保持四语一致。
- 两类图（工具链选择、三阶段流程）分别本地化为四语，保存 8 张 SVG 和 8 张 PNG。它们是编辑示意图，不是硬件测试结果或原文截图。

## 固定官方来源

| 仓库 | 本次核对提交 |
| --- | --- |
| https://github.com/airockchip/rknn-toolkit2 | `2c723177a94fac65cbc036d722907ddbc91980cf` |
| https://github.com/airockchip/rknn3-toolkit | `141883c8e11b05ef4cca4a69d8a7572c4d855191` |
| https://github.com/airockchip/rknn_model_zoo | `837db8e992815ff8647eadb709f07067f4bc3a71` |
| https://github.com/airockchip/rknn3-model-zoo | `7f8c7d848448fa14cf16ba359ca98405c8bb94b5` |

核对 README、版本依赖清单、wheel 文件名、YOLOv5/YOLOv6 转换与推理脚本、模型下载脚本、Android 构建脚本、C++ demo 参数解析和 RKNN3 SDK QuickStart V1.2.0。RK3572 模型转换、编译和运行分别核对 PDF 第 34、36、38 页；第 38 页另做图像检查。产品事实核对 ArmSoM Sige7 与 CM5 官方文档；Android 加载限制和 PyTorch CPU 包方案引用各自官方文档。

## 技术修正与保留边界

1. RK3588/RK3588S、RK3576 内置 NPU 使用 RKNN2。RK3588 作为外接 RK182X 主机时，外接加速器的 RKNN3 栈不改变主机内置 NPU 的路线。
2. RKNN2 联板 `rknn_server` 与独立 Runtime 应用分开；不把调试服务缺失等同于独立部署不可能。
3. 同一 `rknn.api` 导入和 `.rknn` 后缀不代表模型兼容。采用两个 Python 3.10 venv，并保留 RKNN2 `numpy<=1.26.4` 与 RKNN3 `numpy>=2.0` 的版本限定。
4. 原图中硬件实测、Android 16/17 镜像行为及设备节点实例未转述为 ArmSoM 实测，也未规定所有系统必须使用某个 `renderD` 编号。
5. RKNN3 YOLOv6 下载脚本默认下载 RK182X 优化模型，RK3572 快速入门使用标准 `yolov6n.onnx`。正文显式给出官方脚本中的标准模型地址。
6. RKNN3 转换脚本旧帮助仅列 rk1820，但 QuickStart V1.2.0 给出 rk3572；正文记录此差异。`.rknn` 与 `.weight` 必须同次转换配套。
7. Android arm64 C++ 示例以官方参数顺序编写，保留单核掩码 `1`、库搜索路径和结果图取回。未执行模型转换、编译部署或硬件推理。
8. 不建议关闭 SELinux、修改只读系统分区或绕过依赖安装。CPU PyTorch 重新安装仅作为符合版本约束且不需要 CUDA 时的可选排障方法。
9. APK/JNI、系统 IPC、本机 HTTP 是应用设计选项；没有把 `rknn_server` 描述为 REST 服务，也没有把 LLM/VLM 的 `rkllm3-server` 当作 YOLO 接口。
10. ArmSoM 产品链接为选型入口。采用 `reference_products` 和 `platform-reference`，未声称某款板卡/镜像已通过本文命令测试。卡片模板新增显式元数据分支，避免将本篇默认标为实测；其他文章既有显示规则保留。

## 交付边界

复用既有四语 collection、translation_key、目录、搜索、sitemap、canonical、hreflang 与社交分享图机制。正式地址仍为 HTTPS；本地预览响应额外禁止索引。没有改 robots、站点验证文件、DNS 或 Search Console。本记录为发布前的文件和本地预览核查，不代替后续正式部署验收。

网页构建与交互检查见 `validation.md`。硬件、模型输出准确率、性能、特定 BSP 权限与驱动兼容性仍需在实际板卡上验证。
