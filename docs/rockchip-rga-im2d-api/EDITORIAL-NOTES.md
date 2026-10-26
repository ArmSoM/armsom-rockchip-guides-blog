# 129 RGA IM2D API 校对记录

## 来源与处理决定

- 中文：`docs/cn/Common/RGA/Rockchip_Developer_Guide_RGA_CN.pdf`，82页，V2.2.7。
- 英文：`docs/en/Common/RGA/Rockchip_Developer_Guide_RGA_EN.pdf`，79页，V2.2.7。
- 两稿均从PDF第6页开始技术正文，覆盖至末页，分别77/74个技术页。封面日期、密级、声明、联系信息、读者对象、修订表及原目录未进入正文；技术版本和兼容性保留。
- 用户已明确批准：**以中文为主线，并列保留英文差异**。四语均按此执行，末尾设本地化差异附录，不把不同定义混成一个接口。
- 仅改派生Markdown；未改原始PDF。未commit、push或部署。

## 章节完整性

1. 概述：硬件指标、输入/输出格式、对齐限制和所有脚注。
2. 版本说明：API/驱动版本规则、全部查询方法、初始化日志及兼容表。
3. 应用接口：3.1–3.25全部章节，包含import/release/wrap、job、所有单操作与Task/Array接口、OSD、组合处理、参数校验、异步同步、线程上下文。
4. 数据结构：4.1及4.2.1–4.2.13全部定义和成员表；中文独有的五个OSD结构完整补译。
5. 测试与调试：5.1–5.3.13.1全部内容，buffer申请、Android/Linux日志、全部demo命令和示例代码，末章格式转换完整保留。

## 同版本实质差异（已在四语正文并列）

- 3.20.1 `imfill`：英文为`buf`，`color = 0x00000000`，无`release_fence_fd`；中文为`dst`，`color`无默认值，含`release_fence_fd = NULL`。
- 4.2.3 `im_opt_t`：英文只有color/colorkey_range/nn/rop_code/priority/core；中文还含version/mosaic_mode/osd_config/intr_config/reserve。英文结构完整留存于附录，不能推断ABI兼容。
- 4.2.6：英文使用`typedef struct rga_memory_parm im_handle_param_t`，字段width_stride/height_stride/format；中文独立`im_handle_param`，字段width/height/format。英文参数表按stride解释，已明确注明。
- 英文4.2只到4.2.8，缺中文4.2.9–4.2.13：im_osd_block_t、im_osd_invert_factor_t、im_osd_invert_t、im_osd_bpp2_t、im_osd_t。
- 3.15.1英文imblend/imcomposite形参为srcA/srcB/dst，中文为fg_image/bg_image/output_image，英文声明完整留存。
- 英文3.8.1 imcopy在`sync = 1`后有多余`)`；主线采用中文签名，英文原签名留在差异附录作为原稿问题，而非建议复制的正确示例。
- 3.4.3 wrapbuffer_handle参数实际一致，中文`format，`为全角逗号，已据英文ASCII逗号修复；未改变参数、默认值、顺序。

## 其它原文疑点（不猜改）

- 概览及矩阵为`impyramind`，接口为`impyramid`；标题`imfilp`与接口`imflip`不同。
- imcvtcolorTask文字称“平移”，但接口为格式转换；保留来源表述并明确标记。
- 5.3.12称默认`IM_ALPHA_BLEND_DST`，而3.15接口默认`IM_ALPHA_BLEND_SRC_OVER`；同时保留并警示。
- OSD反色指导表将“内部”配`IM_OSD_FLAGS_EXTERNAL`、“外部”配`IM_OSD_FLAGS_INTERNAL`，与名称疑似相反；不擅改枚举。
- 原稿保留`RK_FORMA_A8`、`RK1103B`、`RK1108`、`bule`、`Guassion`等写法；对应实际SDK名称待核验。
- 5.3.5缩小分支代码注释仍写1920x1080而调用720,480；原始注释/参数未静默改写。
- 硬件表第7–9页右侧Pixels/Cycle列超出有效表格边界；从原页可辨字符补回1/2及RGA3的`3 (by pa…; 2 (scale)`。RGA3后缀在两稿原页本身裁缺，没有猜补为完整术语。
- 这里的理论像素/周期、示例运行数据均非ArmSoM实测。板卡、BSP/SDK、librga/驱动组合须实际验证。

## 提取、排版与配图

- 全页背景矩形曾造成误识别巨型表格，已排除后重新识别实际表格边界；保留只有一行的跨页格式表，避免遗漏Lite2/Lite3/RGA3。
- 表格正文共93段，跨页续表补表头；硬件指标合并单元格展开为明确值。表格中的管道符/尖括号安全转义，保留可编辑文字而非整页截图。
- 源中文123个代码单元全部保留，连续跨页块合并，不修改算法、API、寄存器或数字。代码内部原注释原样保留；全角逗号仅上述一处有英文证据修复。
- 原PDF技术页逐页联系表检查、嵌入图片清点均无独立技术插图：两稿图形内容为文字、代码块和表格边框，没有需输出的原始位图/流程图。因此本篇没有assets图片，未伪称已有英文图。中文来源为CN，英文/俄文/德文不存在挪用中文图片的问题。

## 已执行检查

- 两稿41个主层级标题逐章对照，中文增加的五个OSD子节已补齐；最后一页均检查到格式转换代码。
- 支持矩阵56个以im开头API行，去排版换行后中英文系统/语言/库与驱动要求逐项完全相同。
- 四语全部576个中文技术单元进入输出；正文/标题翻译无漏项；外语正文与表格无中文残留（不含保留原注释的代码）。
- 静态检查：四语均93段表格、145个标题；ZH125个代码块，EN/RU/DE各131块（译文将原正文内日志/公式分成可复制代码块，并含6个英文差异声明）。
- 123个原代码单元规范化空白/兼容字符后，在各语言代码内容中均可定位，无缺失；各表格IM_/RK_技术标识符翻译前后集合保留。
- 实际正文长度：ZH117927、EN136046、RU138675、DE140082字符；此数值仅帮助核对文件生成，不替代技术正确性验证。
- 使用现有四语collection、相同translation_key/slug、`media`分类；未新增切换、搜索、目录或sitemap机制。

## 尚未执行或无法确认

- 本子任务未运行Jekyll、浏览器或线上部署；本地页面访问、SEO、目录高亮、搜索/sitemap、窄屏滚动由主任务统一验收。
- 未对SDK头文件进行编译验证，未实际运行demo，未做ArmSoM硬件实验。
- 已完成全页版面巡视和结构/关键参数检查，不将其宣称为所有源码逐字人工审签；上述原稿裁缺、错字与同版本ABI差异仍需实际SDK核验。
