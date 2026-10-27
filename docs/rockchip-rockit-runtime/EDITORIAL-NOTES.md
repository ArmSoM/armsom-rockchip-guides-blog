# 194 Rockit Runtime 编辑与校对记录

## 来源和范围

- 中文：`Rockchip_Developer_Guide_Linux_Rockit_Runtime_CN.pdf`，30 页，SHA-256 `4620357d4aea4b8d43b47de8609202fde16f66d078cef2747eda101f89f236df`。
- 英文：`Rockchip_Developer_Guide_Linux_Rockit_Runtime_EN.pdf`，31 页，SHA-256 `2ae741edd74dc065e70ac6922d79ae88abf1eaf0ff2741345aef0951384bb464`。
- 两份原稿均为 RK-KF-YF-939，V2.28.0，2025-04-27。中文技术内容为共同基线，保留英文独有信息和冲突；不能把较长英文 PDF 视作较新版本。
- 删除第 1 页封面声明/公司联系信息，以及第 2 页读者与修订历史、第 3 页目录；保留第 2 页完整芯片/内核适用矩阵和第 4 页起所有技术内容。
- 全部四语保留原编号 3-13、23 个带编号标题、46 张技术表及 1 张产品矩阵（共 47 张表）。跨页表重复标题，API 映射续页首行作为数据保留，没有错误提升为表头。
- 中英文第 4 页各 1 张架构图均独立裁切；中文使用 CN 图，英俄德使用 EN 图。没有以整页截图代替正文。图中既有模块名保持原样。

## 中英文差异与处理

1. CN VALLOC 多出 `memtype`（cma、system、memfd）及 POOL 的 `nkid`，已补入英俄德完整表格。
2. VSYS 的 `table`：CN 为 n 留 n 帧、0 丢弃；EN 为 0 保留、1 丢弃。采用 CN 主说明，同时四语明确标出冲突并要求核对 SDK。`wcnt` 的 CN“实际帧数”优先于 EN“实际帧率”。
3. `isp_max_h` 定义输入高度，但两份源文档均写“裁剪后的宽度”；原说明及 `mpi_log_err` 诊断完整保留，明确不擅自修改。
4. RV1126B 的 `VALLC`、末表 `cenalbe`、`SCALL`、API `RK_MPI_SYS_RelasePhyMemory` 原样保留。
5. CN `last_runing`、`runing`、`heigth` 与 EN `last_running`、`running`、`height` 的拼写差异，在各语言对应字段同时标注。
6. 两份 API 表都把 `qp_dlt_row_i` 对应 `u32RowQpDelta`，`qp_dlt_row` 对应 `u32RowIQpDelta`；完整保留并提示可能的 I/P 含义不一致。
7. CN 的 `mpp_packet pool`、`mpp_buffer pool`、`mpp_frame pool` 三表完整保留。EN 第 24 页前两表均题作 `mpp_buffer pool`，采用 CN 标题并记录源文错误。
8. EN VRGN 的 `h x y` 额外写共 8 组，已补入中文；其余三语保留此信息。
9. CN `min_size` 为单帧分配最小 free 空间，EN 写 latest；四语按 CN 定义并标明差异。VALLOC ref 为计数为 0 且无 pool 才释放；EN 的“0 means no pool”歧义在英俄德相应行注明。
10. CN 对 ROI 宏块、SAD 均值补偿、静态场景极低码率、去拖尾、消除噪声抖动/蠕动的细节同步进入英俄德。EN Warp 按 CN 卷绕解释为 wrapping，字段名不改。

## 恢复与翻译

- 未着色的命令从 PDF 行恢复为独立代码块；4 条 dumpsys 命令逐条分行，log 命令重定向符、路径、值不变。
- 完整保留 lsmod 示例、7 条 insmod、诊断字符串、内核/用户态查看命令及日志控制命令。四语的 23 条命令/诊断语句一致。
- 俄德正文、表头、每个参数说明、备注、位字段、范围、默认值和源差异说明均翻译。代码输出、模块名、API/成员名、诊断表名及图内技术标识保持源文。
- 全部章节正文和大量 VENC、API 映射表均以可搜索文本提供，不是章节摘要。
- 采用 192 篇相同 frontmatter / translation_key / raw 边界约定，不在正文添加第二套语言切换。
- ArmSoM 为保守平台参考；没有声称全部板卡支持，没有把源输出当作 ArmSoM 实测，没有执行任何设备命令。

## 验证

- 阅读中英各页提取文本、表格并检查全部联系表；独立查看裁切后的架构图。
- 四语各 47 张表、520 行 Markdown 表格记录、23 个编号标题；全部源表字段/API 技术 token 均保留；图文件存在，语言来源符合要求。
- 中英 PDF SHA-256 与导入清单一致，未修改源 PDF。
- 静态检查记录位于工作区 `work/batch-193-222/194/QA.json`；完整站点构建及浏览器交互由主线程统一执行，不以静态检查冒充整站验收。
- 仅新增本篇四语 Markdown、2 张图及本记录；无提交、推送、状态或分页修改。
